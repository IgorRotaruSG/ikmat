function selectTaskById(a,b){d=db.getDbInstance(),d.transaction(function(c){c.executeSql('SELECT * FROM "sync_query" WHERE "id"=?',[a],function(a,c){c.rows.length>0&&(console.log("selectTaskById",c.rows.item(0)),b(c.rows.item(0)))})})}function sync_updateDB(a,b){d=db.getDbInstance();try{b&&b.id&&d.transaction(function(c){var d={};a?(d.sql='UPDATE "sync_query" SET "executed"=?,"extra"=? WHERE "id"=?',d.args=[1,a,b.id]):(d.sql='UPDATE "sync_query" SET "executed"=? WHERE "id"=?',d.args=[1,b.id]),c.executeSql(d.sql,d.args,function(){_sync_lock=!1,_sync_data_i=parseInt(_sync_data_i)+1,(_sync_data_i>=_sync_data_rows.length||!_sync_data_rows)&&($("#syncing_tasks").addClass("hide"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")),sync_query(a,b)})})}catch(c){_sync_lock=!1,_sync_data_i=parseInt(_sync_data_i)+1,console.error("wtf"),sync_query()}}function sync_query(a,b){if(isOffline())return _sync_data_rows=!1,_sync_lock=!1,$("#syncing_tasks").addClass("hide"),void $(".overflow-wrapper").addClass("overflow-wrapper-hide");if(_sync_data_rows)if(_sync_data_i<_sync_data_rows.length&&!_sync_lock){$("#syncing_tasks").hasClass("hide")&&$("#syncing_tasks").removeClass("hide"),$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c=object=$.extend({},_sync_data_rows.item(_sync_data_i));try{c.data=JSON.parse(c.data),c.data.client=User.client,c.data.token=User.lastToken,_sync_lock=!0,"uploadPhotos"!=c.api?Page.apiCall(c.api,c.data,"post","sync_updateDB",{id:c.id}):(console.log("uploadPhotos",c),selectTaskById(c.extra,function(a){console.log("success",a),a.extra&&(a.data=JSON.parse(a.data),c.data.task_id=a.extra,c.data.imageURI&&c.data.task_id&&Page.uploadImage(c.data,function(){window.URL.revokeObjectURL(c.data.imageURI),sync_updateDB(null,{id:c.id})},function(){sync_updateDB(null,{id:c.id})}))}))}catch(e){console.error("wtf"),sync_query()}}else _sync_data_i>0&&(_sync_lock=!1,_sync_data_rows=!1,$("#syncing_tasks").addClass("hide"),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),window.location.reload());else d.transaction(function(a){a.executeSql('SELECT * FROM "sync_query" WHERE "executed"=?',[0],function(a,b){_sync_data_rows=b.rows,console.log("_sync_data_rows",_sync_data_rows),_sync_data_i=0,sync_query()})})}var _sync_data_rows=!1,_sync_data_i=0,_sync_lock=!1;