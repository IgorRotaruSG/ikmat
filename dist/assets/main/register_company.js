function register_companyInit(){load_done=!0,last_data_json={},data={step:1},Page.apiCall("newCompanyRegistration",data,"post","newCompanyRegistration"),bindSlides();var a=$.t("tos.text");$("#tos_back_button").html($.t("tos.back")),$("#tos_back_button").siblings(".ui-btn-inner").find("span.ui-btn-text").html($.t("tos.back")),$("#tos_container").html(a),$("#"+$.mobile.activePage.attr("id")).trigger("create")}function newCompanyRegistration(a){if(a.success)if(void 0!=a.registration_steps.error&&a.registration_steps.error)noInternetError($.t("error.unexpected"));else{$(".overflow-wrapper").addClass("overflow-wrapper-hide");var b='<form id="register_form_submit">';for(var c in a.registration_steps)a.registration_steps.hasOwnProperty(c)&&(b+=HTML.formGenerate(a.registration_steps[c],$.t("register.submit_button")),b+=HTML.inputHidden("update","false"));b+="<form>",$("#registration_container").html(b),$("#"+$.mobile.activePage.attr("id")).trigger("create"),bindSlides(),$(".ui-checkbox").find("label").removeAttr("for"),$(".ui-checkbox").find("span.ui-btn-text").off("mouseover").on("mouseover",function(){$(this).css("text-decoration","underline")}),$(".ui-checkbox").find("span.ui-btn-text").off("mouseout").on("mouseout",function(){$(this).css("text-decoration","none")}),$("#register_form_submit").submit(function(a){a.preventDefault();var b=HTML.validate($(this).parent());if(b){var c=HTML.getFormValues($(this).parent()),d={step:1,parameters:JSON.stringify(c)};$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),isOffline()?noInternetError($.t("error.internet_connection_needed"),!0):Page.apiCall("newCompanyRegistration",d,"post","register_submit")}return!1})}}function register_submit(a){if(console.log(a),$(".overflow-wrapper").addClass("overflow-wrapper-hide"),void 0!=a.email_error)$el=$('input[name="email"]'),$('<label id="'+$el.attr("id")+'_validate" class="validate_error">'+$.t("register.duplicate_email_error")+"</label>").insertAfter($el.parent());else if(void 0!=a.success){var b='<div class="no_results" style="color:#00cde7;">';b+=$.t("register.success_message")+"<br /><br />",b+='<button type="submit" data-theme="e" onclick="window.location.href = \'index.html\';">'+$.t("login.input.button")+"</button>",b+="</div>",$("#registration_container").html(b),$("#"+$.mobile.activePage.attr("id")).trigger("create")}}function bindSlides(){$("#tos").off("click").on("click",function(a){a.preventDefault(),$("#registration_container").slideUp(function(){$("#tos_page").slideDown()})}),$("#tos_back_button").off("click").on("click",function(a){console.log("$('#tos_back_button"),$("#tos_page").slideUp(function(){$("#registration_container").slideDown()})})}var mySwiper=!1;