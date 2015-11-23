function forgotInit() {

}

function recoverAction() {
    var val = $('#input_email').val();

    if (validateEmail(val)) {
        var data = {
            'data': val
        };

        //$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
        Page.apiCall('forgetPassword', data, 'post', 'forgetPasswordSave');
    } else {
        //alert($.t('error.validation_email'));
        $('#alertPopup .page-name').html($.t('login.text.forgot2'));
        $('#alertPopup .alert-text').html($.t('error.validation_email'));
        $('#alertPopup').popup( "open", {positionTo: 'window'});
    }
}

function forgetPasswordSave(data) {
    if (data.exists) {
        $('#alertPopup .alert-text').html($.t("success.password_recover_email"));
        $('#alertPopup').off("popupafterclose").on("popupafterclose",function(){
            window.location.href = 'index.html';
        });
        $('#alertPopup').popup( "open", {positionTo: 'window'});
    } else {
        $('#alertPopup .alert-text').html($.t("error.no_email_found"));
        $('#alertPopup').off("popupafterclose").on("popupafterclose",function(){
            $('.overflow-wrapper').addClass('overflow-wrapper-hide')
        });
        $('#alertPopup').popup( "open", {positionTo: 'window'});
    }
}