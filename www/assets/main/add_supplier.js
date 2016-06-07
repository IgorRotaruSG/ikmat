function add_supplierInit() {
//    if (navigator.connection.type == Connection.NONE) {
    if (!isOffline() ) {
        $('#add_supplier_container_error').text($.t('error.supplier_internet_connect_error'));
    }
    else {
        $('#add_supplier_container_error').hide();
        var data = {
            'client': User.client,
            'token': User.lastToken
        };

        Page.apiCall('registerSupplier', data, 'get', 'registerSupplier');
    }
}

function registerSupplier(data) {
    if (data.success) {
        var html = '';
        html = '<form id="registerSupplierForm">';
        html += HTML.formGenerate(data.form_register_supplier, $.t('nav.add_supplier'));
        html += '<input type="hidden" name="edit" value="false">';
        html += '</form';
        $('#add_supplier_container').html(html);
        $('#' + $.mobile.activePage.attr('id')).trigger('create');

        $('.overflow-wrapper').addClass('overflow-wrapper-hide');

        $('#registerSupplierForm').submit(function(e){
            e.preventDefault();

            var cango = HTML.validate($(this));

            if (cango) {
                var v = HTML.getFormValues($(this).parent());

                var data = {
                    'client': User.client,
                    'token': User.lastToken,
                    'parameters': JSON.stringify(v)
                };

                /*console.log(JSON.stringify(data));*/

                $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
                Page.apiCall('registerSupplier', data, 'get', 'registerSupplierSuccess');
            }

            return false;
        });
    }
}

function registerSupplierSuccess(data) {
    console.log(data);
    if (data.registration_steps != undefined && data.registration_steps.error != undefined) {
        //alert($.t('error.duplicate_employee'));
        //$('.overflow-wrapper').addClass('overflow-wrapper-hide');
        $('#alertPopup .alert-text').html($.t("error.duplicate_employee"));
        $('#alertPopup').off("popupafterclose").on("popupafterclose",function(){
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
        });
        $('#alertPopup').popup( "open", {positionTo: 'window'});

    } else {
        //alert($.t('success.added_supplier'));
        //$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
        //add_supplierInit();
        $('#alertPopup .alert-text').html($.t("error.duplicate_employee"));
        $('#alertPopup').off("popupafterclose").on("popupafterclose",function(){
            $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
            add_supplierInit();
        });
        $('#alertPopup').popup( "open", {positionTo: 'window'});
    }
}