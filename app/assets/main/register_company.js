var mySwiper = false;

function register_companyInit() {
    load_done = true;
    last_data_json = {};

    data = {
        'step': 1
    };

    Page.apiCall('newCompanyRegistration', data, 'post', 'newCompanyRegistration');
    bindSlides();

    var html = $.t('tos.text');
    //html += '<button data-theme="d" onclick="Page.redirect(\'register_company.html\')">' + $.t('tos.back') + '</button>';
    $('#tos_back_button').html($.t('tos.back'));
    $('#tos_back_button').siblings('.ui-btn-inner').find('span.ui-btn-text').html($.t('tos.back'));
    $('#tos_container').html(html);
    $('#' + $.mobile.activePage.attr('id')).trigger('create');
}

function newCompanyRegistration(data) {

    if (data.success) {

        if (data.registration_steps.error != undefined && data.registration_steps.error) {
            noInternetError($.t("error.unexpected"));
        } else {
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');

            var html = '<form id="register_form_submit">';
            for (var i in data.registration_steps) {
                if ((data.registration_steps).hasOwnProperty(i)) {
                    //console.log(data.registration_steps[i]);
                    html += HTML.formGenerate(data.registration_steps[i], $.t('register.submit_button'));
                    html += HTML.inputHidden('update', 'false');
                }
            }
            html += '<form>';
            //html += '<a href="tos.html" data-transition="slide" id="tos_custom"><i class="fa fa-question"></i></a>';
            $('#registration_container').html(html);
            $('#' + $.mobile.activePage.attr('id')).trigger('create');
            //$('.ui-checkbox').find('span.ui-btn-inner').off('click').on('click', function(e){
            //    e.preventDefault();
            //    Page.redirect('tos.html');
            //});
            bindSlides();
            $('.ui-checkbox').find('label').removeAttr('for');
            $('.ui-checkbox').find('span.ui-btn-text').off('mouseover').on('mouseover',function(){
                $(this).css('text-decoration', 'underline');
            });
            $('.ui-checkbox').find('span.ui-btn-text').off('mouseout').on('mouseout',function(){
                $(this).css('text-decoration', 'none');
            });
            $('#register_form_submit').submit(function(e){
                e.preventDefault();
                var go = HTML.validate($(this).parent());
                if (go) {
                    var data_send = HTML.getFormValues($(this).parent());

                    var data = {
                        'step': 1,
                        'parameters': JSON.stringify(data_send)
                    };

                    $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
                    if ( !isOffline() ) {
                        Page.apiCall('newCompanyRegistration', data, 'post', 'register_submit');
                    } else {
                        noInternetError($.t("error.internet_connection_needed"),true);
                    }
                }

                return false;
            });
        }
    }
}

function register_submit(data) {
    console.log(data);
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
    if (data.email_error != undefined) {
        $el = $('input[name="email"]');
        $('<label id="' + $el.attr('id') + '_validate" class="validate_error">' + $.t('register.duplicate_email_error') + '</label>').insertAfter($el.parent());
    }
    else if (data.success != undefined) {
        var html = '<div class="no_results" style="color:#00cde7;">';
        html += $.t('register.success_message') + '<br /><br />';
        html += '<button type="submit" data-theme="e" onclick="window.location.href = \'index.html\';">' + $.t('login.input.button') + '</button>';
        html += '</div>';

        $('#registration_container').html(html);
        $('#' + $.mobile.activePage.attr('id')).trigger('create');
    }
}

function bindSlides(){

    $('#tos').off('click').on('click', function(e){
        e.preventDefault();
        //Page.redirect('tos.html');
        $('#registration_container').slideUp(function(){
            $('#tos_page').slideDown();
        });

    });

    $('#tos_back_button').off('click').on('click', function(e){
        console.log("$('#tos_back_button");
        //e.preventDefault();
        $('#tos_page').slideUp(function(){
            $('#registration_container').slideDown();
        });
    });
}
