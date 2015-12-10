function db(){this.db_name="haccp",this.db_version="1.0",this.db_size=5242880,this.database=localStorage.getItem("database"),this.appVersion=localStorage.getItem("app-version"),this.data=[],this.query=!1}function _fetchResults(a,b){db_data=b.rows}var query=!1,db_data=[];db.prototype.asyncExecute=function(a,b,c){void 0!=a.sql&&b<a.data.length&&(console.log("async triggered"),this.asyncExecute(a,parseInt(b)+1))},db.prototype.lazyQuery=function(a,b,c){if(1==logout_flag)return!1;var d=this;void 0!=a.sql&&void 0!=a.data&&a.data.length>b?this.db.transaction(function(e){void 0!=a.check?e.executeSql('SELECT COUNT(*) as "count","'+a.check.column+'" FROM "'+a.check.table+'" WHERE "'+a.check.index+'"=?',[a.data[b][a.check.index_id]],function(e,f){if(f.rows.item(0).count>0)if(f.rows.item(0)[a.check.column]!=a.data[b][a.check.column_id]){var g=a.data[b].slice(0),h=g[a.check.index_id];g.splice(a.check.index_id,1),g.push(h),e.executeSql(a.check.update_query,g,function(e){d.lazyQuery(a,parseInt(b)+1,c)})}else d.lazyQuery(a,parseInt(b)+1,c);else e.executeSql(a.sql,a.data[b],function(){d.lazyQuery(a,parseInt(b)+1,c)})}):e.executeSql(a.sql,a.data[b],function(){d.lazyQuery(a,parseInt(b)+1,c)})},function(b,c){console.warn("We have an lazy query error here:"),console.log(a),console.warn(b),console.warn("-------------------------------------")}):void 0!=window[c]&&window[c]()},db.prototype.lazyQuerySync=function(a,b,c,d){if(1==logout_flag)return!1;var e=this;void 0!=a.sql&&void 0!=a.data&&a.data.length>b?this.db.transaction(function(f){f.executeSql(a.sql,a.data[b],function(){e.lazyQuerySync(a,parseInt(b)+1,c,d)})},function(b,c){console.warn("We have an lazy query error here:"),console.log(a),console.warn(b),console.warn("-------------------------------------")}):void 0!=window[c]&&(void 0!=d?window[c](d):window[c]())},db.prototype.clean=function(){query=!1,db_data=[]},db.prototype._execQuery=function(a){return query?void a.executeSql(query,[],_fetchResults,this.dbErrorHandle):!1},db.prototype.execute=function(a){query=a,this.db.transaction(this._execQuery,this.dbErrorHandle)},db.prototype.createTables=function(){this.db.transaction(function(a){var b=["settings","tasks","suppliers","employees","haccp_category","haccp_items","forms","registration","form_items"],c="SELECT name FROM sqlite_master WHERE type='table' AND name IN (?)",d='"'+b.join('","')+'"';a.executeSql(c,[d],function(a,c){c.rows.length!=b.length&&db.dbCreateTables(a)})},this.dbErrorHandle,this.dbSuccessHandle)},db.prototype.dropDb=function(){this.db.transaction(this.dbDropTables,this.dbErrorHandle,function(){return!0})},db.prototype.dbDropTables=function(a){this.database=!1,window.localStorage.clear(),a.executeSql('DROP TABLE IF EXISTS "employees"'),a.executeSql('DROP TABLE IF EXISTS "flowchart"'),a.executeSql('DROP TABLE IF EXISTS "forms"'),a.executeSql('DROP TABLE IF EXISTS "haccp_category"'),a.executeSql('DROP TABLE IF EXISTS "haccp_items"'),a.executeSql('DROP TABLE IF EXISTS "suppliers"'),a.executeSql('DROP TABLE IF EXISTS "registration"'),a.executeSql('DROP TABLE IF EXISTS "reports"'),a.executeSql('DROP TABLE IF EXISTS "settings"'),a.executeSql('DROP TABLE IF EXISTS "tasks"'),a.executeSql('DROP TABLE IF EXISTS "form_item"'),a.executeSql('DROP TABLE IF EXISTS "suppliers"'),a.executeSql('DROP TABLE IF EXISTS "sync_query"')},db.prototype.InitDB=function(){this.db=window.openDatabase(this.db_name,this.db_version,"",this.db_size);var a=!1;a=this.database&&void 0!==this.database&&null!==this.database?!1:!0,(!this.appVersion||this.appVersion&&settings.rebuild&&this.appVersion.replace(/\./g,"")<settings.rebuild.replace(/\./g,""))&&(a=!0),console.log("isCreateDB",a),a&&this.createTables()},db.prototype.dbCreateTables=function(a){this.dbDropTables(a),localStorage.setItem("database",!0),this.database=!0,localStorage.setItem("app-version",settings.version),this.appVersion=settings.version,a.executeSql('CREATE TABLE IF NOT EXISTS "settings" ("type"  NOT NULL  UNIQUE , "value" )',[],function(a){}),a.executeSql('CREATE TABLE IF NOT EXISTS "tasks" ("id" INTEGER PRIMARY KEY NOT NULL ,"title" VARCHAR NOT NULL,"type" VARCHAR, "overdue" BOOL NOT NULL, "dueDate" TEXT, "completed" BOOL NOT NULL DEFAULT (1), "check" VARCHAR, "date_start" VARCHAR, "taskData" TEXT)'),a.executeSql('CREATE TABLE IF NOT EXISTS "suppliers" ("name" VARCHAR NOT NULL , "address" VARCHAR, "phone_number" VARCHAR, "id_number" VARCHAR)'),a.executeSql('CREATE TABLE IF NOT EXISTS "employees" ("first_name"  NOT NULL , "last_name"  NOT NULL , "email" , "role" )'),a.executeSql('CREATE TABLE IF NOT EXISTS "haccp_category" ("id" INTEGER PRIMARY KEY  NOT NULL  UNIQUE , "name" VARCHAR)'),a.executeSql('CREATE TABLE IF NOT EXISTS "haccp_items" ("id" INTEGER NOT NULL, "cat" INTEGER NOT NULL , "content" TEXT, "form" TEXT, "response" VARCHAR)'),a.executeSql('CREATE TABLE IF NOT EXISTS "forms" ("type" VARCHAR PRIMARY KEY NOT NULL , "label" TEXT, "alias" VARCHAR)'),a.executeSql('CREATE TABLE IF NOT EXISTS "form_item" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "label" VARCHAR NOT NULL , "form" TEXT NOT NULL, "type" VARCHAR)'),a.executeSql('CREATE TABLE IF NOT EXISTS "registration" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "step" INTEGER NOT NULL  UNIQUE , "data" TEXT NOT NULL )'),a.executeSql('CREATE TABLE IF NOT EXISTS "sync_query" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "time" DATETIME NOT NULL  DEFAULT CURRENT_TIMESTAMP, "api" VARCHAR NOT NULL , "data" TEXT NOT NULL , "extra" INTEGER, "executed" INTEGER NOT NULL  DEFAULT 0,"q_type" VARCHAR)'),a.executeSql('CREATE TABLE IF NOT EXISTS "reports" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "name" VARCHAR, "html" TEXT, "link" VARCHAR)'),a.executeSql('CREATE TABLE IF NOT EXISTS "flowchart" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "name" TEXT, "path" TEXT)')},db.prototype.dbErrorHandle=function(a){console.log("Error processing SQL: ",a),console.log("query: ",query)},db.prototype.dbSuccessHandle=function(){return!0},db.prototype.getDbInstance=function(){return this.db};