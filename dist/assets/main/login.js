var loginFormId = null;
var email = "";
function loginInit() {
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
    if(localStorage.getItem("user_email")){
    	$('#input_email').val(localStorage.getItem("user_email"));
    }
    if (isOffline()) {
        setTimeout(function () {
            noInternetError($.t("error.internet_connection_needed"), true);
        },1500);
        return false;
    }
}

function loginAction(){
    if (isOffline()) {
        setTimeout(function () {
            noInternetError($.t("error.internet_connection_needed"), true);
        },1500);
        return false;
    }
    console.info('s');
    $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
    email = $('#input_email').val();
    var data = {
        'email': email,
        'password': $('#input_password').val(),
        'deviceid': window.device ? window.device.uuid : "web-id",
        'devicetoken': window.deviceToken ? window.deviceToken : ""
        // TODO: uncommend the below line and comment the above line
        //'deviceid': device.uuid
    };

    Page.apiCall('getAccess', data, 'post', 'getAccess');

    return false;
}

function getAccess(data) {
    if (data.success) {
        // make all sync here
        var sm = new SyncMaster(data);
        localStorage.setItem("user_email", email);
        sm.getAll();
        return false;
    } else {
        $('.overflow-wrapper').addClass('overflow-wrapper-hide');
        $('#alertPopup .alert-text').html(data.error);
        $('#alertPopup').popup( "open", {positionTo: 'window'});

    }
}

function user_login_now() {
    User.login(document._login_client, document._login_token);
}
