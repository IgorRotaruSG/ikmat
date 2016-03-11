var query = false;
// used internally by class -- FUCK SQLITE ... --
var db_data = [];
// used internally by class -- FUCK SQLITE ... --
//var thisdatabase;

function db() {
	this.db_name = 'haccp';
	this.db_version = '1.0';
	this.db_size = 50;
	this.database = localStorage.getItem('database');
	this.appVersion = localStorage.getItem('app-version');
	this.data = [];
	this.query = false;
	this.collections = [];
	this.tables = ['tasks', 'haccp_items', 'forms', 'registration', 'form_item', 'sync_query', 'reports', 'flowchart', 'settings'];
	this.localStore = ['app-version', 'company_join_date', 'company_name', 'contact_name', 'database', 'role', 'user_data', 'user_name']
	PouchDB.plugin(Erase);
	//PouchDB.debug.enable('*');

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
						if (params && params._deleted) {
							that.collections[collection].remove(doc);
						}
						resolve(true);
					} else {
						resolve(false);
					}

				});
			});
		})(that, index);
	}
	Promise.all(promises).then(function() {
		if (params && params._deleted) {
			if ( typeof callback != 'function' && window[callback] != undefined) {
				window[callback]();
			} else if (callback && typeof callback == 'function') {
				callback();
			}
			return;
		}
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
		_id : '_design/' + name,
		views : {
		}
	};
	ddoc.views[name] = {
		map : mapFunction.toString()
	};
	return ddoc;
}

db.prototype.createView = function(collection, name, mapFunction) {
	var designDoc = createDesignDoc(name, mapFunction);
	this.collections[collection].putIfNotExists(designDoc);
};

db.prototype.createCollection = function(i, callback){

	if(i == this.tables.length){
		if(callback){
			callback();
		}
		return;
	}
	var that = this;
	if (!that.collections[that.tables[i]]) {
		new PouchDB(that.db_name + "_" + that.tables[i], {
			adapter : 'websql',
			auto_compaction: true,
			skip_setup: true
		}).then(function(result){
			that.collections[that.tables[i]] = result;
			if (!that.collections[that.tables[i]].adapter) {// websql not supported by this browser
				that.collections[that.tables[i]] = new PouchDB(that.db_name + "_" + that.tables[i], {
					skip_setup: true
				}).then(function(result){
					that.collections[that.tables[i]] = result;
					that.createCollection(i + 1, callback);
				});
			}else{
				that.createCollection(i + 1, callback);
			}
			return result;

		});
	}else{
		this.createCollection(i + 1, callback);
	}

}

db.prototype.createTables = function(isReload) {
	localStorage.setItem('database', true);
	this.database = true;
	localStorage.setItem("app-version", settings.version);
	this.appVersion = settings.version;
	var that = this;
	var index = 0;
	var promise = new Promise(function(resolve, reject) {
		that.createCollection(index, function(){
			for (var i = 0; i < that.tables.length; i++) {
				that.createView(that.tables[i], 'sort_index', function (doc) {
					emit(doc.timestamp);
				});

			}
			that.createView('sync_query', 'get_sync', function (doc) {
				if (!doc.executed) {
					emit(doc.timestamp);
				}
			});
			if (isReload) {
				window.location.reload();
			}
			resolve(true);
		})
	});
	return promise;

};

db.prototype.dropDb = function() {
	this.db.transaction(this.dbDropTables, this.dbErrorHandle, function() {
		return true;
	});
};

db.prototype.dbDropTables = function() {
	this.database = false;
	var that = this;
	for (var i = 0; i < localStorage.length; i++) {
		if (this.localStore.indexOf(localStorage.key(i)) > 0) {
			localStorage.removeItem(localStorage.key(i));
		}
	}
	var promises = [];
	for (var i = 0; i < this.tables.length; i++) {
		var collection = this.collections[this.tables[i]];
		if (!collection) {
			collection = new PouchDB(this.db_name + "_" + this.tables[i], {
				skip_setup : true
			});
		}
		promises[i] = new Promise(function(resolve, reject) {
			collection.destroy(function (err, response) {
				if (err) {
					return console.log(err);
				} else {
					resolve(true);
					// success
				}
			});
		});
	}
	return Promise.all(promises).then(function(result) {
		if (result.length == promises.length) {
			return result;
		}
	});
};

db.prototype.InitDB = function() {
	var isCreateDB = false;
	var that = this;
	if (this.database && this.database !== undefined && this.database !== null) {
		isCreateDB = false;
	} else {
		isCreateDB = true;
	}
	if (!this.appVersion || (this.appVersion && settings.rebuild && this.appVersion.replace(/\./g, "") < settings.rebuild.replace(/\./g, ""))) {
		isCreateDB = true;
	}
	if (isCreateDB) {
		this.dbDropTables().then(function(results) {
			return that.createTables(true);
		});
	} else {
		return this.createTables();
	}
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
	this.dbDropTables().then(function() {
		// that.createTables();
		window.location.reload();
	});
};

db.prototype.dbSuccessHandle = function() {
	//alert("success!");
	return true;
};

db.prototype.getDbInstance = function(name) {
	if (name && this.collections[name]) {
		return this.collections[name];
	}
	return false;
};

db.prototype.clearCollection = function(name, callback) {
	var that = this;
	if (this.collections[name]) {
		this.collections[name].erase({}, function() {
			if (callback) {
				callback({
					deleted : true
				});
			}
		});
	} else {
		if (callback) {
			callback({
				deleted : true
			});
		}
	}
};
