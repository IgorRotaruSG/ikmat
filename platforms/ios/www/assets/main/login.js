function loginInit(){return $(".overflow-wrapper").addClass("overflow-wrapper-hide"),localStorage.getItem("user_email")&&$("#input_email").val(localStorage.getItem("user_email")),isOffline()?(setTimeout(function(){noInternetError($.t("error.internet_connection_needed"),!0)},1500),!1):void 0}function loginAction(){if(isOffline())return setTimeout(function(){noInternetError($.t("error.internet_connection_needed"),!0)},1500),!1;console.info("s"),$(".overflow-wrapper").removeClass("overflow-wrapper-hide"),email=$("#input_email").val();var a={email:email,password:$("#input_password").val(),deviceid:window.device?window.device.uuid:"web-id",devicetoken:window.deviceToken?window.deviceToken:""};return Page.apiCall("getAccess",a,"post","getAccess"),!1}function getAccess(a){if(a.success){var b=new SyncMaster(a);return localStorage.setItem("user_email",email),b.getAll(),!1}$(".overflow-wrapper").addClass("overflow-wrapper-hide"),$("#alertPopup .alert-text").html(a.error),$("#alertPopup").popup("open",{positionTo:"window"})}function user_login_now(){User.login(document._login_client,document._login_token)}var loginFormId=null,email="";