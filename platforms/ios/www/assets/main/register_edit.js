function object_merge(a,b){var c={};for(var d in a)a.hasOwnProperty(d)&&(c[d]=a[d]);for(var d in b)b.hasOwnProperty(d)&&(c[d]=b[d]);return c}function register_editInit(){executeSyncQuery(),t_counter=1,load_done=!0,last_data_json={},company_data=!1,load_done=!0,db_back_step=!1,loaded_steps=[],zh=parseInt($("body").height())-100,max_steps=19,max_stepsB=20,mySwiper=new Swiper(".swiper-container",{calculateHeight:!0,releaseFormElements:!0,preventLinks:!1,simulateTouch:!1,keyboardControl:!0,onInit:function(){setSwiperMinHeight()},onSlideNext:function(a){_t="save"},onSlidePrev:function(a){_t="edit"},onSlideChangeEnd:function(a){$("html, body").animate({scrollTop:0},500);var b=$(".swiper-slide-active").find(".no_results");b.length>0&&$('div[data-role="footer"]').hide(),mySwiper.resizeFix(),parseInt(a.activeIndex)==parseInt(a.previousIndex)&&a.previousIndex--;var c=$(mySwiper.activeSlide());HTML.validate(c,"REG");if("save"==_t){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var d=a.getSlide(a.previousIndex),e=HTML.validate(d);if(e){0==$(d).find(".colorwill").length&&"on"==$(d).find('select[data-role="slider"]').val()&&void 0==$(d).find('input[name="frequency_id"]:checked').val()&&(e=!1,$('<label class="validate_error">'+$.t("error.validation")+"</label>").insertAfter($(d).find(".ui-radio").last()));var f=HTML.getFormValues(a.getSlide(a.previousIndex));t_counter>1?HTML.getStepData(t_counter,last_data_json[t_counter-1],f):HTML.getStepData(t_counter,last_data_json[1],f),company_data&&(f=object_merge(company_data,f));var g={client:User.client,token:User.lastToken,step:t_counter,parameters:JSON.stringify(f)};t_counter=parseInt(t_counter)+1,db.lazyQuery({sql:'UPDATE "settings" SET "value"=? WHERE "type"=?',data:[["true","register_edit"]]},0),isOffline()?db.lazyQuery({sql:'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',data:[["companyEdit",JSON.stringify(g),parseInt(t_counter)-1,"registration_step"]]},0,"newCompanyRegistrationOff"):(Page.apiCall("companyEdit",g,"post","newCompanyRegistration"),db.execute('DELETE FROM "haccp_items"'))}else a.swipeTo(a.previousIndex,300,!1),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}"edit"==_t&&(t_counter=parseInt(t_counter)-1,loadBackStep(t_counter))}}),data={client:User.client,token:User.lastToken,step:1},isOffline()?newCompanyRegistrationOff(!0):Page.apiCall("companyEdit",data,"post","newCompanyRegistration")}function showStepFromDB(a,b){if(0==b.rows.length)noInternetError($.t("error.unexpected"));else{var c=$.parseJSON(b.rows.item(0).data);$(".overflow-wrapper").addClass("overflow-wrapper-hide");var d,e="";for(var f in c.registration_steps)if(c.registration_steps.hasOwnProperty(f))if("aux"!=f&&"steps_no"!=f){e='<div style="padding:0 10px;overflow:auto;height: '+zh+'px;"><form onsubmit="return false;">',"form8"==f||"form9"==f||"form10"==f||"form11"==f?(console.warn("generate will"),e+=HTML.formGenerateWill(c.registration_steps[f])):"form3"==f||"form4"==f||"form5"==f?(console.warn("generate colors"),e+=HTML.formGenerateColors(c.registration_steps[f])):(console.warn("generate normal"),e+=HTML.formGenerate(c.registration_steps[f])),e+=HTML.inputHidden("update","true"),e+="</form></div>";var d=mySwiper.getSlide(parseInt(mySwiper.activeIndex)-1);$(d).html(e)}else"aux"==f&&(company_data=c.registration_steps[f],company_data.currentCompany=company_data.lastCompanyId),"steps_no"==f&&(max_steps=c.registration_steps[f].value,max_stepsB=parseInt(max_steps)+1);$("#"+$.mobile.activePage.attr("id")).trigger("create")}}function getStepFromDB(a){a.executeSql('SELECT * FROM "registration" WHERE "step" = "'+db_back_step+'"',[],showStepFromDB,db.dbErrorHandle)}function loadBackStep(a){var b=!1;if(a>1){db_back_step=parseInt(a-1);var c=db.getDbInstance();c.transaction(getStepFromDB,c.dbErrorHandle)}if(1==a&&(a=2,b=!0),void 0!=last_data_json[parseInt(a)-1]){b&&(a=1);var d=$(mySwiper.getSlide(parseInt(a)-1));d.find('input[name="update"]').val("true")}}function newCompanyRegistrationOff(a){var b=db.getDbInstance();if(a&&"boolean"==typeof a)b.transaction(function(a){a.executeSql('SELECT "data" FROM "registration" WHERE "step"=? OR "step"=?',[1,2],function(a,b){if(2==b.rows.length)try{var c=JSON.parse(b.rows.item(0).data),d=JSON.parse(b.rows.item(1).data);c.registration_steps.form1_1=d.registration_steps.form1_1,newCompanyRegistration(c)}catch(e){console.error(e),$("#alertPopup .alert-text").html($.t("error.no_internet_for_sync")),$("#alertPopup").off("popupafterclose").on("popupafterclose",function(){window.location.href="index.html"}),$("#alertPopup").popup("open",{positionTo:"window"})}else $("#alertPopup .alert-text").html($.t("error.no_internet_for_sync")),$("#alertPopup").off("popupafterclose").on("popupafterclose",function(){window.location.href="index.html"}),$("#alertPopup").popup("open",{positionTo:"window"})})});else{var c=parseInt(t_counter)+1;if(c>max_stepsB)return mySwiper.destroy(!1),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$('[data-role="footer"]').hide(),!1;if(c==max_stepsB){var d='<div class="no_results" style="color:#00cde7;font-size:34px;">';d+=$.t("success.register_edit")+"<br /><br />",d+='<button type="submit" data-theme="d" onclick="Page.redirect(\'haccp.html\')">'+$.t("nav.haccp")+"</button>",d+="</div>",mySwiper.appendSlide(d,"swiper-slide")}console.info("t = ",c),b.transaction(function(a){a.executeSql('SELECT "data" FROM "registration" WHERE "step"=?',[c],function(a,b){if(b.rows.length>0)try{var c=JSON.parse(b.rows.item(0).data);newCompanyRegistration(c)}catch(d){noInternetError($.t("error.no_internet_for_sync"))}else{console.log("325");var e='<div class="no_results" style="color:#00cde7;font-size:34px;">';e+=$.t("success.register_edit")+"<br /><br />",e+='<button type="submit" data-theme="e" onclick="redirectHaccpPage()">'+$.t("nav.haccp")+"</button>",e+="</div>",mySwiper.appendSlide(e,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}})})}}function redirectHaccpPage(){isOffline()?noInternetError($.t("error.no_internet_for_sync")):Page.redirect("haccp.html")}function newCompanyRegistration(a,b){if(console.log("params",b),db.lazyQuery({sql:'INSERT INTO "registration"("step","data") VALUES(?,?)',data:[[t_counter,JSON.stringify(a)]],check:{update_query:'UPDATE "registration" SET "data"=? WHERE "step"=?',table:"registration",column:"step",column_id:0,index:"step",index_id:0}},0),a.success)if(console.log("register_edit 347"),void 0!=a.registration_steps.error&&a.registration_steps.error){console.log("register_edit 350");var c,d=$(mySwiper.getSlide(mySwiper.previousIndex));for(var e in a.registration_steps[0])a.registration_steps[0].hasOwnProperty(e)&&(c=d.find('input[name="'+a.registration_steps[0][e]+'"]'),$('<label id="'+c.attr("id")+'_validate" class="validate_error">'+$.t("error.duplicate_email")+"</label>").insertAfter(c.parent()));t_counter=parseInt(t_counter)-1,mySwiper.swipeTo(mySwiper.previousIndex,300,!1),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}else{if(console.log("register_edit 364"),last_data_json[t_counter]=a,t_counter==max_stepsB)return mySwiper.destroy(!1),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$('[data-role="footer"]').hide(),!1;if(t_counter>2){mySwiper.getSlide(parseInt(mySwiper.previousIndex)-1)}if($(".overflow-wrapper").addClass("overflow-wrapper-hide"),t_counter==max_steps){var f='<div class="no_results" style="color:#00cde7;font-size:34px;">';f+=$.t("success.register_edit")+"<br /><br />",f+='<button type="submit" data-theme="e" onclick="redirectHaccpPage()">'+$.t("nav.haccp")+"</button>",f+="</div>",mySwiper.appendSlide(f,"swiper-slide")}var f="";for(var e in a.registration_steps)a.registration_steps.hasOwnProperty(e)&&("aux"!=e&&"steps_no"!=e?(1==t_counter||-1==loaded_steps.indexOf(t_counter))&&(loaded_steps.push(t_counter),f='<div style="padding:0 10px;overflow:auto;height: '+zh+'px;"><form onsubmit="return false;">',"form8"==e||"form9"==e||"form10"==e||"form11"==e?(console.warn("generate will"),f+=HTML.formGenerateWill(a.registration_steps[e])):"form3"==e||"form4"==e||"form5"==e?(console.warn("generate colors"),f+=HTML.formGenerateColors(a.registration_steps[e])):(console.warn("generate normal"),f+=HTML.formGenerate(a.registration_steps[e])),f+=HTML.inputHidden("update","false"),f+="</form></div>",mySwiper.appendSlide(f,"swiper-slide")):("aux"==e&&(company_data=a.registration_steps[e],company_data.currentCompany=company_data.lastCompanyId),"steps_no"==e&&(max_steps=a.registration_steps[e].value,max_stepsB=parseInt(max_steps)+1)));if($("#"+$.mobile.activePage.attr("id")).trigger("create"),$("a i.fa-plus").parent().parent().on("click",offlinePrevent),$("a i.fa-minus").parent().parent().on("click",offlinePrevent),load_done){console.log("LoadDone"),mySwiper.reInit(),mySwiper.resizeFix(),mySwiper.removeSlide(0),load_done=!1;var g=$(mySwiper.activeSlide());HTML.validate(g,"REG")}}}function offlinePrevent(a){isOffline()&&(a.preventDefault(),a.stopPropagation(),noInternetError($.t("error.no_internet_for_sync"),null,$("span.language",this).text()))}function validate_extra(){HTML.validate(mySwiper.getSlide(0))}var company_data=!1,mySwiper,load_done=!0,t_counter=1,last_data_json={},db_back_step=!1,loaded_steps=[],_h_content=0,zh,max_steps=19,max_stepsB=20;$(document).off("submit").on("submit","form",function(a){return a.preventDefault(),a.stopPropagation(),!1});