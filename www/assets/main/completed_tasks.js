function getTasksCompletedCall(a,b){if(0==b.rows.length&&isOffline())$("#no_results_taskList_complete").text($.t("error.completed_tasks_internet_connect_error"));else if(0!=b.rows.length||isOffline()){if(b.rows.length>0){ct_currentTime&&void 0!=ct_currentTime||a.executeSql('SELECT * FROM "settings" WHERE "type" = "'+ct_settings_type+'"',[],completedTaskGet,db.dbErrorHandle);for(var c,d=[],e=[],f=0;f<b.rows.length;f++)in_array(b.rows.item(f).date_start,e)||(d.push({id:b.rows.item(f).date_start,data:Page.formatTaskDate(date=new Date(b.rows.item(f).date_start)),extra:'data-role="list-divider"'}),e.push(b.rows.item(f).date_start)),c=b.rows.item(f).overdue?'<span class="ui-li-count overdue">OVERDUE</span>':"",d.push({id:b.rows.item(f).date_start,data:'<a href="task_view.html?id='+b.rows.item(f).id+'" data-transition="slide"><i class="fa fa-check-square-o"></i> '+b.rows.item(f).title+"</a>"+c});_append("#taskList_complete",d),$("#no_results_taskList_complete").hide()}}else{$("#no_results_taskList_complete").text($.t("error.completed_tasks_no_result"));var d={client:User.client,token:User.lastToken};Page.apiCall("getTasksCompleted",d,"get","getTasksCompleted")}}function getTasksCompletedR(a){a.executeSql('select * from tasks WHERE "completed" = 1',[],getTasksCompletedCall,db.dbErrorHandle)}function completed_tasksInit(){if(User.isLogged()){var a=db.getDbInstance();a.transaction(getTasksCompletedR,db.dbErrorHandle)}else Page.redirect("login.html")}function getTasksCompleted(a){if(a.success){var b=[];if(a.tasks){var d="",e='INSERT INTO "tasks"("id","title","overdue", "dueDate", "completed", "check", "date_start")',f=!1;for(var g in a.tasks){d=new Date(g),b.push({id:g,data:Page.formatTaskDate(d),extra:'data-role="list-divider"'});for(var h in a.tasks[g])getIds.push(a.tasks[g][h].id),f?e+=" UNION":f=!0,e+=' SELECT "'+a.tasks[g][h].id+'" as "id", "'+a.tasks[g][h].taskName+'" as "title", "'+a.tasks[g][h].overdue+'" as "overdue", \''+JSON.stringify(a.tasks[g][h].dueDate)+'\' as "dueDate", "1" as "completed", "'+md5(JSON.stringify(a.tasks[g][h]))+'" as "check", "'+g+'" as date_start',a.tasks[g][h].overdue?c='<span class="ui-li-count overdue">OVERDUE</span>':c="",b.push({id:g,data:'<a href="task_view.html?id='+a.tasks[g][h].id+'" data-transition="slide"><i class="fa fa-check-square-o"></i> '+a.tasks[g][h].taskName+"</a>"+c})}db.clean(),db.execute(e),$("#no_results_taskList_complete").hide(),_append("#taskList_complete",b)}ct_currentTime=a.currentTime;var i=db.getDbInstance();i.transaction(completedTaskUpdated,i.dbErrorHandle)}}function completedTaskGet(a,b){b.rows.length>0&&(ct_currentTime=$.parseJSON(b.rows.item(0).value))}function completedTaskUpdated(a){a.executeSql('SELECT * FROM "settings" WHERE "type" = "'+ct_settings_type+'"',[],completedTaskCommitUpdate,db.dbErrorHandle)}function completedTaskCommitUpdate(a,b){b.rows.length>0?a.executeSql('UPDATE "settings" SET "value" = \''+JSON.stringify(ct_currentTime)+'\' WHERE "type" = "'+ct_settings_type+'"',[],[],db.dbErrorHandle):a.executeSql('INSERT INTO "settings"("type", "value") VALUES("'+ct_settings_type+"\", '"+JSON.stringify(ct_currentTime)+"')",[],[],db.dbErrorHandle)}function completed_tasksAsync(){setTimeout(function(){console.log("completed_tasks:"+ct_currentTime.date);var a={client:User.client,token:User.lastToken,date_from:JSON.stringify(ct_currentTime)};Page.apiCall("getTasksCompleted",a,"get","getTasksCompleted"),completed_tasksAsync()},Page.settings.syncIntervals.completed_tasks)}var getIds=[],ct_currentTime=!1,ct_settings_type="completedTaskUpdated";