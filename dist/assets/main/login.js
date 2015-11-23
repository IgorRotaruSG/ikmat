var loginFormId = null;
function loginInit() {
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
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
    var data = {
        'email': $('#input_email').val(),
        'password': $('#input_password').val(),
        'deviceid': window.device ? device.uuid : "web-id",
        'devicetoken': window.device ? device.devicetoken : ""
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
