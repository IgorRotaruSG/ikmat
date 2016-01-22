var company_data = false;
var mySwiper;
var load_done = true;
var t_counter = 1;
var last_data_json = {};
var db_back_step = false;
var loaded_steps = [];
var _h_content = 0;
var zh;
var max_steps = 19;
var max_stepsB = 20;

//navigator.connection.type = Connection.NONE;

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

$(document).off('submit').on('submit', 'form', function(e){
    e.preventDefault();
    e.stopPropagation();

    return false;
});

function register_editInit() {
    executeSyncQuery();
    t_counter = 1;
    load_done = true;
    last_data_json = {};
    company_data = false;
    load_done = true;
    db_back_step = false;
    loaded_steps = [];
    zh = parseInt($('body').height())-100;
    max_steps = 19;
    max_stepsB = 20;
    mySwiper = new Swiper('.swiper-container',{
        calculateHeight:        true,
        releaseFormElements:    true,
        preventLinks:           false,
        simulateTouch:          false,
        keyboardControl: true,
        //pagination: '.pagination',
        onInit: function() {
            setSwiperMinHeight();
        },
        onSlideNext:            function(swiper) {
            _t = 'save';
        },

        onSlidePrev:            function(swiper) {
            _t = 'edit';
        },
        onSlideChangeEnd:       function(swiper) {
            $('html, body').animate({scrollTop: 0}, 500);
            var hideFooter = $('.swiper-slide-active').find('.no_results');
            if(hideFooter.length > 0){
                $('div[data-role="footer"]').hide();
            }
            mySwiper.resizeFix();
            if ( parseInt(swiper.activeIndex) == parseInt(swiper.previousIndex) ) {
                swiper.previousIndex--;
            }

            var $c = $(mySwiper.activeSlide());
            var goo = HTML.validate($c,"REG");

            if (_t == 'save') {
                $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
                /* last slider source HTML */
                var th = swiper.getSlide(swiper.previousIndex);
                /* last step valid or not */
                var go = HTML.validate(th);
                // conditional validation on will steps
                if (go) {
                    // skip color steps
                    if ($(th).find('.colorwill').length == 0) {
                        if ($(th).find('select[data-role="slider"]').val() == 'on' &&
                            $(th).find('input[name="frequency_id"]:checked').val() == undefined) {
                            go = false;
                            $('<label class="validate_error">' + $.t("error.validation") + '</label>').insertAfter($(th).find('.ui-radio').last());
                        }
                    }
                    var data_send = HTML.getFormValues(swiper.getSlide(swiper.previousIndex));
                    if (t_counter > 1) {
                        HTML.getStepData(t_counter, last_data_json[(t_counter-1)], data_send);
                    } else {
                        HTML.getStepData(t_counter, last_data_json[1], data_send);
                    }

                    if (company_data) {
                        data_send = object_merge(company_data, data_send);
                    }

                    var data = {
                        'client': User.client,
                        'token': User.lastToken,
                        'step': t_counter,
                        'parameters': JSON.stringify(data_send)
                    };

                    t_counter = parseInt(t_counter) + 1;

                    /*console.log('------------------------------------------ step save ---------------------------------------');
                    console.log(data);
                    console.log(JSON.stringify(data));
                    console.log('------------------------------------------ step save ---------------------------------------');*/

                    db.lazyQuery({
                        'sql': 'UPDATE "settings" SET "value"=? WHERE "type"=?',
                        'data': [[
                            'true',
                            'register_edit'
                        ]]
                    },0);
                    if (!isOffline()) {
                        Page.apiCall('companyEdit', data, 'post', 'newCompanyRegistration');
                        //truncate table haccp_items so if there are any changes, it will take them again online
                        db.execute('DELETE FROM "haccp_items"');
                    } else {
                        //console.log('connection 153 lazy query');
                        db.lazyQuery({
                            'sql': 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
                            'data': [[
                                'companyEdit',
                                JSON.stringify(data),
                                parseInt(t_counter)-1,
                                'registration_step'
                            ]]
                        },0,'newCompanyRegistrationOff');
                    }

                } else {
                    swiper.swipeTo(swiper.previousIndex, 300, false);
                    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
                }
            }
            if (_t == 'edit') {
                t_counter = parseInt(t_counter) - 1;
                loadBackStep(t_counter);
            }
        }
    });

    data = {
        'client': User.client,
        'token': User.lastToken,
        'step': 1
    };

    if (!isOffline()) {
        Page.apiCall('companyEdit', data, 'post', 'newCompanyRegistration');
    } else {
        newCompanyRegistrationOff(true);
    }
}

function showStepFromDB(tx, results) {
    if (results.rows.length == 0) {
        noInternetError($.t("error.unexpected"));
    } else {
        var data = $.parseJSON(results.rows.item(0).data);
        $('.overflow-wrapper').addClass('overflow-wrapper-hide');
        var html = '';
        var asd;
        for (var i in data.registration_steps) {
            if ((data.registration_steps).hasOwnProperty(i)) {
                if (i != 'aux' && i != 'steps_no') {
                    html = '<div style="padding:0 10px;overflow:auto;height: ' + zh + 'px;"><form onsubmit="return false;">';
                    if (i == 'form8' || i == 'form9' || i == 'form10' || i == 'form11') {
                        console.warn('generate will');
                        html += HTML.formGenerateWill(data.registration_steps[i]);
                    } else if (i == 'form3' || i == 'form4' || i == 'form5') {
                        console.warn('generate colors');
                        html += HTML.formGenerateColors(data.registration_steps[i]);
                    } else {
                        console.warn('generate normal');
                        html += HTML.formGenerate(data.registration_steps[i]);
                    }
                    html += HTML.inputHidden('update', 'true')
                    //html += HTML.inputText('text', 'update', '', '', '', 'true');
                    html += '</form></div>';
                    var asd = mySwiper.getSlide(parseInt(mySwiper.activeIndex)-1);
                    $(asd).html(html);

                } else {
                    if (i == 'aux') {
                        company_data = data.registration_steps[i];
                        company_data.currentCompany = company_data.lastCompanyId;
                    }
                    if (i == 'steps_no') {
                        max_steps = data.registration_steps[i].value;
                        max_stepsB = parseInt(max_steps) + 1;
                    }
                }
            }
        }
        $('#' + $.mobile.activePage.attr('id')).trigger('create');
    }
}

function getStepFromDB(tx) {
    //console.log('this is step in query: ' + db_back_step);
    tx.executeSql('SELECT * FROM "registration" WHERE "step" = "' + db_back_step + '"', [], showStepFromDB, db.dbErrorHandle);
}

//$(document).on('focus', 'input, textarea', function () {
//    $('div[data-role="footer"]').hide();
//});
//
//$(document).on('blur', 'input, textarea', function() {
//    setTimeout(function() {
//        window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
//        $('div[data-role="footer"]').show();
//    }, 10);
//});

function loadBackStep(step) {
    //console.log('load backstep '+step);
    var c = false;
    if (step > 1) {
        //console.log('getstepgromddb');
        db_back_step = parseInt(step - 1);
        var d = db.getDbInstance();
        d.transaction(getStepFromDB, d.dbErrorHandle);
    }
    if (step == 1) {
        step = 2;
        c = true;
    }
    //console.log(step);
    //console.log(last_data_json[parseInt(step)- 1]);
    if (last_data_json[parseInt(step)- 1] != undefined) {
        if (c) {
            step = 1;
        }
        var asd = $(mySwiper.getSlide(parseInt(step)-1));
        asd.find('input[name="update"]').val('true');
    }
}

function newCompanyRegistrationOff(special) {
    // console.log('register edit.js newCompanyRegistrationOff ', special);
    var d = db.getDbInstance();
    if (special && typeof special == 'boolean') {
        d.transaction(function(tx){
            tx.executeSql('SELECT "data" FROM "registration" WHERE "step"=? OR "step"=?',[1,2], function(tx, results){
                if (results.rows.length == 2) {
                    try {
                        var s1 = JSON.parse(results.rows.item(0).data);
                        var s2 = JSON.parse(results.rows.item(1).data);

                        s1.registration_steps.form1_1 = s2.registration_steps.form1_1;

                        newCompanyRegistration(s1);
                    } catch(err) {
                        console.error(err);
                        //alert($.t("error.no_internet_for_sync"));
                        //window.location.href = 'index.html';
                        $('#alertPopup .alert-text').html($.t("error.no_internet_for_sync"));
                        $('#alertPopup').off("popupafterclose").on("popupafterclose",function(){
                            window.location.href = 'index.html';
                        });
                        $('#alertPopup').popup( "open", {positionTo: 'window'});
                    }
                } else {
                    //console.log('s2');
                    //alert($.t("error.no_internet_for_sync"));
                    //window.location.href = 'index.html';
                    $('#alertPopup .alert-text').html($.t("error.no_internet_for_sync"));
                    $('#alertPopup').off("popupafterclose").on("popupafterclose",function(){
                        window.location.href = 'index.html';
                    });
                    $('#alertPopup').popup( "open", {positionTo: 'window'});
                }
            });
        });
    } else {
        var t = parseInt(t_counter)+1;
        if (t >  max_stepsB ) {
            mySwiper.destroy(false);
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
            $('[data-role="footer"]').hide();
            return false;
        }
        if (t == max_stepsB ) {
            var html = '<div class="no_results" style="color:#00cde7;font-size:34px;">';
            html += $.t('success.register_edit') + '<br /><br />';
            html += '<button type="submit" data-theme="d" onclick="Page.redirect(\'haccp.html\')">' + $.t('nav.haccp') + '</button>';
            html += '</div>';
            mySwiper.appendSlide(html, 'swiper-slide');
        }
        console.info('t = ', t);
        d.transaction(function(tx){
            tx.executeSql('SELECT "data" FROM "registration" WHERE "step"=?', [t], function(tx, results){
                if (results.rows.length > 0) {
                    try {
                        var s1 = JSON.parse(results.rows.item(0).data);

                        newCompanyRegistration(s1);
                    } catch(err) {
                        noInternetError($.t("error.no_internet_for_sync"));
                    }
                } else {
                    console.log('325');
                    var html = '<div class="no_results" style="color:#00cde7;font-size:34px;">';
                    html += $.t('success.register_edit') + '<br /><br />';
                    html += '<button type="submit" data-theme="e" onclick="redirectHaccpPage()">' + $.t('nav.haccp') + '</button>';
                    html += '</div>';
                    mySwiper.appendSlide(html, 'swiper-slide');
                    $('#' + $.mobile.activePage.attr('id')).trigger('create');
                    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
                    //noInternetError($.t("error.no_internet_for_sync"));
                }
            });
        });
    }
}

function redirectHaccpPage(){
	if(!isOffline()){
		Page.redirect('haccp.html');
	}else{
		noInternetError($.t("error.no_internet_for_sync"));
	}
}

function newCompanyRegistration(data, params) {
	console.log("params", params);
    db.lazyQuery({
        'sql': 'INSERT INTO "registration"("step","data") VALUES(?,?)',
        'data': [[
            t_counter,
            JSON.stringify(data)
        ]],
        'check': {
            'update_query': 'UPDATE "registration" SET "data"=? WHERE "step"=?',
            'table': 'registration',
            'column': 'step',
            'column_id': 0,
            'index': 'step',
            'index_id': 0
        }
    },0);
    //console.log('------------------------------------------ /step received ---------------------------------------');

    if (data.success) {
        console.log('register_edit 347');

        if (data.registration_steps.error != undefined && data.registration_steps.error) {
            console.log('register_edit 350');
            var $d = $(mySwiper.getSlide(mySwiper.previousIndex));
            var $o;
            for (var i in data.registration_steps[0]) {
                if ((data.registration_steps[0]).hasOwnProperty(i)) {
                    $o = $d.find('input[name="' + data.registration_steps[0][i] + '"]');
                    $('<label id="' + $o.attr('id') + '_validate" class="validate_error">' + $.t("error.duplicate_email") + '</label>').insertAfter($o.parent());
                }
            }
            t_counter = parseInt(t_counter) - 1;
            mySwiper.swipeTo(mySwiper.previousIndex, 300, false);
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');

        } else {
            console.log('register_edit 364');
            last_data_json[t_counter] = data;

            if (t_counter == max_stepsB) {
                mySwiper.destroy(false);
                $('.overflow-wrapper').addClass('overflow-wrapper-hide');
                $('[data-role="footer"]').hide();
                //console.log('register_edit 371');
                return false;
            }
            //console.log('register_edit 374');
            if (t_counter > 2) {
                var asd = mySwiper.getSlide(parseInt(mySwiper.previousIndex) - 1);
               // $(asd).html('<div style="width:100%;height:100px;"></div>'); //uncomment that
            }
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');

            //console.log('aici avem ceva:' + t_counter);
            if (t_counter == max_steps) {
                var html = '<div class="no_results" style="color:#00cde7;font-size:34px;">';
                html += $.t('success.register_edit') + '<br /><br />';
                html += '<button type="submit" data-theme="e" onclick="redirectHaccpPage()">' + $.t('nav.haccp') + '</button>';
                html += '</div>';
                mySwiper.appendSlide(html, 'swiper-slide');
                /*$('.overflow-wrapper').addClass('overflow-wrapper-hide');
                 mySwiper.destroy(false);*/
            }
            var html = '';

            for (var i in data.registration_steps) {
                if ((data.registration_steps).hasOwnProperty(i)) {
                    if (i != 'aux' && i != 'steps_no') {
                        if (t_counter == 1 || loaded_steps.indexOf(t_counter) == -1) {
                            loaded_steps.push(t_counter);
                            html = '<div style="padding:0 10px;overflow:auto;height: ' + zh + 'px;"><form onsubmit="return false;">';
                            if (i == 'form8' || i == 'form9' || i == 'form10' || i == 'form11') {
                                console.warn('generate will');
                                html += HTML.formGenerateWill(data.registration_steps[i]);
                            } else if (i == 'form3' || i == 'form4' || i == 'form5') {
                                console.warn('generate colors');
                                html += HTML.formGenerateColors(data.registration_steps[i]);
                            } else {
                                console.warn('generate normal');
                                html += HTML.formGenerate(data.registration_steps[i]);
                            }
                            html += HTML.inputHidden('update', 'false');

                            html += '</form></div>';

                            mySwiper.appendSlide(html, 'swiper-slide');
                        }
                    } else {
                        if (i == 'aux') {
                            company_data = data.registration_steps[i];
                            company_data.currentCompany = company_data.lastCompanyId;
                        }
                        if (i == 'steps_no') {
                            max_steps = data.registration_steps[i].value;
                            max_stepsB = parseInt(max_steps) + 1;
                        }
                    }
                }
            }
            $('#' + $.mobile.activePage.attr('id')).trigger('create');
			$('a i.fa-plus').parent().parent().on('click', offlinePrevent);
			$('a i.fa-minus').parent().parent().on('click', offlinePrevent);
			
            if (load_done) {
            	console.log("LoadDone");
                mySwiper.reInit();
                mySwiper.resizeFix();
                mySwiper.removeSlide(0);
                load_done = false;
                var $c = $(mySwiper.activeSlide());
                var go = HTML.validate($c,"REG");
                
            }
        }
    }
}

function offlinePrevent(e){
	if(isOffline()){
		e.preventDefault();
		e.stopPropagation();
		noInternetError($.t("error.no_internet_for_sync"), null, $('span.language', this).text());
	}
}

function validate_extra() {
    var go = HTML.validate(mySwiper.getSlide(0));
    //console.log(go);
}

