function getHaccpCall(a,b){if(b&&(haccp_total=b.total_rows),!(b&&b.offset>b.total_rows))if(isStart=b&&b.rows.length==lazy_total?!0:!1,b&&0!=b.rows.length||!isOffline()||he_have_something)if(b&&0!=b.rows.length||isOffline()||he_have_something||void 0!=get["continue"])if(b.rows.length>0){he_have_something=!0;for(var c,d="",e=[],f=0;f<b.rows.length;f++){var g=f;!function(a){e[a]=new Promise(function(c,d){Page.apiCall("getSavedHaccp",{client:User.client,token:User.lastToken,sub_id:b.rows[a].id},"get",function(d){d&&d.success&&d.data&&b.rows[a].doc&&(b.rows[a].doc.response=JSON.stringify(d.data)),c(!0)})})}(g),Promise.all(e).then(function(a){if(a.length==b.rows.length){for(var e=0;e<b.rows.length;e++)if(d=getHaccpForm(b.rows[e].doc.content,b.rows[e].doc.id,b.rows[e].doc.cat,b.rows[e].doc.response),onNextClick||1!=b.rows.length?mySwiper.appendSlide(d,"swiper-slide"):mySwiper.prependSlide(d,"swiper-slide"),0!=b.rows[e].doc.response)try{c=JSON.parse(b.rows[e].doc.response);c.possibility,c.consequence}catch(f){c=!1}else{c=!1}b&&1==b.rows.length&&(onNextClick&&f_i>2?(mySwiper.removeSlide(0),mySwiper.swipeTo(1,0,!1)):onNextClick||(mySwiper.removeSlide(parseInt(mySwiper.slides.length-1)),mySwiper.swipeTo(1,0,!1))),b.rows.length>1?(mySwiper.removeSlide(0),mySwiper.reInit(),mySwiper.resizeFix()):candelete=!0,$("#"+$.mobile.activePage.attr("id")).trigger("create"),setTimeout(function(){$(".overflow-wrapper").addClass("overflow-wrapper-hide")},500)}})}}else if(he_have_something){console.log("haccp 77 he_have_something");var d='<div class="no_results" style="color:#00cde7;font-size:34px;">';d+=$.t("haccp.no_haccp")+"<br /><br />",d+="</div>",mySwiper.appendSlide(d,"swiper-slide"),mySwiper.removeSlide(0),mySwiper.swipeTo(1,0,!1),check_haccp()}else $(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#haccp_list_no_results").html($.t("haccp.no_haccp")),$('[data-role="footer"]').hide(),setTimeout(function(){Page.redirect("index.html")},3500);else{var h={client:User.client,token:User.lastToken};console.log("26 haccp.js"),Page.apiCall("haccp",h,"post","haccp")}else $("#haccp_list_no_results").text($.t("haccp.no_haccp_yet")),$('[data-role="footer"]').hide(),setTimeout(function(){Page.redirect("index.html")},3500)}function getHaccpCallPrev(a,b){if(alert("getHaccpCallPrev"),0==b.rows.length&&isOffline()&&!he_have_something)console.log("getHaccpCall 18"),$("#haccp_list_no_results").text($.t("haccp.no_haccp_yet")),setTimeout(function(){Page.redirect("index.html")},3500);else if(0!=b.rows.length||isOffline()||he_have_something){if(b.rows.length>0){console.log("din local"),he_have_something=!0;for(var c,d="",e=0;e<b.rows.length;e++){if(d+=getHaccpForm(b.rows[e].doc.content,b.rows[e].doc.id,b.rows[e].doc.cat,b.rows[e].doc.response),mySwiper.prependSlide(d,"swiper-slide"),mySwiper.swipeTo(mySwiper.activeIndex+1,0,!1),0!=b.rows[e].doc.response)try{c=JSON.parse(b.rows[e].doc.response);var f=c.possibility,g=c.consequence}catch(h){var f=-1,g=-1;c=!1}else{var f=-1,g=-1;c=!1}$("#haccp_radio_possibility_"+b.rows[e].doc.id+"_"+f).trigger("click"),$("#haccp_radio_consequence_"+b.rows[e].doc.id+"_"+g).trigger("click")}b.rows.item.length>1?(mySwiper.removeSlide(0),mySwiper.reInit(),mySwiper.resizeFix()):candelete=!0,$("#"+$.mobile.activePage.attr("id")).trigger("create"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}else if(he_have_something){var d='<div class="no_results" style="color:#00cde7;font-size:34px;">';d+=$.t("haccp.no_haccp")+"<br /><br />",d+="</div>",mySwiper.prependSlide(d,"swiper-slide"),mySwiper.swipeTo(mySwiper.activeIndex+1,0,!1),check_haccp()}}else{var i={client:User.client,token:User.lastToken};console.log("112 haccp.js"),Page.apiCall("haccp",i,"post","haccp")}}function getHaccp(){void 0!=get&&void 0!=get["continue"]?db.getDbInstance("haccp_items").query("sort_index",{include_docs:!0,skip:get["continue"],limit:lazy_total},getHaccpCall):db.getDbInstance("haccp_items").query("sort_index",{include_docs:!0,limit:lazy_total},getHaccpCall)}function getHaccpWithLimit(){db.getDbInstance("haccp_items").query("sort_index",{include_docs:!0,skip:f_i,limit:1},getHaccpCall)}function getHaccpWithLimitPrev(){db.getDbInstance("haccp_items").query("sort_index",{include_docs:!0,skip:f_i,limit:1},getHaccpCall)}function haccpInit(){User.isLogged()?(executeSyncQuery(),get={},fq=[],fqi=-1,f_i=2,candelete=!1,universal_cango=!1,he_have_something=!1,_h_content=800,last_id=0,zh_h=parseInt($("body").height())-90,get=Page.get(),get["continue"]&&(last_id=get["continue"],f_i=parseInt(get["continue"])+1),getHaccp(),mySwiper=new Swiper(".swiper-container-haccp",{calculateHeight:!0,releaseFormElements:!1,preventLinks:!1,simulateTouch:!0,noSwiping:!0,onInit:function(){setSwiperMinHeight()},onSlideChangeStart:function(a){$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),parseInt(a.activeIndex)==parseInt(a.previousIndex)&&a.previousIndex--;var b=0,c=$(a.getSlide(a.previousIndex));c.find("input").each(function(){"radio"==$(this).attr("type")&&$(this).is(":checked")&&(b+=parseInt($(this).val()))}),b>=3&&"save"==_t&&decisionTree(a),check_haccp()},onSlideNext:function(a){_t="save",onNextClick=!0,oneClickDone=!1},onSlidePrev:function(a){if(_t="edit",!onNextClick||isValid){if(!isStart){if(f_i>haccp_total)return void(f_i=haccp_total);f_i=onNextClick?parseInt(f_i)-lazy_total:parseInt(f_i)-1,f_i>=0?getHaccpWithLimitPrev():f_i=0}onNextClick=!1,oneClickDone=!1}},onSlideChangeEnd:function(a){parseInt(a.activeIndex)==parseInt(a.previousIndex)&&a.previousIndex--;var b=0,c=$(a.getSlide(a.previousIndex));c.find("input").each(function(){"radio"==$(this).attr("type")&&$(this).is(":checked")&&(b+=parseInt($(this).val()))}),b>=3&&"save"==_t||oneClickDone||(oneClickDone=!0,continueHaccp(a)),a.resizeFix();var d=$(a.getSlide(a.activeIndex));d.find("div.no_results").length>0?$("#footer").hide():$("#footer").show(),(0==f_i||f_i==haccp_total||isStart)&&setTimeout(function(){$(".overflow-wrapper").addClass("overflow-wrapper-hide")},500),onNextClick&&!isValid&&(isValid=!0,$(".overflow-wrapper").addClass("overflow-wrapper-hide"))}}),mySwiper.reInit(),mySwiper.resizeFix()):Page.redirect("login.html")}function insertHaccpItem(){db.lazyQuery("haccp_items",castToListObject(["id","cat","content","form","response"],fq),function(a){a&&db.getDbInstance("haccp_items").query("sort_index",{include_docs:!0,limit:lazy_total},getHaccpCall)})}function haccp(a){if(a.success)if(a.haccp_category.length>0){var b,c,d,e,f=0;for(var g in a.haccp_category)if(a.haccp_category.hasOwnProperty(g)){b=!1,e=!1,d=a.haccp_category[g].id;for(c in a.haccp_category[g].subcategories)a.haccp_category[g].subcategories.hasOwnProperty(c)&&fq.push([c,d,a.haccp_category[g].subcategories[c],JSON.stringify(a.haccp_subcategories_form),f])}insertHaccpItem()}else $(".overflow-wrapper").addClass("overflow-wrapper-hide"),$(".swiper-slide").css("min-height","inherit"),$("#haccp_list_no_results").html($.t("error.no_haccps")),$('[data-role="footer"]').hide()}function getHaccpForm(a,b,c,d){if(0!=d)try{d=JSON.parse(d);var e=d.possibility,f=d.consequence}catch(g){var e=!1,f=!1;d=!1}else{var e=!1,f=!1;d=!1}$(document).ready(function(){check_haccp()});var h='<div style="padding:5px 10px;overflow:auto;height: '+zh_h+'px;" class="scrollTop"><form>';return h+=Form.radioListHACCP("possibility",a,[$.t("haccp.small_answer"),$.t("haccp.medium_answer"),$.t("haccp.big_answer")],b,e),h+='<div style="height:20px;"></div>',h+=Form.radioListHACCP("consequence",$.t("haccp.consequence_question"),[$.t("haccp.small_answer_cons"),$.t("haccp.medium_answer_cons"),$.t("haccp.big_answer_cons")],b,f),h+=Form.inputHidden("subcategory",b),h+=Form.inputHidden("category",c),h+='<table class="haccp_color_table table_separate" cellspacing="12">',h+="<tr>",h+='<td rowspan="4" style="border:0;width:10px;;height:auto;"><div style="-webkit-transform:rotate(270deg);width:12px;">'+$.t("haccp.possibility")+"</div></td>",h+="<td></td>",h+="<td>"+$.t("haccp.low_matrix")+"</td>",h+='<td style="word-wrap: break-word;">'+$.t("haccp.medium_matrix")+"</td>",h+="<td>"+$.t("haccp.high_matrix")+"</td>",h+="</tr>",h+="<tr>",h+="<td>"+$.t("haccp.high_matrix")+"</td>",h+='<td style="background:#ffa800 ;">'+showV(d,2,0)+"</td>",h+='<td style="background:#cf2a27;">'+showV(d,2,1)+"</td>",h+='<td style="background:#cf2a27;">'+showV(d,2,2)+"</td>",h+="</tr>",h+="<tr>",h+='<td style="word-wrap: break-word;">'+$.t("haccp.medium_matrix")+"</td>",h+='<td style="background:#6ca604;">'+showV(d,1,0)+"</td>",h+='<td style="background:#ffa800 ;">'+showV(d,1,1)+"</td>",h+='<td style="background:#cf2a27;">'+showV(d,1,2)+"</td>",h+="</tr>",h+="<tr>",h+="<td>"+$.t("haccp.low_matrix")+"</td>",h+='<td style="background:#6ca604;">'+showV(d,0,0)+"</td>",h+='<td style="background:#6ca604;">'+showV(d,0,1)+"</td>",h+='<td style="background:#ffa800;">'+showV(d,0,2)+"</td>",h+="</tr>",h+="<tr>",h+='<td colspan="5" style="border:0;width:auto;height:auto;">'+$.t("haccp.consequence")+"</td>",h+="</tr>",h+="</table>",h+=Form.inputHidden("critical_point",""),h+="</form></div>"}function showV(a,b,c){if(a){if(a.possibility==b&&a.consequence==c){var d="#fff";return(2==b&&0==c||0==b&&2==c||1==b&&1==c)&&(d="#000"),'<i class="fa fa-check" style="color:'+d+';"></i>'}return""}return""}function haccpComplete(a){if(a.success)if(a.haccp_response)if(a.haccp_response.deviation&&a.haccp_response.task_id){var a={client:User.client,token:User.lastToken,task_id:a.haccp_response.task_id};Page.apiCall("deviation",a,"get","haccpDeviation_s")}else onNextClick&&(!isStart||isStart&&2==mySwiper.activeIndex)&&(0==f_i?(f_i=parseInt(f_i)+lazy_total-1,isStart=!0):(f_i=parseInt(f_i)+1,getHaccpWithLimit()));else noInternetError($.t("error.no_internet_for_sync"));else noInternetError($.t("error.no_internet_for_sync"))}function showLocalDevPopup(){db.getDbInstance("settings").get("deviation_form",function(a,b){if(b){var c=JSON.parse(b.value);haccpDeviation_s(c)}else $("#alertPopup .alert-text").html($.t("error.no_internet_for_sync")),$("#alertPopup").on("popupafterclose",function(){$("#alertPopup").unbind("popupafterclose"),window.location.href="index.html"}),$("#alertPopup").popup("open",{positionTo:"window"})})}function haccpDeviation_s(a){if(isOffline()&&a.form_deviation){html=HTML.formGenerate(a.form_deviation,"Lagre"),console.log("no way it gets here"),$("#form_haccp_deviation").html(html);var b=null;$("#"+$.mobile.activePage.attr("id")).trigger("create"),$("#signature-reset").off("click").on("click",function(a){return a.preventDefault(),$('input[name="'+s+'"]').val("numele va fi aici"),!1}),$("#form_haccp_deviation").off("submit").on("submit",function(a){a.preventDefault();var c=HTML.validate($(this));if(c){var d=HTML.getFormValues($(this).parent());if(null!=b){var e=b.rows.item(0).data;e=JSON.parse(e);var f=JSON.parse(e.response);f.deviation_data=d,f.deviation_data.signature=offline_signature,e.response=JSON.stringify(f);var g=JSON.stringify(e);db.lazyQuery("sync_query",[{_id:b.rows.item(0).id,data:g}]),$("#popupDeviation").popup("close")}}return f_i=parseInt(f_i)+1,getHaccpWithLimit(),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),!1}),$("#popupDeviation").popup("open"),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),$("#popupDeviation").css("height","100%"),$("#popupDeviation").on("popupafterclose",function(a,b){$(".overflow-wrapper").addClass("overflow-wrapper-hide"),1==signature_open&&($("#signature_pop").popup("open",{positionTo:"window"}),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),$("#signature_pop").css("height","100%"))}),$("#signature-trigger").off("click").on("click",function(a){a.preventDefault();var b=$("#sign_name").val();return""==b.replace(/\s/g,"")?$("#sign_name").parent().parent().append('<label class="validate_error">'+$.t("error.signature_name")+"</label>"):($("#sign_name").parent().parent().find(".validate_error").remove(),signature_open=!0,$("#signature_pop").on("popupafterclose",function(a,b){$("#popupDeviation").popup("open")}),$("#signature").html(""),$("#popupDeviation").popup("close"),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),$("#signature_pop").css("height","100%"),$sigdiv=$("#signature").jSignature(),$sigdiv.jSignature("reset"),$(document).off("click","#deviation-signature-close").on("click","#deviation-signature-close",function(){signature_open=!1,$("#signature_pop").popup("close"),offline_signature={name:$("#sign_name").val(),svg:$sigdiv.jSignature("getData","svgbase64")[1],parameter:"task",task_id:get.id},$("#sign_name").attr("disabled",!0),$("#signature-trigger").attr("disabled",!0);var a=new Date,b=a.getFullYear()+"-"+(a.getMonth()+1)+"-"+a.getDate()+" "+a.getHours()+":"+a.getMinutes()+":"+a.getSeconds();$("#signature-trigger").val(b).button("refresh"),$("#popupDeviation").popup("open")})),!1})}else Page.redirect("haccp_deviation.html?id="+a.form_deviation.task_id.value+"&return_haccp_id="+last_id)}function takeHACCPPicture(a){navigator.camera.getPicture(function(b){$("#"+a).css({visibility:"visible",display:"block"}).attr("src",b),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),$("#popupDeviation").css("height","100%")},function(a){console.log("Error getting picture: "+a)},{quality:50,destinationType:navigator.camera.DestinationType.FILE_URI})}function selectHACCPPicture(a){Page.selectImage(a,function(b){$("#"+a).css({visibility:"visible",display:"block"}).attr("src",b),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),$("#popupDeviation").css("height","100%")})}function uploadHACCPPictureHaccp(){var a=$("#"+haccp_image_id),b=a.attr("src");Page.uploadImage(b,function(b){a.css({visibility:"hidden",display:"none"}).attr("src","")})}function haccpDeviationSave(a){universal_cango=!0,$("#popupDeviation").popup("close")}function check_haccp(){$('input[type="radio"]').change(function(){if("possibility"==$(this).attr("name")||"consequence"==$(this).attr("name")){var a=parseInt($(mySwiper.getSlide(mySwiper.activeIndex)).find("input[name=consequence]:checked").val()),b=parseInt($(mySwiper.getSlide(mySwiper.activeIndex)).find("input[name=possibility]:checked").val());a=a?a+2:2,b=b?4-b:4,$(".swiper-slide-active .haccp_color_table").find("i").remove(),$(".swiper-slide-active .haccp_color_table tr:nth-child("+b+") td:nth-child("+a+")").html('<i class="fa fa-check" style="color:#000;"></i>')}})}function continueHaccp(a){if(confirm_action=!1,$("#confirmDevPopup").unbind("popupafterclose"),$("#confirmDevPopup").unbind("popupafteropen"),$("#confirmDevPopup").popup("close"),"save"!=_t||universal_cango)universal_cango=!1,0>=activeQuestion?activeQuestion=f_i-mySwiper.slides.length:activeQuestion--,activeQuestion>=0&&console.log("try to get haccp with prev");else{var b={};if(isNaN(a.previousIndex))var c=$(a.getSlide(a.activeIndex));else var c=$(a.getSlide(a.previousIndex));c.find("input").each(function(){"radio"==$(this).attr("type")?(void 0==b[$(this).attr("name")]&&(b[$(this).attr("name")]=-1),$(this).is(":checked")&&(b[$(this).attr("name")]=$(this).val())):b[$(this).attr("name")]=$(this).val()});var d=!0;isValid=!0;for(i in b)b.hasOwnProperty(i)&&("subcategory"!=i&&"category"!=i&&(-1==b[i]?(d=!1,isValid=!1,c.find('input[name="'+i+'"]').first().parent().parent().parent().find("p").remove(),c.find('input[name="'+i+'"]').first().parent().parent().parent().append($('<p style="color:red;">'+$.t("haccp.this_is_required")+"</p>"))):c.find('input[name="'+i+'"]').first().parent().parent().parent().find("p").remove()),"subcategory"==i&&(last_id=c.find('input[name="'+i+'"]').val()));if(b.critical_point=$("input[name='critical_point']").val(),$("input[name='critical_point']").val(""),b.deviation=createDeviation,b.deviationAnswers=deviationAnswers,createDeviation=!1,deviationAnswers={},nextSlide&&d){console.log("cango");var e=$(a.getSlide(a.activeIndex));e.find("div.no_results").length>0&&$('[data-role="footer"]').hide();var f={client:User.client,token:User.lastToken,haccp_category:b.category,response:JSON.stringify(b)};if(db.lazyQuery("haccp_items",[{_id:b.subcategory,response:JSON.stringify(b)}]),db.lazyQuery("settings",[{_id:"haccp",value:!0}]),isOffline()){var g=parseInt(b.possibility)+parseInt(b.consequence);g>=lazy_total?db.lazyQuery("sync_query",[{api:"haccp",data:JSON.stringify(f),q_type:"haccp_deviation"}],"showLocalDevPopup"):(db.lazyQuery("sync_query",[{api:"haccp",data:JSON.stringify(f),q_type:"haccp_deviation"}]),f_i=parseInt(f_i)+1,getHaccpWithLimit())}else console.log("haccp 244"),Page.apiCall("haccp",f,"get","haccpComplete")}else mySwiper.swipePrev();console.log("continueHaccp line 908"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}return!1}function decisionTree(a,b){$(".overflow-wrapper").addClass("overflow-wrapper-hide"),move_on=!1,void 0===b&&(b=step1),openConfirmDialog(b.message,b.confirm,b.cancel,1)}function openConfirmDialog(a,b,c,d){resetToDefault&&($("#deviation_yes").prop("checked",!0),$("#deviation_no").siblings("label").data("icon","radio-off").removeClass("ui-radio-on").addClass("ui-radio-off"),$("#deviation_yes").siblings("label").data("icon","radio-on").removeClass("ui-radio-off").addClass("ui-radio-on"),resetToDefault=!1);var e;return $("input[name='critical_point']").val(""),$("#confirmDevPopup .ui-radio").show(),(3==d||5==d||8==d)&&($("#confirmDevPopup .ui-radio").hide(),$("#deviation_yes").prop("checked",!0)),$("#confirmDevPopup .alert-text").html(a),$("#confirmDevPopup").off("popupafteropen").on("popupafteropen",function(a,b){$("#confirmDevPopup-screen").remove(),e=!1,$("#confirmDevButton").off("click").on("click",function(){e=!0})}),$("#confirmDevPopup").off("popupafterclose").on("popupafterclose",function(a,f){if($("#confirmDevPopup").unbind("popupafteropen"),$("#confirmDevButton").unbind("click"),void 0!==e&&!e)return deviationTreeBackStep();if(e){var g=$("#deviation_yes").is(":checked");if(deletedObjectArray.length>0){var h=deletedObjectArray[deletedObjectArray.length-1].answer;if(g&&1==h||!g&&0==h){if(deletedObjectArray.length>1)return console.log("vienvt current step: ",d),deviationTreeNextStep(d)}else deletedObjectArray=[],resetToDefault=!0}return $("#deviation_yes").is(":checked")?(resetToDefault=!1,b()):(resetToDefault=!0,c())}}),$("#confirmDevPopup").popup("open",{positionTo:"window"}),$("#confirmDevPopup").css({height:parseInt($("body").height())+3-50+"px"}),$("#confirmDevPopup").parent().css({top:50,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+3-50+"px",overflow:"hidden",position:"fixed"}),$(".scrollTop").scrollTop(0),$("body").scrollTop(0),!0}function goCreateDeviation(a){console.log("goCreateDeviation"),confirm_action=!0,createDeviation=!0,universal_cango=!1,nextSlide=!0,continueHaccp(a)}function goNext(a){console.log("goNext"),universal_cango=!1,nextSlide=!0,createDeviation=!1,$("input[name='critical_point']").val(""),$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),continueHaccp(a)}function goNextWithCriticalControl(a,b){console.log("goNextWithCriticalControl"),universal_cango=!1,nextSlide=!0,createDeviation=!1,$("input[name='critical_point']").val(b),continueHaccp(a)}function deviationTreeBackStep(){if(console.log("deviationTreeBackStep deviationAnswers: ",deviationAnswers),$("input[name='critical_point']").val(""),isEmpty(deviationAnswers))$("#deviation_no").siblings("label").data("icon","radio-off").removeClass("ui-radio-on").addClass("ui-radio-off"),$("#deviation_yes").siblings("label").data("icon","radio-on").removeClass("ui-radio-off").addClass("ui-radio-on"),$("#deviation_yes").prop("checked",!0),mySwiper.swipePrev();else{var prevStepKeys=Object.keys(deviationAnswers),prevStep=prevStepKeys[prevStepKeys.length-1];prevAns=deviationAnswers[prevStep],console.log(prevStep,prevAns),deletedObject={},deletedObject.step=prevStep,deletedObject.answer=prevAns,deletedObjectArray.push(deletedObject);var prevStepFunc=eval("{"+prevStep+"}");openConfirmDialog(prevStepFunc.message,prevStepFunc.confirm,prevStepFunc.cancel,prevStep),1==prevAns?($("#deviation_no").siblings("label").data("icon","radio-off").removeClass("ui-radio-on").addClass("ui-radio-off"),$("#deviation_yes").siblings("label").data("icon","radio-on").removeClass("ui-radio-off").addClass("ui-radio-on"),$("#deviation_yes").prop("checked",!0)):($("#deviation_yes").siblings("label").data("icon","radio-off").removeClass("ui-radio-on").addClass("ui-radio-off"),$("#deviation_no").siblings("label").data("icon","radio-on").removeClass("ui-radio-off").addClass("ui-radio-on"),$("#deviation_no").prop("checked",!0)),delete deviationAnswers[prevStep]}}function setDeviationAnswer(a){console.log("setDeviationAnswer step: ",a),"step1"==a?$("#deviation_yes").is(":checked")?deviationAnswers.step1=1:deviationAnswers.step1=0:"step2"==a?$("#deviation_yes").is(":checked")?deviationAnswers.step2=1:deviationAnswers.step2=0:"step3"==a?$("#deviation_yes").is(":checked")?deviationAnswers.step3=1:deviationAnswers.step3=0:"step4"==a?$("#deviation_yes").is(":checked")?deviationAnswers.step4=1:deviationAnswers.step4=0:"step5"==a?$("#deviation_yes").is(":checked")?deviationAnswers.step5=1:deviationAnswers.step5=0:"step6"==a?$("#deviation_yes").is(":checked")?deviationAnswers.step6=1:deviationAnswers.step6=0:"step7"==a?$("#deviation_yes").is(":checked")?deviationAnswers.step7=1:deviationAnswers.step7=0:"step8"==a&&($("#deviation_yes").is(":checked")?deviationAnswers.step8=1:deviationAnswers.step8=0)}function deviationTreeNextStep(step){if(console.log("deviationTreeNextStep Array:"),console.log(deletedObjectArray),$("input[name='critical_point']").val(""),!isEmpty(deletedObjectArray)){var nextStepObject=deletedObjectArray[deletedObjectArray.length-1-1];if(void 0==nextStepObject&&1==deletedObjectArray.length)return void(deletedObjectArray=[]);var nextStepName=nextStepObject.step;nextStepName==step&&console.log("== nextStepObject:",nextStepObject);var nextStepFunc=eval("{"+nextStepName+"}"),nextAns=nextStepObject.answer;setDeviationAnswer(step),openConfirmDialog(nextStepFunc.message,nextStepFunc.confirm,nextStepFunc.cancel,nextStepName),1==nextAns?($("#deviation_no").siblings("label").data("icon","radio-off").removeClass("ui-radio-on").addClass("ui-radio-off"),$("#deviation_yes").siblings("label").data("icon","radio-on").removeClass("ui-radio-off").addClass("ui-radio-on"),$("#deviation_yes").prop("checked",!0)):($("#deviation_yes").siblings("label").data("icon","radio-off").removeClass("ui-radio-on").addClass("ui-radio-off"),$("#deviation_no").siblings("label").data("icon","radio-on").removeClass("ui-radio-off").addClass("ui-radio-on"),$("#deviation_no").prop("checked",!0)),deletedObjectArray.pop()}}var _t,get={},fq=[],fqi=-1,f_i=2,candelete=!1,universal_cango=!1,he_have_something=!1,_h_content=800,last_id=0,mySwiper,zh_h,signature_open=!1,offline_signature,activeQuestion=0,confirm_action=!1,nextSlide=!0,priviousSlide=!1,createDeviation=!1,deviationAnswers={},onNextClick=!1,haccp_total=0,isStart=!0,lazy_total=3,isValid=!1,oneClickDone,deletedObject={},deletedObjectArray=[],prevAns,resetToDefault,step1,step2,step3,step4,step5,step6,step7,step8;step8={message:"Gjennomfør etterfølgende trinn for å fjerne eller redusere faren til akseptabelt nivå.",confirm:function(){deviationAnswers.step8=1,goNextWithCriticalControl(mySwiper,step8.message)},cancel:function(){deviationAnswers.step8=0,goNext(mySwiper)}},step7={message:"Vil etterfølgende trinn fjerne eller redusere faren til akseptabelt nivå?",confirm:function(){deviationAnswers.step7=1,goNext(mySwiper)},cancel:function(){deviationAnswers.step7=0,openConfirmDialog(step8.message,step8.confirm,step8.cancel,8)}},step6={message:"Kan forurensing øke til uakseptabelt nivå?",confirm:function(){deviationAnswers.step6=1,openConfirmDialog(step7.message,step7.confirm,step7.cancel,7)},cancel:function(){deviationAnswers.step6=0,goNext(mySwiper)}},step5={message:"Fjern eller reduser faren til et akseptabelt nivå.",confirm:function(){deviationAnswers.step5=1,goNextWithCriticalControl(mySwiper,step5.message)},cancel:function(){deviationAnswers.step5=0,goNext(mySwiper)}},step4={message:"Er hensikten med dette trinnet å fjerne eller redusere faren til et akseptabelt nivå?",confirm:function(){deviationAnswers.step4=1,openConfirmDialog(step5.message,step5.confirm,step5.cancel,5)},cancel:function(){deviationAnswers.step4=0,openConfirmDialog(step6.message,step6.confirm,step6.cancel,6)}},step3={message:"Modifiser trinn, prosess eller produkt.",confirm:function(){deviationAnswers.step3=1,goNextWithCriticalControl(mySwiper,step3.message)},cancel:function(){deviationAnswers.step3=0,goNext(mySwiper)}},step2={message:"Er styring på dette trinnet nødvendig for sikkerheten?",confirm:function(){deviationAnswers.step2=1,openConfirmDialog(step3.message,step3.confirm,step3.cancel,3)},cancel:function(){deviationAnswers.step2=0,goNext(mySwiper)}},step1={message:"Finnes det forebyggende kontroll eller styringstiltak for den påviste faren?",confirm:function(){deviationAnswers.step1=1,openConfirmDialog(step4.message,step4.confirm,step4.cancel,4)},cancel:function(){deviationAnswers.step1=0,openConfirmDialog(step2.message,step2.confirm,step2.cancel,2)}},$(window).on("orientationchange",function(a){console.log("orientationchange"),"undefined"!=typeof $sigdiv&&$sigdiv.jSignature("reset"),$("#confirmDevPopup").parent().css({top:"0 !important",left:"0 !important","max-width":"100% !important",width:"100%  !important",height:parseInt($("body").height())+3+"px  !important",overflow:"hidden",position:"fixed"}),"landscape"==a.orientation?($("#signature-status-message").hide(),$("#confirmDevPopup .ui-content").css("margin-top","15%")):($("#signature-status-message").show(),$("#confirmDevPopup .ui-content").css("margin-top","50%")),mySwiper.resizeFix()});