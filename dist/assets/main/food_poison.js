function food_poisonInit(){get=Page.get();var a={client:User.client,token:User.lastToken};void 0!=get.id&&(a.task_id=get.id),Page.apiCall("foodPoison",a,"get","foodPoison"),$("#food_content").height(document.body.clientHeight-100)}function foodPoison(a){if(console.info(a),a.form_fix_deviation){var b="<h3>"+$.t("tasks.poison_fix")+"</h3>",c=a.form_fix_deviation;for(var d in c)c.hasOwnProperty(d)&&"form"!=d&&null!=c[d]&&(b+='<fieldset data-role="controlgroup">'+d+": "+c[d].replace(/\+/g," ")+"</fieldset>");b+="<hr />",b+=HTML.formGenerate(a.form_fix_deviation.form,$.t("general.save_button")),b+='<div data-role="popup" data-history="false" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15"><div id="signature-holder"><div id="signature" data-role="none"></div></div><button id="deviation-signature-close">'+$.t("general.sign_button")+"</button></div></div>",$("#form_food_poison").html(b).off("submit").on("submit",function(a){a.preventDefault();var b=Form.validate($(this));if(b){$(".overflow-wrapper").removeClass("overflow-wrapper-hide");var c=Form.getValues($(this)),d={client:User.client,token:User.lastToken,task_id:get.id,results:JSON.stringify(c)};db.lazyQuery({sql:'UPDATE "tasks" SET "completed"=? WHERE "id"=?',data:[["1",get.id]]},0),Page.apiCall("foodPoison",d,"get","maintenanceDone")}return!1}),$("#signature-trigger").off("click").on("click",function(a){return a.preventDefault(),openSignaturePopup(),$(document).off("click","#deviation-signature-close").on("click","#deviation-signature-close",function(){$("#signature_pop").popup("close");var a={client:User.client,token:User.lastToken,signature:JSON.stringify({name:$("#sign_name").val(),svg:$sigdiv.jSignature("getData","svgbase64")[1],parameter:"task",task_id:get.id})};Page.apiCall("documentSignature",a,"get","documentSignature")}),!1}),$("#"+$.mobile.activePage.attr("id")).trigger("create"),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#form_back_btn i").removeClass("hided")}else alert("incomplete")}function documentSignature(a){$("#sign_name").attr("disabled",!0),$("#signature-trigger").attr("disabled",!0),$("#signature-trigger").val(a.current_time.date).button("refresh")}function maintenanceDone(a){Page.redirect("tasks.html")}var get;$(document).on("click","#form_back_btn",function(a){a.preventDefault(),$("[href='tasks.html']").click()}),$(window).on("orientationchange",function(a){$sigdiv.jSignature("reset"),$(".ui-popup-container").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px",overflow:"hidden",position:"fixed"}),setTimeout(function(){$("#signature_pop-popup").css({top:0,left:0,"max-width":"100%",width:"100%",height:parseInt($("body").height())+"px"})},500)});