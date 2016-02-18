function db(){this.db_name="haccp",this.db_version="1.0",this.db_size=5242880,this.database=localStorage.getItem("database"),this.appVersion=localStorage.getItem("app-version"),this.data=[],this.query=!1,this.collections=[],this.tables=["settings","tasks","suppliers","employees","haccp_category","haccp_items","forms","registration","form_item","sync_query","reports","flowchart"]}function _fetchResults(a,b){db_data=b.rows}function createDesignDoc(a,b){var c={_id:"_design/"+a,views:{}};return c.views[a]={map:b.toString()},c}var query=!1,db_data=[];db.prototype.asyncExecute=function(a,b,c){void 0!=a.sql&&b<a.data.length&&this.asyncExecute(a,parseInt(b)+1)},db.prototype.lazyQuery=function(a,b,c,d){if(1==logout_flag)return!1;a&&void 0!=b&&b.length>0?this.bulkDocs(a,b,c,d):"function"!=typeof c&&void 0!=window[c]?d?window[c](d):window[c]():c&&"function"==typeof c&&(d?c(d):c())},db.prototype.bulkDocs=function(a,b,c,d){if(!a)return null;for(var e=[],f=this,g=0;g<b.length;g++){b[g].timestamp=(new Date).toJSON();var h=g;!function(c,d){e[d]=new Promise(function(e,f){c.collections[a].get(String(b[d]._id),function(a,c){a&&e(!1),!a&&c&&c._rev?(b[d]=jQuery.extend(c,b[d]),b[d]._id=String(b[d]._id),e(!0)):e(!1)})})}(f,h)}Promise.all(e).then(function(){f.collections[a].bulkDocs(b,function(a,b){"function"!=typeof c&&void 0!=window[c]?d?window[c](d,b):window[c](b):c&&"function"==typeof c&&(d?c(d,b):c(b))})})},db.prototype.lazyQuerySync=function(a,b,c,d){if(1==logout_flag)return!1;void 0!=a&&void 0!=b&&b.length>0?this.bulkDocs(a,b,c,d):void 0!=window[c]&&(void 0!=d?window[c](d):window[c]())},db.prototype.clean=function(){query=!1,db_data=[]},db.prototype._execQuery=function(a){return query?void a.executeSql(query,[],_fetchResults,this.dbErrorHandle):!1},db.prototype.createView=function(a,b,c){var d=createDesignDoc(b,c);this.collections[a].put(d)},db.prototype.createTables=function(){localStorage.setItem("database",!0),this.database=!0,localStorage.setItem("app-version",settings.version),this.appVersion=settings.version;for(var a=0;a<this.tables.length;a++){this.collections[this.tables[a]]=new PouchDB(this.db_name+"_"+this.tables[a],{skip_setup:!0});var b=createDesignDoc("sort_index",function(a){emit(a.timestamp)});this.collections[this.tables[a]].put(b)}this.createView("sync_query","get_sync",function(a){a.executed||emit(a.timestamp)})},db.prototype.dropDb=function(){this.db.transaction(this.dbDropTables,this.dbErrorHandle,function(){return!0})},db.prototype.dbDropTables=function(){this.database=!1;for(var a=0;a<localStorage.length;a++)"user_email"!=localStorage.key(a)&&localStorage.removeItem(localStorage.key(a));for(var b=[],a=0;a<this.tables.length;a++){var c=this.collections[this.tables[a]];b[a]=new Promise(function(a,b){c?c.destroy(a):a(!0)})}return Promise.all(b)},db.prototype.InitDB=function(){var a=!1,b=this;a=this.database&&void 0!==this.database&&null!==this.database?!1:!0,(!this.appVersion||this.appVersion&&settings.rebuild&&this.appVersion.replace(/\./g,"")<settings.rebuild.replace(/\./g,""))&&(a=!0),a?this.dbDropTables().then(function(){b.createTables(),window.location.reload()}):this.createTables()},db.prototype.dbCreateTables=function(a){this.dbDropTables(a),localStorage.setItem("database",!0),this.database=!0,localStorage.setItem("app-version",settings.version),this.appVersion=settings.version},db.prototype.dbErrorHandle=function(a){console.log("Error processing SQL: ",a),console.log("query: ",query);var b=this;this.dbDropTables().then(function(){b.createTables(),window.location.reload()})},db.prototype.dbSuccessHandle=function(){return!0},db.prototype.getDbInstance=function(a){return a?this.collections[a]:!1},db.prototype.clearCollection=function(a){this.collections[a].allDocs({include_docs:!0,deleted:!0})};