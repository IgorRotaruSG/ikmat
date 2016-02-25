function getTasksCall(a,b){if(bindLoadMoreFunction(),!b&&isOffline())$("#alertPopup .alert-text").html($.t("error.no_internet_for_sync")),$("#alertPopup").popup("open",{positionTo:"window"}),tasks_page--,0==tasks_page?$("#load_more_tasks").parent().find(".ui-btn-text").html($.t("error.no_tasks")):$("#load_more_tasks").parent().hide();else if(isOffline())b&&b.rows.length>0?getTasksFromLocal(b):db.getDbInstance("settings").allDocs({keys:["register_edit","haccp","role"],include_docs:!0},function(a,c){var d=!0,e=!0;if(c&&c.rows.length>0)for(var f=0;f<c.rows.length;f++)"register_edit"==c.rows[f].key&&c.rows[f].doc.value&&(d=!1),"haccp"==c.rows[f].key&&c.rows[f].doc.value&&(e=!1);e?getTasksFromLocal(b):($("#load_more_tasks").parent().hide(),checkTasksList())});else{$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c={client:User.client,token:User.lastToken};last_update&&(c.last_update=last_update.getTime()),res=b,Page.apiCall("getTasksUpdated",c,"get","updateTasks"),Page.apiCall("getFormList",c,"get","getFormsList"),Page.apiCall("getReportList",c,"get","getReportsList")}}function getFormsList(a){if(a.success){var b=a.form_list,c=[];"ROLE_EMPLOYEE"!=localStorage.getItem("role")&&(c=[[999,$.t("nav.employee")],[1e3,$.t("nav.supplier")]]);for(var d in b)"object"==typeof b[d]?c.push([d,b[d].alias]):c.push([d,b[d]]);c.sort(function(a,b){return a=a[1],b=b[1],b>a?-1:a>b?1:0});for(var e=[],f=0;f<c.length;f++){var d=c[f][0],g=c[f][1];("maintenance"!=d||"food_poision"!=d||999!=d&&1e3!=d)&&e.push([d,g,g])}e.length>0&&db.lazyQuery("forms",castToListObject(["type","label","alias"],e))}}function getReportsList(a){if(a.success){var b=a.reports_list,c=[];for(var d in b)"object"==typeof b[d]?c.push([d,b[d].alias]):c.push([d,b[d]]);c.sort(function(a,b){return a=a[1],b=b[1],b>a?-1:a>b?1:0}),c.length>0&&db.lazyQuery("reports",castToListObject(["id","name"],c))}}function dateFromString(a){var b=a.split(/[^0-9]/);return new Date(b[0],b[1]-1,b[2],b[3],b[4],b[5])}function updateTasks(a){if(a.success){if("object"==typeof last_update){var b=last_update;b=b.setHours(0,0,0,0);var c=new Date(dateFromString(a.currentTime.date)).setHours(0,0,0,0),d=Math.abs(c-b);d>0&&(isSync=!0)}}else""!=a.error&&User.logout();if(last_update=new Date(dateFromString(a.currentTime.date)),console.log("set last_update",last_update,last_update.getTime()),a.success&&a.tasks_nr>0||a.success&&0==updated||isSync){updated=1;var a={client:User.client,token:User.lastToken};Page.apiCall("getTasksUncompleted",a,"get","getTasksUncompleted")}else getTasksFromLocal(res)}function getTasks(){var a=(tasks_page-1)*per_page;db.getDbInstance("tasks").query("tasks_uncompleted",{include_docs:!0,skip:a,limit:per_page},getTasksCall)}function tasksInit(){tasks_page=1,testInternetConnection(),User.isLogged()?(db.createView("tasks","tasks_uncompleted",function(a){a.completed||emit(JSON.parse(a.dueDate).date)}),executeSyncQuery(),mySwiper=new Swiper(".swiper-container-task",{calculateHeight:!0,releaseFormElements:!0,preventLinks:!0,simulateTouch:!0,keyboardControl:!1,noSwiping:!0,noSwipingClass:"ui-slider",onInit:function(){},onSlideNext:function(a){_t="next"},onSlidePrev:function(a){_t="prev"},onSlideChangeEnd:function(a){$("html, body").animate({scrollTop:0},500),parseInt(a.activeIndex)==parseInt(a.previousIndex)&&a.previousIndex--,0==_h_content&&(_h_content=$(window).height()-$.mobile.activePage.children('[data-role="header"]').height()-35),realignSlideHeight("max-height-task"),"prev"==_t&&a.removeSlide(parseInt(a.activeIndex)+1),setSwiperMinHeight(),"tasks"==$.mobile.activePage.attr("id")&&0==a.activeIndex&&($("h1.ui-title").html($.t("nav.tasks")),$("#form_back_btn i").addClass("hided"))}}),getTasks()):Page.redirect("login.html"),document.addEventListener("resume",function(){var a=$.mobile.activePage.attr("id");"tasks"==a&&getTasks()},!1)}function getTaskData(a){if(a.success&&a.form){isOffline()||db.lazyQuery("tasks",[{_id:document.task_id,taskData:JSON.stringify(a)}]),last_data_received=a.form;var b='<div style="padding:10px;"><form id="form_task_save">';void 0!=a.form.label&&void 0!=a.form.label.value&&(b+='<legend class="legend_task">'+a.form.label.value+"</legend>"),b+=HTML.formGenerate(a.form,$.t("general.save_button")),b+="</form></div>",mySwiper.appendSlide(b,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$(".ui-slider-handle").on("click",function(){return!1}),$("#form_task_save").on("submit",function(a){isReload=!0,a.preventDefault();var b=HTML.getFormValues($(this).parent()),c=HTML.validate($(this)),d={};if(c){var d={client:User.client,token:User.lastToken,results:JSON.stringify(b)},e=!1;for(var f in b)if(b.hasOwnProperty(f)&&void 0!=last_data_received[f].deviation)switch(last_data_received[f].type){case"slider":(b[f]<last_data_received[f].deviation.min||b[f]>last_data_received[f].deviation.max)&&(e=!0);break;case"default":}e?(isOffline()?$("#confirmPopup .alert-text").html($.t("general.deviation_offline_accept_message")):$("#confirmPopup .alert-text").html($.t("general.deviation_accept_message")),$("#confirmPopup").on("popupafteropen",function(a,b){$("#confirmButton").off("click").on("click",function(){confirm_action=!0})}),$("#confirmPopup").off("popupafterclose").on("popupafterclose",function(a,c){$("#confirmButton").unbind("click"),confirm_action&&(confirm_action=!1,isOffline()?db.lazyQuery("sync_query",[{api:"formDeviationStart",data:JSON.stringify(d),extra:0,q_type:"formDeviationStart"}],function(a){a&&db.lazyQuery("tasks",[{_id:String(devId),completed:!0}],function(c){if(c&&c.length>0){var e=c[0].id;db.lazyQuery("tasks",[{_id:String(document.task_id),completed:!0}]),taskGeneration("deviation",{id:e,form_deviation:{task_id:{value:JSON.parse(d.results).task_id},deviation_description:{value:b.temperature+" grader rapportert på "+a.form.label.value}}},function(a){deviationDoneTask({form_deviation:a.form_deviation,id:e})})}})}):(Page.apiCall("formDeviationStart",d,"get","getDeviation"),db.lazyQuery("tasks",[{_id:String(document.task_id),completed:!0}])))}),$("#confirmPopup").popup("open",{positionTo:"window"})):isOffline()?(db.lazyQuery("tasks",[{_id:String(document.task_id),completed:!0}]),db.lazyQuery("sync_query",[{api:"formDeviationStart",data:JSON.stringify(d),extra:document.task_id,q_type:"task_saved"}],"redirectToTasks")):(Page.apiCall("formDeviationStart",d,"get","redirectToTasks"),db.lazyQuery("tasks",[{_id:String(document.task_id),completed:!0}]))}return!1}),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),mySwiper.swipeTo(1,300,!0),mySwiper.resizeFix(),realignSlideHeight("max-height-task")}else console.warn("it seems that we have a problem")}function taskGeneration(a,b,c){db.getDbInstance("form_item").get(a,function(d){if(isOffline()&&d&&d.form){var e;switch(a){case"deviation":case"maintenance":var f={};$.extend(f,{success:!0,form_deviation:JSON.parse(d.form)}),b&&($.extend(!0,f,b),b.id&&(document.task_id=b.id)),e=f,getDeviationForm(e)}closeButtonDisplay(c,e)}else noInternetError($.t("error.no_internet_for_sync"))})}function deviationDoneTask(a){taskDeviationSave(a.id);var b=new FormCache;b.saveToTaskList("deviation",a,function(){Page.redirect("tasks.html"),getTasks()})}function redirectToTasks(){tasks_page=1,mySwiper.swipeTo(0,300,!0),mySwiper.removeSlide(parseInt(mySwiper.activeIndex)+1),mySwiper.reInit(),realignSlideHeight("max-height-task"),isReload&&($("#taskList").empty(),getTasks()),isReload=!1}function getDeviation(a){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var b={client:User.client,token:User.lastToken,task_id:a.form_deviation.last_task_inserted};Page.apiCall("deviation",b,"get","getDeviationForm")}function getDeviationForm(a,b){void 0===b&&(b=!1);var c='<div style="padding:10px;"><form id="form_deviation_save">';c+=HTML.formGenerate(a.form_deviation,$.t("general.save_button"),"dev"),c+='</form><div data-role="popup" data-history="false" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.sign_button")+"</button></div></div>",sss_temp=a.form_deviation.task_id.value,mySwiper.appendSlide(c,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$("#signature-reset").on("click",function(a){return a.preventDefault(),$('input[name="signature"]').val("user name"),!1}),$("#signature-trigger").off("click").on("click",function(a){return a.preventDefault(),openSignaturePopup(),$(document).off("click","#deviation-signature-close").on("click","#deviation-signature-close",function(){$("#signature_pop").popup("close"),$("#sign_name").attr("disabled",!0),$("#signature-trigger").attr("disabled",!0),$("#signature-trigger").val("Signed").button("refresh")}),!1}),$("#form_deviation_save").on("submit",function(a){isReload=!0,a.preventDefault();var b=HTML.validate($(this));if(b){$("#form_back_btn i").addClass("hided"),$("h1.ui-title").html($.t("nav.tasks")),$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c=HTML.getFormValues($(this).parent());if(isOffline()){var d={client:User.client,token:User.lastToken};document.task_id>0?d.form=JSON.stringify(c):d.results=JSON.stringify(c);var e=$("#"+haccp_image_id),f=e.attr("src");f&&(d.imageURI=f),document.task_id>0&&(api="deviation"),db.lazyQuery("sync_query",[{api:api,data:JSON.stringify(d),extra:document.task_id,q_type:"taskDeviationSave"}],function(a){if(a&&a.length>0){var b=a[0].id;document.task_id>0&&(b=document.task_id),$.isNumeric(b)&&$('input[name="task_id"]').val(b),deviationDoneTask({form_fix_deviation:c,id:b})}})}else{var g={client:User.client,token:User.lastToken,task_id:sss_temp,form:JSON.stringify(c)};db.lazyQuery("tasks",[{_id:String(sss_temp),completed:!0}]),Page.apiCall("deviation",g,"get","taskDeviationSave")}}return!1}),closeButtonDisplay(),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),b===!1?mySwiper.swipeTo(2,300,!0):mySwiper.swipeTo(1,300,!0)}function documentSignature(a){$("#sign_name").attr("disabled",!0),$("#signature-trigger").attr("disabled",!0),$("#signature-trigger").val(a.current_time.date).button("refresh")}function taskDeviationSave(a){if($("#taskList").empty(),tasks_page=1,$.isNumeric(a)&&$('input[name="task_id"]').val(a),"undefined"!=typeof $sigdiv){var b={client:User.client,token:User.lastToken,signature:JSON.stringify({name:$("#sign_name").val(),svg:$sigdiv.jSignature("getData","svgbase64")[1],parameter:"task",task_id:a})};isOffline()?db.lazyQuery("sync_query",[{api:"documentSignature",data:JSON.stringify(b),extra:a,q_type:"documentSignature"}]):Page.apiCall("documentSignature",b,"get","documentSignature")}uploadHACCPPicture({task_id:a}),mySwiper.swipeTo(0,300,!1),mySwiper.removeSlide(1),mySwiper.removeSlide(1),mySwiper.resizeFix(),realignSlideHeight("max-height-task"),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),redirectToTasks()}function taskDeviationFixSave(a){if($("#taskList").empty(),tasks_page=1,$.isNumeric(a)&&$('input[name="task_id"]').val(a),"undefined"!=typeof $sigdiv){var b={client:User.client,token:User.lastToken,signature:JSON.stringify({name:$("#sign_name").val(),svg:$sigdiv.jSignature("getData","svgbase64")[1],parameter:"task",task_id:a})};isOffline()?db.lazyQuery("sync_query",[{api:"documentSignature",data:JSON.stringify(b),extra:a,q_type:"documentSignature"}]):Page.apiCall("documentSignature",b,"get","documentSignature")}uploadHACCPPicture({task_id:a,role:"fixed"}),mySwiper.swipeTo(0,300,!1),mySwiper.removeSlide(1),mySwiper.removeSlide(1),mySwiper.resizeFix(),realignSlideHeight("max-height-task"),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),redirectToTasks()}function selectHACCPPicture(a){Page.selectImage(a,function(b){$("#"+a).css({visibility:"visible",display:"block"}).attr("src",b)})}function uploadHACCPPicture(a){var b=$("#"+haccp_image_id),c=b.attr("src"),d=a||{};Page.uploadImage(c,d,function(a){b.css({visibility:"hidden",display:"none"}).attr("src","")})}function getTasksUncompleted(a){if(isSync=!1,$("#load_more_tasks").attr("disabled","disabled"),$("#load_more_tasks").parent().find(".ui-btn-text").html($.t("general.loading")),a.success){if(last_update=new Date(dateFromString(a.currentTime.date)),tasks_total_nr=a.tasks_total_nr,a.tasks){var b=[],c=new Date,d="",e=[],f=0;for(var g in a.tasks){c=new Date(g);var h=$("#taskList").find("li[data-id='"+g+"'][data-role='list-divider']");0==h.length&&b.push({id:g,data:Page.formatTaskDate(c),extra:'data-role="list-divider"'});var i=Object.keys(a.tasks[g]).map(function(b){return a.tasks[g][b]});i.sort(function(a,b){return a=a.taskName,b=b.taskName,b>a?-1:a>b?1:0});for(var j=0;j<i.length;j++){var k=$("#taskList").find("a[data-id='"+i[j].id+"']")[0];k||(f++,getIds.push(i[j].id),e.push([i[j].id,i[j].taskName,i[j].type,i[j].overdue,JSON.stringify(i[j].dueDate),0,md5(JSON.stringify(i[j])),g,i[j].taskData]),d="deviation"==i[j].type?'<a href="#" data-id="'+i[j].id+'" class="generate_deviation_fix">'+i[j].taskName+"</a>":"maintenance"==i[j].type?'<a href="maintenance.html?id='+i[j].id+'" data-id="'+i[j].id+'"  data-transition="slide"><i class="fa fa-key"></i> '+i[j].taskName+"</a>":"food_poision"==i[j].type?'<a href="food_poison.html?id='+i[j].id+'" data-id="'+i[j].id+'" data-transition="slide"><i class="fa fa-flask"></i> '+i[j].taskName+"</a>":'<a href="#" data-id="'+i[j].id+'" class="generate_task_form">'+i[j].taskName+"</a>",i[j].overdue&&"deviation"==i[j].type?b.push({id:g,data:d,extra:'class="li-overdue-red" data-icon="false"'}):b.push({id:g,data:d,extra:'data-icon="false"'}))}}1==tasks_page?(local_tasks_total=f,db.clearCollection("tasks",function(){db.lazyQuery("tasks",castToListObject(["id","title","type","overdue","dueDate","completed","check","date_start","taskData"],e),function(a){})})):(local_tasks_total+=f,db.lazyQuery("tasks",castToListObject(["id","title","type","overdue","dueDate","completed","check","date_start","taskData"],e))),checkTaskData(),db.getDbInstance("settings").allDocs({keys:["register_edit","haccp","role"],include_docs:!0},function(a,c){var d=!0,e=!0,f="";if(c&&c.rows.length>0)for(var g=0;g<c.rows.length;g++)"register_edit"==c.rows[g].key&&c.rows[g].doc.value&&(d=!1),"haccp"==c.rows[g].key&&c.rows[g].doc.value&&(e=!1),"role"==c.rows[g].key&&(f=c.rows[g].doc.value);1==tasks_page&&((d||e)&&"ROLE_EMPLOYEE"!=f&&b.push({id:9999,data:$.t("tasks.registration_steps"),extra:'data-role="list-divider"'}),d&&"ROLE_EMPLOYEE"!=f&&b.push({id:9998,data:'<a href="register_edit.html" data-transition="slide">'+$.t("tasks.complete_profile")+"</a>",extra:'data-icon="false"'}),e&&"ROLE_EMPLOYEE"!=f&&b.push({id:9997,data:'<a href="haccp.html" data-transition="slide">'+$.t("tasks.complete_haccp")+"</a>",extra:'data-icon="false"'})),_append("#taskList",b),mySwiper.reInit(),mySwiper.resizeFix(),realignSlideHeight("max-height-task"),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),bindOpenTask(),mySwiper.reInit(),mySwiper.resizeFix()}),per_page>f?($("#load_more_tasks").attr("disabled",!0),$("#load_more_tasks").parent().hide()):a.tasks_total_nr<=per_page?($("#load_more_tasks").attr("disabled",!0),$("#load_more_tasks").parent().hide()):($("#load_more_tasks").removeAttr("disabled"),$("#load_more_tasks").parent().show(),$("#load_more_tasks").parent().find(".ui-btn-text").html($.t("general.load_more")))}else{var c=new Date,b=[];db.getDbInstance("settings").allDocs({keys:["register_edit","haccp","role"],include_docs:!0},function(a,c){var d=!0,e=!0,f="";if(c&&c.rows.length>0)for(var g=0;g<c.rows.length;g++)"register_edit"==c.rows[g].key&&c.rows[g].doc.value&&(d=!1),"haccp"==c.rows[g].key&&c.rows[g].doc.value&&(e=!1),"role"==c.rows[g].key&&(f=c.rows[g].doc.value);1==tasks_page&&((d||e)&&"ROLE_EMPLOYEE"!=f?b.push({id:9999,data:$.t("tasks.registration_steps"),extra:'data-role="list-divider"'}):($("#load_more_tasks").attr("disabled","disabled"),$("#load_more_tasks").parent().hide()),d&&"ROLE_EMPLOYEE"!=f&&b.push({id:9998,data:'<a href="register_edit.html" data-transition="slide">'+$.t("tasks.complete_profile")+"</a>",extra:'data-icon="false"'}),e&&"ROLE_EMPLOYEE"!=f&&b.push({id:9997,data:'<a href="haccp.html" data-transition="slide">'+$.t("tasks.complete_haccp")+"</a>",extra:'data-icon="false"'})),_append("#taskList",b),mySwiper.reInit(),mySwiper.resizeFix(),realignSlideHeight("max-height-task"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")})}mySwiper.resizeFix(),realignSlideHeight("max-height-task")}}function takeHACCPPicture(a){navigator.camera.getPicture(function(b){$("#"+a).css({visibility:"visible",display:"block"}).attr("src",b)},function(a){console.log("Error getting picture: "+a)},{quality:50,destinationType:navigator.camera.DestinationType.FILE_URI}),realignSlideHeight("max-height-task")}function findTaskData(){for(var a=0;a<emptytaskdata.length;a++){var b={client:User.client,token:User.lastToken,task_id:emptytaskdata[a]};Page.apiCall("getTask",b,"get","updateTaskData",emptytaskdata[a])}}function updateTaskData(a,b){delete emptytaskdata.splice(emptytaskdata.indexOf(b),1),a.success&&(isOffline()||db.bulkDocs("tasks",[{_id:a.form.task_id.value,taskData:JSON.stringify(a)}],function(){}))}function getTasksFromLocal(a){var b,c=[],d=[];if(0!=local_tasks_total&&local_tasks_total>a.total_rows&&(tasks_total_nr-=local_tasks_total-a.total_rows),local_tasks_total=a.total_rows,$("#load_more_tasks").removeAttr("disabled"),$("#load_more_tasks").parent().show(),$("#load_more_tasks").parent().find(".ui-btn-text").html($.t("general.load_more")),console.log("results",a),!a)return $(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#load_more_tasks").parent().hide(),void checkTasksList();per_page>=tasks_total_nr&&($("#load_more_tasks").attr("disabled",!0),$("#load_more_tasks").parent().hide());for(var e=0;e<a.rows.length;e++){var f=$("#taskList").find("a[data-id='"+a.rows[e].doc.id+"']")[0];if(!f){if(!in_array(a.rows[e].doc.date_start,d)){var g=$("#taskList").find("li[data-id='"+a.rows[e].doc.date_start+"'][data-role='list-divider']");0==g.length&&c.push({id:a.rows[e].doc.date_start,data:Page.formatTaskDate(date=new Date(a.rows[e].doc.date_start)),extra:'data-role="list-divider"'}),d.push(a.rows[e].doc.date_start)}b="deviation"==a.rows[e].doc.type?'<a href="#" data-id="'+a.rows[e].doc.id+'" class="generate_deviation_fix">'+a.rows[e].doc.title+"</a>":"maintenance"==a.rows[e].doc.type?'<a href="maintenance.html?id='+a.rows[e].doc.id+'" data-id="'+a.rows[e].doc.id+'" data-transition="slide"><i class="fa fa-key"></i> '+a.rows[e].doc.title+"</a>":"food_poision"==a.rows[e].doc.type?'<a href="food_poison.html?id='+a.rows[e].doc.id+'" data-id="'+a.rows[e].doc.id+'"  data-transition="slide"><i class="fa fa-flask"></i>'+a.rows[e].doc.title+"</a>":'<a href="#" data-id="'+a.rows[e].doc.id+'" class="generate_task_form">'+a.rows[e].doc.title+"</a>",a.rows[e].doc.overdue&&"deviation"==a.rows[e].doc.type?c.push({id:a.rows[e].doc.date_start,data:b,extra:'class="li-overdue-red"'}):c.push({id:a.rows[e].doc.date_start,data:b})}}db.getDbInstance("settings").allDocs({keys:["register_edit","haccp","role"],include_docs:!0},function(a,b){var d=!0,e=!0,f="";if(b&&b.rows.length>0)for(var g=0;g<b.rows.length;g++)"register_edit"==b.rows[g].key&&b.rows[g].doc.value&&(d=!1),"haccp"==b.rows[g].key&&b.rows[g].doc.value&&(e=!1),"role"==b.rows[g].key&&(f=b.rows[g].doc.value);1==tasks_page&&((d||e)&&"ROLE_EMPLOYEE"!=f&&c.push({id:9999,data:$.t("tasks.registration_steps"),extra:'data-role="list-divider"'}),d&&"ROLE_EMPLOYEE"!=f&&c.push({id:9998,data:'<a href="register_edit.html" data-transition="slide">'+$.t("tasks.complete_profile")+"</a>",extra:'data-icon="false"'}),e&&"ROLE_EMPLOYEE"!=f&&c.push({id:9997,data:'<a href="haccp.html" data-transition="slide">'+$.t("tasks.complete_haccp")+"</a>",extra:'data-icon="false"'})),_append("#taskList",c),mySwiper.reInit(),mySwiper.resizeFix(),realignSlideHeight("max-height-task"),bindOpenTask(),$(".overflow-wrapper").addClass("overflow-wrapper-hide")})}function bindLoadMoreFunction(){$("#load_more_tasks").off("click").on("click",function(){if(0==$(this).is(":disabled"))if($(this).attr("disabled","disabled"),$("#load_more_tasks").parent().find(".ui-btn-text").html($.t("general.loading")),tasks_page++,isOffline())getTasks();else{var a={client:User.client,token:User.lastToken,page:tasks_page};Page.apiCall("getTasksUncompleted",a,"get","getTasksUncompleted")}})}function checkTaskData(){db.getDbInstance("tasks").query(function(a,b){a.taskData&&""!=a.taskData&&"undefined"!=a.taskData||b(a)},function(a,b){if(b&&b.rows.length>0&&!isOffline()){for(var c=0;c<b.rows.length;c++)emptytaskdata.push(b.rows[c].id);findTaskData()}})}function checkTasksList(){return setTimeout(function(){var a=$("#taskList").html();""==a&&$("#taskList").parent().html('<div class="no_results" style="width: '+($(window).width()-80)+'px">'+$.t("error.no_tasks")+"</div>")},2e3),!0}function haccpDeviationFix(a){if(a.form_fix_deviation){var b=new Date(a.form_fix_deviation.deviation_date.date.replace(" ","T")),c='<div style="padding:10px;"><h3>'+$.t("tasks.deviation_fix")+"</h3>";if(c+='<form id="form_haccp_deviation_fix">',void 0!==a.form_fix_deviation.deviation_photos&&a.form_fix_deviation.deviation_photos.length>0){var d=[];d="string"==typeof a.form_fix_deviation.deviation_photos?$.parseJSON(a.form_fix_deviation.deviation_photos):a.form_fix_deviation.deviation_photos;for(var e in d)d.hasOwnProperty(e)&&(c+='<img width="100%" height="auto" style="margin:0 auto;" src="'+d[e]+'" />')}c+='<fieldset data-role="controlgroup">'+$.t("haccp_deviation_fix.deviation")+": "+a.form_fix_deviation.deviation.replace(/\+/g," ")+"</fieldset>",c+='<fieldset data-role="controlgroup">'+$.t("haccp_deviation_fix.initial_action")+": "+a.form_fix_deviation.initial_action.replace(/\+/g," ")+"</fieldset>",c+='<fieldset data-role="controlgroup">'+$.t("haccp_deviation_fix.deviation_date")+": "+b.getDate()+"."+(parseInt(b.getMonth())+1)+"."+b.getFullYear()+"</fieldset>",c+='<fieldset data-role="controlgroup">'+$.t("haccp_deviation_fix.responsible")+": "+(a.form_fix_deviation.form.responsible_fix_deviation.value+"").replace(/\+/g," ")+"</fieldset>",c+="<hr />",a.form_fix_deviation.form.signature={type:"signature",label:"Signature"},c+=HTML.formGenerate(a.form_fix_deviation.form,$.t("general.save_button")),c+='<div data-role="popup" data-history="false" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.sign_button")+"</button></div>",c+="</form></div>",mySwiper.appendSlide(c,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$(".ui-slider-handle").on("click",function(){return!1}),mySwiper.swipeTo(1,300,!0),mySwiper.resizeFix(),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),realignSlideHeight("max-height-task"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$("#signature-reset").on("click",function(a){return a.preventDefault(),$('input[name="signature"]').val("user name"),!1}),$("#signature-trigger").off("click").on("click",function(a){return a.preventDefault(),openSignaturePopup(),$(document).off("click","#deviation-signature-close").on("click","#deviation-signature-close",function(){$("#signature_pop").popup("close"),$("#sign_name").attr("disabled",!0),$("#signature-trigger").attr("disabled",!0),$("#signature-trigger").val("Signed").button("refresh")}),!1}),$("#form_haccp_deviation_fix").off("submit").on("submit",function(a){isReload=!0,a.preventDefault();var b=HTML.validate($(this).parent());if(b){var c=Form.getValues($(this));if(isOffline()){var d={client:User.client,token:User.lastToken,task_id:document.task_id,form:JSON.stringify(c)};db.lazyQuery("sync_query",[{api:"deviation",data:JSON.stringify(d),extra:devId,q_type:"deviation_saved"}],function(a){a&&db.lazyQuery("tasks",[{_id:String(devId),completed:!0}],function(){taskDeviationFixSave(devId)})})}else{var e={client:User.client,token:User.lastToken,task_id:devId,form:JSON.stringify(c)};Page.apiCall("deviation",e,"get","taskDeviationFixSave"),db.lazyQuery("tasks",[{_id:String(devId),completed:!0}])}}return!1})}else a.form_deviation&&getDeviationForm(a,!0)}function haccpDeviationFixSave(a){redirectToTasks()}function closeButtonDisplay(a,b){$("#form_back_btn i").removeClass("hided"),$("#form_back_btn").on("click",function(c){a&&a.apply(this,[b]),redirectToTasks()})}function bindOpenTask(){$(".generate_task_form").off("click").on("click",function(a){if(closeButtonDisplay(),$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),a.preventDefault(),$("h1.ui-title").html($(this).html()),document.task_id=$(this).data("id"),isOffline())db.getDbInstance("tasks").get(String(document.task_id),function(a,b){b&&b.taskData?getTaskData(JSON.parse(b.taskData)):($("#alertPopup .alert-text").html($.t("error.no_internet_for_sync")),$("#alertPopup").on("popupafterclose",function(){$("#alertPopup").unbind("popupafterclose"),window.location.href="index.html"}),$("#alertPopup").popup("open",{positionTo:"window"}))});else{var b={client:User.client,token:User.lastToken,task_id:document.task_id};Page.apiCall("getTask",b,"get","getTaskData")}}),$(".generate_deviation_fix").off("click").on("click",function(a){closeButtonDisplay(),$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),a.preventDefault(),$("h1.ui-title").html($(this).html()),devId=$(this).data("id");var b={client:User.client,token:User.lastToken,task_id:devId};isOffline()?db.getDbInstance("tasks").get(String(devId),function(a,b){return b&&b.taskData?void haccpDeviationFix(JSON.parse(b.taskData)):void setTimeout(function(){noInternetError($.t("error.no_internet_for_sync"))},1500)}):Page.apiCall("deviation",b,"get","haccpDeviationFix")})}var getIds=[],currentTime=!1,settings_type="uncompletedTaskUpdated",mySwiper,_h_content=0,_t,last_data_received=!1,offline_signature,emptytaskdata=[],last_update,res,updated=0,isReload,confirm_action=!1,tasks_page=1,per_page=20,devId=0,tasks_total_nr=0,local_tasks_total=0,isSync=!1,sss_temp=null,emptytask=0;