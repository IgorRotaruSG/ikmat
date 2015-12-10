var mySwiper;
var loadedSteps = [];
var currentStep = 0;
var colorpicker = false;
var sel_colorpicker = false;
var company_data = false;

var closed_help = false;

var _t = false;
var cleanup = false;
var t_counter = 1;

var lid = '';

function close_help() {
    closed_help = true;
    $('.swipe_help').css('display', 'none');
}

function object_merge(a, b) {
    var t = {};
    for (var i in a) {
        if (a.hasOwnProperty(i)) {
            t[i] = a[i];
        }
    }
    for (var i in b) {
        if (b.hasOwnProperty(i)) {
            t[i] = b[i];
        }
    }
    return t;
}

function register_companyInit() {

    $('#no_results').text('Loading ...');

    mySwiper = new Swiper('.swiper-container',{
        calculateHeight:        true,
        releaseFormElements:    true,
        preventLinks:           false,
        simulateTouch:          false,
        //pagination: '.pagination',

        // TODO: remove mousewheel support on production
        //mousewheelControl:      true,
        onInit: function() {
            setSwiperMinHeight();
        },
        onSlideChangeStart:     function(swiper) {
            //startFade();
        },

        onSlideNext:            function(swiper) {
           _t = 'save';
        },

        onSlidePrev:            function(swiper) {
            _t = 'edit';
        },

        onSlideChangeEnd:       function(swiper) {
            mySwiper.resizeFix();
            if ( parseInt(swiper.activeIndex) == parseInt(swiper.previousIndex) ) {
                swiper.previousIndex--;
            }

            if (t_counter == 18) {
                setTimeout(function(){
                    window.location.href = 'index.html';
                }, 3000);
            }
            $('html, body').animate({scrollTop: 0}, 500);
            if (_t == 'save') {
                $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
                var go = Form.validate(swiper.getSlide(swiper.previousIndex));
                /*if (loadedSteps.indexOf(swiper.activeIndex) !== -1) {
                    $(swiper.getSlide(swiper.previousIndex)).find('input[name="update"]').val('true');
                } else {
                    $(swiper.getSlide(swiper.previousIndex)).find('input[name="update"]').val('false');
                }*/
                if (go) {
                    var data_send = Form.getValues(swiper.getSlide(swiper.previousIndex));
                    if (company_data) {
                        data_send = object_merge(company_data, data_send);
                    }
                    currentStep = swiper.activeIndex + 1;

                    //console.log('t_counter here:' + t_counter);
                    var data = {
                        'step': t_counter,
                        'parameters': JSON.stringify(data_send)
                    }
                    t_counter = parseInt(t_counter) + 1;
//                    console.log('trigger step save');
                    //console.log(data);
//                    console.log(JSON.stringify(data));
                    //$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
                    loadedSteps.push(swiper.activeIndex);
                    Page.apiCall('newCompanyRegistration', data, 'post', 'newCompanyRegistration');
                    cleanup = swiper.previousIndex;
                } else {
                    swiper.swipePrev();
                    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
                }
            }
        }
    });

    data = {
        'step': 1
    };

    //newCompanyRegistration();
    Page.apiCall('newCompanyRegistration', data, 'post', 'newCompanyRegistration');
}

function newCompanyRegistration(data) {
    //var data = {"success":true,"currentTime":{"date":"2014-02-12 15:12:10","timezone_type":3,"timezone":"Europe/Helsinki"},"registration_steps":{"form17":{"dishwasher":{"label":"Dish Washer","input":{"type":"multiple_text","fields":{"0":"name","temperature":{"washing":["default_temp","min_temp","max_temp"],"rinse":["default_temp","min_temp","max_temp"]}},"placeholder":"name dishwasher 1"},"validation":["required","string"]},"frequency":{"label":"How frequent will you do the dish washer temperature?","input":{"type":"radio_list"},"answers":{"1":"Every Day","2":"Every other day","3":"Once a week","4":"Every other week","5":"Once a month","6":"Every other month","7":"Every half year","8":"Every year"}},"start_date":{"input":{"type":"date","placeholder":"Choose Date"},"label":"Start Date"}}},"token":"321pz9nl1gow4o0ssss0oc4w8skgw0okokgsk8ck8sk0k8o00o"};
    console.log('---------------------------------------------------------------------------');
    console.log('trigger step received');
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
    if (data.success) {
        if (data.registration_steps.error) {
            t_counter = parseInt(t_counter) - 1;
            mySwiper.swipePrev();
            var fields = data.registration_steps[0];
            var as = []
            for (var i in fields) {
                if (fields.hasOwnProperty(i) && i != 'audit_participants')
                    as.push(fields[i]);
            }

            var $c = $(mySwiper.activeSlide());

            if (as.indexOf("company_email") != -1) {
                var $o = $c.find('input[name="email"]');
                $('<label id="' + $o.attr('id') + '_validate" class="validate_error">This email address already exists.</label>').insertAfter($o.parent());
            }

            if (as.indexOf("haccp_resonsible") != -1) {
                var $o = $c.find('input[name="responsible_for_haccp"]');
                $('<label id="' + $o.attr('id') + '_validate" class="validate_error">This email address already exists.</label>').insertAfter($o.parent());
            }

            if (fields.audit_participants != undefined) {
                var audt = fields.audit_participants;
                var $k = $c.find('input[name="internal_audit_participant[]"]');
                for (var i in audt) {
                    if (audt.hasOwnProperty(i)) {
                        $k.each(function(){
                            if ($(this).val() == audt[i]) {
                                $('<label id="' + $(this).attr('id') + '_validate" class="validate_error">This email address already exists.</label>').insertAfter($(this).parent());
                                return false;
                            }
                        });
                    }
                }
            }
        } else {
            if (cleanup !== false) {
                //console.log('curat pe:'+cleanup);
                mySwiper.removeSlide(cleanup);
                mySwiper.reInit();
                mySwiper.resizeFix();
            }
            if (t_counter == 18) {
                var html = '<div class="no_results" style="color:#00cde7;font-size:34px;">' + $.t('register.success_message') + '</div>';
                mySwiper.appendSlide(html, 'swiper-slide');
            }
            var inp;
            var html = '';
            for (var i in data.registration_steps) {
                if (data.registration_steps.hasOwnProperty(i)) {
                    if (i != 'aux') {
                        html = '<div style="padding:0 10px;"><form onsubmit="return false;">';
                        for (var j in data.registration_steps[i]) {
                            if ((data.registration_steps[i]).hasOwnProperty(j)) {
                                inp = data.registration_steps[i][j];
                                if (inp.input != undefined) {
                                    switch (inp.input.type) {
                                        case 'text':
                                            html += Form.inputText(j, inp.label, inp.input.placeholder, inp.validation, inp.name, inp.value);
                                            break;
                                        case 'multiple_text':
                                            if (i == 'form12' || i == 'form13' || i == 'form14' || i == 'form15' || i == 'form16') {
                                                html += Form.multipleInputTextFridge(j, inp.label, inp.input.placeholder, inp.validation, inp.input.fields);
                                            } else if (i == 'form17') {
                                                html += Form.multipleInputTextDishWasher(j, inp.label, inp.input.placeholder, inp.validation, inp.input.fields);
                                            } else {
                                                html += Form.multipleInputText(j, inp.label, inp.input.placeholder, inp.validation);
                                            }
                                            break;
                                        case 'textarea':
                                            html += Form.textarea(j, inp.label, inp.input.placeholder, inp.validation);
                                            break;
                                        case 'select':
                                            html += Form.selectBox(j, inp.label, inp.input.data, inp.input.placeholder, inp.validation);
                                            break;
                                        case 'checkbox_list':
                                            html += Form.checkboxList(j, inp.label, inp.input.value, inp.answers, inp.name);
                                            break;
                                        case 'multiple_text_color':
                                            html += Form.multipleTextColor(j, inp.label, inp.answers);
                                            break;
                                        case 'radio_list':
                                            if (i == 'form7' || i == 'form9' || i == 'form8' || i == 'form11') {
                                                html += Form.radioList(j, inp.label, inp.input.value, inp.answers, inp.name, true);
                                            } else {
                                                html += Form.radioList(j, inp.label, inp.input.value, inp.answers, inp.name);
                                            }
                                            break;
                                        case 'date':
                                            if (i == 'form7' || i == 'form9' || i == 'form8' || i == 'form11') {
                                                html += Form.inputDate(j, inp.label, inp.input.placeholder, true);
                                            } else if (i == 'form12' || i == 'form13' || i == 'form14' || i == 'form15' || i == 'form16' || i == 'form17') {
                                                html += Form.inputDateV(j, inp.label, inp.input.placeholder, false, null, true);
                                            } else {
                                                html += Form.inputDate(j, inp.label, inp.input.placeholder);
                                            }
                                            break;
                                        case 'custom':
                                            html += Form.customStep10(j, inp.label, inp.measurement_question_id, inp.frequency, inp.haccp);
                                            break;
                                        case 'text_clicker':
                                            html += Form.clickIncrement(j, inp.label, inp.input.data, inp.validation);
                                            break;
                                    }
                                }
                            }
                        }
                        html += Form.inputHidden('update', 'false');
                        /*if (!closed_help) {
                            html += '<div class="swipe_help"><a href="#" onclick="close_help();" data-role="none"><span>Swipe right to save and go to the next step.<br /> Swipe left to go back and edit.<br />Click on this help to make it disappear.</span></a></div>';
                        }*/
                        html += Form.inputCancel('index.html');
                        //html += '<a href="#" onclick="function_asd()">ASD</a>'
                        html += "</form></div>";
                        mySwiper.appendSlide(html, 'swiper-slide');
                    } else {
                        company_data = data.registration_steps[i];
                        company_data.currentCompany = company_data.lastCompanyId;
                    }
                }
            }
            $('#' + $.mobile.activePage.attr('id')).trigger('create');

            if (loadedSteps.length == 0) {
                $('.overflow-wrapper').addClass('overflow-wrapper-hide');
                mySwiper.reInit();
                mySwiper.resizeFix();
                mySwiper.removeSlide(0);
                /*loadedSteps.push(1);
                loadedSteps.push(2);*/
            }
            if (colorpicker) {
                $('.color-pallet-table').find('td').off('click').on('click', function(){
                    sel_colorpicker.css('background-color', $(this).data('color'));
                    sel_colorpicker.find('input').val($(this).data('color'));
                    $( "#popupDialog" ).popup( "close" );
                });
                $('.colorpicker-bind').off('click').on('click', function(){
                    sel_colorpicker = $(this);
                    $('.color-pallet-table').find('td').each(function(){
                        if ($(this).data('color') == sel_colorpicker.find('input').val()) {
                            $(this).find('img').css('visibility', 'visible');
                        } else {
                            $(this).find('img').css('visibility', 'hidden');
                        }
                    });
                    $( "#popupDialog" ).popup( "open" );
                });
                colorpicker = false;
            }
        }
    }
}

function function_asd() {
    var data_send = Form.getValues(mySwiper.getSlide(0));
    console.log(data_send);
    return false;
}