function getFormsCall(a,b){if(0==b.rows.length&&isOffline())$("#no_results_forms").text($.t("forms.no_forms_connection"));else if(b.rows.length>0&&isOffline()){$(".overflow-wrapper").addClass("overflow-wrapper-hide");for(var c,d,e,f,g=[],h=0;h<b.rows.length;h++){f=999==b.rows.item(h).type?"add_employee":1e3==b.rows.item(h).type?"add_supplier":b.rows.item(h).type;try{c=JSON.parse(b.rows.item(h).label),e=c.alias,d='<a href="#" data-type="'+f+'" class="form_generator_link">'+c.alias+"</a>"}catch(i){d='<a href="#" data-type="'+f+'" class="form_generator_link">'+b.rows.item(h).label+"</a>",e=b.rows.item(h).label}g.push({alias:e,id:h,data:d})}$("#forms_list").html(""),_appendAndSortByAlias("#forms_list",g),bind_form_click_handler(),bind_form2_click_handler(),$("#no_results_forms").hide()}else{console.log("if connection is live");var g={client:User.client,token:User.lastToken};Page.apiCall("formDeviationStart",g,"get","formDeviationStart")}mySwiper.reInit(),mySwiper.resizeFix()}function getForms(a){a.executeSql('SELECT * FROM "forms" WHERE alias<>""',[],getFormsCall)}function formsInit(){if(User.isLogged()){executeSyncQuery();var a=db.getDbInstance();a.transaction(getForms,db.dbErrorHandle),console.log("forms.js 73 swiper init"),mySwiper=new Swiper(".swiper-container-form",{calculateHeight:!0,releaseFormElements:!0,preventLinks:!1,simulateTouch:!1,noSwiping:!0,noSwipingClass:"ui-slider",onInit:function(){1==mySwiper.slides.length&&($("#footer").remove(),$("#form_back_btn i").addClass("hided")),setSwiperMinHeight()},onSlideNext:function(a){_t="next"},onSlidePrev:function(a){_t="prev"},onSlideChangeStart:function(a){},onSlideChangeEnd:function(a){var b=$(document).find(".form2_save");if(HTML.validate($("body"),"ex"),b.length>0){if("next"==_t){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c=Form.validate(a.getSlide(a.previousIndex));if(c){var d=Form.getValues(a.getSlide(a.previousIndex)),e={client:User.client,token:User.lastToken,results:JSON.stringify(d)};canRedirectAfterPoisonParam=!0,isOffline()?(lazydatasend.push(d),$(".overflow-wrapper").addClass("overflow-wrapper-hide")):Page.apiCall("foodPoison",e,"get","foodPoisonDone")}else canRedirectAfterPoisonParam=!1,a.swipePrev(),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}else if("prev"==_t&&0==a.activeIndex)for(var f=a.slides.length,g=f;g>0;g--)a.removeSlide(parseInt(g)),$("div[data-role='navbar']").remove()}else"prev"==_t&&a.removeSlide(parseInt(a.activeIndex)+1);console.log("mySwiper.slides",mySwiper.slides),1==mySwiper.slides.length&&($("#footer").remove(),$("#form_back_btn i").addClass("hided")),$("html, body").animate({scrollTop:0},500),mySwiper.resizeFix(),parseInt(a.activeIndex)==parseInt(a.previousIndex)&&a.previousIndex--;var h=$(".swiper-slide-active").find(".no_results");if(h.length>0&&canRedirectAfterPoisonParam){if(canRedirectAfterPoisonParam=!1,console.log("Is this real life?"),lazydatasend!=[]&&isOffline()){var i=Form.getValues(a.getSlide(a.previousIndex));lazydatasend.push(i);var j={};for(j.results={},g=0;g<lazydatasend.length;g++)for(var k in lazydatasend[g])lazydatasend[g].hasOwnProperty(k)&&("task_id"==k?(j[k]=lazydatasend[g][k],j.results[k]=lazydatasend[g][k]):j.results[k]=lazydatasend[g][k]);j.results=JSON.stringify(j.results),db.lazyQuery({sql:'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',data:[["foodPoison",JSON.stringify(j),0,"foodPoison"]]},0)}setTimeout(function(){window.location.href="index.html"},3500)}}})}else Page.redirect("login.html")}function toObject(a){for(var b={},c=0;c<a.length;++c)b[a[c][0]]=a[c][1];return b}function sortObject(a){var b,c={},d=[];for(b in a)a.hasOwnProperty(b)&&d.push(a[b]);for(d.sort(),b=0;b<d.length;b++){var e=getKeyByValue(a,d[b]);console.log(e),console.log(d[b]),c[e]=d[b]}return c}function getKeyByValue(a,b){for(var c in a)if(a.hasOwnProperty(c)&&a[c]==b)return c}function formDeviationStart(a){if(a.success){var b=a.form_list,c=[];"ROLE_EMPLOYEE"!=localStorage.getItem("role")&&(c=[[999,$.t("nav.add_employee")],[1e3,$.t("nav.add_supplier")]]);for(var d in b)"object"==typeof b[d]?c.push([d,b[d].alias]):c.push([d,b[d]]);c.sort(function(a,b){return a=a[1],b=b[1],b>a?-1:a>b?1:0});for(var a=[],e=[],f=0;f<c.length;f++){var d=c[f][0],g=c[f][1];999!=d&&1e3!=d&&a.push({alias:g,id:100-f,data:'<a href="#" data-type="'+d+'" class="form_generator_link"> '+g+"</a>"}),999==d&&a.push({alias:$.t("nav.add_employee"),id:999,data:'<a href="#" data-type="add_employee" class="form_generator_link"><i ></i> '+$.t("nav.add_employee")+"</a>"}),1e3==d&&a.push({alias:$.t("nav.add_supplier"),id:1e3,data:'<a href="#" data-type="add_supplier" class="form_generator_link"><i ></i> '+$.t("nav.add_supplier")+"</a>"}),("maintenance"!=d||"food_poision"!=d||999!=d&&1e3!=d)&&e.push([d,g,g])}db.lazyQuery({sql:'INSERT OR REPLACE INTO "forms" ("type","label","alias") VALUES(?,?,?)',data:e},0),$("#forms_list").html(""),_appendAndSortByAlias("#forms_list",a),bind_form_click_handler(),$("#no_results_forms").hide(),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}realignSlideHeight("max-height-form")}function formItemData(a){if(console.log("forms.js  formItemData 200"),a.success){var b=a.form_list_question;if(void 0!=b.info){var c=b;last_data_received=c.form;var d='<div style="padding:10px;"><form id="form2_save">';switch(void 0!=b.info.label&&(d+='<legend class="legend_task">'+b.info.label+"</legend>"),console.log("216 forms.js"),b.info.type){case"maintenance":case"deviation":d+=HTML.formGenerate(last_data_received.form_deviation,$.t("general.save_button")),d+='</form><div data-role="popup" id="signature_pop"  data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.sign_button")+"</button></div></div>",$(document).on("click","#signature-reset",function(a){return a.preventDefault(),$('input[name="signature"]').val("user name"),!1}),$(document).off("click","#signature-trigger").on("click","#signature-trigger",function(a){return a.preventDefault(),openSignaturePopup(),$(document).off("click","#deviation-signature-close").on("click","#deviation-signature-close",function(){$("#signature_pop").popup("close");var a=HTML.getFormValues($(document).find("#form2_save").parent());console.log(a);var c={client:User.client,token:User.lastToken,results:JSON.stringify(a)};"maintenance"==b.info.type?Page.apiCall("maintenance",c,"get","maintenanceSignDone"):Page.apiCall("deviationForm",c,"get","maintenanceSignDone")}),!1});break;case"food_poision":d='<div style="padding:10px;"><form class="form2_save">',d+='<legend class="legend_task">'+b.info.label+"</legend>";var e={task_id:last_data_received.task_id,guestName:last_data_received.guestName,guestAddress:last_data_received.guestAddress,guestPhone:last_data_received.guestPhone},f=HTML.formGenerate(e,"");d+=f,d+="</form></div>",mySwiper.appendSlide(d,"swiper-slide"),d='<div style="padding:10px;"><form class="form2_save">',d+='<legend class="legend_task">'+b.info.label+"</legend>",e={task_id:last_data_received.task_id,symptoms:last_data_received.symptoms,symptomsDateTime:last_data_received.symptomsDateTime,symptom_days:last_data_received.symptom_days,symptom_hours:last_data_received.symptom_hours},f=HTML.formGenerate(e,""),d+=f,d+="</form></div>",mySwiper.appendSlide(d,"swiper-slide"),d='<div style="padding:10px;"><form class="form2_save">',d+='<legend class="legend_task">'+b.info.label+"</legend>",e={task_id:last_data_received.task_id,makingFoodDateTime:last_data_received.makingFoodDateTime,makingFoodTotalGuests:last_data_received.makingFoodTotalGuests,makingFoodSickGuests:last_data_received.makingFoodSickGuests,makingFoodWhatFood:last_data_received.makingFoodWhatFood,makingFoodEarlierEaten:last_data_received.makingFoodEarlierEaten,guestTalkedDoctor:last_data_received.guestTalkedDoctor},f=HTML.formGenerate(e,""),d+=f,d+="</form></div>",mySwiper.appendSlide(d,"swiper-slide"),d='<div style="padding:10px;"><form class="form2_save">',d+='<legend class="legend_task">'+b.info.label+"</legend>",e={task_id:last_data_received.task_id,ingredients:last_data_received.ingredients,cooledDown:last_data_received.cooledDown,reheated:last_data_received.reheated,keptWarm:last_data_received.keptWarm,restLeftAnalysis:last_data_received.restLeftAnalysis},f=HTML.formGenerate(e,""),d+=f,d+="</form></div>",mySwiper.appendSlide(d,"swiper-slide"),d='<div style="padding:10px;"><form class="form2_save">',d+='<legend class="legend_task">'+b.info.label+"</legend>",e={task_id:last_data_received.task_id,immediateMeasures:last_data_received.immediateMeasures,otherComplaints:last_data_received.otherComplaints,guestCompensation:last_data_received.guestCompensation,employee_id:last_data_received.employee_id,deviation_deadline:last_data_received.deviation_deadline},f=HTML.formGenerate(e,""),d+=f,d+='</form></div><div data-role="popup" id="signature_pop"  data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.sign_button")+"</button></div></div>";var g='<div id="footer" data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="none" style="border:0 !important;"><div data-role="navbar"><ul><li><a href="#" onclick="mySwiper.swipePrev();" data-theme="e" class="must-be-big"><i class="fa fa-angle-left fa-2x pull-left" style="color: #4c7600;"></i> Forrige</a></li><li><a href="#" onclick="mySwiper.swipeNext();" data-theme="e" class="must-be-big">Neste <i class="fa fa-angle-right fa-2x pull-right" style="color: #4c7600;"></i></a></li></ul></div></div>';$(g).insertBefore("#forms #menu_panel"),mySwiper.appendSlide(d,"swiper-slide"),d='<div class="no_results" style="color:#00cde7;font-size:34px;">'+$.t("register.food_poison_success")+"</div>",mySwiper.appendSlide(d,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create");break;default:d+=HTML.formGenerate(last_data_received,$.t("general.save_button")),d+="</form></div>"}"food_poison"!=c.type&&(mySwiper.appendSlide(d,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create")),mySwiper.swipeTo(2,300,!0),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#form2_save").on("submit",function(a){console.log("hei macarena"),a.preventDefault();var c=HTML.getFormValues($(this).parent()),d=HTML.validate($(this));if(d){var e=!1,f={client:User.client,token:User.lastToken,results:JSON.stringify(c)};if("maintenance"==b.info.type)console.log("Form saved successfully. 503"),Page.apiCall("maintenance",f,"get","maintenanceDoneForm");else if("deviation"==b.info.type)console.log("Form saved successfully2. 506"),Page.apiCall("deviationForm",f,"get","maintenanceDoneForm");else{for(var g in c)if(c.hasOwnProperty(g)&&void 0!=last_data_received[g].deviation)switch(last_data_received[g].type){case"slider":(c[g]<last_data_received[g].deviation.min||c[g]>last_data_received[g].deviation.max)&&(e=!0);break;case"default":}e?($("#confirmPopup .alert-text").html($.t("general.deviation_accept_message")),$("#confirmPopup").on("popupafteropen",function(a,b){$("#confirmButton").off("click").on("click",function(){console.log("aici avem prima chestie"),Page.apiCall("formDeviationStart",f,"get","form2_save_dev")})}),$("#confirmPopup").on("popupafterclose",function(a,b){$("#confirmButton").unbind("click")}),$("#confirmPopup").popup("open",{positionTo:"window"})):(console.log("Form saved successfully. 536"),Page.apiCall("formDeviationStart",f,"get","redirect_to_forms"))}}return!1}),mySwiper.swipeTo(1,300,!0)}else{console.log("forms.js 482");var a=[],h=[],d='<div style="padding:10px;"><ul data-role="listview" data-inset="true" data-divider-theme="b">';for(var i in b)b.hasOwnProperty(i)&&(d+='<li><a href="#" data-id="'+b[i].info.id+'" data-type="'+b[i].form.type.value+'" class="form_generator_link2"><i class="fa fa-edit"></i> '+b[i].info.label+"</a></li>",h.push([b[i].info.id,b[i].info.label,JSON.stringify(b[i].form),document.form_cat]));d+="</ul></div>",console.log("forms.js 505",h);db.lazyQuery({sql:'INSERT OR REPLACE INTO "form_item"("id", "label", "form", "type") VALUES(?,?,?,?)',data:h},0),mySwiper.appendSlide(d,"swiper-slide"),bind_form2_click_handler(),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(1,300,!0)}}else console.log("wrooong")}function maintenance(a){if(console.log("maintenance"),console.log("data"),console.log(a),a.form_deviation){var b='<form id="form_maintenance">';b+=HTML.formGenerate(a.form_deviation,$.t("general.save_button")),b+='</form><div data-role="popup" id="signature_pop"  data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.sign_button")+"</button></div></div>",mySwiper.appendSlide(b,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(2,300,!0),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#signature-trigger").off("click").on("click",function(a){return a.preventDefault(),openSignaturePopup(),$(document).off("click","#deviation-signature-close").on("click","#deviation-signature-close",function(){$("#signature_pop").popup("close");var a={client:User.client,token:User.lastToken,signature:JSON.stringify({name:$("#sign_name").val(),svg:$sigdiv.jSignature("getData","svgbase64")[1],parameter:"task",task_id:sss_temp})};console.log("documentSignature forms.js 592"),Page.apiCall("documentSignature",a,"post","documentSignature")}),!1}),$("#form_maintenance").on("submit",function(a){a.preventDefault();var b=HTML.validate($(this));if(b){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c=HTML.getFormValues($(this).parent()),d={client:User.client,token:User.lastToken,results:JSON.stringify(c)};Page.apiCall("maintenance",d,"get","maintenanceDoneForm")}return!1}),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}if(a.form_fix_deviation){var c=new Date(a.form_fix_deviation.deviation_date.date),b="<h3>Deviation form fix</h3>";if(void 0!=a.form_fix_deviation.deviation_photos&&a.form_fix_deviation.deviation_photos.length>0){var d=$.parseJSON(a.form_fix_deviation.deviation_photos);console.log(d);for(var e in d)d.hasOwnProperty(e)&&(b+='<img width="100%" height="auto" style="margin:0 auto;" src="'+d[e]+'" />')}b+='<fieldset data-role="controlgroup">Deviation. '+a.form_fix_deviation.deviation.replace(/\+/g," ")+"</div>",b+='<fieldset data-role="controlgroup">Initial action. '+a.form_fix_deviation.initial_action.replace(/\+/g," ")+"</div>",b+='<fieldset data-role="controlgroup">Deviation date (from system): '+c.getDate()+"."+(parseInt(c.getMonth())+1)+"."+c.getFullYear()+"</div>",b+='<fieldset data-role="controlgroup">Responsible for fixing deviation: '+a.form_fix_deviation.form.responsible_fix_deviation.value+"</div>",b+="<hr />",b+=HTML.formGenerate(a.form_fix_deviation.form,$.t("general.save_button")),$("#form_maintenance").html(b).off("submit").on("submit",function(a){a.preventDefault();var b=Form.validate($(this));if(b){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c=Form.getValues($(this)),d={client:User.client,token:User.lastToken,task_id:get.id,results:JSON.stringify(c)};Page.apiCall("maintenance",d,"get","maintenanceDoneForm")}return!1}),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}}function maintenanceDoneForm(a){$.isNumeric(a)&&$('input[name="task_id"]').val(a),uploadHACCPPictureForms(),Page.redirect("tasks.html")}function foodPoisonDone(a){console.log("foodPoisonDone"),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$.isNumeric(a)&&$('input[name="task_id"]').val(a)}function maintenanceSignDone(a){$.isNumeric(a)&&$('input[name="task_id"]').val(a);var b={client:User.client,token:User.lastToken,signature:JSON.stringify({name:$("#sign_name").val(),svg:$sigdiv.jSignature("getData","svgbase64")[1],parameter:"task",task_id:a})};Page.apiCall("documentSignature",b,"get","documentSignature")}function showCloseButton(){$("#form_back_btn i").removeClass("hided"),$("#form_back_btn").on("click",function(a){$("[href='forms.html']").click()})}function bind_form_click_handler(){$(".form_generator_link").off("click").on("click",function(a){showCloseButton(),$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),document.form_cat=$(this).data("type"),console.log("686 "+document.form_cat);var b=db.getDbInstance();b.transaction(function(a){a.executeSql('SELECT * FROM "form_item" WHERE "type"=?',[document.form_cat],function(a,b){if(console.log("results",b),isOffline())if(isOffline()&&b.rows.length>0)if(console.log("756 connection whatever and rows > 0"),1==b.rows.length){var c=$.extend({},b.rows.item(0));console.log("aici e form-ul de maintenance"),last_data_received=JSON.parse(c.form);var d='<div style="padding:10px;"><form id="form2_save">';switch(console.log(c.type),c.type){case"maintenance":case"deviation":d+='<legend class="legend_task">'+b.rows.item(0).label+"</legend>",d+=HTML.formGenerate(last_data_received,$.t("general.save_button")),d+='</form><div data-role="popup" id="signature_pop"  data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.sign_button")+"</button></div></div>",$(document).on("click","#signature-reset",function(a){return a.preventDefault(),$('input[name="signature"]').val("user name"),!1}),$(document).off("click","#signature-trigger").on("click","#signature-trigger",function(a){return a.preventDefault(),openSignaturePopup(),$(document).off("click","#deviation-signature-close").on("click","#deviation-signature-close",function(){$("#signature_pop").popup("close");var a=HTML.getFormValues($(document).find("#form2_save").parent()),b={client:User.client,token:User.lastToken,results:JSON.stringify(a)};console.log("api call signature"),isOffline()?(offline_signature={signature:JSON.stringify({name:$("#sign_name").val(),svg:$sigdiv.jSignature("getData","svgbase64")[1],parameter:"task",task_id:$(document).find('input[name="task_id"]').val()})},console.log("offline_signature = "),console.log(offline_signature),$("#sign_name").attr("disabled",!0),$("#signature-trigger").attr("disabled",!0),$("#signature-trigger").val("Signed").button("refresh")):"maintenance"==c.type?Page.apiCall("maintenance",b,"get","maintenanceSignDone"):Page.apiCall("deviationForm",b,"get","maintenanceSignDone")}),!1});break;case"food_poision":d='<div style="padding:10px;"><form class="form2_save">',d+='<legend class="legend_task">'+b.rows.item(0).label+"</legend>";var e={task_id:last_data_received.task_id,guestName:last_data_received.guestName,guestAddress:last_data_received.guestAddress,guestPhone:last_data_received.guestPhone},f=HTML.formGenerate(e,"");d+=f,d+="</form></div>",mySwiper.appendSlide(d,"swiper-slide"),d='<div style="padding:10px;"><form class="form2_save">',d+='<legend class="legend_task">'+b.rows.item(0).label+"</legend>",e={task_id:last_data_received.task_id,symptoms:last_data_received.symptoms,symptomsDateTime:last_data_received.symptomsDateTime,symptom_days:last_data_received.symptom_days,symptom_hours:last_data_received.symptom_hours},f=HTML.formGenerate(e,""),d+=f,d+="</form></div>",mySwiper.appendSlide(d,"swiper-slide"),d='<div style="padding:10px;"><form class="form2_save">',d+='<legend class="legend_task">'+b.rows.item(0).label+"</legend>",e={task_id:last_data_received.task_id,makingFoodDateTime:last_data_received.makingFoodDateTime,makingFoodTotalGuests:last_data_received.makingFoodTotalGuests,makingFoodSickGuests:last_data_received.makingFoodSickGuests,makingFoodWhatFood:last_data_received.makingFoodWhatFood,makingFoodEarlierEaten:last_data_received.makingFoodEarlierEaten,guestTalkedDoctor:last_data_received.guestTalkedDoctor},f=HTML.formGenerate(e,""),d+=f,d+="</form></div>",mySwiper.appendSlide(d,"swiper-slide"),d='<div style="padding:10px;"><form class="form2_save">',d+='<legend class="legend_task">'+b.rows.item(0).label+"</legend>",e={task_id:last_data_received.task_id,ingredients:last_data_received.ingredients,cooledDown:last_data_received.cooledDown,reheated:last_data_received.reheated,keptWarm:last_data_received.keptWarm,restLeftAnalysis:last_data_received.restLeftAnalysis},f=HTML.formGenerate(e,""),d+=f,d+="</form></div>",mySwiper.appendSlide(d,"swiper-slide"),d='<div style="padding:10px;"><form class="form2_save">',d+='<legend class="legend_task">'+b.rows.item(0).label+"</legend>",e={task_id:last_data_received.task_id,immediateMeasures:last_data_received.immediateMeasures,otherComplaints:last_data_received.otherComplaints,guestCompensation:last_data_received.guestCompensation,employee_id:last_data_received.employee_id,deviation_deadline:last_data_received.deviation_deadline},f=HTML.formGenerate(e,""),d+=f,d+='</form></div><div data-role="popup" id="signature_pop"  data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.sign_button")+"</button></div></div>";var g='<div data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="none" style="border:0 !important;"><div data-role="navbar"><ul><li><a href="#" onclick="mySwiper.swipePrev();" data-theme="e" class="must-be-big"><i class="fa fa-angle-left fa-2x pull-left" style="color: #4c7600;"></i> Forrige</a></li><li><a href="#" onclick="mySwiper.swipeNext();" data-theme="e" class="must-be-big">Neste <i class="fa fa-angle-right fa-2x pull-right" style="color: #4c7600;"></i></a></li></ul></div></div>';$(g).insertBefore("#forms #menu_panel"),mySwiper.appendSlide(d,"swiper-slide"),d='<div class="no_results" style="color:#00cde7;font-size:34px;">'+$.t("register.food_poison_success")+"</div>",mySwiper.appendSlide(d,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create");break;default:console.log("930"),d+='<legend class="legend_task">'+b.rows.item(0).label+"</legend>",d+=HTML.formGenerate(last_data_received,$.t("general.save_button")),d+="</form></div>"}"food_poison"!=c.type&&(mySwiper.appendSlide(d,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create")),mySwiper.swipeTo(2,300,!0),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#form2_save").on("submit",function(a){a.preventDefault();var b=HTML.getFormValues($(this).parent()),d=HTML.validate($(this));if(d){var e=!1,f={client:User.client,token:User.lastToken,results:JSON.stringify(b)};if(console.log(c.type),console.log(b.task_id),"maintenance"==c.type)if(console.log("Form saved successfully. 1155"),isOffline()){console.log("offline form save");var g={client:User.client,token:User.lastToken,results:JSON.stringify(b),signature:offline_signature.signature};db.lazyQuery({sql:'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',data:[["maintenance",JSON.stringify(g),document.task_id,"maintenanceDoneForm"]]},0,function(a){g.id=a,formcache.saveToTaskList(g)}),console.log(" Page.redirect"),Page.redirect("tasks.html")}else console.log("online form save"),Page.apiCall("maintenance",f,"get","maintenanceDoneForm");else if("deviation"==c.type){var g={client:User.client,token:User.lastToken,results:JSON.stringify(b),signature:offline_signature.signature},h=$("#"+haccp_image_id),i=h.attr("src");i&&(g.imageURI=i),console.log(g),console.log(offline_signature),db.lazyQuery({sql:'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',data:[["deviationForm",JSON.stringify(g),document.task_id,"maintenanceSignDone"]]},0,function(a){g.id=a,formcache.saveToTaskList("deviation",g,function(){maintenanceDoneForm(a)})}),console.log(" Page.redirect")}else{console.log(c);for(var j in b)if(b.hasOwnProperty(j)&&void 0!=last_data_received[j].deviation)switch(last_data_received[j].type){case"slider":(b[j]<last_data_received[j].deviation.min||b[j]>last_data_received[j].deviation.max)&&(e=!0);break;case"default":}if(e)console.log("if deviation"),$("#confirmPopup .alert-text").html($.t("general.deviation_accept_message")),$("#confirmPopup").on("popupafteropen",function(a,d){$("#confirmButton").off("click").on("click",function(){if(isOffline()){console.log("else if offline");var a={client:User.client,token:User.lastToken,results:JSON.stringify(b),category:c.type};db.lazyQuery({sql:'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',data:[["formDeviationStart",JSON.stringify(a),0,"formDeviationStart"]]},0),redirect_to_forms()}else console.log("aici avem prima chestie"),console.log(f),Page.apiCall("formDeviationStart",f,"get","form2_save_dev")})}),$("#confirmPopup").on("popupafterclose",function(a,b){$("#confirmButton").unbind("click")}),$("#confirmPopup").popup("open",{positionTo:"window"});else if(console.log("Form saved successfully. 1199"),isOffline()){var g={client:User.client,token:User.lastToken,results:JSON.stringify(b),category:c.type};db.lazyQuery({sql:'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',data:[["formDeviationStart",JSON.stringify(g),0,"formDeviationStart"]]},0),redirect_to_forms()}else Page.apiCall("formDeviationStart",f,"get","redirect_to_forms")}}return!1}),mySwiper.swipeTo(1,300,!0),mySwiper.resizeFix()}else{console.log("1001 + results : ");for(var d='<div style="padding:10px;"><ul data-role="listview" data-inset="true" data-divider-theme="b">',h=0;h<b.rows.length;h++)console.log(b.rows.item(h)),d+='<li><a href="#" data-id="'+b.rows.item(h).id+'" data-type="'+b.rows.item(h).type+'" class="form_generator_link2"><i class="fa fa-edit"></i> '+b.rows.item(h).label+"</a></li>";d+="</ul></div>",mySwiper.appendSlide(d,"swiper-slide"),bind_form2_click_handler(),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(1,300,!0),mySwiper.resizeFix()}else noInternetError($.t("error.no_internet_for_sync"));else switch(console.log("885 connection live"),document.form_cat){case"maintenance":var i={client:User.client,token:User.lastToken,results:""};console.log("730"),Page.apiCall("maintenance",i,"get","formItemData");break;case"food_poision":var i={client:User.client,token:User.lastToken,results:""};console.log(i),console.log("am trimis call aici"),Page.apiCall("foodPoison",i,"get","formItemData");break;case"add_employee":var i={client:User.client,token:User.lastToken};console.log("am trimis call employee aici"),Page.apiCall("registerEmployee",i,"get","registerEmployee");break;case"add_supplier":var i={client:User.client,token:User.lastToken};Page.apiCall("registerSupplier",i,"get","registerSupplier"),console.log("add supplier");break;case"deviation":console.log("deviation 851");var i={client:User.client,token:User.lastToken,results:""};console.log("857"),console.log(i),Page.apiCall("deviationForm",i,"get","formItemData");break;default:console.log("744");var i={client:User.client,token:User.lastToken,category:document.form_cat};Page.apiCall("formDeviationStart",i,"get","formItemData")}})})})}function bind_form2_click_handler(){$(".form_generator_link2").off("click").on("click",function(a){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var b=$(this).data("id"),c=$(this).data("type"),d=db.getDbInstance();console.log(b),d.transaction(function(a){a.executeSql('SELECT * FROM "form_item" WHERE "id"=?',[b],function(a,d){if(d.rows.length>0){console.log("forms.js form_item rows > 0");var e=$.extend({},d.rows.item(0));last_data_received=JSON.parse(e.form);var f='<div style="padding:10px;"><form id="form2_save">';f+='<legend style="font-weight: bold;margin-bottom:20px;">'+d.rows.item(0).label+"</legend>",f+=HTML.formGenerate(last_data_received,$.t("general.save_button")),f+="</form></div>",mySwiper.appendSlide(f,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(2,300,!0),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#form2_save").on("submit",function(a){a.preventDefault();var b=HTML.getFormValues($(this).parent()),c=HTML.validate($(this));if(c){var d=!1,f={client:User.client,token:User.lastToken,results:JSON.stringify(b)};for(var g in b)if(b.hasOwnProperty(g)&&void 0!=last_data_received[g].deviation)switch(last_data_received[g].type){case"slider":(b[g]<last_data_received[g].deviation.min||b[g]>last_data_received[g].deviation.max)&&(d=!0);break;case"default":}if(d)console.log("deviation"),$("#confirmPopup .alert-text").html($.t("general.deviation_accept_message")),$("#confirmPopup").on("popupafteropen",function(a,c){$("#confirmButton").off("click").on("click",function(){if(console.log("aici avem prima chestie"),console.log(f),isOffline()){console.log("else if offline");var a={client:User.client,token:User.lastToken,results:JSON.stringify(b),category:e.type};db.lazyQuery({sql:'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',data:[["formDeviationStart",JSON.stringify(a),0,"formDeviationStart"]]},0),redirect_to_forms()}else Page.apiCall("formDeviationStart",f,"get","form2_save_dev")})}),$("#confirmPopup").on("popupafterclose",function(a,b){$("#confirmButton").unbind("click")}),$("#confirmPopup").popup("open",{positionTo:"window"});else if(console.log("Form saved successfully. 1302"),isOffline()){var h={client:User.client,token:User.lastToken,results:JSON.stringify(b),category:e.type};db.lazyQuery({sql:'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',data:[["formDeviationStart",JSON.stringify(h),0,"formDeviationStart"]]},0),redirect_to_forms()}else Page.apiCall("formDeviationStart",f,"get","redirect_to_forms")}return console.log("forms.js 1101"),!1})}else console.log("forms.js form_item rows == 0"),console.log("forms.js 1105"),console.log("heeeeey id = ",b),a.executeSql('SELECT * FROM "forms" WHERE "type"=?',[c],function(a,b){if(b.rows.length>0){var c={client:User.client,token:User.lastToken,category:b.rows.item(0).type};document.form_cat=b.rows.item(0).type,console.log("data:",c),console.log(b.rows.item(0)),Page.apiCall("formDeviationStart",c,"get","formCond3")}else $("#alertPopup .alert-text").html("Operation unavailable"),$("#alertPopup").on("popupafterclose",function(){$("#alertPopup").unbind("popupafterclose"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}),$("#alertPopup").popup("open",{positionTo:"window"})})})}),realignSlideHeight("max-height-form")})}function formCond3(a){if(console.log(a),console.log("forms.js 1128"),a.form_list_question instanceof Array)for(var b in a.form_list_question)a.form_list_question.hasOwnProperty(b)&&(console.log("d itera = ",b),console.log(a.form_list_question[b]),db.lazyQuery({sql:'INSERT OR REPLACE INTO "form_item"("id", "label", "form", "type") VALUES(?,?,?,?)',data:[[a.form_list_question[b].info.id,a.form_list_question[b].info.label,JSON.stringify(a.form_list_question[b].form),document.form_cat]]},0));else db.lazyQuery({sql:'INSERT OR REPLACE INTO "form_item"("id", "label", "form", "type") VALUES(?,?,?,?)',data:[[a.form_list_question.info.id,a.form_list_question.info.label,JSON.stringify(a.form_list_question.form),document.form_cat]]},0)}function redirect_to_forms(){mySwiper.swipeTo(0,300,!0),mySwiper.removeSlide(1),mySwiper.removeSlide(1),mySwiper.reInit(),mySwiper.resizeFix(),realignSlideHeight("max-height-form");var a=db.getDbInstance();a.transaction(getForms,db.dbErrorHandle);
}function form2_save_dev(a){console.log("aici avem a treia chestia"),console.log(a),$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var b={client:User.client,token:User.lastToken,task_id:a.form_deviation.last_task_inserted};console.log("aici avem a doua chestie"),console.log(b),Page.apiCall("deviation",b,"get","form2_save_dev_start")}function form2_save_dev_start(a){console.log("aici avem a patra chestie"),console.log(a);var b='<div style="padding:10px;"><form id="form_deviation_save">';b+=HTML.formGenerate(a.form_deviation,$.t("general.save_button")),b+='</form><div data-role="popup" id="signature_pop"   data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.save_button")+"</button></div></div>",sss_temp=a.form_deviation.task_id.value,mySwiper.appendSlide(b,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$("#signature-reset").on("click",function(a){return a.preventDefault(),$('input[name="signature"]').val("user name"),!1}),$("#signature-trigger").off("click").on("click",function(a){return a.preventDefault(),openSignaturePopup(),$(document).off("click","#deviation-signature-close").on("click","#deviation-signature-close",function(){$("#signature_pop").popup("close"),console.log("deviation-signature-close8");var a={client:User.client,token:User.lastToken,signature:JSON.stringify({name:$("#sign_name").val(),svg:$sigdiv.jSignature("getData","svgbase64")[1],parameter:"task",task_id:sss_temp})};console.log("forms.js 1256 document sign"),Page.apiCall("documentSignature",a,"get","documentSignature")}),!1}),$("#form_deviation_save").on("submit",function(a){a.preventDefault(),console.log("da submit");var b=Form.validate($(this));if(b){$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),showCloseButton();var c=HTML.getFormValues($(this).parent()),d={client:User.client,token:User.lastToken,task_id:sss_temp,form:JSON.stringify(c)};console.log("dev save:"),console.log(d),Page.apiCall("deviation",d,"get","form2_save_dev_start_save"),uploadHACCPPictureForms()}return!1}),showCloseButton(),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),mySwiper.swipeTo(2,300,!0),mySwiper.swipeTo(3,300,!0)}function documentSignature(a){$.isNumeric(a)&&$('input[name="task_id"]').val(a),$("#sign_name").attr("disabled",!0),$("#signature-trigger").attr("disabled",!0),$("#signature-trigger").val(a.current_time.date).button("refresh")}function form2_save_dev_start_save(){console.log("am ajuns pe save");var a=db.getDbInstance();a.transaction(getForms,db.dbErrorHandle),mySwiper.swipeTo(0,300,!1),mySwiper.removeSlide(1),mySwiper.removeSlide(1),mySwiper.removeSlide(1),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}function takeHACCPPicture(a){navigator.camera.getPicture(function(b){$("#"+a).css({visibility:"visible",display:"block"}).attr("src",b)},function(a){console.log("Error getting picture: "+a)},{quality:50,destinationType:navigator.camera.DestinationType.FILE_URI})}function selectHACCPPicture(a){console.log("select picture"),Page.selectImage(a,function(b){console.log("select uri",b),$("#"+a).css({visibility:"visible",display:"block"}).attr("src",b)})}function uploadHACCPPictureForms(){var a=$("#"+haccp_image_id),b=a.attr("src");Page.uploadImage(b,function(b){a.css({visibility:"hidden",display:"none"}).attr("src","")})}function registerEmployee(a){if(a.success){var b="";b='<form id="registerEmployeeForm">',b+=HTML.formGenerate(a.form_register_employee,$.t("nav.add_employee")),b+='<input type="hidden" name="edit" value="false">',b+="</form>",mySwiper.appendSlide(b,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(1,300,!0),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#registerEmployeeForm").submit(function(a){a.preventDefault();var b=HTML.validate($(this));if(b){var c=HTML.getFormValues($(this).parent()),d={client:User.client,token:User.lastToken,data:JSON.stringify(c)};$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),$("#form_back_btn i").addClass("hided"),Page.apiCall("registerEmployee",d,"get","registerEmployeeSucess")}return!1})}}function registerEmployeeSucess(a){void 0!=a.registration_steps&&void 0!=a.registration_steps.error?($("#alertPopup .alert-text").html($.t("error.duplicate_employee")),$("#alertPopup").on("popupafterclose",function(){$("#alertPopup").unbind("popupafterclose"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}),$("#alertPopup").popup("open",{positionTo:"window"})):($(".overflow-wrapper").removeClass("overflow-wrapper-hide"),mySwiper.swipeTo(0,300,!1),mySwiper.removeSlide(1)),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}function registerSupplier(a){if(a.success){var b="";b='<form id="registerSupplierForm">',b+=HTML.formGenerate(a.form_register_supplier,$.t("nav.add_supplier")),b+='<input type="hidden" name="edit" value="false">',b+="</form",mySwiper.appendSlide(b,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(1,300,!0),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#registerSupplierForm").submit(function(a){a.preventDefault();var b=HTML.validate($(this));if(b){var c=HTML.getFormValues($(this).parent()),d={client:User.client,token:User.lastToken,parameters:JSON.stringify(c)};$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),Page.apiCall("registerSupplier",d,"get","registerSupplierSuccess")}return!1})}}function registerSupplierSuccess(a){void 0!=a.registration_steps&&void 0!=a.registration_steps.error?console.log($.t("error.duplicate_employee")):(console.log($.t("success.added_supplier")),$(".overflow-wrapper").removeClass("overflow-wrapper-hide")),mySwiper.swipeTo(0,300,!1),mySwiper.removeSlide(1),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}var mySwiper,_h_content=0,_t,last_data_received,offline_signature,lazydatasend=[],canRedirectAfterPoisonParam=!1,formcache=new FormCache;$(window).on("orientationchange",function(a){$sigdiv.jSignature("reset"),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),setTimeout(function(){$("#signature_pop-popup").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px"}),console.log("asd")},500)});