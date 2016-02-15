function reportsGetCurrentDate(){var a=new Date,b=new Date,c=new Date(b.getFullYear(),b.getMonth()+1,0);return a.getFullYear()+"-"+(a.getMonth()+1).toString().replace(/\d{0,2}/,function(a){return"0".slice(a.length-1)+a})+"-"+c.getDate().toString().replace(/\d{0,2}/,function(a){return"0".slice(a.length-1)+a})}function bindExtraSelectors(){$("#reports-select-yearly-year").off("change").on("change",function(){var a=$(this).val();reports_date_start=a+"-01-01",reports_date_end=a+"-12-31"}),$("#reports-select-monthly-month").on("change",function(){var a=$(this).val(),b=new Date,c=a.toString().replace(/\d{0,2}/,function(a){return"0".slice(a.length-1)+a});reports_date_start=b.getFullYear()+"-"+c+"-01",reports_date_end=b.getFullYear()+"-"+c+"-"+new Date(b.getFullYear(),a,0).getDate()}),$("#report-select-date-from").off("change").on("change",function(){reports_date_start=$(this).val()}),$("#report-select-date-to").off("change").on("change",function(){reports_date_end=$(this).val()})}function getReportsCall(a,b){if(console.log("getReportsCall",b),0==b.rows.length&&isOffline())$("#raportList").parent().prepend('<div class="text-center">'+$.t("error.no_internet_for_sync")+"</div>"),$("#alertPopup .alert-text").html($.t("error.no_internet_for_sync")),$("#alertPopup").off("popupafterclose").on("popupafterclose",function(){Page.redirect("index.html")}),$("#alertPopup").popup("open",{positionTo:"window"});else if(isOffline()){if(b.rows.length>0){for(var c=[],d=0;d<b.rows.length;d++)c.push(b.rows[d].doc);showOfflineReports(c),mySwiper.reInit()}}else{var e={client:User.client,token:User.lastToken};Page.apiCall("reportTables",e,"get","reportTables"),mySwiper.reInit()}}function getReports(){db.getDbInstance("reports").allDocs({include_docs:!0},getReportsCall)}function reportsInit(){displayDocumnetList(!1);var a=$(".resp_table");$("#table04").length||$("#table08").length||$("#table09").length?console.log("aaaa"):$("#table07").length?a.find("tr").each(function(){var b=$(this);b.find("td").each(function(){var b=$(this),c=b.index(),d=a.find("thead  tr:eq(1) th:eq("+c+")").html();0==c?d=a.find("thead  tr:eq(0) th:eq("+c+")").html():1==c||2==c?d=a.find("thead  tr:eq(0) th:eq(1)").html()+" / "+a.find("thead  tr:eq(1) th:eq("+(c-1)+")").html():3==c||4==c?d=a.find("thead  tr:eq(0) th:eq(2)").html()+" / "+a.find("thead  tr:eq(1) th:eq("+(c-1)+")").html():(5==c||6==c)&&(d=a.find("thead  tr:eq(0) th:eq(3)").html()+" / "+a.find("thead  tr:eq(1) th:eq("+(c-1)+")").html()),c>6&&(d=a.find("thead  tr:eq(0) th:eq("+(c-3)+")").html());var e="<span class='td_before'>"+d+"</span>";b.prepend(e)})}):a.find("tr").each(function(){var b=$(this);b.find("td").each(function(){var b=$(this),c=b.index(),d=a.find("thead  tr th:eq("+c+")").html(),e="<span class='td_before'>"+d+"</span>";b.prepend(e)})}),User.isLogged()?(executeSyncQuery(),getReports(),mySwiper=new Swiper(".swiper-container-reports",{calculateHeight:!0,releaseFormElements:!0,preventLinks:!1,simulateTouch:!1,onInit:function(){1==mySwiper.slides.length&&displayDocumnetList(!1),setSwiperMinHeight()},onSlideNext:function(a){displayDocumnetList(!1),_t="next"},onSlidePrev:function(a){displayDocumnetList(!1),_t="prev"},onSlideChangeEnd:function(a){$("html, body").animate({scrollTop:0},500),parseInt(a.activeIndex)==parseInt(a.previousIndex)&&a.previousIndex--,"prev"==_t&&a.removeSlide(parseInt(a.activeIndex)+1),"reports"==$.mobile.activePage.attr("id")&&(0==a.activeIndex?($("h1.ui-title").html("Rapporter"),$("div#global_footer").hide()):$("div#global_footer").show())}}),$("#reports-type-select").on("change",function(){var a=$(this).val(),b=new Date,c=null,d=null,e="";switch(a){case"crt_year":c=b.getFullYear()+"-01-01",d=reportsGetCurrentDate();break;case"crt_month":c=b.getFullYear()+"-"+(b.getMonth()+1).toString().replace(/\d{0,2}/,function(a){return"0".slice(a.length-1)+a})+"-01",d=reportsGetCurrentDate();break;case"yearly":e+='<select id="reports-select-yearly-year">';for(var f=b.getFullYear();f>=parseInt(company_year);f--)e+='<option value="'+f+'">'+f+"</option>";e+="</select>",c=b.getFullYear()+"-01-01",d=b.getFullYear()+"-12-31";break;case"monthly":var g={1:$.t("reports_filter.months.1"),2:$.t("reports_filter.months.2"),3:$.t("reports_filter.months.3"),4:$.t("reports_filter.months.4"),5:$.t("reports_filter.months.5"),6:$.t("reports_filter.months.6"),7:$.t("reports_filter.months.7"),8:$.t("reports_filter.months.8"),9:$.t("reports_filter.months.9"),10:$.t("reports_filter.months.10"),11:$.t("reports_filter.months.11"),12:$.t("reports_filter.months.12")};e+='<select id="reports-select-monthly-month" class="">';for(var f=b.getMonth();f>0;f--)e+='<option value="'+f+'">'+g[f]+"</option>";e+="</select>";var h=b.getMonth().toString().replace(/\d{0,2}/,function(a){return"0".slice(a.length-1)+a});c=b.getFullYear()+"-"+h+"-01",d=b.getFullYear()+"-"+h+"-"+new Date(b.getFullYear(),b.getMonth(),0).getDate();break;case"custom":e+='<label>From</label><input type="date" value="'+reportsGetCurrentDate()+'" id="report-select-date-from"/>',e+='<label>To</label><input type="date" value="'+reportsGetCurrentDate()+'" id="report-select-date-to"/>',c=reportsGetCurrentDate(),d=reportsGetCurrentDate()}$("#extra-reports-type-select").html(e).trigger("create"),bindExtraSelectors(),reports_date_start=c,reports_date_end=d,reports_type=a}),realignSlideHeight("max-height-reports")):Page.redirect("login.html")}function showOfflineReports(a){console.log("showOfflineReports");var b="";a.push({id:0,name:$.t("nav.documents")}),a.sort(function(a,b){return a=a.name,b=b.name,b>a?-1:a>b?1:0});for(var c in a)a.hasOwnProperty(c)&&(b+=0==a[c].id?'<li><a href="#" data-type="doc" class="report_generator_link" data-from="" data-to=""></i> '+a[c].name+"</a></li>":15==a[c].id?'<li><a href="#" data-type="'+a[c].id+'" class="report_generator_link" data-from="" data-to="">'+a[c].name+"</a></li>":'<li><a href="#" data-type="'+a[c].id+'" class="report_generator_link" data-from="'+reports_date_start+'" data-to="'+reports_date_end+'" >'+a[c].name+"</a></li>");$("#no_results_raports").hide(),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#raportList").html("").html(b).listview("refresh"),bind_form_click_handler_r()}function reportTables(a){if(console.log("reportTables",a),a.success){var b="",c=[],d=a.reports_list,e=[["doc",$.t("nav.documents")]];for(var f in d)"object"==typeof d[f]?e.push([f,d[f].alias]):e.push([f,d[f]]);e.sort(function(a,b){return a=a[1],b=b[1],b>a?-1:a>b?1:0});for(var g=0;g<e.length;g++){var f=e[g][0],h=e[g][1];"doc"==f?b+='<li><a href="#" data-type="'+f+'" class="report_generator_link">'+h+"</a></li>":(b+='<li><a href="#" data-type="'+f+'" class="report_generator_link" data-from="'+reports_date_start+'" data-to="'+reports_date_end+'" >'+h+"</a></li>",c.push([f,h]))}if(c.length>0){var i='INSERT OR REPLACE INTO "reports"("id","name") VALUES(?,?)';db.lazyQuery({sql:i,data:c},0)}$("#no_results_raports").hide(),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#raportList").html(b).listview("refresh"),$(".report_link").off("click").on("click",function(a){a.preventDefault(),Page.redirect($(this).attr("href")+"&from="+reports_date_start+"&to="+reports_date_end)}),bind_form_click_handler_r()}}function bind_form_click_handler_r(){$(".report_generator_link").off("click").on("click",function(a){var b=new Date;switch(current_month=getMonth(b.getMonth()+1),current_month_nr=b.getMonth()+1,reports_date_start=(new Date).getFullYear()+"-"+((new Date).getMonth()+1).toString().replace(/\d{0,2}/,function(a){return"0".slice(a.length-1)+a})+"-01",report_name=$(this).text(),$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),document.form_cat=$(this).data("type"),document.date_from=$(this).data("from"),document.date_to=$(this).data("to"),document.form_cat){case"doc":var c={client:User.client,token:User.lastToken,report_number:1e3};Page.apiCall("reports",c,"get","documentsCall");break;default:getReportsView()}})}function reportsView(a){if(!a)return $("#alertPopup .alert-text").html($.t("error.no_internet_for_sync")),$("#alertPopup").off("popupafterclose").on("popupafterclose",function(){$(".overflow-wrapper").addClass("overflow-wrapper-hide")}),void $("#alertPopup").popup("open",{positionTo:"window"});$(".overflow-wrapper").addClass("overflow-wrapper-hide");var b=new Date;void 0===current_month&&(current_month=getMonth(b.getMonth()+1),current_month_nr=b.getMonth()+1);var c=getMonths(),d=getYears(),e='<div class="report-date-selector-container"><div class="report-date-selector"><select name="month" data-icon="false" class="report-date-selector" id="report-month">'+c+'</select></div><div class="report-date-selector"><select name="year" data-icon="false" class="report-date-selector" id="report-year">'+d+'</select></div><div class="clearfix"></div></div>';e+=a.report_returned,mySwiper.appendSlide(e,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(1,300,!0),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("h1.ui-title").html("Rapporter"),$(".svgString").each(function(){if(""!=$(this).val()){var a=$(this).val(),b=new Image;b.src="data:image/svg+xml;base64,"+a,b.width="150",$(b).appendTo($(this).parent())}}),$(".report_4_link").off("click").on("click",function(a){a.preventDefault(),Page.redirect("reports_task.html?report="+get.id+"&task_id="+$(this).data("id"))}),$("#send_email").off("click").on("click",function(b){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c={client:User.client,token:User.lastToken,report_id:a.report_number,filter_date_from:reports_date_start,filter_date_to:reports_date_end};isLinkData(c.report_id)?Page.apiCall("exportReportPdfLink",c,"get","openNativeEmail",c):isNative()?Page.apiCall("exportBase64ReportPdf",c,"get","openNativeEmail",c):Page.apiCall("exportReportPdfLink",c,"get","openNativeEmail",c)}),$("#confirm-send").off("click").on("click",function(b,c){var d=HTML.validate($("#popup-send-email"));if(d){$("#confirm-send").attr("disabled",!0),$("#confirm-send").parent().find(".ui-btn-text").html($.t("general.loading")),$(".overflow-wrapper").addClass("overflow-wrapper-hide");var e={client:User.client,token:User.lastToken,report_id:a.report_number,email:$("#email").val(),filter_date_from:reports_date_start,filter_date_to:reports_date_end};Page.apiCall("send-report-by-email",e,"get","sendEmail")}}),$(".photopopup").on({popupbeforeposition:function(){var a=$(window).height()-60+"px";$(".photopopup img").css("max-height",a)}}),$("#current-year").off("click").on("click",function(a){$("#report-year-wrap").show()}),$("#current-month").off("click").on("click",function(a){$("#report-month-wrap").show()}),$("#report-year").off("click").on("click",function(a){$("#report-year").closest(".report-date-selector").on("click").on("click",function(){a.preventDefault();var b=new Date($("#report-year").val()),c=b.getFullYear()+"-01-01",d=b.getFullYear()+"-12-31";$("#current-year").html($(this).find("option:selected").html()),$("#current-year").parent().children("span.ui-btn-inner").html($(this).find("option:selected").html()),reports_date_start=c,reports_date_end=d,getNewReport(c,d)})}),$("#report-month").off("change").on("change",function(a){a.preventDefault();var b=new Date($("#report-year").val()),c=b.getFullYear()+"-"+$(this).val()+"-01",d=new Date(b.getFullYear(),$(this).val(),0),e=b.getFullYear()+"-"+$(this).val()+"-"+d.getDate();$("#current-month").html($(this).find("option:selected").html()),$("#current-month").parent().children("span.ui-btn-inner").html($(this).find("option:selected").html()),current_month=getMonth($(this).val()),current_month_nr=$(this).val();var f=$(this).val(),g=f.toString().replace(/\d{0,2}/,function(a){return"0".slice(a.length-1)+a});reports_date_start=b.getFullYear()+"-"+g+"-01",reports_date_end=b.getFullYear()+"-"+g+"-"+new Date(b.getFullYear(),f,0).getDate(),getNewReport(c,e)}),"12"==document.form_cat||"1"==document.form_cat||"3"==document.form_cat||"15"==document.form_cat?($(".report-date-selector-container").hide(),$(".semi-title-blue").css("margin-top","10px")):($(".report-date-selector-container").show(),$(".semi-title-blue").css("margin-top","0px")),realignSlideHeight("max-height-reports")}function isLinkData(a){return 15==a?!0:!1}function openNativeEmail(a,b){var c=report_name?report_name:"Rapporter";c+=localStorage.getItem("company_name")?" fra "+localStorage.getItem("company_name"):"";var d={subject:c,cc:localStorage.getItem("user_email")?localStorage.getItem("user_email"):""};if(a&&!isLinkData(b.report_id)?d.attachments="base64:"+report_name+"_"+reports_date_start+"_"+reports_date_end+".pdf//"+a.data:isNative()?(d.isHtml=!0,d.body='<div>Trykk på lenken nedenfor for å se rapporter: <a href="'+encodeURI(a.data)+'">'+a.data+"</a></div>"):d.body="Trykk på lenken nedenfor for å se rapporter: "+a.data,$(".overflow-wrapper").addClass("overflow-wrapper-hide"),isNative()&&cordova.plugins&&cordova.plugins.email)cordova.plugins.email.isAvailable(function(a){cordova.plugins.email.open(d)});else{var e="mailto:?subject="+d.subject;d.cc&&(e+="&cc="+d.cc),d.body&&(e+="&body="+d.body),location.href=e}}function getReportsView(){var a={};if(null==a.html){var b={client:User.client,token:User.lastToken,report_number:document.form_cat,filter_date_from:document.date_from,filter_date_to:document.date_to};Page.apiCall("reportTables",b,"get","reportsView")}else reportsView(b)}function displayDocumnetList(a){a?$("#document-anchors").removeClass("hidden"):$("#document-anchors").addClass("hidden")}function documentsCall(a){if(a.success){var b={signature:{type:"signature",label:"Sign this document"}};displayDocumnetList(!0),$("h1.ui-title").html("Selskapsdokument");var c="";$(a.html).find("h2.heading").each(function(a,b){c+='<dt><a data-rel="close" class="anchor-item" data-transition="slide" href="'+a+'" class="email_flowcharts">'+(a+1)+". "+b.innerText+"</a></dt>"}),$("#doc-list-contents").html("").html(c),$("#document-list .ui-panel-inner").css({"overflow-y":"scroll",height:$(window).height()});var d="";d+=decodeURIComponent(a.html),d+='<form id="documentsForm">',d+=HTML.formGenerate(b,$.t("general.submit_button")),d+="</form>",d+='<div data-role="popup" data-history="false" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.sign_button")+"</button></div>",mySwiper.appendSlide(d,"swiper-slide"),$("#"+$.mobile.activePage.attr("id")).trigger("create"),mySwiper.swipeTo(1,300,!0),$("#documents_container").html(d),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#documentsForm").submit(function(a){a.preventDefault();var b={client:User.client,token:User.lastToken,choose:'{"signed":true}'};return Page.apiCall("reports",b,"get","reportsSigned"),!1}),$(".anchor-item").off("click").on("click",function(){return $("#document-list").panel("close"),$("#max-height-reports").animate({scrollTop:$("#max-height-reports h2.heading").eq(parseInt($(this).attr("href"))).position().top}),!1}),$("#signature-trigger").off("click").on("click",function(a){return a.preventDefault(),openSignaturePopup(),$("#deviation-signature-close").off("click").on("click",function(){$("#signature_pop").popup("close");var a={client:User.client,token:User.lastToken,signature:JSON.stringify({name:$("#sign_name").val(),svg:$sigdiv.jSignature("getData","svgbase64")[1],parameter:"document"})};Page.apiCall("documentSignature",a,"get","documentSignature")}),!1}),$("#send_email").off("click").on("click",function(b){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c={client:User.client,token:User.lastToken,report_id:a.report_number,filter_date_from:reports_date_start,filter_date_to:reports_date_end};isNative()?isLinkData(c.report_id)?Page.apiCall("exportReportPdfLink",c,"get","openNativeEmail",c):Page.apiCall("exportBase64ReportPdf",c,"get","openNativeEmail",c):Page.apiCall("exportReportPdfLink",c,"get","openNativeEmail",c)})}}function reportsSigned(a){$("html, body").animate({scrollTop:0},500)}function documentSignature(a){$("#sign_name").attr("disabled",!0),$("#signature-trigger").attr("disabled",!0),$("#signature-trigger").val(a.current_time.date).button("refresh")}function sendEmail(a){$("#confirm-send").removeAttr("disabled"),$("#confirm-send").parent().find(".ui-btn-text").html($.t("general.send")),reports_date_start=(new Date).getFullYear()+"-"+((new Date).getMonth()+1).toString().replace(/\d{0,2}/,function(a){return"0".slice(a.length-1)+a})+"-01",reports_date_end=reportsGetCurrentDate(),$("#popup-send-email").popup("close"),$(".swiper-slide-active").scrollTop(0),$(".semi-title-blue").parent().find("p").append('<div class="report_email_sent">'+$.t("general.email_sent")+"</div>")}function getMonths(){var a="";a+="";for(var b=12;b>0;b--)a+='<option value="'+b+'" '+(current_month_nr==b?"selected":"")+">"+months[b]+"</option>";return a}function getMonth(a){var b=months[a];return b}function getWeeks(){var a=new Date,b="";b+="";for(var c=a.get;c>0;c--)b+='<option value="'+c+'">'+c+"</option>";return b}function getYears(){for(var a=new Date,b="",c=a.getFullYear()+1,d=new Date(reports_date_start),e=c;e>=parseInt(company_year);e--)b+='<option value="'+e+'" '+(e==d.getFullYear()?"selected":"")+">"+e+"</option>";return b}function getNewReport(a,b){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c={client:User.client,token:User.lastToken,report_number:document.form_cat,filter_date_from:a,filter_date_to:b};Page.apiCall("reportTables",c,"get","reportsView"),mySwiper.removeSlide(1)}var add=[],reports_type=null,company_year=(new Date).getFullYear(),get,mySwiper,$sigdiv,current_month,current_month_nr,report_name;localStorage.getItem("company_join_date")&&(company_year=localStorage.getItem("company_join_date").split("-")[0]);var reports_date_start=(new Date).getFullYear()+"-"+((new Date).getMonth()+1).toString().replace(/\d{0,2}/,function(a){return"0".slice(a.length-1)+a})+"-01",reports_date_end=reportsGetCurrentDate(),months={1:$.t("reports_filter.months.1"),2:$.t("reports_filter.months.2"),3:$.t("reports_filter.months.3"),4:$.t("reports_filter.months.4"),5:$.t("reports_filter.months.5"),6:$.t("reports_filter.months.6"),7:$.t("reports_filter.months.7"),8:$.t("reports_filter.months.8"),9:$.t("reports_filter.months.9"),10:$.t("reports_filter.months.10"),11:$.t("reports_filter.months.11"),12:$.t("reports_filter.months.12")};