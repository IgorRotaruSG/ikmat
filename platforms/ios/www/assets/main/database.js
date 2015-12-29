var query = false; // used internally by class -- FUCK SQLITE ... --
var db_data = []; // used internally by class -- FUCK SQLITE ... --
//var thisdatabase;

function db() {
    this.db_name = 'haccp';
    this.db_version = '1.0';
    this.db_size = 5*1024*1024;
    this.database = localStorage.getItem('database');
    this.appVersion = localStorage.getItem('app-version');
    this.data = [];
    this.query = false;
//    console.log('function db()');
}

db.prototype.asyncExecute = function(data, step, callback) {
    if (data.sql != undefined && step < data.data.length) {
        console.log('async triggered');
        this.asyncExecute(data, parseInt(step) + 1);
    }
};

db.prototype.lazyQuery = function(q, i, callback, params) {
    if ( logout_flag == true ) {
        return false;
    }
    var thisClass = this;
    if (q && q.sql != undefined && q.data != undefined && q.data.length > i) {
        this.db.transaction(function(tx){
            if (q.check != undefined) {
                tx.executeSql('SELECT COUNT(*) as "count","' + q.check.column + '" FROM "' + q.check.table + '" WHERE "' + q.check.index + '"=?',[q.data[i][q.check.index_id]],function(tx, results){
                    if (results.rows.item(0).count > 0) {
                        if (results.rows.item(0)[q.check.column] != q.data[i][q.check.column_id]) {

                            var tmp = q.data[i].slice(0);
                            var tmp_index = tmp[q.check.index_id];
                            tmp.splice(q.check.index_id, 1);
                            tmp.push(tmp_index);

                            tx.executeSql(q.check.update_query, tmp, function(tx){
                                thisClass.lazyQuery(q, parseInt(i)+1, callback);
                            });
                        } else {
                            thisClass.lazyQuery(q, parseInt(i)+1, callback);
                        }
                    } else {
                        tx.executeSql(q.sql, q.data[i], function(){
                            thisClass.lazyQuery(q, parseInt(i)+1, callback);
                        });
                    }
                });
            } else {
                tx.executeSql(q.sql, q.data[i], function(tx, results){
                	if(q.sql.indexOf("INSERT") != -1){
                		params = results.insertId;
                	}
                	thisClass.lazyQuery(q, parseInt(i)+1, callback, params);
                });
            }
        }, function(el, er){
            console.warn('We have an lazy query error here:');
            console.log(q);
            console.warn(el);
            console.warn('-------------------------------------');
        });
    } else {
        if (typeof callback != 'function' && window[callback] != undefined) {
        	if(params){
        		window[callback](params);
        	}else{
        		window[callback]();
        	}
        }else if(callback && typeof callback == 'function'){
        	if(params){
        		callback(params);
        	}else{
        		callback();
        	}
        	
        }
    }
};

db.prototype.lazyQuerySync = function(q, i, callback, callback_params) {
    if ( logout_flag == true ) {
        //alert('lazyQuerySync');
        return false;
    }
    //console.count('lazyQuerySync');
    var thisClass = this;
    if (q.sql != undefined && q.data != undefined && q.data.length > i) {
        this.db.transaction(function(tx){
            //console.log(q.data[i]);
            tx.executeSql(q.sql, q.data[i], function(){
                thisClass.lazyQuerySync(q, parseInt(i)+1, callback, callback_params);
            });
        }, function(el, er){
            console.warn('We have an lazy query error here:');
            console.log(q);
            console.warn(el);
            console.warn('-------------------------------------');
        });
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

db.prototype.execute = function(q){
    query = q;
    this.db.transaction(this._execQuery, this.dbErrorHandle);
};

db.prototype.createTables = function(){
    this.db.transaction(function(tx){
        //var tables = ['settings','tasks','suppliers','employees','papers','haccp_category','haccp_items','forms','registration','form_items'];
        var tables = ['settings','tasks','suppliers','employees','haccp_category','haccp_items','forms','registration','form_items'];

        var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name IN (?)";
        var tabs = '"' + tables.join('","') + '"';

        tx.executeSql(sql, [tabs], function(tx, results){
            if (results.rows.length != tables.length) {
                db.dbCreateTables(tx);
            }
        });

        //this.dbCreateTables
    }, this.dbErrorHandle, this.dbSuccessHandle);
};


db.prototype.dropDb = function() {
    //console.log('dropDb');
    //this.db.transaction(this.dbDropTables, this.dbErrorHandle, this.dbSuccessHandle);
    this.db.transaction(this.dbDropTables, this.dbErrorHandle, function (){
        //alert('dropped');
        return true;
    });
};


db.prototype.dbDropTables = function(tx) {
    this.database = false;
    //console.log('dbDropTables');
    //localStorage.clear();
    window.localStorage.clear();
    tx.executeSql('DROP TABLE IF EXISTS "employees"');
    tx.executeSql('DROP TABLE IF EXISTS "flowchart"');
    tx.executeSql('DROP TABLE IF EXISTS "forms"');
    tx.executeSql('DROP TABLE IF EXISTS "haccp_category"');
    tx.executeSql('DROP TABLE IF EXISTS "haccp_items"');
    //tx.executeSql('DROP TABLE IF EXISTS "papers"');
    tx.executeSql('DROP TABLE IF EXISTS "suppliers"');
    tx.executeSql('DROP TABLE IF EXISTS "registration"');
    tx.executeSql('DROP TABLE IF EXISTS "reports"');
    tx.executeSql('DROP TABLE IF EXISTS "settings"');
    tx.executeSql('DROP TABLE IF EXISTS "tasks"');
    /*extra*/
    tx.executeSql('DROP TABLE IF EXISTS "form_item"');
    tx.executeSql('DROP TABLE IF EXISTS "suppliers"');
    tx.executeSql('DROP TABLE IF EXISTS "sync_query"');
    //return true;
};

db.prototype.InitDB = function() {
    this.db = window.openDatabase(this.db_name, this.db_version, "", this.db_size);
    var isCreateDB = false;
    if (this.database && this.database !== undefined && this.database !== null ) {
    	isCreateDB = false;
    } else {
    	isCreateDB = true;
    }
    if(!this.appVersion || (this.appVersion && settings.rebuild && this.appVersion.replace(/\./g, "") < settings.rebuild.replace(/\./g, ""))){
    	isCreateDB = true;
    }
    if(isCreateDB){
    	this.createTables();
    }
};

db.prototype.dbCreateTables = function (tx) {
	this.dbDropTables(tx);
    localStorage.setItem('database', true);
    this.database = true;
    localStorage.setItem("app-version", settings.version);
    this.appVersion = settings.version;
    
    //console.warn('sunt pe database create');
    tx.executeSql('CREATE TABLE IF NOT EXISTS "settings" ("type"  NOT NULL  UNIQUE , "value" )',[],function(tx){
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
    console.log("Error processing SQL: ",err);
    console.log('query: ',query);
};

db.prototype.dbSuccessHandle = function() {
    //alert("success!");
    return true;
};

db.prototype.getDbInstance = function(){
    return this.db;
};
