function add_employeeInit() {
//    if (navigator.connection.type == Connection.NONE) {
    if (!isOffline() ) {
//        $('#add_employee_container_error').text('No form to show. Please connect to internet to sync.');
        $('#add_employee_container_error').text($.t('error.employee_internet_connect_error'));
    }
    else {
        $('#add_employee_container_error').hide();
        var data = {
            'client': User.client,
            'token': User.lastToken
        };

        Page.apiCall('registerEmployee', data, 'get', 'registerEmployee');
    }
}

function registerEmployee(data) {
    if (data.success) {
        var html = '';

        html = '<form id="registerEmployeeForm">';
        html += HTML.formGenerate(data.form_register_employee, $.t('nav.add_employee'));
        html += '<input type="hidden" name="edit" value="false">';
        html += '</form';

        $('#add_employee_container').html(html);
        $('#' + $.mobile.activePage.attr('id')).trigger('create');

        $('.overflow-wrapper').addClass('overflow-wrapper-hide');

        $('#registerEmployeeForm').submit(function(e){
            e.preventDefault();

            var cango = HTML.validate($(this));

            if (cango) {
                var v = HTML.getFormValues($(this).parent());

                var data = {
                    'client': User.client,
                    'token': User.lastToken,
                    'data': JSON.stringify(v)
                };

                /*console.log(JSON.stringify(data));*/

                $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
                $('#form_back_btn i').addClass('hided');
                Page.apiCall('registerEmployee', data, 'get', 'registerEmployeeSucess');
            }

            return false;
        });
    }
}

function registerEmployeeSucess(data) {
    if (data.registration_steps != undefined && data.registration_steps.error != undefined) {
        //alert($.t('error.duplicate_employee'));
        //$('.overflow-wrapper').addClass('overflow-wrapper-hide');
        $('#alertPopup .alert-text').html($.t("error.duplicate_employee"));
        $('#alertPopup').off("popupafterclose").on("popupafterclose",function(){
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
        });
        $('#alertPopup').popup( "open", {positionTo: 'window'});
    } else {
        //alert($.t('success.added_employee'));
        //$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
        //add_employeeInit();
        $('#alertPopup .alert-text').html($.t("error.duplicate_employee"));
        $('#alertPopup').off("popupafterclose").on("popupafterclose",function(){
            $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
            add_employeeInit();
        });
    }
}