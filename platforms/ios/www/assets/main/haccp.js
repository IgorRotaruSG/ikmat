function getHaccpCall(a,b){if(0==b.rows.length&&isOffline()&&!he_have_something)console.log("getHaccpCall 18"),$("#haccp_list_no_results").text($.t("haccp.no_haccp_yet")),setTimeout(function(){Page.redirect("index.html")},3500);else if(0!=b.rows.length||isOffline()||he_have_something||void 0!=get["continue"])if(b.rows.length>0){console.log("din local"),he_have_something=!0;for(var c,d="",e=0;e<b.rows.length;e++){if(d=getHaccpForm(b.rows.item(e).content,b.rows.item(e).id,b.rows.item(e).cat,b.rows.item(e).response),mySwiper.appendSlide(d,"swiper-slide"),0!=b.rows.item(e).response)try{c=JSON.parse(b.rows.item(e).response);var f=c.possibility,g=c.consequence}catch(h){var f=-1,g=-1;c=!1}else{var f=-1,g=-1;c=!1}$("#haccp_radio_possibility_"+b.rows.item(e).id+"_"+f).trigger("click"),$("#haccp_radio_consequence_"+b.rows.item(e).id+"_"+g).trigger("click")}b.rows.length>1?(mySwiper.removeSlide(0),mySwiper.reInit(),mySwiper.resizeFix()):candelete=!0,$("#"+$.mobile.activePage.attr("id")).trigger("create"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}else if(he_have_something){console.log("haccp 77 he_have_something");var d='<div class="no_results" style="color:#00cde7;font-size:34px;">';d+=$.t("haccp.no_haccp")+"<br /><br />",d+="</div>",mySwiper.appendSlide(d,"swiper-slide"),check_haccp()}else $(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#haccp_list_no_results").html($.t("haccp.no_haccp")),$('[data-role="footer"]').hide(),setTimeout(function(){Page.redirect("index.html")},3500);else{console.log("getHaccpCall from API");var i={client:User.client,token:User.lastToken};console.log("26 haccp.js"),Page.apiCall("haccp",i,"post","haccp")}}function getHaccpCallPrev(a,b){if(0==b.rows.length&&isOffline()&&!he_have_something)console.log("getHaccpCall 18"),$("#haccp_list_no_results").text($.t("haccp.no_haccp_yet")),setTimeout(function(){Page.redirect("index.html")},3500);else if(0!=b.rows.length||isOffline()||he_have_something){if(b.rows.length>0){console.log("din local"),he_have_something=!0;for(var c,d="",e=0;e<b.rows.length;e++){if(d+=getHaccpForm(b.rows.item(e).content,b.rows.item(e).id,b.rows.item(e).cat,b.rows.item(e).response),mySwiper.prependSlide(d,"swiper-slide"),mySwiper.swipeTo(mySwiper.activeIndex+1,0,!1),0!=b.rows.item(e).response)try{c=JSON.parse(b.rows.item(e).response);var f=c.possibility,g=c.consequence}catch(h){var f=-1,g=-1;c=!1}else{var f=-1,g=-1;c=!1}$("#haccp_radio_possibility_"+b.rows.item(e).id+"_"+f).trigger("click"),$("#haccp_radio_consequence_"+b.rows.item(e).id+"_"+g).trigger("click")}b.rows.item.length>1?(mySwiper.removeSlide(0),mySwiper.reInit(),mySwiper.resizeFix()):candelete=!0,$("#"+$.mobile.activePage.attr("id")).trigger("create"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}else if(he_have_something){var d='<div class="no_results" style="color:#00cde7;font-size:34px;">';d+=$.t("haccp.no_haccp")+"<br /><br />",d+="</div>",mySwiper.prependSlide(d,"swiper-slide"),mySwiper.swipeTo(mySwiper.activeIndex+1,0,!1),check_haccp()}}else{var i={client:User.client,token:User.lastToken};console.log("112 haccp.js"),Page.apiCall("haccp",i,"post","haccp")}}function getHaccp(a){void 0!=get&&void 0!=get["continue"]?(console.log("haccp.js 92"),a.executeSql('select * from haccp_items WHERE "id" > "'+get["continue"]+'" ORDER BY "id" ASC LIMIT 3',[],getHaccpCall,db.dbErrorHandle)):(console.log("haccp.js 95"),a.executeSql('select * from haccp_items ORDER BY "id" ASC LIMIT 3',[],getHaccpCall,db.dbErrorHandle))}function getHaccpWithLimit(a){a.executeSql('select * from haccp_items ORDER BY "id" ASC LIMIT '+f_i+",1",[],getHaccpCall,db.dbErrorHandle)}function getHaccpWithLimitPrev(a){a.executeSql('select * from haccp_items ORDER BY "id" ASC LIMIT '+activeQuestion+",1",[],getHaccpCallPrev,db.dbErrorHandle)}function haccpInit(){if(User.isLogged()){executeSyncQuery(),get={},fq=[],fqi=-1,f_i=2,candelete=!1,universal_cango=!1,he_have_something=!1,_h_content=800,last_id=0,zh_h=parseInt($("body").height())-90,get=Page.get(),get["continue"]&&(last_id=get["continue"],f_i=parseInt(get["continue"])+1);var a=db.getDbInstance();a.transaction(getHaccp,db.dbErrorHandle),mySwiper=new Swiper(".swiper-container-haccp",{calculateHeight:!0,releaseFormElements:!1,preventLinks:!1,simulateTouch:!0,noSwiping:!0,onInit:function(){setSwiperMinHeight()},onSlideChangeStart:function(a){parseInt(a.activeIndex)==parseInt(a.previousIndex)&&a.previousIndex--;var b=0,c=$(a.getSlide(a.previousIndex));c.find("input").each(function(){"radio"==$(this).attr("type")&&$(this).is(":checked")&&(b+=parseInt($(this).val()))}),b>=3&&"save"==_t&&decisionTree(a),check_haccp()},onSlideNext:function(a){_t="save"},onSlidePrev:function(a){_t="edit"},onSlideChangeEnd:function(a){parseInt(a.activeIndex)==parseInt(a.previousIndex)&&a.previousIndex--;var b=0,c=$(a.getSlide(a.previousIndex));c.find("input").each(function(){"radio"==$(this).attr("type")&&$(this).is(":checked")&&(b+=parseInt($(this).val()))}),b>=3&&"save"==_t||continueHaccp(a),a.resizeFix();var d=$(a.getSlide(a.activeIndex));return d.find("div.no_results").length>0?($("#footer").hide(),void $(".overflow-wrapper").addClass("overflow-wrapper-hide")):void $("#footer").show()}}),mySwiper.reInit(),mySwiper.resizeFix()}else Page.redirect("login.html")}function insertHaccpItem(a){fqi<fq.length-1?(fqi=parseInt(fqi)+1,a.executeSql(fq[fqi],[],insertHaccpItem,db.dbErrorHandle)):a.executeSql("select * from haccp_items LIMIT 3",[],getHaccpCall,db.dbErrorHandle)}function haccp(a){if(a.success)if(a.haccp_category.length>0){var b,c,d,e,f,g=0;for(var h in a.haccp_category)if(a.haccp_category.hasOwnProperty(h)){b='INSERT INTO "haccp_items"("id","cat","content","form","response")',c=!1,f=!1,e=a.haccp_category[h].id;for(d in a.haccp_category[h].subcategories)a.haccp_category[h].subcategories.hasOwnProperty(d)&&(f=!0,c?b+=" UNION":c=!0,b+=' SELECT "'+d+'" as "id", "'+e+'" as "cat", "'+a.haccp_category[h].subcategories[d]+'" as "content",\''+JSON.stringify(a.haccp_subcategories_form)+"' as \"form\", '"+g+'\' as "response"');f&&fq.push(b)}var i=db.getDbInstance();i.transaction(insertHaccpItem,db.dbErrorHandle)}else console.log("no_results"),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#haccp_list_no_results").html($.t("error.no_haccps")),$('[data-role="footer"]').hide()}function getHaccpForm(a,b,c,d){if(0!=d)try{d=JSON.parse(d);d.possibility,d.consequence}catch(e){d=!1}else{d=!1}$(document).ready(function(){check_haccp()});var f='<div style="padding:5px 10px;overflow:auto;height: '+zh_h+'px;" class="scrollTop"><form>';return f+=Form.radioListHACCP("possibility",a,[$.t("haccp.small_answer"),$.t("haccp.medium_answer"),$.t("haccp.big_answer")],b),f+='<div style="height:20px;"></div>',f+=Form.radioListHACCP("consequence",$.t("haccp.consequence_question"),[$.t("haccp.small_answer_cons"),$.t("haccp.medium_answer_cons"),$.t("haccp.big_answer_cons")],b),f+=Form.inputHidden("subcategory",b),f+=Form.inputHidden("category",c),f+='<table class="haccp_color_table table_separate" cellspacing="12">',f+="<tr>",f+='<td rowspan="4" style="border:0;width:10px;;height:auto;"><div style="-webkit-transform:rotate(270deg);width:12px;">'+$.t("haccp.possibility")+"</div></td>",f+="<td></td>",f+="<td>"+$.t("haccp.low_matrix")+"</td>",f+='<td style="word-wrap: break-word;">'+$.t("haccp.medium_matrix")+"</td>",f+="<td>"+$.t("haccp.high_matrix")+"</td>",f+="</tr>",f+="<tr>",f+="<td>"+$.t("haccp.high_matrix")+"</td>",f+='<td style="background:#ffa800 ;">'+showV(d,2,0)+"</td>",f+='<td style="background:#cf2a27;">'+showV(d,2,1)+"</td>",f+='<td style="background:#cf2a27;">'+showV(d,2,2)+"</td>",f+="</tr>",f+="<tr>",f+='<td style="word-wrap: break-word;">'+$.t("haccp.medium_matrix")+"</td>",f+='<td style="background:#6ca604;">'+showV(d,1,0)+"</td>",f+='<td style="background:#ffa800 ;">'+showV(d,1,1)+"</td>",f+='<td style="background:#cf2a27;">'+showV(d,1,2)+"</td>",f+="</tr>",f+="<tr>",f+="<td>"+$.t("haccp.low_matrix")+"</td>",f+='<td style="background:#6ca604;">'+showV(d,0,0)+"</td>",f+='<td style="background:#6ca604;">'+showV(d,0,1)+"</td>",f+='<td style="background:#ffa800;">'+showV(d,0,2)+"</td>",f+="</tr>",f+="<tr>",f+='<td colspan="5" style="border:0;width:auto;height:auto;">'+$.t("haccp.consequence")+"</td>",f+="</tr>",f+="</table>",f+=Form.inputHidden("critical_point",""),f+="</form></div>"}function showV(a,b,c){if(a){if(a.possibility==b&&a.consequence==c){var d="#fff";return(2==b&&0==c||0==b&&2==c||1==b&&1==c)&&(d="#000"),'<i class="fa fa-check" style="color:'+d+';"></i>'}return""}return""}function haccpComplete(a){console.log("aici 1"),$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var b=db.getDbInstance();if(a.success)if(a.haccp_response)if(a.haccp_response.deviation&&a.haccp_response.task_id){var a={client:User.client,token:User.lastToken,task_id:a.haccp_response.task_id};console.log("aici 2"),Page.apiCall("deviation",a,"get","haccpDeviation_s")}else f_i=parseInt(f_i)+1,b.transaction(getHaccpWithLimit,db.dbErrorHandle),$(".overflow-wrapper").addClass("overflow-wrapper-hide");else noInternetError($.t("error.no_internet_for_sync"));else noInternetError($.t("error.no_internet_for_sync"))}function showLocalDevPopup(){var a=db.getDbInstance();a.transaction(function(a){a.executeSql('SELECT "value" FROM "settings" WHERE "type"=?',["deviation_form"],function(a,b){if(b.rows.length>0){var c=JSON.parse(b.rows.item(0).value);haccpDeviation_s(c)}else $("#alertPopup .alert-text").html($.t("error.no_internet_for_sync")),$("#alertPopup").on("popupafterclose",function(){$("#alertPopup").unbind("popupafterclose"),window.location.href="index.html"}),$("#alertPopup").popup("open",{positionTo:"window"})})})}function haccpDeviation_s(a){if(console.log("aici 3"),isOffline()&&a.form_deviation){html=HTML.formGenerate(a.form_deviation,"Lagre"),console.log("no way it gets here"),$("#form_haccp_deviation").html(html);var b=null;d.transaction(function(a){a.executeSql('SELECT "data","id" FROM "sync_query" WHERE "q_type"=? AND "executed"=? ORDER BY "id" DESC',["haccp_deviation","0"],function(a,c){if(c.rows.length>0){b=c;var d=JSON.parse(JSON.parse(c.rows.item(0).data).response).subcategory;a.executeSql('SELECT "content" FROM "haccp_items" WHERE "id"=? ',[d],function(a,b){b.rows.length>0&&$("#form_haccp_deviation").find('textarea[name="deviation_description"]').text(b.rows.item(0).content)})}})}),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$("#signature-reset").off("click").on("click",function(a){return a.preventDefault(),$('input[name="'+s+'"]').val("numele va fi aici"),!1}),$("#form_haccp_deviation").off("submit").on("submit",function(a){a.preventDefault();var c=HTML.validate($(this));if(c){var e=HTML.getFormValues($(this).parent());if(null!=b){var f=b.rows.item(0).data;f=JSON.parse(f);var g=JSON.parse(f.response);g.deviation_data=e,g.deviation_data.signature=offline_signature,f.response=JSON.stringify(g);var h=JSON.stringify(f);db.lazyQuery({sql:'UPDATE "sync_query" SET "data"=? WHERE "id"=?',data:[[h,b.rows.item(0).id]]},0),$("#popupDeviation").popup("close")}}return f_i=parseInt(f_i)+1,d.transaction(getHaccpWithLimit,db.dbErrorHandle),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),!1}),$("#popupDeviation").popup("open"),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),$("#popupDeviation").css("height","100%"),$("#popupDeviation").on("popupafterclose",function(a,b){$(".overflow-wrapper").addClass("overflow-wrapper-hide"),1==signature_open&&($("#signature_pop").popup("open",{positionTo:"window"}),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),$("#signature_pop").css("height","100%"))}),$("#signature-trigger").off("click").on("click",function(a){a.preventDefault();var b=$("#sign_name").val();return""==b.replace(/\s/g,"")?$("#sign_name").parent().parent().append('<label class="validate_error">'+$.t("error.signature_name")+"</label>"):($("#sign_name").parent().parent().find(".validate_error").remove(),signature_open=!0,$("#signature_pop").on("popupafterclose",function(a,b){$("#popupDeviation").popup("open")}),$("#signature").html(""),$("#popupDeviation").popup("close"),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),$("#signature_pop").css("height","100%"),$sigdiv=$("#signature").jSignature(),$sigdiv.jSignature("reset"),$(document).off("click","#deviation-signature-close").on("click","#deviation-signature-close",function(){signature_open=!1,$("#signature_pop").popup("close"),offline_signature={name:$("#sign_name").val(),svg:$sigdiv.jSignature("getData","svgbase64")[1],parameter:"task",task_id:get.id},$("#sign_name").attr("disabled",!0),$("#signature-trigger").attr("disabled",!0);var a=new Date,b=a.getFullYear()+"-"+(a.getMonth()+1)+"-"+a.getDate()+" "+a.getHours()+":"+a.getMinutes()+":"+a.getSeconds();$("#signature-trigger").val(b).button("refresh"),$("#popupDeviation").popup("open")})),!1})}else Page.redirect("haccp_deviation.html?id="+a.form_deviation.task_id.value+"&return_haccp_id="+last_id)}function takeHACCPPicture(a){navigator.camera.getPicture(function(b){$("#"+a).css({visibility:"visible",display:"block"}).attr("src",b),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),$("#popupDeviation").css("height","100%")},function(a){console.log("Error getting picture: "+a)},{quality:50,destinationType:navigator.camera.DestinationType.FILE_URI})}function selectHACCPPicture(a){Page.selectImage(a,function(b){$("#"+a).css({visibility:"visible",display:"block"}).attr("src",b),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),$("#popupDeviation").css("height","100%")})}function uploadHACCPPictureHaccp(){var a=$("#"+haccp_image_id),b=a.attr("src");Page.uploadImage(b,function(b){a.css({visibility:"hidden",display:"none"}).attr("src","")})}function haccpDeviationSave(a){universal_cango=!0,$("#popupDeviation").popup("close")}function check_haccp(){var a=$(".haccp_color_table").find("i"),b=0,c=0;b=a.parent().index()+1,c=a.parent().parent().index(),c=3-c+2,1!=b&&(b=2),1!=c&&(c=4),$('input[type="radio"]').change(function(){"possibility"==$(this).attr("name")?(c=$(this).parent().index()+1,c=3-c+2):"consequence"==$(this).attr("name")&&(b=$(this).parent().index()+2),$(".swiper-slide-active .haccp_color_table").find("i").remove(),$(".swiper-slide-active .haccp_color_table tr:nth-child("+c+") td:nth-child("+b+")").html('<i class="fa fa-check" style="color:#000;"></i>')})}function continueHaccp(a){if(confirm_action=!1,$("#confirmDevPopup").unbind("popupafterclose"),$("#confirmDevPopup").unbind("popupafteropen"),$("#confirmDevPopup").popup("close"),"save"!=_t||universal_cango)universal_cango=!1,0>=activeQuestion?activeQuestion=f_i-mySwiper.slides.length:activeQuestion--,activeQuestion>=0&&console.log("try to get haccp with prev");else{$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var b={};if(isNaN(a.previousIndex))var c=$(a.getSlide(a.activeIndex));else var c=$(a.getSlide(a.previousIndex));c.find("input").each(function(){"radio"==$(this).attr("type")?(void 0==b[$(this).attr("name")]&&(b[$(this).attr("name")]=-1),$(this).is(":checked")&&(b[$(this).attr("name")]=$(this).val())):b[$(this).attr("name")]=$(this).val()});var e=!0;for(i in b)b.hasOwnProperty(i)&&("subcategory"!=i&&"category"!=i&&(-1==b[i]?(e=!1,c.find('input[name="'+i+'"]').first().parent().parent().parent().find("p").remove(),c.find('input[name="'+i+'"]').first().parent().parent().parent().append($('<p style="color:red;">'+$.t("haccp.this_is_required")+"</p>"))):c.find('input[name="'+i+'"]').first().parent().parent().parent().find("p").remove()),"subcategory"==i&&(last_id=c.find('input[name="'+i+'"]').val()));if(b.critical_point=$("input[name='critical_point']").val(),$("input[name='critical_point']").val(""),b.deviation=createDeviation,b.deviationAnswers=deviationAnswers,createDeviation=!1,deviationAnswers={},nextSlide&&e){console.log("cango");var f=$(a.getSlide(a.activeIndex));f.find("div.no_results").length>0&&$('[data-role="footer"]').hide();var g={client:User.client,token:User.lastToken,haccp_category:b.category,response:JSON.stringify(b)};if(db.lazyQuery({sql:'UPDATE "haccp_items" SET "response"=? WHERE "cat"=? AND "id"=?',data:[[JSON.stringify(b),b.category,b.subcategory]]},0),db.lazyQuery({sql:'UPDATE "settings" SET "value"=? WHERE "type"=?',data:[["true","haccp"]]},0),isOffline()){console.log("942 no internet");var h=parseInt(b.possibility)+parseInt(b.consequence);h>=3?db.lazyQuery({sql:'INSERT INTO "sync_query"("api","data","q_type") VALUES(?,?,?)',data:[["haccp",JSON.stringify(g),"haccp_deviation"]]},0,"showLocalDevPopup"):(db.lazyQuery({sql:'INSERT INTO "sync_query"("api","data","q_type") VALUES(?,?,?)',data:[["haccp",JSON.stringify(g),"haccp_deviation"]]},0),f_i=parseInt(f_i)+1,d.transaction(getHaccpWithLimit,db.dbErrorHandle),$(".overflow-wrapper").addClass("overflow-wrapper-hide"))}else console.log("haccp 244"),Page.apiCall("haccp",g,"get","haccpComplete");$(".overflow-wrapper").addClass("overflow-wrapper-hide")}else $(".overflow-wrapper").addClass("overflow-wrapper-hide"),mySwiper.swipePrev()}return!1}function decisionTree(a,b){console.log("step",b),console.log("decisionTree"),move_on=!1,void 0===b&&(b=step1),openConfirmDialog(b.message,b.confirm,b.cancel,1)}function openConfirmDialog(a,b,c,d){var e;return $("input[name='critical_point']").val(""),$("#confirmDevPopup .ui-radio").show(),(3==d||5==d||8==d)&&($("#confirmDevPopup .ui-radio").hide(),$("#deviation_yes").prop("checked",!0)),$("#confirmDevPopup .alert-text").html(a),$("#confirmDevPopup").off("popupafteropen").on("popupafteropen",function(a,b){$("#confirmDevPopup-screen").remove(),e=!1,$("#confirmDevButton").off("click").on("click",function(){e=!0})}),$("#confirmDevPopup").off("popupafterclose").on("popupafterclose",function(a,d){return $("#confirmDevPopup").unbind("popupafteropen"),$("#confirmDevButton").unbind("click"),void 0===e||e?e?$("#deviation_yes").is(":checked")?b():c():void 0:deviationTreeBackStep()}),$("#confirmDevPopup").popup("open",{positionTo:"window"}),$("#confirmDevPopup").css({height:parseInt($("body").height())+3-50+"px"}),$("#confirmDevPopup").parent().css({top:50,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+3-50+"px",overflow:"hidden",position:"fixed"}),$(".scrollTop").scrollTop(0),$("body").scrollTop(0),!0}function goCreateDeviation(a){$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),confirm_action=!0,createDeviation=!0,universal_cango=!1,nextSlide=!0,continueHaccp(a)}function goNext(a){universal_cango=!1,nextSlide=!0,createDeviation=!1,$("input[name='critical_point']").val(""),continueHaccp(a)}function goNextWithCriticalControl(a,b){universal_cango=!1,nextSlide=!0,createDeviation=!1,$("input[name='critical_point']").val(b),continueHaccp(a)}function deviationTreeBackStep(){if(console.log("deviationTreeBackStep"),console.log(deviationAnswers),$("input[name='critical_point']").val(""),isEmpty(deviationAnswers))$("#deviation_no").siblings("label").data("icon","radio-off").removeClass("ui-radio-on").addClass("ui-radio-off"),$("#deviation_yes").siblings("label").data("icon","radio-on").removeClass("ui-radio-off").addClass("ui-radio-on"),$("#deviation_yes").trigger("click"),mySwiper.swipePrev();else{var prevStepKeys=Object.keys(deviationAnswers),prevStep=prevStepKeys[prevStepKeys.length-1],prevAns=deviationAnswers[prevStep];console.log(prevStep,prevAns);var prevStepFunc=eval("{"+prevStep+"}");openConfirmDialog(prevStepFunc.message,prevStepFunc.confirm,prevStepFunc.cancel,0),1==prevAns?($("#deviation_no").siblings("label").data("icon","radio-off").removeClass("ui-radio-on").addClass("ui-radio-off"),$("#deviation_yes").siblings("label").data("icon","radio-on").removeClass("ui-radio-off").addClass("ui-radio-on"),$("#deviation_yes").trigger("click")):($("#deviation_yes").siblings("label").data("icon","radio-off").removeClass("ui-radio-on").addClass("ui-radio-off"),$("#deviation_no").siblings("label").data("icon","radio-on").removeClass("ui-radio-off").addClass("ui-radio-on"),$("#deviation_no").trigger("click")),delete deviationAnswers[prevStep]}}var _t,get={},fq=[],fqi=-1,f_i=2,candelete=!1,universal_cango=!1,he_have_something=!1,_h_content=800,last_id=0,mySwiper,zh_h,signature_open=!1,offline_signature,activeQuestion=0,confirm_action=!1,nextSlide=!0,createDeviation=!1,deviationAnswers={},step1,step2,step3,step4,step5,step6,step7,step8;step8={message:"Gjennomfør etterfølgende trinn for å fjerne eller redusere faren til akseptabelt nivå.",confirm:function(){deviationAnswers.step8=1,goNextWithCriticalControl(mySwiper,step8.message)},cancel:function(){deviationAnswers.step8=0,goNext(mySwiper)}},step7={message:"Vil etterfølgende trinn fjerne eller redusere faren til akseptabelt nivå?",confirm:function(){deviationAnswers.step7=1,goNext(mySwiper)},cancel:function(){deviationAnswers.step7=0,openConfirmDialog(step8.message,step8.confirm,step8.cancel,8)}},step6={message:"Kan forurensing øke til uakseptabelt nivå?",confirm:function(){deviationAnswers.step6=1,openConfirmDialog(step7.message,step7.confirm,step7.cancel,7)},cancel:function(){deviationAnswers.step6=0,goNext(mySwiper)}},step5={message:"Fjern eller reduser faren til et akseptabelt nivå.",confirm:function(){deviationAnswers.step5=1,goNextWithCriticalControl(mySwiper,step5.message)},cancel:function(){deviationAnswers.step5=0,goNext(mySwiper)}},step4={message:"Er hensikten med dette trinnet å fjerne eller redusere faren til et akseptabelt nivå?",confirm:function(){deviationAnswers.step4=1,openConfirmDialog(step5.message,step5.confirm,step5.cancel,5)},cancel:function(){deviationAnswers.step4=0,openConfirmDialog(step6.message,step6.confirm,step6.cancel,6)}},step3={message:"Modifiser trinn, prosess eller produkt.",confirm:function(){deviationAnswers.step3=1,goNextWithCriticalControl(mySwiper,step3.message)},cancel:function(){deviationAnswers.step3=0,goNext(mySwiper)}},step2={message:"Er styring på dette trinnet nødvendig for sikkerheten?",confirm:function(){deviationAnswers.step2=1,openConfirmDialog(step3.message,step3.confirm,step3.cancel,3)},cancel:function(){deviationAnswers.step2=0,goNext(mySwiper)}},step1={message:"Finnes det forebyggende kontroll eller styringstiltak for den påviste faren?",confirm:function(){deviationAnswers.step1=1,openConfirmDialog(step4.message,step4.confirm,step4.cancel,4)},cancel:function(){deviationAnswers.step1=0,openConfirmDialog(step2.message,step2.confirm,step2.cancel,2)}},$(window).on("orientationchange",function(a){console.log("orientationchange"),"undefined"!=typeof $sigdiv&&$sigdiv.jSignature("reset"),$("#confirmDevPopup").parent().css({top:"0 !important",left:"0 !important","max-width":"100% !important",width:"100%  !important",height:parseInt($("body").height())+3+"px  !important",overflow:"hidden",position:"fixed"}),"landscape"==a.orientation?($("#signature-status-message").hide(),$("#confirmDevPopup .ui-content").css("margin-top","15%")):($("#signature-status-message").show(),$("#confirmDevPopup .ui-content").css("margin-top","50%")),mySwiper.resizeFix()});