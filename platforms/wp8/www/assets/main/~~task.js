function getTasksCall(a,b){if(0==b.rows.length&&isOffline())$("#no_results").text("No task to show. Please connect to internet to sync.");else if(0!=b.rows.length||isOffline()){if(b.rows.length>0&&!isOffline()){$("#no_results").text("No task to show, yet.");var c={client:User.client,token:User.lastToken};Page.apiCall("getTasksUncompleted",c,"get","getTasksUncompletedShow")}else if(b.rows.length>0){currentTime&&void 0!=currentTime||a.executeSql('SELECT * FROM "settings" WHERE "type" = "'+settings_type+'"',[],uncompletedTaskGet,db.dbErrorHandle);for(var d,e,c=[],f=[],g=0;g<b.rows.length;g++)in_array(b.rows.item(g).date_start,f)||(c.push({id:b.rows.item(g).date_start,data:Page.formatTaskDate(date=new Date(b.rows.item(g).date_start)),extra:'data-role="list-divider"'}),f.push(b.rows.item(g).date_start)),d=b.rows.item(g).overdue?'<span class="ui-li-count overdue">OVERDUE</span>':"",e="deviation"==b.rows.item(g).type?'<a href="haccp_deviation_fix.html?id='+b.rows.item(g).id+'" data-transition="slide"><i class="fa fa-warning"></i> '+b.rows.item(g).title+"</a>"+d:'<a href="task_view.html?id='+b.rows.item(g).id+'" data-transition="slide"><i class="fa fa-square-o"></i> '+b.rows.item(g).title+"</a>"+d,c.push({id:b.rows.item(g).date_start,data:e});_append("#taskList",c),$("#no_results").hide()}}else{$("#no_results").text("No task to show, yet.");var c={client:User.client,token:User.lastToken};Page.apiCall("getTasksUncompleted",c,"get","getTasksUncompleted")}}function getTasks(a){a.executeSql('select * from tasks WHERE "completed" = 0',[],getTasksCall,db.dbErrorHandle)}function tasksInit(){if(User.isLogged()){var a=db.getDbInstance();a.transaction(getTasks,db.dbErrorHandle)}else Page.redirect("login.html")}function getTasksUncompleted(a){if(console.log(a),a.success){var b=[];if(a.tasks){var d="",e='INSERT INTO "tasks"("id","title","type", "overdue", "dueDate", "completed", "check", "date_start")',f=!1,g="";for(var h in a.tasks){d=new Date(h),b.push({id:h,data:Page.formatTaskDate(d),extra:'data-role="list-divider"'});for(var i in a.tasks[h])getIds.push(a.tasks[h][i].id),f?e+=" UNION":f=!0,e+=' SELECT "'+a.tasks[h][i].id+'" as "id", "'+a.tasks[h][i].taskName+'" as "title", "'+a.tasks[h][i].type+'" as "type", "'+a.tasks[h][i].overdue+'" as "overdue", \''+JSON.stringify(a.tasks[h][i].dueDate)+'\' as "dueDate", "0" as "completed", "'+md5(JSON.stringify(a.tasks[h][i]))+'" as "check", "'+h+'" as date_start',a.tasks[h][i].overdue?c='<span class="ui-li-count overdue">OVERDUE</span>':c="",g="deviation"==a.tasks[h][i].type?'<a href="haccp_deviation_fix.html?id='+a.tasks[h][i].id+'" data-transition="slide"><i class="fa fa-warning"></i> '+a.tasks[h][i].taskName+"</a>"+c:'<a href="task_view.html?id='+a.tasks[h][i].id+'" data-transition="slide"><i class="fa fa-square-o"></i> '+a.tasks[h][i].taskName+"</a>"+c,b.push({id:h,data:g})}db.clean(),db.execute(e),$("#no_results").hide(),_append("#taskList",b)}currentTime=a.currentTime;var j=db.getDbInstance();j.transaction(uncompletedTaskUpdated,j.dbErrorHandle)}}function getTasksUncompletedShow(a){if(console.log(a),a.success){var b=[];if(a.tasks){var d="",e='INSERT INTO "tasks"("id","title","type", "overdue", "dueDate", "completed", "check", "date_start")',f=!1,g="";for(var h in a.tasks){d=new Date(h),b.push({id:h,data:Page.formatTaskDate(d),extra:'data-role="list-divider"'});for(var i in a.tasks[h])getIds.push(a.tasks[h][i].id),f?e+=" UNION":f=!0,e+=' SELECT "'+a.tasks[h][i].id+'" as "id", "'+a.tasks[h][i].taskName+'" as "title", "'+a.tasks[h][i].type+'" as "type", "'+a.tasks[h][i].overdue+'" as "overdue", \''+JSON.stringify(a.tasks[h][i].dueDate)+'\' as "dueDate", "0" as "completed", "'+md5(JSON.stringify(a.tasks[h][i]))+'" as "check", "'+h+'" as date_start',a.tasks[h][i].overdue?c='<span class="ui-li-count overdue">OVERDUE</span>':c="",g="deviation"==a.tasks[h][i].type?'<a href="haccp_deviation_fix.html?id='+a.tasks[h][i].id+'" data-transition="slide"><i class="fa fa-warning"></i> '+a.tasks[h][i].taskName+"</a>"+c:'<a href="task_view.html?id='+a.tasks[h][i].id+'" data-transition="slide"><i class="fa fa-square-o"></i> '+a.tasks[h][i].taskName+"</a>"+c,b.push({id:h,data:g})}db.clean(),$("#no_results").hide(),_append("#taskList",b)}currentTime=a.currentTime;var j=db.getDbInstance();j.transaction(uncompletedTaskUpdated,j.dbErrorHandle)}}function uncompletedTaskGet(a,b){b.rows.length>0&&(currentTime=$.parseJSON(b.rows.item(0).value))}function uncompletedTaskUpdated(a){a.executeSql('SELECT * FROM "settings" WHERE "type" = "'+settings_type+'"',[],uncompletedTaskCommitUpdate,db.dbErrorHandle)}function uncompletedTaskCommitUpdate(a,b){b.rows.length>0?a.executeSql('UPDATE "settings" SET "value" = \''+JSON.stringify(currentTime)+'\' WHERE "type" = "'+settings_type+'"',[],function(){},db.dbErrorHandle):a.executeSql('INSERT INTO "settings"("type", "value") VALUES("'+settings_type+"\", '"+JSON.stringify(currentTime)+"')",[],function(){},db.dbErrorHandle)}function tasksAsync(){setTimeout(function(){console.log("tasks:"+currentTime.date);var a={client:User.client,token:User.lastToken,date_from:JSON.stringify(currentTime)};Page.apiCall("getTasksUncompleted",a,"get","getTasksUncompleted"),tasksAsync()},Page.settings.syncIntervals.tasks)}function clearTasksRefresh(){window.location.href=""}function clearTasksCall(a){a.executeSql('DELETE FROM tasks WHERE "completed" = 0',[],clearTasksRefresh,db.dbErrorHandle)}function clearTasks(){var a=db.getDbInstance();a.transaction(clearTasksCall,a.dbErrorHandle)}var getIds=[],currentTime=!1,settings_type="uncompletedTaskUpdated";