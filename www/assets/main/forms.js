function getFormsCall(a,b){if(a&&db.dbErrorHandle(),0==b.rows.length&&isOffline())$("#no_results_forms").text($.t("forms.no_forms_connection"));else if(b.rows.length>0&&isOffline()){$(".overflow-wrapper").addClass("overflow-wrapper-hide");for(var c,d,e,f=[],g=0,h=0;h<b.rows.length;h++)!function(a,b){var h=999==b.rows[a].doc.type?"employee":1e3==b.rows[a].doc.type?"supplier":b.rows[a].doc.type;console.log(a,h),checkForm(h,function(i){if(i){try{c=JSON.parse(b.rows[a].doc.label),e=c.alias,d='<a href="#" data-type="'+h+'" class="form_generator_link">'+c.alias+"</a>"}catch(j){d='<a href="#" data-type="'+h+'" class="form_generator_link">'+b.rows[a].doc.label+"</a>",e=b.rows[a].doc.label}f.push({alias:e,id:a,data:d})}else g++;f.length+g==b.rows.length&&(console.log("gen form"),$("#forms_list").html(""),f.sort(function(a,b){var c=a.id,d=b.id;return d>c?-1:c>d?1:0}),_appendAndSortByAlias("#forms_list",f),bind_form_click_handler(),bind_form2_click_handler())})}(h,b);$("#no_results_forms").hide()}else{console.log("if connection is live");var f={client:User.client,token:User.lastToken};Page.apiCall("formDeviationStart",f,"get","formDeviationStart")}mySwiper.reInit(),mySwiper.resizeFix()}function getForms(){db.getDbInstance("forms").query("sort_label",{include_docs:!0},getFormsCall)}function formsInit(){User.isLogged()?(db.createView("forms","sort_label",function(a){emit(a.label)}),executeSyncQuery(),getForms(),console.log("forms.js 73 swiper init"),mySwiper=new Swiper(".swiper-container-form",{calculateHeight:!0,releaseFormElements:!0,preventLinks:!1,simulateTouch:!1,noSwiping:!0,noSwipingClass:"ui-slider",onInit:function(){1==mySwiper.slides.length&&($("#footer").remove(),$("#form_back_btn i").addClass("hided")),setSwiperMinHeight()},onSlideNext:function(a){_t="next"},onSlidePrev:function(a){_t="prev"},onSlideChangeStart:function(a){},onSlideChangeEnd:function(a){var b=$(document).find(".form2_save");if(HTML.validate($("body"),"ex"),b.length>0){if("next"==_t){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c=Form.validate(a.getSlide(a.previousIndex));if(c){var d=Form.getValues(a.getSlide(a.previousIndex)),e={client:User.client,token:User.lastToken,results:JSON.stringify(d)};canRedirectAfterPoisonParam=!0,console.log("data_send",d),isOffline()?(lazydatasend.push(d),$(".overflow-wrapper").addClass("overflow-wrapper-hide")):Page.apiCall("foodPoison",e,"get","foodPoisonDone")}else canRedirectAfterPoisonParam=!1,a.swipePrev(),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}else if("prev"==_t&&0==a.activeIndex)for(var f=a.slides.length,g=f;g>0;g--)a.removeSlide(parseInt(g)),$("div[data-role='navbar']").remove()}else"prev"==_t&&a.removeSlide(parseInt(a.activeIndex)+1);1==mySwiper.slides.length&&($("#footer").remove(),$("#form_back_btn i").addClass("hided")),$("html, body").animate({scrollTop:0},500),mySwiper.resizeFix(),parseInt(a.activeIndex)==parseInt(a.previousIndex)&&a.previousIndex--;var h=$(".swiper-slide-active").find(".no_results");if(h.length>0&&canRedirectAfterPoisonParam)if(canRedirectAfterPoisonParam=!1,console.log("Is this real life?"),lazydatasend!=[]&&isOffline()){var i=Form.getValues(a.getSlide(a.previousIndex));lazydatasend.push(i);var j={};for(j.results={},g=0;g<lazydatasend.length;g++)for(var k in lazydatasend[g])lazydatasend[g].hasOwnProperty(k)&&("task_id"==k?(j[k]=lazydatasend[g][k],j.results[k]=lazydatasend[g][k]):j.results[k]=lazydatasend[g][k]);j.results=JSON.stringify(j.results),console.log("newlazy",j),db.lazyQuery("sync_query",[{api:"foodPoison",data:JSON.stringify(j),extra:0,q_type:"foodPoison"}],function(a){if(a&&a.length>0){var b=a[0].id;j.results=JSON.parse(j.results),j.results.id=b,formcache.generateFoodPoisonTask("food_poision",j.results,function(){j={},Page.redirect("index.html")})}})}else setTimeout(function(){Page.redirect("index.html")},1e3)}})):Page.redirect("login.html")}function checkForm(a,b){return mapForm[a]?void db.getDbInstance("sync_query").query(function(b,c){b.extra==mapForm[a]&&c(b.id,b.data)},{limit:1},function(a,c){if(console.log("results.rows",c),!(c&&c.rows.length>0))return void(b&&b(!0));var d=JSON.parse(c.rows[0].value);if(d.parameters){d.parameters=JSON.parse(d.parameters);for(key in d.parameters)if(d.parameters.hasOwnProperty(key)&&"off"==d.parameters[key])return void(b&&b(!1))}b&&b(!0)}):void(b&&b(!0))}function toObject(a){for(var b={},c=0;c<a.length;++c)b[a[c][0]]=a[c][1];return b}function sortObject(a){var b,c={},d=[];for(b in a)a.hasOwnProperty(b)&&d.push(a[b]);for(d.sort(),b=0;b<d.length;b++){var e=getKeyByValue(a,d[b]);console.log(e),console.log(d[b]),c[e]=d[b]}return c}function getKeyByValue(a,b){for(var c in a)if(a.hasOwnProperty(c)&&a[c]==b)return c}function formDeviationStart(a){if(a.success){var b=a.form_list,c=[];"ROLE_EMPLOYEE"!=localStorage.getItem("role")&&(c=[[999,$.t("nav.employee")],[1e3,$.t("nav.supplier")]]);for(var d in b)"object"==typeof b[d]?c.push([d,b[d].alias]):c.push([d,b[d]]);c.sort(function(a,b){return a=a[1],b=b[1],b>a?-1:a>b?1:0});for(var a=[],e=[],f=0;f<c.length;f++){var d=c[f][0],g=c[f][1];999!=d&&1e3!=d&&a.push({alias:g,id:100-f,data:'<a href="#" data-type="'+d+'" class="form_generator_link"> '+g+"</a>"}),999==d&&a.push({alias:$.t("nav.employee"),id:999,data:'<a href="#" data-type="employee" class="form_generator_link"><i ></i> '+$.t("nav.employee")+"</a>"}),1e3==d&&a.push({alias:$.t("nav.supplier"),id:1e3,data:'<a href="#" data-type="supplier" class="form_generator_link"><i ></i> '+$.t("nav.supplier")+"</a>"}),("maintenance"!=d||"food_poision"!=d||999!=d&&1e3!=d)&&e.push({_id:String(d),alias:g,data:g})}db.lazyQuery("forms",e),$("#forms_list").html(""),_appendAndSortByAlias("#forms_list",a),bind_form_click_handler(),$("#no_results_forms").hide(),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}realignSlideHeight("max-height-form")}function formGeneration(a,b,c){db.getDbInstance("form_item").query(function(b,c){b.type==a&&c(b)},{include_docs:!0},function(d,e){if(console.log("results",e),isOffline())if(isOffline()&&e&&e.rows.length>0){var f;switch(a){case"dishwasher":case"fridge":case"vegetable_fridge":case"cooler":case"sushi_fridge":case"sushi_cooler":case"cooling_food":case"food_warm":case"food_being_prepared":case"received_stock":for(var g={success:!0,form_list_question:[]},h=0;h<e.rows.length;h++){var i={form:JSON.parse(e.rows[h].doc.form),info:{label:e.rows[h].doc.label,id:e.rows[h].doc.id}};g.form_list_question.push(i)}f=g,formItemData(f);break;case"deviation":case"maintenance":var i={};$.extend(i,{success:!0,form_list_question:{form:{form_deviation:JSON.parse(e.rows[0].doc.form)},info:{label:e.rows[0].doc.label,type:a}}}),b&&($.extend(!0,i,b),b.id&&(document.task_id=b.id)),f=i,formItemData(f);break;case"employee":var i={};$.extend(i,{success:!0,form_register_employee:JSON.parse(e.rows[0].doc.form)}),registerEmployee(i);break;case"supplier":var i={};$.extend(i,{success:!0,form_register_supplier:JSON.parse(e.rows[0].doc.form)}),registerSupplier(i);break;default:var i={};$.extend(i,{success:!0,form_list_question:{form:JSON.parse(e.rows[0].doc.form),info:{label:e.rows[0].doc.label,type:a}}}),f=i,console.log("data",f),formItemData(f)}showCloseButton(c,f)}else noInternetError($.t("error.no_internet_for_sync"));else{switch(console.log("885 connection live"),a){case"maintenance":var f={client:User.client,token:User.lastToken,results:""};console.log("730"),Page.apiCall("maintenance",f,"get","formItemData");break;case"food_poision":var f={client:User.client,token:User.lastToken,results:""};console.log(f),console.log("am trimis call aici"),Page.apiCall("foodPoison",f,"get","formItemData");break;case"employee":var f={client:User.client,token:User.lastToken};console.log("am trimis call employee aici"),Page.apiCall("registerEmployee",f,"get","registerEmployee");break;case"supplier":var f={client:User.client,token:User.lastToken};Page.apiCall("registerSupplier",f,"get","registerSupplier"),console.log("add supplier");break;case"deviation":console.log("deviation 851");var f={client:User.client,token:User.lastToken,results:""};console.log("857"),console.log(f),Page.apiCall("deviationForm",f,"get","formItemData");break;default:console.log("744");var f={client:User.client,token:User.lastToken,category:a};Page.apiCall("formDeviationStart",f,"get","formItemData")}showCloseButton(c)}})}function formItemData(a){if(console.log("forms.js  formItemData 200"),a.success){var b=a.form_list_question;if(void 0!=b.info){var c=b;last_data_received=c.form;var d="form2_save_"+b.info.type+"_"+mySwiper.activeIndex||0,e='<div style="padding:10px;"><form id="'+d+'">';switch(void 0!=b.info.label&&(e+='<legend class="legend_task">'+b.info.label+"</legend>"),console.log("216 forms.js"),b.info.type){case"maintenance":case"deviation":e+=HTML.formGenerate(last_data_received.form_deviation,$.t("general.save_button"),"+1 month"),e+='</form><div data-role="popup" id="signature_pop"  data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.sign_button")+"</button></div></div>",$(document).on("click","#signature-reset",function(a){return a.preventDefault(),$('input[name="signature"]').val("user name"),!1}),$(document).off("click","#signature-trigger").on("click","#signature-trigger",function(a){return a.preventDefault(),openSignaturePopup(),$(document).off("click","#deviation-signature-close").on("click","#deviation-signature-close",function(){$("#signature_pop").popup("close"),$("#sign_name").attr("disabled",!0),$("#signature-trigger").attr("disabled",!0),$("#signature-trigger").val("Signed").button("refresh")}),!1});break;case"food_poision":e='<div style="padding:10px;"><form class="form2_save">',e+='<legend class="legend_task">'+b.info.label+"</legend>";var f={task_id:last_data_received.task_id,guestName:last_data_received.guestName,guestAddress:last_data_received.guestAddress,guestPhone:last_data_received.guestPhone},g=HTML.formGenerate(f,"");e+=g,e+="</form></div>",mySwiper.appendSlide(e,"swiper-slide"),e='<div style="padding:10px;"><form class="form2_save">',e+='<legend class="legend_task">'+b.info.label+"</legend>",f={task_id:last_data_received.task_id,symptoms:last_data_received.symptoms,symptomsDateTime:last_data_received.symptomsDateTime,symptom_days:last_data_received.symptom_days,symptom_hours:last_data_received.symptom_hours},g=HTML.formGenerate(f,""),e+=g,e+="</form></div>",mySwiper.appendSlide(e,"swiper-slide"),e='<div style="padding:10px;"><form class="form2_save">',e+='<legend class="legend_task">'+b.info.label+"</legend>",f={task_id:last_data_received.task_id,makingFoodDateTime:last_data_received.makingFoodDateTime,makingFoodTotalGuests:last_data_received.makingFoodTotalGuests,makingFoodSickGuests:last_data_received.makingFoodSickGuests,makingFoodWhatFood:last_data_received.makingFoodWhatFood,makingFoodEarlierEaten:last_data_received.makingFoodEarlierEaten,guestTalkedDoctor:last_data_received.guestTalkedDoctor},g=HTML.formGenerate(f,""),e+=g,e+="</form></div>",mySwiper.appendSlide(e,"swiper-slide"),e='<div style="padding:10px;"><form class="form2_save">',e+='<legend class="legend_task">'+b.info.label+"</legend>",f={task_id:last_data_received.task_id,ingredients:last_data_received.ingredients,cooledDown:last_data_received.cooledDown,reheated:last_data_received.reheated,keptWarm:last_data_received.keptWarm,restLeftAnalysis:last_data_received.restLeftAnalysis},g=HTML.formGenerate(f,""),e+=g,e+="</form></div>",mySwiper.appendSlide(e,"swiper-slide"),e='<div style="padding:10px;"><form class="form2_save">',e+='<legend class="legend_task">'+b.info.label+"</legend>",f={task_id:last_data_received.task_id,immediateMeasures:last_data_received.immediateMeasures,otherComplaints:last_data_received.otherComplaints,guestCompensation:last_data_received.guestCompensation,employee_id:last_data_received.employee_id,deviation_deadline:last_data_received.deviation_deadline},g=HTML.formGenerate(f,""),e+=g,e+='</form></div><div data-role="popup" id="signature_pop"  data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.sign_button")+"</button></div></div>";var h='<div id="footer" data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="none" style="border:0 !important;"><div data-role="navbar"><ul><li><a href="#" onclick="mySwiper.swipePrev();" data-theme="e" class="must-be-big"><i class="fa fa-angle-left fa-2x pull-left" style="color: #4c7600;"></i> '+$.t("general.previous")+'</a></li><li><a href="#" onclick="mySwiper.swipeNext();" data-theme="e" class="must-be-big"><i class="fa fa-angle-right fa-2x pull-right" style="color: #4c7600;"></i>'+$.t("general.next")+" </a></li></ul></div></div>";$(h).insertBefore("#forms #menu_panel"),mySwiper.appendSlide(e,"swiper-slide"),e='<div class="no_results" style="color:#00cde7;font-size:34px;">'+$.t("register.food_poison_success")+"</div>",mySwiper.appendSlide(e,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create");break;default:e+=HTML.formGenerate(last_data_received,$.t("general.save_button")),e+="</form></div>"}"food_poison"!=c.type&&(mySwiper.appendSlide(e,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create")),mySwiper.swipeTo(mySwiper.activeIndex+1,300,!0),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#"+d).on("submit",function(a){console.log("hei macarena"),a.preventDefault();var d=HTML.getFormValues($(this).parent()),e=HTML.validate($(this));if(e){var f=!1,g={client:User.client,token:User.lastToken,results:JSON.stringify(d)};if("maintenance"==b.info.type||"deviation"==b.info.type){var h=b.info.type;if("deviation"==b.info.type&&(h="deviationForm"),isOffline()){var i={client:User.client,token:User.lastToken};document.task_id>0?i.form=JSON.stringify(d):i.results=JSON.stringify(d);var j=$("#"+haccp_image_id),k=j.attr("src");k&&(i.imageURI=k),document.task_id>0&&(h="deviation"),db.lazyQuery("sync_query",[{api:h,data:JSON.stringify(i),extra:document.task_id,q_type:"maintenanceDoneForm"}],function(a){if(a&&a.length>0){var c=a[0].id;document.task_id>0&&(c=document.task_id),$.isNumeric(c)&&(console.log("data"),$('input[name="task_id"]').val(c)),uploadHACCPPictureForms(),deviationDoneForm({form_fix_deviation:d,id:c},b.info.type)}})}else Page.apiCall(h,g,"get","maintenanceDoneForm")}else{for(var l in d)if(d.hasOwnProperty(l)&&void 0!=last_data_received[l].deviation)switch(last_data_received[l].type){case"slider":(d[l]<last_data_received[l].deviation.min||d[l]>last_data_received[l].deviation.max)&&(f=!0);break;case"default":}if(f)console.log("deviation"),$("#confirmPopup .alert-text").html($.t("general.deviation_accept_message")),$("#confirmPopup").on("popupafteropen",function(a,b){$("#confirmButton").off("click").on("click",function(){if(console.log("aici avem prima chestie"),console.log(g),isOffline()){console.log("else if offline",d);var a={client:User.client,token:User.lastToken,results:JSON.stringify(d),category:c.type};console.log("offline_data",a),db.lazyQuery("sync_query",[{api:"formDeviationStart",data:JSON.stringify(a),extra:0,q_type:"formDeviationStart"}],function(a){if(a&&a.length>0){var b=a[0].id;formGeneration("deviation",{id:b,form_list_question:{form:{form_deviation:{deviation_description:{value:d.temperature+" "+$.t("form.deviation_description")+" "+a.rows.item(0).label}}}}},function(a){console.log("back response",a),deviationDoneForm({form_deviation:a.form_list_question.form.form_deviation,id:b})})}})}else Page.apiCall("formDeviationStart",g,"get","form2_save_dev")}),$.each($("*[data-lang]"),function(a,b){var c=$(b).attr("data-lang");$(b).find("span.ui-btn-text").text($.t(c))})}),$("#confirmPopup").on("popupafterclose",function(a,b){$("#confirmButton").unbind("click")}),$("#confirmPopup").popup("open",{positionTo:"window"});else if(console.log("Form saved successfully. 1302"),isOffline()){var i={client:User.client,token:User.lastToken,results:JSON.stringify(d),category:c.type};db.lazyQuery("sync_query",[{api:formDeviationStart,data:JSON.stringify(i),extra:0,q_type:"formDeviationStart"}]),redirect_to_forms()}else Page.apiCall("formDeviationStart",g,"get","redirect_to_forms")}}return!1}),mySwiper.swipeTo(mySwiper.activeIndex,300,!0),console.log("mySwiper.activeIndex",mySwiper.activeIndex)}else{console.log("forms.js 482",b);var a=[],i=[],e='<div style="padding:10px;"><ul data-role="listview" data-inset="true" data-divider-theme="b">';for(var j in b)b.hasOwnProperty(j)&&(e+='<li><a href="#" data-id="'+b[j].info.id+'" data-type="'+b[j].form.type.value+'" class="form_generator_link2"><i class="fa fa-edit"></i> '+b[j].info.label+"</a></li>",i.push([b[j].info.id,b[j].info.label,JSON.stringify(b[j].form),document.form_cat]));e+="</ul></div>",console.log("forms.js 505",i),isOffline()||db.lazyQuery("form_item",castToListObject(["id","label","form","type"],i)),mySwiper.appendSlide(e,"swiper-slide"),bind_form2_click_handler(),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(mySwiper.activeIndex+1,300,!0)}}else console.log("wrooong")}function maintenance(a){if(console.log("maintenance"),console.log("data"),console.log(a),a.form_deviation){var b='<form id="form_maintenance">';b+=HTML.formGenerate(a.form_deviation,$.t("general.save_button")),b+='</form><div data-role="popup" id="signature_pop"  data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.sign_button")+"</button></div></div>",mySwiper.appendSlide(b,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(mySwiper.activeIndex+1,300,!0),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#signature-trigger").off("click").on("click",function(a){return a.preventDefault(),openSignaturePopup(),$(document).off("click","#deviation-signature-close").on("click","#deviation-signature-close",function(){$("#signature_pop").popup("close");var a={client:User.client,token:User.lastToken,signature:JSON.stringify({name:$("#sign_name").val(),svg:$sigdiv.jSignature("getData","svgbase64")[1],parameter:"task",task_id:sss_temp})};console.log("documentSignature forms.js 592"),Page.apiCall("documentSignature",a,"post","documentSignature")}),!1}),$("#form_maintenance").on("submit",function(a){a.preventDefault();var b=HTML.validate($(this));if(b){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c=HTML.getFormValues($(this).parent()),d={client:User.client,token:User.lastToken,results:JSON.stringify(c)};Page.apiCall("maintenance",d,"get","maintenanceDoneForm")}return!1}),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}if(a.form_fix_deviation){var c=new Date(a.form_fix_deviation.deviation_date.date),b="<h3>Deviation form fix</h3>";if(void 0!=a.form_fix_deviation.deviation_photos&&a.form_fix_deviation.deviation_photos.length>0){var d=$.parseJSON(a.form_fix_deviation.deviation_photos);console.log(d);for(var e in d)d.hasOwnProperty(e)&&(b+='<img width="100%" height="auto" style="margin:0 auto;" src="'+d[e]+'" />')}b+='<fieldset data-role="controlgroup">Deviation. '+a.form_fix_deviation.deviation.replace(/\+/g," ")+"</div>",b+='<fieldset data-role="controlgroup">Initial action. '+a.form_fix_deviation.initial_action.replace(/\+/g," ")+"</div>",b+='<fieldset data-role="controlgroup">Deviation date (from system): '+c.getDate()+"."+(parseInt(c.getMonth())+1)+"."+c.getFullYear()+"</div>",b+='<fieldset data-role="controlgroup">Responsible for fixing deviation: '+a.form_fix_deviation.form.responsible_fix_deviation.value+"</div>",b+="<hr />",b+=HTML.formGenerate(a.form_fix_deviation.form,$.t("general.save_button")),$("#form_maintenance").html(b).off("submit").on("submit",function(a){a.preventDefault();var b=Form.validate($(this));if(b){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c=Form.getValues($(this)),d={client:User.client,token:User.lastToken,task_id:get.id,results:JSON.stringify(c)};Page.apiCall("maintenance",d,"get","maintenanceDoneForm")}return!1}),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}}function maintenanceDoneForm(a,b){$.isNumeric(a)&&$('input[name="task_id"]').val(a),maintenanceSignDone(a),uploadHACCPPictureForms(),Page.redirect("tasks.html"),b&&b()}function foodPoisonDone(a){console.log("foodPoisonDone"),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$.isNumeric(a)&&$('input[name="task_id"]').val(a)}function maintenanceSignDone(a){if($.isNumeric(a)&&$('input[name="task_id"]').val(a),"undefined"!=typeof $sigdiv){var b=null;try{b=$sigdiv.jSignature("getData","svgbase64")[1]}catch(c){}var d={client:User.client,token:User.lastToken,signature:JSON.stringify({name:$("#sign_name").val(),svg:b,parameter:"task",task_id:a})};isOffline()?db.lazyQuery("sync_query",[{api:"documentSignature",data:JSON.stringify(d),extra:a,q_type:"documentSignature"}]):Page.apiCall("documentSignature",d,"post","documentSignature")}}function showCloseButton(a,b){$("#form_back_btn i").hasClass("hided")&&$("#form_back_btn i").removeClass("hided"),$(document).off("click","#form_back_btn").on("click","#form_back_btn",function(c){c.preventDefault(),console.log("form list"),a&&a.apply(this,[b]),$("[href='forms.html']").click()})}function bind_form_click_handler(){$(".form_generator_link").off("click").on("click",function(a){$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),document.form_cat=$(this).data("type"),formGeneration(document.form_cat)})}function deviationDoneForm(a,b){maintenanceSignDone(a.id),b||(b="deviation"),console.log("deviationDoneForm",a,b),formcache.saveToTaskList(b,a,function(){console.log("saveToTaskList",a),$("[href='forms.html']").click()})}function bind_form2_click_handler(){$(".form_generator_link2").off("click").on("click",function(a){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var b=$(this).data("id"),c=$(this).data("type"),d="bind_form2_"+c+"_"+mySwiper.activeIndex||0;db.getDbInstance("form_item").get(String(b),function(a,e){if(e){console.log("forms.js form_item rows > 0");var f=$.extend({},e);last_data_received=JSON.parse(f.form);var g='<div style="padding:10px;"><form id="'+d+'">';g+='<legend style="font-weight: bold;margin-bottom:20px;">'+e.label+"</legend>",g+=HTML.formGenerate(last_data_received,$.t("general.save_button")),g+="</form></div>",mySwiper.appendSlide(g,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(mySwiper.activeIndex+1,300,!0),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#"+d).on("submit",function(a){a.preventDefault();var b=HTML.getFormValues($(this).parent());console.log("dd",b);var c=HTML.validate($(this));if(c){var d=!1,g={client:User.client,token:User.lastToken,results:JSON.stringify(b)};for(var h in b)if(b.hasOwnProperty(h)&&void 0!=last_data_received[h].deviation)switch(last_data_received[h].type){case"slider":(b[h]<last_data_received[h].deviation.min||b[h]>last_data_received[h].deviation.max)&&(d=!0);break;case"default":}if(d)console.log("deviation"),$("#confirmPopup .alert-text").html($.t("general.deviation_accept_message")),$("#confirmPopup").on("popupafteropen",function(a,c){$("#confirmButton").off("click").on("click",function(){if(console.log("aici avem prima chestie"),console.log(g),isOffline()){console.log("else if offline",b);var a={client:User.client,token:User.lastToken,results:JSON.stringify(b),category:f.type};console.log("offline_data",a),db.lazyQuery("sync_query",[{api:"formDeviationStart",data:JSON.stringify(a),extra:0,q_type:"formDeviationStart"}],function(a){formGeneration("deviation",{id:a.id,form_list_question:{form:{form_deviation:{deviation_description:{value:b.temperature+" grader rapportert på "+e.label}}}}},function(a){console.log("back response",a),deviationDoneForm({form_deviation:a.form_list_question.form.form_deviation,id:insertId})})})}else Page.apiCall("formDeviationStart",g,"get","form2_save_dev")}),$.each($("*[data-lang]"),function(a,b){var c=$(b).attr("data-lang");$(b).find("span.ui-btn-text").text($.t(c))})}),$("#confirmPopup").on("popupafterclose",function(a,b){$("#confirmButton").unbind("click")}),$("#confirmPopup").popup("open",{positionTo:"window"});else if(console.log("Form saved successfully. 1302"),isOffline()){var i={client:User.client,token:User.lastToken,results:JSON.stringify(b),category:f.type};db.lazyQuery("sync_query",[{api:"formDeviationStart",data:JSON.stringify(i),extra:0,q_type:"formDeviationStart"}]),redirect_to_forms()}else Page.apiCall("formDeviationStart",g,"get","redirect_to_forms")}return console.log("forms.js 1101"),!1})}else console.log("forms.js form_item rows == 0"),console.log("forms.js 1105"),console.log("heeeeey id = ",b),db.getDbInstance("forms").query(function(a,b){a.type==c&&b(a)},{include_docs:!0},function(a,b){if(console.log("results",c,b),b.rows.length>0){var d={client:User.client,token:User.lastToken,category:b.rows[0].doc.type};document.form_cat=b.rows[0].doc.type,console.log("data:",d),console.log(b.rows[0].doc),Page.apiCall("formDeviationStart",d,"get","formCond3")}else $("#alertPopup .alert-text").html("Operation unavailable"),$("#alertPopup").on("popupafterclose",function(){$("#alertPopup").unbind("popupafterclose"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}),$("#alertPopup").popup("open",{positionTo:"window"})})}),realignSlideHeight("max-height-form")})}function formCond3(a){if(console.log(a),console.log("forms.js 1128"),a.form_list_question instanceof Array)for(var b in a.form_list_question)a.form_list_question.hasOwnProperty(b)&&(console.log("d itera = ",b),console.log(a.form_list_question[b]),db.lazyQuery("form_item",castToListObject(["id","label","form","type"],[a.form_list_question[b].info.id,a.form_list_question[b].info.label,JSON.stringify(a.form_list_question[b].form),document.form_cat])));else db.lazyQuery("form_item",castToListObject(["id","label","form","type"],[a.form_list_question.info.id,a.form_list_question.info.label,JSON.stringify(a.form_list_question.form),document.form_cat]))}function redirect_to_forms(){mySwiper.swipeTo(0,300,!0),mySwiper.removeSlide(1),mySwiper.removeSlide(1),mySwiper.reInit(),mySwiper.resizeFix(),realignSlideHeight("max-height-form"),getForms()}function form2_save_dev(a){console.log("aici avem a treia chestia"),console.log(a),$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var b={client:User.client,token:User.lastToken,task_id:a.form_deviation.last_task_inserted};console.log("aici avem a doua chestie"),console.log(b),Page.apiCall("deviation",b,"get","form2_save_dev_start")}function form2_save_dev_start(a){console.log("aici avem a patra chestie"),console.log(a);var b='<div style="padding:10px;"><form id="form_deviation_save">';b+=HTML.formGenerate(a.form_deviation,$.t("general.save_button"),"+1 month"),b+='</form><div data-role="popup" id="signature_pop"   data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.save_button")+"</button></div></div>",sss_temp=a.form_deviation.task_id.value,mySwiper.appendSlide(b,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$("#signature-reset").on("click",function(a){return a.preventDefault(),$('input[name="signature"]').val("user name"),!1}),$("#signature-trigger").off("click").on("click",function(a){return a.preventDefault(),openSignaturePopup(),$(document).off("click","#deviation-signature-close").on("click","#deviation-signature-close",function(){$("#signature_pop").popup("close"),$("#sign_name").attr("disabled",!0),$("#signature-trigger").attr("disabled",!0),$("#signature-trigger").val("Signed").button("refresh")}),!1}),$("#form_deviation_save").on("submit",function(a){a.preventDefault(),console.log("da submit");var b=Form.validate($(this));if(b){$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),showCloseButton();var c=HTML.getFormValues($(this).parent()),d={client:User.client,token:User.lastToken,task_id:sss_temp,form:JSON.stringify(c)};console.log("dev save:"),console.log(d),Page.apiCall("deviation",d,"get","form2_save_dev_start_save")}return!1}),showCloseButton(),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),mySwiper.swipeTo(2,300,!0),mySwiper.swipeTo(3,300,!0)}function documentSignature(a){$.isNumeric(a)&&$('input[name="task_id"]').val(a),$("#sign_name").attr("disabled",!0),$("#signature-trigger").attr("disabled",!0),$("#signature-trigger").val(a.current_time.date).button("refresh")}function form2_save_dev_start_save(a){uploadHACCPPictureForms(),maintenanceSignDone(a),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),Page.redirect("tasks.html")}function takeHACCPPicture(a){navigator.camera.getPicture(function(b){$("#"+a).css({visibility:"visible",display:"block"}).attr("src",b)},function(a){console.log("Error getting picture: "+a)},{quality:50,destinationType:navigator.camera.DestinationType.FILE_URI})}function selectHACCPPicture(a){console.log("select picture"),Page.selectImage(a,function(b){console.log("select uri",b),$("#"+a).css({visibility:"visible",display:"block"}).attr("src",b)})}function uploadHACCPPictureForms(a,b){var c=$("#"+haccp_image_id),d=c.attr("src");console.log("upload image"),Page.uploadImage(d,function(b){c.css({visibility:"hidden",display:"none"}).attr("src",""),a&&a()},b)}function registerEmployee(a){if(a.success){var b="";b='<form id="registerEmployeeForm">',b+=HTML.formGenerate(a.form_register_employee,$.t("nav.employee")),b+='<input type="hidden" name="edit" value="false">',b+="</form>",mySwiper.appendSlide(b,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(mySwiper.activeIndex+1,300,!0),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#registerEmployeeForm").submit(function(a){a.preventDefault();var b=HTML.validate($(this));if(b){var c=HTML.getFormValues($(this).parent()),d={client:User.client,token:User.lastToken,data:JSON.stringify(c)};$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),$("#form_back_btn i").addClass("hided"),isOffline()?db.lazyQuery("sync_query",[{api:"registerEmployee",data:JSON.stringify(d),extra:0,q_type:"registerEmployeeSucess"}]):Page.apiCall("registerEmployee",d,"post","registerEmployeeSucess")}return!1})}}function registerEmployeeSucess(a){void 0!=a.registration_steps&&void 0!=a.registration_steps.error?($("#alertPopup .alert-text").html($.t("error.duplicate_employee")),$("#alertPopup").on("popupafterclose",function(){$("#alertPopup").unbind("popupafterclose"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}),$("#alertPopup").popup("open",{positionTo:"window"})):($(".overflow-wrapper").removeClass("overflow-wrapper-hide"),mySwiper.swipeTo(0,300,!1),mySwiper.removeSlide(1)),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}function registerSupplier(a){if(a.success){var b="";b='<form id="registerSupplierForm">',b+=HTML.formGenerate(a.form_register_supplier,$.t("nav.supplier")),b+='<input type="hidden" name="edit" value="false">',b+="</form",mySwiper.appendSlide(b,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(mySwiper.activeIndex+1,300,!0),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#registerSupplierForm").submit(function(a){a.preventDefault();var b=HTML.validate($(this));
if(b){var c=HTML.getFormValues($(this).parent()),d={client:User.client,token:User.lastToken,parameters:JSON.stringify(c)};$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),isOffline()?db.lazyQuery("sync_query",[{api:"registerSupplier",data:JSON.stringify(d),extra:0,q_type:"registerSupplierSuccess"}],function(a){if(a&&a.length>0){var b=a[0].id;registerSupplierSuccess(b)}}):Page.apiCall("registerSupplier",d,"post","registerSupplierSuccess")}return!1})}}function registerSupplierSuccess(a){void 0!=a.registration_steps&&void 0!=a.registration_steps.error?console.log($.t("error.duplicate_employee")):(console.log($.t("success.added_supplier")),$(".overflow-wrapper").removeClass("overflow-wrapper-hide")),mySwiper.swipeTo(0,300,!1),mySwiper.removeSlide(1),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}var mySwiper,_h_content=0,_t,last_data_received,offline_signature,lazydatasend=[],canRedirectAfterPoisonParam=!1,mapForm={cooling_food:9,food_warm:10,received_stock:11,food_being_prepared:12,fridge:13,vegetable_fridge:14,sushi_fridge:15,cooler:16,sushi_cooler:17,dishwasher:18},formcache=new FormCache;$(window).on("orientationchange",function(a){$sigdiv.jSignature("reset"),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),setTimeout(function(){$("#signature_pop-popup").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px"}),console.log("asd")},500)});