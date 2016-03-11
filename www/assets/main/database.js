function db(){this.db_name="haccp",this.db_version="1.0",this.db_size=5242880,this.database=localStorage.getItem("database"),this.appVersion=localStorage.getItem("app-version"),this.data=[],this.query=!1,this.collections=[],this.tables=["settings","tasks","haccp_category","haccp_items","forms","registration","form_item","sync_query","reports","flowchart"],PouchDB.plugin(Erase)}function _fetchResults(a,b){db_data=b.rows}function createDesignDoc(a,b){var c={_id:"_design/"+a,views:{}};return c.views[a]={map:b.toString()},c}var query=!1,db_data=[];db.prototype.asyncExecute=function(a,b,c){void 0!=a.sql&&b<a.data.length&&this.asyncExecute(a,parseInt(b)+1)},db.prototype.lazyQuery=function(a,b,c,d){if(1==logout_flag)return!1;a&&void 0!=b&&b.length>0?this.bulkDocs(a,b,c,d):"function"!=typeof c&&void 0!=window[c]?d?window[c](d):window[c]():c&&"function"==typeof c&&(d?c(d):c())},db.prototype.bulkDocs=function(a,b,c,d){if(console.log("bulkDocs",b),!a)return null;for(var e=[],f=this,g=0;g<b.length;g++){var h=g;!function(c,f){e[f]=new Promise(function(e,g){c.collections[a].get(String(b[f]._id||b[f].id),function(g,h){g&&(b[f].timestamp=(new Date).toJSON(),e(!1)),!g&&h&&h._rev?(b[f]=jQuery.extend(h,b[f]),b[f]._id=String(b[f]._id),d&&d._deleted&&(console.log("deleted"),c.collections[a].remove(h)),e(!0)):e(!1)})})}(f,h)}Promise.all(e).then(function(){return d&&d._deleted?void("function"!=typeof c&&void 0!=window[c]?window[c]():c&&"function"==typeof c&&c()):void f.collections[a].bulkDocs(b,function(a,b){"function"!=typeof c&&void 0!=window[c]?d?window[c](d,b):window[c](b):c&&"function"==typeof c&&(d?c(d,b):c(b))})})},db.prototype.lazyQuerySync=function(a,b,c,d){if(1==logout_flag)return!1;void 0!=a&&void 0!=b&&b.length>0?this.bulkDocs(a,b,c,d):void 0!=window[c]&&(void 0!=d?window[c](d):window[c]())},db.prototype.clean=function(){query=!1,db_data=[]},db.prototype._execQuery=function(a){return query?void a.executeSql(query,[],_fetchResults,this.dbErrorHandle):!1},db.prototype.createView=function(a,b,c){var d=createDesignDoc(b,c);this.collections[a].putIfNotExists(d)},db.prototype.createTables=function(a){localStorage.setItem("database",!0),this.database=!0,localStorage.setItem("app-version",settings.version),this.appVersion=settings.version;for(var b=this,c=0;c<this.tables.length;c++){var d=c;!function(a){b.collections[b.tables[a]]||(b.collections[b.tables[a]]=new PouchDB(b.db_name+"_"+b.tables[a],{skip_setup:!0,adapter:"websql",size:this.db_size}),b.collections[b.tables[a]].adapter||(b.collections[b.tables[a]]=new PouchDB(b.db_name+"_"+b.tables[a],{skip_setup:!0}))),b.createView(b.tables[a],"sort_index",function(a){emit(a.timestamp)})}(d)}this.createView("sync_query","get_sync",function(a){a.executed||emit(a.timestamp)}),a&&window.location.reload()},db.prototype.dropDb=function(){this.db.transaction(this.dbDropTables,this.dbErrorHandle,function(){return!0})},db.prototype.dbDropTables=function(){this.database=!1;for(var a=0;a<localStorage.length;a++)"user_email"!=localStorage.key(a)&&localStorage.removeItem(localStorage.key(a));for(var b=[],a=0;a<this.tables.length;a++){var c=this.collections[this.tables[a]];c||(c=new PouchDB(this.db_name+"_"+this.tables[a],{skip_setup:!0})),b[a]=new Promise(function(a,b){c.destroy(function(){a(!0)})})}return Promise.all(b).then(function(a){return a.length==b.length?a:void 0})},db.prototype.InitDB=function(){var a=!1,b=this;a=this.database&&void 0!==this.database&&null!==this.database?!1:!0,(!this.appVersion||this.appVersion&&settings.rebuild&&this.appVersion.replace(/\./g,"")<settings.rebuild.replace(/\./g,""))&&(a=!0),a?this.dbDropTables().then(function(a){b.createTables(!0)}):this.createTables()},db.prototype.dbCreateTables=function(a){this.dbDropTables(a),localStorage.setItem("database",!0),this.database=!0,localStorage.setItem("app-version",settings.version),this.appVersion=settings.version},db.prototype.dbErrorHandle=function(a){console.log("Error processing SQL: ",a),console.log("query: ",query);this.dbDropTables().then(function(){window.location.reload()})},db.prototype.dbSuccessHandle=function(){return!0},db.prototype.getDbInstance=function(a){return a?this.collections[a]:!1},db.prototype.clearCollection=function(a,b){console.log("clearCollection");var c=this;this.collections[a]?this.collections[a].erase({},function(){c.collections[a].compact().then(function(a){b({deleted:!0})})["catch"](function(a){console.log(a)})}):b({deleted:!0})};