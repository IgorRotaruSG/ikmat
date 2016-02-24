var mySwiper;
var p = true;
var t_counter = 1;
var cleanup = false;

var lid = '';
var lid_opn = {};

function register_editInit() {
    if (User.isLogged()) {

        var data = {
            'client': User.client,
            'token': User.lastToken
        }

        console.log(data);

        Page.apiCall('reports', data, 'post', 'reports');

        p = true;
        cleanup = false;
        var data = {
            'client': User.client,
            'token': User.lastToken,
            'step': '1'
        };

        Page.apiCall('companyEdit', data, 'post', 'companyEdit');

        mySwiper = false;

        mySwiper = new Swiper('.swiper-container-registration',{
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
                if (t_counter == 18) {
                    setTimeout(function(){
                        Page.redirect('haccp.html');
                    }, 3000);
                }
                $('html, body').animate({scrollTop: 0}, 500);
                if (_t == 'save') {
                    $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
                    var go = Form.validate(swiper.getSlide(swiper.previousIndex));

                    if (go) {
                        var data_send = Form.getValues(swiper.getSlide(swiper.previousIndex));
                        /*console.log('data send');
                         console.log('-------------------------------------------------------------------');
                         console.log(data_send);
                         console.log('-------------------------------------------------------------------');*/

                        //console.log('t_counter here:' + t_counter);
                        var data = {
                            'client': User.client,
                            'token': User.lastToken,
                            'step': t_counter,
                            'parameters': JSON.stringify(data_send)
                        }
                        t_counter = parseInt(t_counter) + 1;

                        console.log('trigger step save');
                        //console.log(data);
                        console.log('-------------------------------------------------------------------');
                        console.log(data);
                        console.log('-------------------------------------------------------------------');
                        //$('.overflow-wrapper').removeClass('overflow-wrapper-hide');

                        Page.apiCall('companyEdit', data, 'post', 'companyEdit');
                        cleanup = swiper.previousIndex;
                    } else {
                        swiper.swipePrev();
                        $('.overflow-wrapper').addClass('overflow-wrapper-hide');
                    }
                }
            }
        });

    } else {
        Page.redirect('login.html');
    }
}

function reports(data) {

}

function companyEdit(data) {
    console.log('companyEdit in _register_edit.js 109');
    //var data = {"success":true,"currentTime":{"date":"2014-02-11 17:51:36","timezone_type":3,"timezone":"Europe/Helsinki"},"registration_steps":{"form16":{"fridges":{"label":"Sushi Coolers","input":{"type":"multiple_text","fields":["name","default_temp","min_temp","max_temp"],"placeholder":"name cooler 1"},"validation":["required","string"]},"category":{"label":"How frequent will you do the temperature measurements for the coolers in your kitchen?","input":{"type":"radio_list","value":4},"answers":{"1":"Every Day","2":"Every other day","3":"Once a week","4":"Every other week","5":"Once a month","6":"Every other month","7":"Every half year","8":"Every year"},"name":"frequency"},"start_date":{"input":{"type":"date","placeholder":"Choose Date"},"label":"Start Date"},"value":{"sushi_cooler_id":null,"frequency_id":null,"start_date":null,"name":null,"temperature":{"min_temp":null,"max_temp":null,"default_temp":null}}}},"token":"3d9u8ugb06ckkg8kc8wwo8gs8o04gsgog448ocksooo0wo4w00"};
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
    console.log('step received');
    console.log('========================================================================================');
    //console.log(JSON.stringify(data));
    console.log(data);
    console.log('========================================================================================');
    if (data.success) {
        if (cleanup !== false) {
            //console.log('curat pe:'+cleanup);
            mySwiper.removeSlide(cleanup);
            mySwiper.reInit();
            mySwiper.resizeFix();
        }
        if (t_counter == 18) {
            var html = '<div class="no_results" style="color:#00cde7;font-size:34px;">' + $.t('register.edit_success_message') + '</div>';
            mySwiper.appendSlide(html, 'swiper-slide');
        }
        var inp;
        var html = '';
        for (var i in data.registration_steps) {
            if (data.registration_steps.hasOwnProperty(i)) {
                if (i != 'aux') {
                    /*console.log('data');
                    console.log('========================================================================================');
                    console.log(data);
                    console.log(JSON.stringify(data));*/
                    html = '<div style="padding:10px;"><form onsubmit="return false;">';
                    for (var j in data.registration_steps[i]) {
                        if ((data.registration_steps[i]).hasOwnProperty(j)) {
                            inp = data.registration_steps[i][j];
                            if (inp.input != undefined) {
                                /*console.log('input');
                                 console.log('-------------------------------------------------------------------');
                                 console.log(inp);
                                 console.log('-------------------------------------------------------------------');*/
                                switch (inp.input.type) {
                                    case 'text':
                                        html += Form.inputTextV(j, inp.label, inp.input.placeholder, inp.validation, inp.value);
                                        break;
                                    case 'multiple_text':
                                        if (i == 'form12' || i == 'form13' || i == 'form14' || i == 'form15' || i == 'form16') {
                                            html += Form.multipleInputTextVC(j, inp.label, inp.input.placeholder, inp.validation, inp.input.fields, data.registration_steps[i].value);
                                        } else if (i == 'form17') {
                                            html += Form.multipleInputTextVD(j, inp.label, inp.input.placeholder, inp.validation, inp.input.fields, data.registration_steps[i].value);
                                        } else {
                                            html += Form.multipleInputTextV(j, inp.label, inp.input.placeholder, inp.validation, inp.value);
                                        }
                                        break;
                                    case 'textarea':
                                        html += Form.textarea(j, inp.label, inp.input.placeholder, inp.validation, inp.value);
                                        break;
                                    case 'select':
                                        html += Form.selectBox(j, inp.label, inp.input.data, inp.input.placeholder, inp.validation);
                                        break;
                                    case 'checkbox_list':
                                        html += Form.checkboxListV(j, inp.label, inp.input.value, inp.answers, inp.name);
                                        break;
                                    case 'multiple_text_color':
                                        html += Form.multipleTextColorV(j, inp.label, inp.answers, inp.value);
                                        break;
                                    case 'radio_list':
                                        if (i == 'form7') {
                                            html += Form.radioListV(j, inp.label, inp.input.value, inp.answers, inp.name, true, data.registration_steps[i].value);
                                        }
                                        else if (i == 'form12' || i == 'form13' || i == 'form14' || i == 'form15' || i == 'form16' || i == 'form17') {
                                            html += Form.radioListV(j, inp.label, inp.input.value, inp.answers, inp.name, false, data.registration_steps[i].value, true);
                                        } else {
                                            html += Form.radioListV(j, inp.label, inp.input.value, inp.answers, inp.name, false, data.registration_steps[i].value);
                                        }
                                        break;
                                    case 'date':
                                        if (i == 'form7') {
                                            html += Form.inputDateV(j, inp.label, inp.input.placeholder, true, data.registration_steps[i].value);
                                        }
                                        else if (i == 'form12' || i == 'form13' || i == 'form14' || i == 'form15' || i == 'form16' || i == 'form17') {
                                            html += Form.inputDateV(j, inp.label, inp.input.placeholder, true, data.registration_steps[i].value, true);
                                        } else {
                                            html += Form.inputDateV(j, inp.label, inp.input.placeholder, false, data.registration_steps[i].value);
                                        }
                                        break;
                                    case 'custom':
                                        html += Form.customStep10V(j, inp.label, inp.measurement_question_id, inp.frequency, inp.haccp, inp.value);
                                        break;
                                    case 'text_clicker':
                                        html += Form.clickIncrement(j, inp.label, inp.input.data, inp.validation, inp.value);
                                        break;
                                }
                            }
                        }
                    }
                    html += Form.inputHidden('update', 'false');
                    html += "</div></div>";
                    /*console.log('asta am scuipat:');
                     console.log(html);*/
                    mySwiper.appendSlide(html, 'swiper-slide');

                } else {

                }
            }
        }
        $('#' + $.mobile.activePage.attr('id')).trigger('create');

        if (p) {
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
            mySwiper.reInit();
            mySwiper.resizeFix();
            mySwiper.removeSlide(0);
            p = false;
        }
    }
}

$(document).on("submit", "form", function(e){
    e.preventDefault();
    return false;
});