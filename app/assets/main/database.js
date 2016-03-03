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
	this.tables = ['settings', 'tasks', 'haccp_category', 'haccp_items', 'forms', 'registration', 'form_item', 'sync_query', 'reports', 'flowchart'];
}

db.prototype.asyncExecute = function(data, step, callback) {
	if (data.sql != undefined && step < data.data.length) {
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

db.prototype.bulkDocs = function(collection, docs, callback, params) {
	if (!collection) {
		return null;
	}
	var promises = [];
	var that = this;
	for (var i = 0; i < docs.length; i++) {
		var index = i;
		(function(that, i) {
			promises[i] = new Promise(function(resolve, reject) {
				that.collections[collection].get(String(docs[i]._id || docs[i].id), function(err, doc) {
					if (err) {
						 docs[i].timestamp = new Date().toJSON();
						 resolve(false);
					}
					if (!err && doc && doc._rev) {
						docs[i] = jQuery.extend(doc, docs[i]);
						docs[i]._id = String(docs[i]._id);
						if(params && params._deleted){
							docs[i]._deleted = true;
						}
						resolve(true);
					}else{
						resolve(false);
					}
					
				});
			});
		})(that, index);
	}
	Promise.all(promises).then(function() {
		that.collections[collection].bulkDocs(docs, function(error, results) {
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

db.prototype.createTables = function(isReload) {
	localStorage.setItem('database', true);
	this.database = true;
	localStorage.setItem("app-version", settings.version);
	this.appVersion = settings.version;
	var that = this;
	for (var i = 0; i < this.tables.length; i++) {
		var index = i;
		(function(i){
			that.collections[that.tables[i]] = new PouchDB(that.db_name + "_" + that.tables[i], {
				skip_setup : true
			});
			var designDoc = createDesignDoc('sort_index', function (doc) {
				emit(doc.timestamp);
			});
			that.collections[that.tables[i]].put(designDoc);
		})(index);
		
	}
	this.createView('sync_query', 'get_sync', function(doc){
		if(!doc.executed){
			emit(doc.timestamp);
		}
	});
	
	if(isReload){
		window.location.reload();
	}
};

db.prototype.dropDb = function() {
    this.db.transaction(this.dbDropTables, this.dbErrorHandle, function (){
        return true;
    });
};

db.prototype.dbDropTables = function() {
	this.database = false;
	for (var i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i) != "user_email") {
			localStorage.removeItem(localStorage.key(i));
		}
	}
	var promises = [];
	for (var i = 0; i < this.tables.length; i++) {
		var collection = this.collections[this.tables[i]];
		if(!collection){
			collection = new PouchDB(this.db_name + "_" + this.tables[i], {
				skip_setup : true
			});
		}
		promises[i] = new Promise(function(resolve, reject) {
			if(collection){
				collection.destroy(resolve);
			}else{
				
				collection.destroy(resolve);
			}
		});
	}
	return Promise.all(promises);
};

db.prototype.InitDB = function() {
    var isCreateDB = false;
    var that = this;
    if (this.database && this.database !== undefined && this.database !== null ) {
    	isCreateDB = false;
    } else {
    	isCreateDB = true;
    }
    if(!this.appVersion || (this.appVersion && settings.rebuild && this.appVersion.replace(/\./g, "") < settings.rebuild.replace(/\./g, ""))){
    	isCreateDB = true;
    }
    if(isCreateDB){
    	console.log('isCreateDB');
    	this.dbDropTables().then(function(results){
    		console.log('results isCreateDB', results);
    		that.createTables(true);
    	});
    }else{
    	this.createTables();
    }
    // this.createTables();
	
};

db.prototype.dbCreateTables = function(tx) {
	this.dbDropTables(tx);
	localStorage.setItem('database', true);
	this.database = true;
	localStorage.setItem("app-version", settings.version);
	this.appVersion = settings.version;
};

db.prototype.dbErrorHandle = function(err) {
	console.log("Error processing SQL: ", err);
	console.log('query: ', query);
	var that = this;
	this.dbDropTables().then(function(){
		that.createTables();
		window.location.reload();
	});
};

db.prototype.dbSuccessHandle = function() {
	//alert("success!");
	return true;
};

db.prototype.getDbInstance = function(name) {
	if(name){
		return this.collections[name];
	}
	return false;
};

db.prototype.clearCollection = function(name, callback) {
	var that = this;
	this.collections[name].query('sort_index', function (error, results) {
	  	that.bulkDocs(name, results.rows, function(){
	  		if(callback){
	  			callback();
	  		}
	  	}, {_deleted:true});
	});
};
