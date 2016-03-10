function getFlowchartCall(a,b){if(isOffline())$("#alertPopup .alert-text").html($.t("error.no_internet_for_sync")),$("#alertPopup").on("popupafterclose",function(){$("#alertPopup").unbind("popupafterclose"),window.location.href="index.html"}),$("#alertPopup").popup("open",{positionTo:"window"}),$("#no_results_flowchart").text($.t("forms.no_forms_connection")),$(".overflow-wrapper").addClass("overflow-wrapper-hide");else{var c={client:User.client,token:User.lastToken};Page.apiCall("flowchart",c,"get","showFlowchart")}mySwiper.reInit(),mySwiper.resizeFix()}function getFlowcharts(){db.getDbInstance("flowchart").allDocs({include_docs:!0},getFlowchartCall)}function flowchartInit(){User.isLogged()?(executeSyncQuery(),getFlowcharts(),mySwiper=new Swiper(".swiper-container-flowchart",{calculateHeight:!0,releaseFormElements:!0,preventLinks:!0,simulateTouch:!0,keyboardControl:!1,noSwiping:!0,noSwipingClass:"ui-slider",onInit:function(){setSwiperMinHeight()},onSlideNext:function(a){},onSlidePrev:function(a){},onSlideChangeEnd:function(a){}})):Page.redirect("login.html")}function showFlowchart(a){if(a.success){var b="";if(a.flowcharts.length>0){for(var c in a.flowcharts)if(a.flowcharts.hasOwnProperty(c)){var d=settings.apiPath+a.flowcharts[c].path+"originals/"+a.flowcharts[c].name,e=settings.apiPath+a.flowcharts[c].path+"originals/"+a.flowcharts[c].name;b+='<div class="image_element"><a href="'+e+'" class="swipebox" title="'+a.flowcharts[c].description+'" data-id="'+a.flowcharts[c].id+'" ><img src="'+d+'" alt="image" /></a></div>'}b+='<div class="clearfix"></div>',$("#no_results_flowchart").hide(),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#flowchart_list").html(b),$(".swipebox").swipebox({useCSS:!0,useSVG:!0,initialIndexOnArray:0,hideCloseButtonOnMobile:!0,hideBarsDelay:17e3,videoMaxWidth:1140,beforeOpen:function(){},afterOpen:function(){},afterClose:function(){},loopAtEnd:!0}),$('a[data-id="'+a.flowcharts[0].id+'"]').trigger("click")}else $("#no_results_flowchart").text($.t("error.no_data")),$("#no_results_flowchart").show(),$(".overflow-wrapper").addClass("overflow-wrapper-hide");$("#"+$.mobile.activePage.attr("id")).trigger("create"),$("#reset-flowchart").off("click").on("click",function(){var a={client:User.client,token:User.lastToken};Page.apiCall("resetFlowchart",a,"get","resetFlowchart")}),isNative()?($(".fa-file-pdf-o").addClass("fa-envelope-o"),$(".fa-envelope-o").removeClass("fa-file-pdf-o")):($(".fa-envelope-o").addClass("fa-file-pdf-o"),$(".fa-file-pdf-o").removeClass("fa-envelope-o"))}}function deleteFlowchart(a){confirm_action=!1,$("#confirmPopup .alert-text").html($.t("general.flowchart_delete")),$("#confirmPopup").off("popupafteropen").on("popupafteropen",function(a,b){$("#confirmButton").off("click").on("click",function(){confirm_action=!0,$("#confirmPopup").popup("close")})}),$("#confirmPopup").off("popupafterclose").on("popupafterclose",function(b,c){if($("#confirmButton").unbind("click"),confirm_action){if(!isOffline()){var d={client:User.client,token:User.lastToken,flowchart_id:a};Page.apiCall("removeFlowchart",d,"get","removeFlowchart")}}else console.log("du nathing")}),$("#confirmPopup").popup("open",{positionTo:"window"})}function printFlowchart(a,b){if(isNative()&&cordova.plugins&&cordova.plugins.email){var c=encodeURI(a);cordova.plugins.printer.print(c,{name:"Document.html",landscape:!1},function(){})}else{w=window.open();var d='<style>.image_element {width: 96%;height: 96%;text-align: left;line-height: normal;display: block;margin: 0 1px 1px 0;float: left;}.image_element a {display: block;height: 100%;width: 100%;padding-left: 20px}.image_element a img {max-width:100% !important;max-height:100%!important;display:block;}</style><div class="image_element"><strong>'+b+'</trong><br><a class="ui-link"><img src="'+a+'" /></a></div>';w.document.write(d),w.print(),w.close()}}function emailFlowchart(a){console.log("flowchartId",$("#flowchart_list").find("a[data-id="+a+"]"));var b=$("#flowchart_list").find("a[data-id="+a+"]");$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c={client:User.client,token:User.lastToken,report_id:15,flowchart_id:a,flowchart_name:$(b).attr("title")};isNative()?Page.apiCall("exportBase64ReportPdf",c,"get","openNativeEmail",c):Page.apiCall("exportReportPdfForDownload",c,"get","downloadPdf",c)}function openNativeEmail(a,b){var c="Flytskjema "+b.flowchart_name;c+=localStorage.getItem("company_name")?" av "+localStorage.getItem("company_name"):"";var d={subject:c,cc:localStorage.getItem("user_email")?localStorage.getItem("user_email"):""};a&&(d.attachments="base64:"+a.name+"//"+a.data),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),isNative()&&cordova.plugins&&cordova.plugins.email&&cordova.plugins.email.isAvailable(function(a){cordova.plugins.email.open(d)})}function downloadPdf(a,b){a.data&&window.open(a.data,"_blank"),$(".overflow-wrapper").addClass("overflow-wrapper-hide")}function removeFlowchart(a){a.success&&"true"==a.success&&a.flowchart_id&&($("#swipebox-close").trigger("click"),$('a[data-id="'+a.flowchart_id+'"]').parent().remove(),0==$("#flowchart_list .image_element").length&&($("#no_results_flowchart").text($.t("error.no_data")),$("#no_results_flowchart").show(),$(".overflow-wrapper").addClass("overflow-wrapper-hide")))}function resetFlowchart(a){a.success&&1==a.success&&getFlowcharts()}function sendEmailFlowchart(a){$("#confirm-send").removeAttr("disabled"),$("#confirm-send").parent().find(".ui-btn-text").html($.t("general.send")),$("#popup-send-email-flowchart").popup("close"),$(".swiper-slide-active").scrollTop(0)}var mySwiper,_h_content=0,_t;$(window).on("orientationchange",function(a){$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),setTimeout(function(){$("#signature_pop-popup").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px"})},500)});