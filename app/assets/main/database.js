var query = false;
// used internally by class -- FUCK SQLITE ... --
var db_data = [];
// used internally by class -- FUCK SQLITE ... --
//var thisdatabase;

function db() {
	this.db_name = 'haccp';
	this.db_version = '1.0';
	this.db_size = 5 * 1024 * 1024;
	this.database = localStorage.getItem('database');
	this.appVersion = localStorage.getItem('app-version');
	this.data = [];
	this.query = false;
	this.collections = [];
	this.tables = ['settings', 'tasks', 'suppliers', 'employees', 'haccp_category', 'haccp_items', 'forms', 'registration', 'form_item', 'sync_query', 'reports', 'flowchart'];
	//    console.log('function db()');
}

db.prototype.asyncExecute = function(data, step, callback) {
	if (data.sql != undefined && step < data.data.length) {
		console.log('async triggered');
		this.asyncExecute(data, parseInt(step) + 1);
	}
};

db.prototype.lazyQuery = function(collection, data, callback, params) {
	if (logout_flag == true) {
		return false;
	}
	var thisClass = this;
	if (collection && data != undefined && data.length > 0) {
		this.bulkDocs(collection, data, callback, params);
	} else {
		if ( typeof callback != 'function' && window[callback] != undefined) {
			if (params) {
				window[callback](params);
			} else {
				window[callback]();
			}
		} else if (callback && typeof callback == 'function') {
			if (params) {
				callback(params);
			} else {
				callback();
			}

		}
	}
};

// db.prototype.select = function(collection, condition, callback, params){
// if(!collection){
// return null;
// }
// this.collections[collection]
// };

db.prototype.bulkDocs = function(collection, docs, callback, params) {
	if (!collection) {
		return null;
	}
	var promises = [];
	var that = this;
	for (var i = 0; i < docs.length; i++) {
		docs[i].timestamp = new Date().toJSON();
		var index = i;
		(function(that, i) {
			promises[i] = new Promise(function(resolve, reject) {
				that.collections[collection].get(String(docs[i]._id), function(err, doc) {
					if (err) {
						 resolve(false);
					}
					if (!err && doc && doc._rev) {
						docs[i] = jQuery.extend(doc, docs[i]);
						docs[i]._id = String(docs[i]._id);
						resolve(true);
					}else{
						resolve(false);
					}
					
				});
			});
		})(that, index);
	}
	Promise.all(promises).then(function() {
		console.log("docs", docs);
		that.collections[collection].bulkDocs(docs, function(error, results) {
			console.log("aaaaaaaaa:", collection, results, error);
			if ( typeof callback != 'function' && window[callback] != undefined) {
				if (params) {
					window[callback](params, results);
				} else {
					window[callback](results);
				}
			} else if (callback && typeof callback == 'function') {
				if (params) {
					callback(params, results);
				} else {
					callback(results);
				}
			}
		});
	});
};

db.prototype.lazyQuerySync = function(collection, data, callback, callback_params) {
	if (logout_flag == true) {
		return false;
	}
	var thisClass = this;
	if (collection != undefined && data != undefined && data.length > 0) {
		console.log("collection", collection);
		this.bulkDocs(collection, data, callback, callback_params);
	} else {
		if (window[callback] != undefined) {
			if (callback_params != undefined) {
				window[callback](callback_params);
			} else {
				window[callback]();
			}
		}
	}
};

db.prototype.clean = function() {
	query = false;
	db_data = [];
};

db.prototype._execQuery = function(tx) {
	//alert('query:' + query);
	if (query) {
		tx.executeSql(query, [], _fetchResults, this.dbErrorHandle);
	} else {
		return false;
	}
};

function _fetchResults(tx, results) {
	db_data = results.rows;
}

// db.prototype.execute = function(q){
// query = q;
// this.db.transaction(this._execQuery, this.dbErrorHandle);
// };

function createDesignDoc(name, mapFunction) {
	var ddoc = {
		_id: '_design/' + name,
		views: {
		}
	};
	ddoc.views[name] = { map: mapFunction.toString() };
	return ddoc;
}

db.prototype.createView = function(collection, name, mapFunction){
	var designDoc = createDesignDoc(name, mapFunction);
	this.collections[collection].put(designDoc);
};

db.prototype.createTables = function() {
	for (var i = 0; i < this.tables.length; i++) {
		this.collections[this.tables[i]] = new PouchDB(this.db_name + "_" + this.tables[i], {
			skip_setup : true
		});
		var designDoc = createDesignDoc('sort_index', function (doc) {
			emit(doc.timestamp);
		});
		this.collections[this.tables[i]].put(designDoc);
	}
	this.createView('sync_query', 'get_sync', function(doc){
		if(!doc.executed){
			emit(doc.timestamp);
		}
	});
};

db.prototype.dropDb = function() {
	//console.log('dropDb');
	//this.db.transaction(this.dbDropTables, this.dbErrorHandle, this.dbSuccessHandle);
	this.db.transaction(this.dbDropTables, this.dbErrorHandle, function() {
		//alert('dropped');
		return true;
	});
};

db.prototype.dbDropTables = function() {
	this.database = false;
	for (var i = 0; i < localStorage.length; i++) {
		console.log(localStorage.key(i));
		if (localStorage.key(i) != "user_email") {
			localStorage.removeItem(localStorage.key(i));
		}
	}
	var promises = [];
	for (var i = 0; i < this.tables.length; i++) {
		var collection = this.collections[this.tables[i]];
		promises[i] = new Promise(function(resolve, reject) {
			collection.destroy(resolve);
		});
	}
	return Promise.all(promises);
};

db.prototype.InitDB = function() {
	// this.db = openDatabase(this.db_name, this.db_version, "", this.db_size);
	// this.db = new PouchDB(this.db_name);
	// // new PouchDB(this.db_name + "2");
	// console.log("db", this.db);
	// this.db.post({
	// _id: 'mydoc2',
	// title: 'Heroes2'
	// }, function(err, response) {
	// if (err) { return console.log(err); }
	// // handle response
	// });
	//
	// this.db.allDocs({
	// include_docs: true,
	// attachments: true
	// }, function(err, response) {
	// if (err) { return console.log(err); }else{
	// console.log(response);
	// }
	// // handle result
	// });
	// var isCreateDB = false;
	// if (this.database && this.database !== undefined && this.database !== null ) {
	// isCreateDB = false;
	// } else {
	// isCreateDB = true;
	// }
	// if(!this.appVersion || (this.appVersion && settings.rebuild && this.appVersion.replace(/\./g, "") < settings.rebuild.replace(/\./g, ""))){
	// isCreateDB = true;
	// }
	// if(isCreateDB){
	// this.createTables();
	// }
	this.createTables();
};

db.prototype.dbCreateTables = function(tx) {
	this.dbDropTables(tx);
	localStorage.setItem('database', true);
	this.database = true;
	localStorage.setItem("app-version", settings.version);
	this.appVersion = settings.version;

	//console.warn('sunt pe database create');
	tx.executeSql('CREATE TABLE IF NOT EXISTS "settings" ("type"  NOT NULL  UNIQUE , "value" )', [], function(tx) {
		/*tx.executeSql('INSERT INTO "settings"("type","value") VALUES(?,?)',[
		 "deviation_form",
		 JSON.stringify({"form_deviation":{"task_id":{"type":"hidden","value":""},"deviation_description":{"type":"textarea","label":"Avviksbeskrivelse","validation":["required","string"],"value":""},"initial_action":{"type":"textarea","label":"Strakstiltak","validation":["required","string"]},"upload_photo":{"label":"Ta eller last opp bilde","type":"file"},"employee_id":{"type":"select","list":[],"label":"Ansvarlig for tiltak","validation":["required","string"]},"deviation_deadline":{"type":"date","label":"Tidsfrist for tiltak","validation":["required","string"]},"signature":{"label":"Signatur","type":"signature","validation":["required","string"]}}})
		 ]);*/
	});
	tx.executeSql('CREATE TABLE IF NOT EXISTS "tasks" ("id" INTEGER PRIMARY KEY NOT NULL ,"title" VARCHAR NOT NULL,"type" VARCHAR, "overdue" BOOL NOT NULL, "dueDate" TEXT, "completed" BOOL NOT NULL DEFAULT (1), "check" VARCHAR, "date_start" VARCHAR, "taskData" TEXT)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS "suppliers" ("name" VARCHAR NOT NULL , "address" VARCHAR, "phone_number" VARCHAR, "id_number" VARCHAR)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS "employees" ("first_name"  NOT NULL , "last_name"  NOT NULL , "email" , "role" )');
	//tx.executeSql('CREATE TABLE IF NOT EXISTS "papers" ("id" INTEGER, "paper" VARCHAR)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS "haccp_category" ("id" INTEGER PRIMARY KEY  NOT NULL  UNIQUE , "name" VARCHAR)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS "haccp_items" ("id" INTEGER NOT NULL, "cat" INTEGER NOT NULL , "content" TEXT, "form" TEXT, "response" VARCHAR)');
	//tx.executeSql('CREATE TABLE IF NOT EXISTS "forms" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "type" VARCHAR NOT NULL , "label" TEXT)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS "forms" ("type" VARCHAR PRIMARY KEY NOT NULL , "label" TEXT, "alias" VARCHAR)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS "form_item" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "label" VARCHAR NOT NULL , "form" TEXT NOT NULL, "type" VARCHAR)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS "registration" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "step" INTEGER NOT NULL  UNIQUE , "data" TEXT NOT NULL )');
	tx.executeSql('CREATE TABLE IF NOT EXISTS "sync_query" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "time" DATETIME NOT NULL  DEFAULT CURRENT_TIMESTAMP, "api" VARCHAR NOT NULL , "data" TEXT NOT NULL , "extra" INTEGER, "executed" INTEGER NOT NULL  DEFAULT 0,"q_type" VARCHAR)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS "reports" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "name" VARCHAR, "html" TEXT, "link" VARCHAR)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS "flowchart" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "name" TEXT, "path" TEXT)');

};

db.prototype.dbErrorHandle = function(err) {
	console.log("Error processing SQL: ", err);
	console.log('query: ', query);
	db.dropDb();
};

db.prototype.dbSuccessHandle = function() {
	//alert("success!");
	return true;
};

db.prototype.getDbInstance = function(name) {
	console.log('getDbInstance', name);
	if(name){
		return this.collections[name];
	}
	return false;
};

db.prototype.clearCollection = function(name) {
	this.collections[name].allDocs({include_docs: true, deleted: true});
};
