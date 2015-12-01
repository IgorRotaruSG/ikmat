var mySwiper;
var _h_content = 0;
var _t;
var last_data_received;
var offline_signature;
var lazydatasend = [];

//navigator.connection.type = Connection.NONE;

function getFormsCall(tx, results) {
    if (results.rows.length == 0 && isOffline()) {
        $('#no_results_forms').text($.t('forms.no_forms_connection'));
    }
//    else if (results.rows.length == 0  && navigator.connection.type != Connection.NONE) {

    else if (results.rows.length > 0 && isOffline() ) {
        $('.overflow-wrapper').addClass('overflow-wrapper-hide');
        var data = [];
        var label, tmp, link, alias;

        for (var i=0;i<results.rows.length;i++) {
            try {
                tmp = JSON.parse(results.rows.item(i).label);
                alias = tmp.alias;
                link = '<a href="#" data-type="' + results.rows.item(i).type + '" class="form_generator_link">' + tmp.alias + '</a>';
            } catch (err) {
                link = '<a href="#" data-type="' + results.rows.item(i).type + '" class="form_generator_link">' + results.rows.item(i).label + '</a>';
                alias = results.rows.item(i).label;
            }
            data.push({
                'alias':    alias,
                'id':       i,
                'data':     link
            });
        }
        if (localStorage.getItem('role') != 'ROLE_EMPLOYEE') {
            data.push({
                'alias':    $.t('nav.add_employee'),
                'id':       999,
		'data':     '<a href="#" data-type="add_employee" class="form_generator_link"><i class="fa fa-users"></i> ' + $.t('nav.add_employee') + '</a>'
            });

            data.push({
                'alias':    $.t('nav.add_supplier'),
                'id':       1000,
                'data':     '<a href="#" data-type="add_supplier" class="form_generator_link"><i class="fa fa-users"></i> ' + $.t('nav.add_supplier') + '</a>'
            });
        }


        $('#forms_list').html('');
        _append('#forms_list', data);
        bind_form_click_handler();
        bind_form2_click_handler();

        $('#no_results_forms').hide();
    }
    else {
        console.log('if connection is live');
        //$('#no_results_forms').text($.t('forms.no_forms_yet'));

        var data = {
            'client': User.client,
            'token': User.lastToken
        };
        Page.apiCall('formDeviationStart', data, 'get', 'formDeviationStart');
    }

    console.log("FormList");
    console.log(data);

    mySwiper.reInit();
    mySwiper.resizeFix();
}

function getForms(tx) {
    tx.executeSql('SELECT * FROM "forms"', [], getFormsCall);
}

function formsInit() {
//    console.log('forms init');
    if (User.isLogged()) {
        executeSyncQuery();
        var d = db.getDbInstance();
        d.transaction(getForms, db.dbErrorHandle);
        console.log('forms.js 73 swiper init');
        mySwiper = new Swiper('.swiper-container-form',{
            calculateHeight:        true,
            releaseFormElements:    true,
            preventLinks:           false,
            simulateTouch:          false,
            noSwiping : true,
            noSwipingClass: 'ui-slider',
            //pagination: '.pagination',
            onInit: function() {
                if ( mySwiper.slides.length == 1 ) {
                    $('#footer').remove();
                    $('#form_back_btn i').addClass('hided');
                }
                setSwiperMinHeight();
            },
            onSlideNext:            function(swiper) {
                _t = 'next';
            },

            onSlidePrev:            function(swiper) {
                _t = 'prev';
            },
            onSlideChangeEnd:       function(swiper) {
              $('html, body').animate({scrollTop: 0}, 500);
                mySwiper.resizeFix();
                if ( parseInt(swiper.activeIndex) == parseInt(swiper.previousIndex) ) {
                    swiper.previousIndex--;
                }
                
                HTML.validate($('body'),'ex');
                var redirectAfterPoison = $('.swiper-slide-active').find('.no_results');
                if(redirectAfterPoison.length > 0){
                    console.log('redirectAfterPoison');
                    if ( lazydatasend != [] &&  isOffline() ) {
                        var data_send2 = Form.getValues(swiper.getSlide(swiper.previousIndex));
                        lazydatasend.push(data_send2);
                        var newlazy = {};
                        newlazy['results'] = {};
                        for ( i = 0; i< lazydatasend.length; i++ ) {
                            for (var prop in lazydatasend[i] ) {
                                // important check that this is objects own property
                                // not from prototype prop inherited
                                if(lazydatasend[i].hasOwnProperty(prop)){
                                    if ( prop == 'task_id' ){
                                        newlazy[prop] = lazydatasend[i][prop];
                                        newlazy['results'][prop] = lazydatasend[i][prop];
                                    } else {
                                        newlazy['results'][prop] = lazydatasend[i][prop];
                                    }
                                }
                            }
                        }
                        newlazy['results'] = JSON.stringify(newlazy.results);
                        console.log(newlazy);
//                        return;
                        db.lazyQuery({
                            'sql': 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
                            'data': [[
                                'foodPoison',
                                JSON.stringify(newlazy),
                                0,
                                'foodPoison'
                            ]]
                        },0);
                    }
                    setTimeout(function(){
                        window.location.href = 'index.html';
                    }, 3500);
                }

                var poison = $(document).find('.form2_save');
                if(poison.length > 0){
                    if(_t == 'next'){
                        $('.overflow-wrapper').removeClass('overflow-wrapper-hide');

                        var go = Form.validate(swiper.getSlide(swiper.previousIndex));
                        if(go){
                            var data_send = Form.getValues(swiper.getSlide(swiper.previousIndex));
                            var data = {
                                'client': User.client,
                                'token': User.lastToken,
                                'results': JSON.stringify(data_send)
                            };
                            if (!isOffline() ) {
                                Page.apiCall('foodPoison', data, 'get', 'foodPoisonDone');
                            } else {
                                lazydatasend.push(data_send);
                                $('.overflow-wrapper').addClass('overflow-wrapper-hide');
                            }
                        }else{
                            swiper.swipePrev();
                            $('.overflow-wrapper').addClass('overflow-wrapper-hide');

                        }
                    }else{
                        if(_t == 'prev'){
                            if(swiper.activeIndex == 0){
                                var swiper_slides = swiper.slides.length;
                                for  ( var i = swiper_slides; i > 0; i-- ) {
                                    swiper.removeSlide(parseInt(i));
//                                    alert(i);
                                    $("div[data-role='navbar']").remove();
                                }
//                                swiper.removeSlide(parseInt(swiper.activeIndex) + 2);
//                                swiper.removeAllSlides();
                            }
                        }
                    }
                }else{
                    if (_t == 'prev') {
                        swiper.removeSlide(parseInt(swiper.activeIndex) + 1);
                    }
                }
                if ( mySwiper.slides.length == 1 ) {
                     $('#footer').remove();
                     $('#form_back_btn i').addClass('hided');
                }
            }
        });


    } else {
        Page.redirect('login.html');
    }
}

function toObject(arr) {
    var rv = {};
    for (var i = 0; i < arr.length; ++i)
        rv[arr[i][0]] = arr[i][1];
    return rv;
}

function sortObject(o) {
    var sorted = {},
    key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(o[key]);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        var keyName = getKeyByValue(o,a[key]);
        console.log(keyName);
        console.log(a[key]);
        sorted[keyName] = a[key];
    }
    return sorted;
}


function getKeyByValue(obj,value) {
    for( var prop in obj ) {
        if( obj.hasOwnProperty( prop ) ) {
            if( obj[ prop ] == value ) {
                return prop;
            }
        }
    }
}

function formDeviationStart(data) {
    if (data.success) {
        var f = data.form_list_question;
        /* SORT SECTION */
        var tuples = [];
        if (localStorage.getItem('role') != 'ROLE_EMPLOYEE') {
            tuples = [
                [999, $.t('nav.add_employee')],
                [1000, $.t('nav.add_supplier')]
            ];
        }

        for (var key in f) {
            if (typeof f[key] == 'object') {
                tuples.push([key, f[key].alias]);
            }else {
                tuples.push([key, f[key]]);
            }
        }
        tuples.sort(function(a, b) {
            a = a[1];
            b = b[1];
            return a < b ? -1 : (a > b ? 1 : 0);
        });
        var data = []; // For show
        var db_data = []; // For insert to local db

        for (var i = 0; i < tuples.length; i++) {
            var key = tuples[i][0];
            var value= tuples[i][1];
            if (key != 999 && key != 1000) {
                data.push({
                    'alias':    value,
                    'id':       100 - i,
                    'data':     '<a href="#" data-type="' + key + '" class="form_generator_link"> ' + value + '</a>'
                });
            }
            if (key == 999) {
                data.push({
                    'alias':    $.t('nav.add_employee'),
                    'id':       999,
                    'data':     '<a href="#" data-type="add_employee" class="form_generator_link"><i ></i> ' + $.t('nav.add_employee') + '</a>'
                });
            }
            if (key == 1000) {
                data.push({
                    'alias':    $.t('nav.add_supplier'),
                    'id':       1000,
                    'data':     '<a href="#" data-type="add_supplier" class="form_generator_link"><i ></i> ' + $.t('nav.add_supplier') + '</a>'
                });
            }

            if(key != 'maintenance' || key != 'food_poision' || (key != 999 && key != 1000)){
                db_data.push([key, value]);
            }
        }

        /* INSERT SECTION */
        var q = 'INSERT INTO "forms" ("type", "label") VALUES(?,?)';
        db.lazyQuery({
            'sql': 'INSERT OR REPLACE INTO "forms" ("type","label") VALUES(?,?)',
            'data': db_data
        },0);
        /* SHOW SECTION */
        $('#forms_list').html('');
        _appendAndSortByAlias('#forms_list', data);
        bind_form_click_handler();
        $('#no_results_forms').hide();
        $('.overflow-wrapper').addClass('overflow-wrapper-hide');
    }
    realignSlideHeight('max-height-form');
}

function formItemData(data) {
    console.log('forms.js  formItemData 200');
    if (data.success) {
        var f = data.form_list_question;
        if (f.info != undefined) {
            var d = f;

            last_data_received = d.form;

            var html = '<div style="padding:10px;"><form id="form2_save">';

            if (f.info.label != undefined) {
                html += '<legend class="legend_task">' + f.info.label + '</legend>';
            }

            console.log('216 forms.js');
            switch(f.info.type){
                /* If maintenance, add signature form*/
                case 'maintenance':
                    //console.log('maintenance 306');
                    html += HTML.formGenerate(last_data_received.form_deviation,  $.t("general.save_button"));

                    html += '</form>' +
                        '<div data-role="popup" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">'+
                        '<div id="signature-holder">'+
                        '<div id="signature" data-role="none"></div>'+
                        '</div>' +
                        '<button id="deviation-signature-close">'+ $.t("general.sign_button") +'</button>' +
                        '</div>'+
                        '</div>';
                    $(document).on('click', '#signature-reset' , function(e){
                        e.preventDefault();

                        $('input[name="signature"]').val('user name');

                        return false;
                    });

                    $(document).off('click','#signature-trigger').on('click','#signature-trigger', function(e){
                        e.preventDefault();
                        openSignaturePopup();

                        $(document).off('click','#deviation-signature-close').on('click','#deviation-signature-close' ,function(){
                            $('#signature_pop').popup('close');
                            /* Save maintenance for now */
                            var dd1 = HTML.getFormValues($(document).find('#form2_save').parent());
                            console.log(dd1);
                            var data_m = {
                                'client': User.client,
                                'token': User.lastToken,
                                'results': JSON.stringify(dd1)
                            };
                            console.log('freeze maintenance');
                            Page.apiCall('maintenance', data_m, 'get', 'maintenanceSignDone');
                        });

                        return false;
                    });
                    break;

                case 'food_poision':
                    /* Step 1*/
                    html = '<div style="padding:10px;"><form class="form2_save">';
                    html += '<legend class="legend_task">' + f.info.label + '</legend>';
                    var step = {
                        'task_id': last_data_received.task_id,
                        'guestName': last_data_received.guestName,
                        'guestAddress': last_data_received.guestAddress,
                        'guestPhone': last_data_received.guestPhone
                    };
                    var form = HTML.formGenerate(step, '');
                    html += form;
                    html += '</form></div>';
                    mySwiper.appendSlide(html, 'swiper-slide');
//                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
                    /* Step 2*/
                    html = '<div style="padding:10px;"><form class="form2_save">';
                    html += '<legend class="legend_task">' + f.info.label + '</legend>';
                    step = {
                        'task_id': last_data_received.task_id,
                        'symptoms': last_data_received.symptoms,
                        'symptomsDateTime': last_data_received.symptomsDateTime,
                        'symptom_days': last_data_received.symptom_days,
                        'symptom_hours': last_data_received.symptom_hours
                    };
                    form = HTML.formGenerate(step, '');
                    html += form;
                    html += '</form></div>';
                    mySwiper.appendSlide(html, 'swiper-slide');
//                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
                    /* Step 3*/
                    html = '<div style="padding:10px;"><form class="form2_save">';
                    html += '<legend class="legend_task">' + f.info.label + '</legend>';
                    step = {
                        'task_id': last_data_received.task_id,
                        'makingFoodDateTime': last_data_received.makingFoodDateTime,
                        'makingFoodTotalGuests': last_data_received.makingFoodTotalGuests,
                        'makingFoodSickGuests': last_data_received.makingFoodSickGuests,
                        'makingFoodWhatFood': last_data_received.makingFoodWhatFood,
                        'makingFoodEarlierEaten': last_data_received.makingFoodEarlierEaten,
                        'guestTalkedDoctor': last_data_received.guestTalkedDoctor
                    };
                    form = HTML.formGenerate(step, '');
                    html += form;
                    html += '</form></div>';
                    mySwiper.appendSlide(html, 'swiper-slide');
//                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
                    /* Step 4*/
                    html = '<div style="padding:10px;"><form class="form2_save">';
                    html += '<legend class="legend_task">' + f.info.label + '</legend>';
                    step = {
                        'task_id': last_data_received.task_id,
                        'ingredients': last_data_received.ingredients,
                        'cooledDown': last_data_received.cooledDown,
                        'reheated': last_data_received.reheated,
                        'keptWarm': last_data_received.keptWarm,
                        'restLeftAnalysis': last_data_received.restLeftAnalysis
                    };
                    form = HTML.formGenerate(step, '');
                    html += form;
                    html += '</form></div>';
                    mySwiper.appendSlide(html, 'swiper-slide');
//                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
                    /* Step 5*/
                    html = '<div style="padding:10px;"><form class="form2_save">';
                    html += '<legend class="legend_task">' + f.info.label + '</legend>';
                    step = {
                        'task_id': last_data_received.task_id,
                        'immediateMeasures': last_data_received.immediateMeasures,
                        'otherComplaints': last_data_received.otherComplaints,
                        'guestCompensation': last_data_received.guestCompensation,
                        'employee_id': last_data_received.employee_id,
                        'deviation_deadline': last_data_received.deviation_deadline,
//                        'signature': last_data_received.signature,
                       'correctionalMeasures': last_data_received.correctionalMeasures
                    };
                    form = HTML.formGenerate(step, '');
                    html += form;
                    html += '</form></div>'+
                        '<div data-role="popup" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">'+
                        '<div id="signature-holder">'+
                        '<div id="signature" data-role="none"></div>'+
                        '</div>' +
                        '<button id="deviation-signature-close">'+$.t("general.sign_button")+'</button>' +
                        '</div>'+
                        '</div>'
                    ;
                    var footer = '<div id="footer" data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="none" style="border:0 !important;">'+
                        '<div data-role="navbar"><ul>' +
                        '<li><a href="#" onclick="mySwiper.swipePrev();" data-theme="e" class="must-be-big"><i class="fa fa-angle-left fa-2x pull-left" style="color: #4c7600;"></i> Forrige</a></li>'+
                        '<li><a href="#" onclick="mySwiper.swipeNext();" data-theme="e" class="must-be-big">Neste <i class="fa fa-angle-right fa-2x pull-right" style="color: #4c7600;"></i></a></li>' +
                        '</ul></div></div>';
                    $(footer).insertBefore('#forms #menu_panel');
                    mySwiper.appendSlide(html, 'swiper-slide');
                    /* Last step for redirect*/
                    html = '<div class="no_results" style="color:#00cde7;font-size:34px;">' + $.t('register.food_poison_success') + '</div>';
                    mySwiper.appendSlide(html, 'swiper-slide');
                    $('#' + $.mobile.activePage.attr('id')).trigger('create');
//                    fixFooterPosition();
                    break;
                case 'deviation':
                    console.log('deviation 401');
                    html += HTML.formGenerate(last_data_received.form_deviation,  $.t("general.save_button"), 'dev');
                    html += '</form>' +
                        '<div data-role="popup" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">'+
                        '<div id="signature-holder">'+
                        '<div id="signature" data-role="none"></div>'+
                        '</div>' +
                        '<button id="deviation-signature-close">'+ $.t("general.sign_button") +'</button>' +
                        '</div>'+
                        '</div>';
                    $(document).on('click', '#signature-reset' , function(e){
                        e.preventDefault();

                        $('input[name="signature"]').val('user name');

                        return false;
                    });

                    $(document).off('click','#signature-trigger').on('click','#signature-trigger', function(e){
                        e.preventDefault();
                        openSignaturePopup();

                        $(document).off('click','#deviation-signature-close').on('click','#deviation-signature-close' ,function(){
                            $('#signature_pop').popup('close');
                            /* Save maintenance for now */
                            var dd1 = HTML.getFormValues($(document).find('#form2_save').parent());
                            console.log('444 dd1: ');
                            console.log(dd1);
                            var data_m = {
                                'client': User.client,
                                'token': User.lastToken,
                                'results': JSON.stringify(dd1)
                            };
                            console.log('freeze dev');
                            Page.apiCall('deviationForm', data_m, 'get', 'maintenanceSignDone');
                        });

                        return false;
                    });
                    break;
                default:
                    html += HTML.formGenerate(last_data_received,  $.t("general.save_button"));
                    html += '</form></div>';
                    break;
            }

            if(d.type != 'food_poison'){
                mySwiper.appendSlide(html, 'swiper-slide');
                $('#' + $.mobile.activePage.attr('id')).trigger('create');
            }
            mySwiper.swipeTo(2, 300, true);
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');

            $('#form2_save').on('submit', function(e) {
                console.log('hei macarena');
                e.preventDefault();

                var dd = HTML.getFormValues($(this).parent());
                var go = HTML.validate($(this));

                if (go) {
                    var deviation = false;

                    var data = {
                        'client': User.client,
                        'token': User.lastToken,
                        'results': JSON.stringify(dd)
                    };
                    /*Different saving for maintenance */
                    if(f.info.type == 'maintenance'){
                        console.log('Form saved successfully. 503');
                        Page.apiCall('maintenance', data, 'get', 'maintenanceDoneForm');
                    } else if (f.info.type == 'deviation') {
                        console.log('Form saved successfully2. 506');
                        Page.apiCall('deviationForm', data, 'get', 'maintenanceDoneForm');
                    }
                    else{
                        for (var i in dd) {
                            if (dd.hasOwnProperty(i)) {
                                if (last_data_received[i].deviation != undefined) {
                                    switch (last_data_received[i].type) {
                                        case 'slider':
                                            if (dd[i] < last_data_received[i].deviation.min || dd[i] > last_data_received[i].deviation.max) {
                                                deviation = true;
                                            }
                                            break;
                                        case 'default':
                                            break;
                                    }
                                }
                            }
                        }

                        if (deviation) {
                            $('#confirmPopup .alert-text').html($.t('general.deviation_accept_message'));
                            $('#confirmPopup').on(
                                "popupafteropen", function( event, ui ) {
                                    $('#confirmButton').off('click').on('click',function(){
                                        console.log('aici avem prima chestie');
                                        Page.apiCall('formDeviationStart', data, 'get', 'form2_save_dev');
                                    });
                                });
                            $('#confirmPopup').on(
                                "popupafterclose", function( event, ui ) {
                                    //var a = false;
                                    $('#confirmButton').unbind("click");
                                }
                            );
                            $('#confirmPopup').popup( "open", {positionTo: 'window'});
                        } else {
                            console.log('Form saved successfully. 536');

                            Page.apiCall('formDeviationStart', data, 'get', 'redirect_to_forms');
                        }
                    }
                }

                return false;
            });
            console.log('forms.js 457');
            mySwiper.swipeTo(1, 300, true);
            console.log('forms.js 480');
        } else {
            console.log('forms.js 482');
//            alert('forms.js 482');
            var data = [];
            var db_data = [];
            var html = '<div style="padding:10px;"><ul data-role="listview" data-inset="true" data-divider-theme="b">';
            for (var i in f) {
                if (f.hasOwnProperty(i)) {
                    html += '<li><a href="#" data-id="' + f[i].info.id + '" data-type="'+ f[i].form.type.value +'" class="form_generator_link2"><i class="fa fa-edit"></i> ' + f[i].info.label + '</a></li>';

                    db_data.push([
                        f[i].info.id,
                        f[i].info.label,
                        JSON.stringify(f[i].form),
                        document.form_cat
                    ]);
                }
            }

            html += '</ul></div>';
//            console.log('final to insert');
//            console.log(db_data);
            console.log('forms.js 505',db_data);
            var q = 'INSERT OR REPLACE INTO "form_item" ("id", "label", "form", "type") VALUES(?,?,?,?)';
            db.lazyQuery({
                'sql': 'INSERT OR REPLACE INTO "form_item"("id", "label", "form", "type") VALUES(?,?,?,?)',
                'data': db_data
            },0);

            mySwiper.appendSlide(html, 'swiper-slide');
            bind_form2_click_handler();

            $('.overflow-wrapper').addClass('overflow-wrapper-hide');

            $('#' + $.mobile.activePage.attr('id')).trigger('create');
            mySwiper.swipeTo(1, 300, true);
        }
    } else {
        console.log('wrooong');
    }
}

function maintenance(data) {
    console.log('maintenance');
    console.log('data');
    console.log(data);
    if (data.form_deviation) {
        var html = '<form id="form_maintenance">';
        html += HTML.formGenerate(data.form_deviation,  $.t("general.save_button"));
        html += '</form>'+
            '<div data-role="popup" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">'+
            '<div id="signature-holder">'+
            '<div id="signature" data-role="none"></div>'+
            '</div>' +
            '<button id="deviation-signature-close">'+$.t("general.sign_button")+'</button>' +
            '</div>'+
            '</div>';
        mySwiper.appendSlide(html, 'swiper-slide');

        $('#' + $.mobile.activePage.attr('id')).trigger('create');
        mySwiper.swipeTo(2, 300, true);
        $('.overflow-wrapper').addClass('overflow-wrapper-hide');
//        $('#form_maintenance').html(html);
        $('#signature-trigger').off('click').on('click', function(e){
            e.preventDefault();
            openSignaturePopup();

            //$('#deviation-signature-close').off('click').on('click',function(){
            $(document).off('click','#deviation-signature-close').on('click','#deviation-signature-close' ,function(){
                $('#signature_pop').popup('close');
                var data = {
                    'client': User.client,
                    'token': User.lastToken,
                    'signature': JSON.stringify({
                        "name": $('#sign_name').val(),
                        "svg": $sigdiv.jSignature("getData", "svgbase64")[1],
                        "parameter": "task",
                        "task_id": sss_temp
                    })
                };
                //console.log(JSON.stringify(data));

                console.log('documentSignature forms.js 592');
//                Page.apiCall('documentSignature', data, 'get', 'documentSignature');
                Page.apiCall('documentSignature', data, 'post', 'documentSignature');
            });

            return false;
        });

        $('#form_maintenance').on('submit', function(e){
            e.preventDefault();

            var go = HTML.validate($(this));

            if (go) {
                $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
                var dd = HTML.getFormValues($(this).parent());

                var data = {
                    'client': User.client,
                    'token':User.lastToken,
                    'results': JSON.stringify(dd)
                };

                Page.apiCall('maintenance', data, 'get', 'maintenanceDoneForm');
            }

            return false;
        });
        $('#' + $.mobile.activePage.attr('id')).trigger('create');
        $('.overflow-wrapper').addClass('overflow-wrapper-hide');
    }
    if (data.form_fix_deviation) {
        var d = new Date(data.form_fix_deviation.deviation_date.date);

        var html = '<h3>Deviation form fix</h3>';

        if (data.form_fix_deviation.deviation_photos != undefined && (data.form_fix_deviation.deviation_photos).length > 0) {
            var p = $.parseJSON(data.form_fix_deviation.deviation_photos);
            console.log(p);
            for (var i in p) {
                if (p.hasOwnProperty(i)) {
                    html += '<img width="100%" height="auto" style="margin:0 auto;" src="' + p[i] + '" />';
                }
            }
        }

        html += '<fieldset data-role="controlgroup">Deviation. '+ data.form_fix_deviation.deviation.replace(/\+/g,' ') + '</div>';

        html += '<fieldset data-role="controlgroup">Initial action. '+ data.form_fix_deviation.initial_action.replace(/\+/g,' ') + '</div>';

        html += '<fieldset data-role="controlgroup">Deviation date (from system): '+ d.getDate() + '.' + (parseInt(d.getMonth()) + 1) + '.' + d.getFullYear() + '</div>';

        html += '<fieldset data-role="controlgroup">Responsible for fixing deviation: '+ data.form_fix_deviation.form.responsible_fix_deviation.value + '</div>';

        html += '<hr />';

        html += HTML.formGenerate(data.form_fix_deviation.form,  $.t("general.save_button"));

        $('#form_maintenance').html(html).off('submit').on('submit', function(e){
            e.preventDefault();

            var go = Form.validate($(this));

            if (go) {
                $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
                var dd = Form.getValues($(this));

                var data = {
                    'client': User.client,
                    'token':User.lastToken,
                    'task_id': get.id,
                    'results': JSON.stringify(dd)
                };

                Page.apiCall('maintenance', data, 'get', 'maintenanceDoneForm');

            }

            return false;
        });
        $('#' + $.mobile.activePage.attr('id')).trigger('create');
        $('.overflow-wrapper').addClass('overflow-wrapper-hide');
    }
}

function maintenanceDoneForm(data) {
    //console.info('maintenanceDone',data);
    if($.isNumeric(data)){
        $('input[name="task_id"]').val(data);
    }
    uploadHACCPPictureForms();
    Page.redirect('tasks.html');
}

function foodPoisonDone(data){
    console.log('foodPoisonDone');
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
    if($.isNumeric(data)){
        $('input[name="task_id"]').val(data);
    }
}

function maintenanceSignDone(data) {
   console.log("maintenanceSignDone");
    if($.isNumeric(data)){
        $('input[name="task_id"]').val(data);
    }
    var data1 = {
        'client': User.client,
        'token': User.lastToken,
        'signature': JSON.stringify({
            "name": $('#sign_name').val(),
            "svg": $sigdiv.jSignature("getData", "svgbase64")[1],
            "parameter": "task",
            "task_id": data
        })
    };
    Page.apiCall('documentSignature', data1, 'get', 'documentSignature');
}

function bind_form_click_handler() {

	$('#form_back_btn').on('click', function(e) {
        $("[href='forms.html']").click();
    });
    $('.form_generator_link').off('click').on('click', function(e){
    	 $('#form_back_btn i').removeClass('hided');
        $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
        document.form_cat = $(this).data('type');
        console.log('686 '+ document.form_cat);

        var d = db.getDbInstance();
        d.transaction(function(tx){
            tx.executeSql('SELECT * FROM "form_item" WHERE "type"=?',[document.form_cat], function(tx, results){
//                if (results.rows.length == 0 && navigator.connection.type != Connection.NONE) {
                if (!isOffline()) {
                    console.log('885 connection live');
//                if (navigator.connection.type != Connection.NONE) {
                    switch(document.form_cat){
                        case 'maintenance':
                            var data = {
                                'client': User.client,
                                'token': User.lastToken,
                                'results': ''
                            };
                            console.log('730');
                            Page.apiCall('maintenance', data, 'get', 'formItemData');
                            break;
                        case 'food_poision':
                            var data = {
                                'client': User.client,
                                'token': User.lastToken,
                                'results': ''
                            };
                            console.log(data);
                            console.log('am trimis call aici');
                            Page.apiCall('foodPoison', data, 'get', 'formItemData');
                            break;
                        case 'add_employee':
                            var data = {
                                'client': User.client,
                                'token': User.lastToken
                            };
                            console.log('am trimis call employee aici');
                            Page.apiCall('registerEmployee', data, 'get', 'registerEmployee');
                            break;
                        case 'add_supplier':
                            var data = {
                                'client': User.client,
                                'token': User.lastToken
                            };

                            Page.apiCall('registerSupplier', data, 'get', 'registerSupplier');
                            console.log('add supplier');
                            break;
                        case 'deviation':
                            console.log('deviation 851');
                            var data = {
                                'client': User.client,
                                'token': User.lastToken,
                                'results': ''
                            };
                            console.log('857');
                            console.log(data);
                            Page.apiCall('deviationForm', data, 'get', 'formItemData');
                            break;
                        default:
                            console.log('744');
                            var data = {
                                'client': User.client,
                                'token': User.lastToken,
                                'category': document.form_cat
                            };
                            Page.apiCall('formDeviationStart', data, 'get', 'formItemData');
                            break;
                    }
                }
                else if ( isOffline() && results.rows.length > 0 ) {
                    console.log('756 connection whatever and rows > 0');
                    if (results.rows.length == 1 ) {
                        var d = $.extend({}, results.rows.item(0));
                        console.log('aici e form-ul de maintenance');
                        last_data_received = JSON.parse(d.form);

                        var html = '<div style="padding:10px;"><form id="form2_save">';
                        console.log(d.type);
                        switch(d.type){
                            /* If maintenance, add signature form*/
                            case 'maintenance':
                                html += '<legend class="legend_task">' + results.rows.item(0).label + '</legend>';
                                html += HTML.formGenerate(last_data_received,  $.t("general.save_button"));
                                html += '</form>' +
                                    '<div data-role="popup" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">'+
                                    '<div id="signature-holder">'+
                                    '<div id="signature" data-role="none"></div>'+
                                    '</div>' +
                                    '<button id="deviation-signature-close">'+$.t("general.sign_button")+'</button>' +
                                    '</div>'+
                                    '</div>';
                                $(document).on('click', '#signature-reset' , function(e){
                                    e.preventDefault();

                                    $('input[name="signature"]').val('user name');

                                    return false;
                                });

                                $(document).off('click','#signature-trigger').on('click','#signature-trigger', function(e){
                                    e.preventDefault();
                                    openSignaturePopup();

                                    $(document).off('click','#deviation-signature-close').on('click','#deviation-signature-close' ,function(){
                                        $('#signature_pop').popup('close');
                                        /* Save maintenance for now */
                                        var dd1 = HTML.getFormValues($(document).find('#form2_save').parent());
                                        //console.log(dd1);
                                        var data_m = {
                                            'client': User.client,
                                            'token': User.lastToken,
                                            'results': JSON.stringify(dd1)
                                        };
                                        console.log('api call signature');
                                        if ( !isOffline() ) {
                                            Page.apiCall('maintenance', data_m, 'get', 'maintenanceSignDone');
                                        } else {
                                            offline_signature = {
                                                'signature': JSON.stringify({
                                                    "name": $('#sign_name').val(),
                                                    "svg": $sigdiv.jSignature("getData", "svgbase64")[1],
                                                    "parameter": "task",
                                                    "task_id": $(document).find('input[name="task_id"]').val()
                                                })
                                            };
                                            console.log('offline_signature = ');
                                            console.log(offline_signature);
                                            $('#sign_name').attr('disabled', true);
                                            $('#signature-trigger').attr('disabled', true);
                                            $('#signature-trigger').val('Signed').button('refresh');
                                        }
                                    });

                                    return false;
                                });
                                break;
                            case 'food_poision':
                                /* Step 1*/
                                html = '<div style="padding:10px;"><form class="form2_save">';
                                html += '<legend class="legend_task">' + results.rows.item(0).label + '</legend>';
                                var step = {
                                    'task_id': last_data_received.task_id,
                                    'guestName': last_data_received.guestName,
                                    'guestAddress': last_data_received.guestAddress,
                                    'guestPhone': last_data_received.guestPhone
                                };
                                var form = HTML.formGenerate(step, '');
                                html += form;
                                html += '</form></div>';
                                mySwiper.appendSlide(html, 'swiper-slide');
//                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
                                /* Step 2*/
                                html = '<div style="padding:10px;"><form class="form2_save">';
                                html += '<legend class="legend_task">' + results.rows.item(0).label + '</legend>';
                                step = {
                                    'task_id': last_data_received.task_id,
                                    'symptoms': last_data_received.symptoms,
                                    'symptomsDateTime': last_data_received.symptomsDateTime,
                                    'symptom_days': last_data_received.symptom_days,
                                    'symptom_hours': last_data_received.symptom_hours
                                };
                                form = HTML.formGenerate(step, '');
                                html += form;
                                html += '</form></div>';
                                mySwiper.appendSlide(html, 'swiper-slide');
//                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
                                /* Step 3*/
                                html = '<div style="padding:10px;"><form class="form2_save">';
                                html += '<legend class="legend_task">' + results.rows.item(0).label + '</legend>';
                                step = {
                                    'task_id': last_data_received.task_id,
                                    'makingFoodDateTime': last_data_received.makingFoodDateTime,
                                    'makingFoodTotalGuests': last_data_received.makingFoodTotalGuests,
                                    'makingFoodSickGuests': last_data_received.makingFoodSickGuests,
                                    'makingFoodWhatFood': last_data_received.makingFoodWhatFood,
                                    'makingFoodEarlierEaten': last_data_received.makingFoodEarlierEaten,
                                    'guestTalkedDoctor': last_data_received.guestTalkedDoctor
                                };
                                form = HTML.formGenerate(step, '');
                                html += form;
                                html += '</form></div>';
                                mySwiper.appendSlide(html, 'swiper-slide');
//                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
                                /* Step 4*/
                                html = '<div style="padding:10px;"><form class="form2_save">';
                                html += '<legend class="legend_task">' + results.rows.item(0).label + '</legend>';
                                step = {
                                    'task_id': last_data_received.task_id,
                                    'ingredients': last_data_received.ingredients,
                                    'cooledDown': last_data_received.cooledDown,
                                    'reheated': last_data_received.reheated,
                                    'keptWarm': last_data_received.keptWarm,
                                    'restLeftAnalysis': last_data_received.restLeftAnalysis
                                };
                                form = HTML.formGenerate(step, '');
                                html += form;
                                html += '</form></div>';
                                mySwiper.appendSlide(html, 'swiper-slide');
//                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
                                /* Step 5*/
                                html = '<div style="padding:10px;"><form class="form2_save">';
                                html += '<legend class="legend_task">' + results.rows.item(0).label + '</legend>';
                                step = {
                                    'task_id': last_data_received.task_id,
                                    'immediateMeasures': last_data_received.immediateMeasures,
                                    'otherComplaints': last_data_received.otherComplaints,
                                    'guestCompensation': last_data_received.guestCompensation,
                                    'employee_id': last_data_received.employee_id,
                                    'deviation_deadline': last_data_received.deviation_deadline,
//                                    'signature': last_data_received.signature,
                                   'correctionalMeasures': last_data_received.correctionalMeasures
                                };
                                form = HTML.formGenerate(step, '');
                                html += form;
                                html += '</form></div>'+
                                    '<div data-role="popup" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">'+
                                    '<div id="signature-holder">'+
                                    '<div id="signature" data-role="none"></div>'+
                                    '</div>' +
                                    '<button id="deviation-signature-close">'+$.t("general.sign_button")+'</button>' +
                                    '</div>'+
                                    '</div>'
                                ;
                                var footer = '<div data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="none" style="border:0 !important;">'+
                                    '<div data-role="navbar"><ul>' +
                                        '<li><a href="#" onclick="mySwiper.swipePrev();" data-theme="e" class="must-be-big"><i class="fa fa-angle-left fa-2x pull-left" style="color: #4c7600;"></i> Forrige</a></li>'+
                                        '<li><a href="#" onclick="mySwiper.swipeNext();" data-theme="e" class="must-be-big">Neste <i class="fa fa-angle-right fa-2x pull-right" style="color: #4c7600;"></i></a></li>' +
                                    '</ul></div></div>';
                                $(footer).insertBefore('#forms #menu_panel');
                                mySwiper.appendSlide(html, 'swiper-slide');
                                /* Last step for redirect*/
                                html = '<div class="no_results" style="color:#00cde7;font-size:34px;">' + $.t('register.food_poison_success') + '</div>';
                                mySwiper.appendSlide(html, 'swiper-slide');
                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
                                break;
                            case 'deviation':
                                html += '<legend class="legend_task">' + results.rows.item(0).label + '</legend>';
                                html += HTML.formGenerate(last_data_received,  $.t("general.save_button"));
                                html += '</form>' +
                                    '<div data-role="popup" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">'+
                                    '<div id="signature-holder">'+
                                    '<div id="signature" data-role="none"></div>'+
                                    '</div>' +
                                    '<button id="deviation-signature-close">'+$.t("general.sign_button")+'</button>' +
                                    '</div>'+
                                    '</div>';
                                $(document).on('click', '#signature-reset' , function(e){
                                    e.preventDefault();

                                    $('input[name="signature"]').val('user name');

                                    return false;
                                });

                                $(document).off('click','#signature-trigger').on('click','#signature-trigger', function(e){
                                    e.preventDefault();

                                    openSignaturePopup();

                                    $(document).off('click','#deviation-signature-close').on('click','#deviation-signature-close' ,function(){
                                        $('#signature_pop').popup('close');
                                        /* Save maintenance for now */
                                        var dd1 = HTML.getFormValues($(document).find('#form2_save').parent());
                                        //console.log('dd1 = ');
                                        //console.log(dd1);
                                        var data_m = {
                                            'client': User.client,
                                            'token': User.lastToken,
                                            'results': JSON.stringify(dd1)
                                        };

                                        Page.apiCall('deviationForm', data_m, 'get', 'maintenanceSignDone');
                                    });

                                    return false;
                                });
                                break;
                            default:
                                console.log('930');
                                html += '<legend class="legend_task">' + results.rows.item(0).label + '</legend>';
                                html += HTML.formGenerate(last_data_received,  $.t("general.save_button"));
                                html += '</form></div>';
                                break;
                        }

                        if(d.type != 'food_poison'){
                            mySwiper.appendSlide(html, 'swiper-slide');
                            $('#' + $.mobile.activePage.attr('id')).trigger('create');
                        }
                        mySwiper.swipeTo(2, 300, true);
                        $('.overflow-wrapper').addClass('overflow-wrapper-hide');

                        $('#form2_save').on('submit', function(e) {
                            e.preventDefault();

                            var dd = HTML.getFormValues($(this).parent());
                            var go = HTML.validate($(this));
                            if (go) {
                                var deviation = false;

                                var data = {
                                    'client': User.client,
                                    'token': User.lastToken,
                                    'results': JSON.stringify(dd)
                                };
                                /*Different saving for maintenance */
                                console.log(d.type);
                                console.log(dd.task_id);
                                if(d.type == 'maintenance'){
                                    console.log('Form saved successfully. 1155');
                                    if ( !isOffline()  ) {
                                        console.log('online form save');
                                        Page.apiCall('maintenance', data, 'get', 'maintenanceDoneForm');
                                    } else {
                                        console.log('offline form save');
                                        var offline_data = {
                                            'client': User.client,
                                            'token': User.lastToken,
                                            'results': JSON.stringify(dd),
                                            'signature': offline_signature.signature
                                        };
                                        console.log(offline_data);
                                        console.log(offline_signature);
                                        db.lazyQuery({
                                            'sql': 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
                                            'data': [[
                                                'maintenance',
                                                JSON.stringify(offline_data),
                                                document.task_id,
                                                'maintenanceDoneForm'
                                            ]]
                                        },0);
                                        Page.redirect('tasks.html');
//                                        return;
                                    }
                                } else if (d.type == 'deviation') {
                                    console.log('1082 babam');
                                }else{
                                    /*food poison*/
                                    console.log(d);
                                    for (var i in dd) {
                                        if (dd.hasOwnProperty(i)) {
                                            if (last_data_received[i].deviation != undefined) {
                                                switch (last_data_received[i].type) {
                                                    case 'slider':
                                                        if (dd[i] < last_data_received[i].deviation.min || dd[i] > last_data_received[i].deviation.max) {
                                                            deviation = true;
                                                        }
                                                        break;
                                                    case 'default':
                                                        //console.log('deviation not defined: ' + last_data_received[i].type);
                                                        break;
                                                }
                                            }
                                        }
                                    }

                                    if (deviation) {
                                        console.log('if deviation');
                                        $('#confirmPopup .alert-text').html($.t('general.deviation_accept_message'));
                                        $('#confirmPopup').on(
                                            "popupafteropen", function( event, ui ) {
                                                $('#confirmButton').off('click').on('click',function(){
                                                    if ( !isOffline() ) {
                                                        console.log('aici avem prima chestie');
                                                        console.log(data);
                                                        Page.apiCall('formDeviationStart', data, 'get', 'form2_save_dev');
                                                    } else {
                                                        console.log('else if offline');
                                                        var offline_data = {
                                                            'client': User.client,
                                                            'token': User.lastToken,
                                                            'results': JSON.stringify(dd),
                                                            'category': d.type
                                                        };
                                                        db.lazyQuery({
                                                            'sql': 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
                                                            'data': [[
                                                                'formDeviationStart',
                                                                JSON.stringify(offline_data),
                                                                0,
                                                                'formDeviationStart'
                                                            ]]
                                                        },0);
                                                        console.log('Skjema Lagres');
                                                        redirect_to_forms();
                                                        /*$('#alertPopup .alert-text').html('Skjema Lagres');
                                                        $('#alertPopup').on("popupafterclose",function(){
                                                            redirect_to_forms();
                                                            $('#alertPopup').unbind("popupafterclose");
                                                        });
                                                        $('#alertPopup').popup( "open", {positionTo: 'window'});*/
                                                    }
                                                });
                                            });
                                        $('#confirmPopup').on(
                                            "popupafterclose", function( event, ui ) {
                                                //var a = false;
                                                $('#confirmButton').unbind("click");
                                            }
                                        );
                                        $('#confirmPopup').popup( "open", {positionTo: 'window'});

                                    } else {
                                        console.log('Form saved successfully. 1199');
                                        if ( !isOffline()  ) {
                                            Page.apiCall('formDeviationStart', data, 'get', 'redirect_to_forms');
                                        } else {
                                            var offline_data = {
                                                'client': User.client,
                                                'token': User.lastToken,
                                                'results': JSON.stringify(dd),
                                                'category': d.type
                                            };
                                            db.lazyQuery({
                                                'sql': 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
                                                'data': [[
                                                    'formDeviationStart',
                                                    JSON.stringify(offline_data),
                                                    0,
                                                    'formDeviationStart'
                                                ]]
                                            },0);
                                            redirect_to_forms();
                                        }
                                    }
                                }
                            }

                            return false;
                        });
                        mySwiper.swipeTo(1, 300, true);
                        mySwiper.resizeFix();
                    } else {
                        console.log('1001 + results : ');
                        var html = '<div style="padding:10px;"><ul data-role="listview" data-inset="true" data-divider-theme="b">';

                        for (var i=0;i<results.rows.length;i++) {
                            console.log(results.rows.item(i));
                            html += '<li><a href="#" data-id="' + results.rows.item(i).id + '" data-type="'+ results.rows.item(i).type +'" class="form_generator_link2"><i class="fa fa-edit"></i> ' + results.rows.item(i).label + '</a></li>';
                        }

                        html += '</ul></div>';
                        mySwiper.appendSlide(html, 'swiper-slide');
                        bind_form2_click_handler();
                        $('.overflow-wrapper').addClass('overflow-wrapper-hide');

                        $('#' + $.mobile.activePage.attr('id')).trigger('create');
                        mySwiper.swipeTo(1, 300, true);
                        mySwiper.resizeFix();
                    }
                } else {
                    //console.log('Offline');
                    noInternetError($.t("error.no_internet_for_sync"));
                }
            });
        });
    });
}

function bind_form2_click_handler() {
    $('.form_generator_link2').off('click').on('click', function(e){
        $('.overflow-wrapper').removeClass('overflow-wrapper-hide');

        var id = $(this).data('id');
        var type = $(this).data('type');
        var d = db.getDbInstance();
        console.log(id);

        d.transaction(function(tx){
            tx.executeSql('SELECT * FROM "form_item" WHERE "id"=?', [id], function(tx, results){
                if (results.rows.length > 0) {
//              if (results.rows.length == 0) {
                    console.log('forms.js form_item rows > 0');
                    var d = $.extend({}, results.rows.item(0));

                    last_data_received = JSON.parse(d.form);

                    var html = '<div style="padding:10px;"><form id="form2_save">';
                    html += '<legend class="legend_task">' + results.rows.item(0).label + '</legend>';
                    html += HTML.formGenerate(last_data_received,  $.t("general.save_button"));

                    html += '</form></div>';

                    mySwiper.appendSlide(html, 'swiper-slide');

                    $('#' + $.mobile.activePage.attr('id')).trigger('create');
                    mySwiper.swipeTo(2, 300, true);
                    $('.overflow-wrapper').addClass('overflow-wrapper-hide');

                    $('#form2_save').on('submit', function(e) {
                        e.preventDefault();

                        var dd = HTML.getFormValues($(this).parent());
                        var go = HTML.validate($(this));
                        if (go) {
                            var deviation = false;

                            var data = {
                                'client': User.client,
                                'token': User.lastToken,
                                'results': JSON.stringify(dd)
                            };

                            for (var i in dd) {
                                if (dd.hasOwnProperty(i)) {
                                    if (last_data_received[i].deviation != undefined) {
                                        switch (last_data_received[i].type) {
                                            case 'slider':
                                                if (dd[i] < last_data_received[i].deviation.min || dd[i] > last_data_received[i].deviation.max) {
                                                    deviation = true;
                                                }
                                                break;
                                            case 'default':
                                                //alert('deviation not defined: ' + last_data_received[i].type);
                                                break;
                                        }
                                    }
                                }
                            }

                            if (deviation) {
                                //alert('deviation');
                                console.log('deviation');
                                //var a = confirm($.t('general.deviation_accept_message'));
                                $('#confirmPopup .alert-text').html($.t('general.deviation_accept_message'));
                                $('#confirmPopup').on(
                                    "popupafteropen", function( event, ui ) {
                                        $('#confirmButton').off('click').on('click',function(){
                                            console.log('aici avem prima chestie');
                                            console.log(data);
                                            if ( !isOffline() ) {
                                                Page.apiCall('formDeviationStart', data, 'get', 'form2_save_dev');
                                            } else {
                                                console.log('else if offline');
                                                var offline_data = {
                                                    'client': User.client,
                                                    'token': User.lastToken,
                                                    'results': JSON.stringify(dd),
                                                    'category': d.type
                                                };
                                                db.lazyQuery({
                                                    'sql': 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
                                                    'data': [[
                                                        'formDeviationStart',
                                                        JSON.stringify(offline_data),
                                                        0,
                                                        'formDeviationStart'
                                                    ]]
                                                },0);
                                                redirect_to_forms();
                                                /*$('#alertPopup .alert-text').html("Skjema Lagres");
                                                $('#alertPopup').on("popupafterclose",function(){
                                                    $('#alertPopup').unbind("popupafterclose");
                                                    redirect_to_forms();
                                                });
                                                $('#alertPopup').popup( "open", {positionTo: 'window'});*/
                                            }
                                        });
                                });
                                $('#confirmPopup').on(
                                    "popupafterclose", function( event, ui ) {
                                        //var a = false;
                                        $('#confirmButton').unbind("click");
                                    }
                                );
                                $('#confirmPopup').popup( "open", {positionTo: 'window'});
                            } else {
                                console.log('Form saved successfully. 1302');
                                if ( !isOffline() ) {
                                    Page.apiCall('formDeviationStart', data, 'get', 'redirect_to_forms');
                                } else {
                                    var offline_data = {
                                        'client': User.client,
                                        'token': User.lastToken,
                                        'results': JSON.stringify(dd),
                                        'category': d.type
                                    };
                                    db.lazyQuery({
                                        'sql': 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
                                        'data': [[
                                            'formDeviationStart',
                                            JSON.stringify(offline_data),
                                            0,
                                            'formDeviationStart'
                                        ]]
                                    },0);
                                    redirect_to_forms();

                                }

                            }
                        }
                        console.log('forms.js 1101');
                        return false;
                    });
                } else {
                    console.log('forms.js form_item rows == 0');
                    console.log('forms.js 1105');
                    console.log('heeeeey id = ',id);
                    tx.executeSql('SELECT * FROM "forms" WHERE "type"=?', [type], function(tx, results){
                        if ( results.rows.length > 0 ) {
                            var data = {
                                'client': User.client,
                                'token': User.lastToken,
                                'category': results.rows.item(0).type
                            };

                            document.form_cat = results.rows.item(0).type;
                            console.log('data:',data);
                            console.log(results.rows.item(0));

                            Page.apiCall('formDeviationStart', data, 'get', 'formCond3');
                        } else {
                            $('#alertPopup .alert-text').html('Operation unavailable');
                            $('#alertPopup').on("popupafterclose",function(){
                                $('#alertPopup').unbind("popupafterclose");
                                $('.overflow-wrapper').addClass('overflow-wrapper-hide');
                            });
                            $('#alertPopup').popup( "open", {positionTo: 'window'});
                            //alert('Operation unavailable');
                            //$('.overflow-wrapper').addClass('overflow-wrapper-hide');
                        }

                    });
                }
            });
        });
        realignSlideHeight('max-height-form');
    });
}

function formCond3(data) {
    console.log(data);
    console.log('forms.js 1128');
//    var q = 'INSERT OR REPLACE INTO "form_item"("id", "label", "form", "type") VALUES(?,?,?,?)';
    if ( data.form_list_question instanceof Array) {
        for ( var d in data.form_list_question ) {
            if ( data.form_list_question.hasOwnProperty(d) ) {
                console.log('d itera = ', d);
                console.log(data.form_list_question[d]);
//                return;
                db.lazyQuery({
                    'sql': 'INSERT OR REPLACE INTO "form_item"("id", "label", "form", "type") VALUES(?,?,?,?)',
                    'data': [[
                        data.form_list_question[d].info.id,
                        data.form_list_question[d].info.label,
                        JSON.stringify(data.form_list_question[d].form),
                        document.form_cat
                    ]]
                },0);
            }
        }
    } else {
        db.lazyQuery({
            'sql': 'INSERT OR REPLACE INTO "form_item"("id", "label", "form", "type") VALUES(?,?,?,?)',
            'data': [[
                data.form_list_question.info.id,
                data.form_list_question.info.label,
                JSON.stringify(data.form_list_question.form),
                document.form_cat
            ]]
        },0);
    }

}

function redirect_to_forms() {
    mySwiper.swipeTo(0, 300, true);
    mySwiper.removeSlide(1);
    mySwiper.removeSlide(1);
    mySwiper.reInit();
    mySwiper.resizeFix();
    realignSlideHeight('max-height-form');
    var d = db.getDbInstance();
    d.transaction(getForms, db.dbErrorHandle);
}

function form2_save_dev(data) {
    console.log('aici avem a treia chestia');
    console.log(data);

    $('.overflow-wrapper').removeClass('overflow-wrapper-hide');

    var data_send = {
        'client': User.client,
        'token': User.lastToken,
        'task_id': data.form_deviation.last_task_inserted
    };

    console.log('aici avem a doua chestie');
    console.log(data_send);

    Page.apiCall('deviation', data_send, 'get', 'form2_save_dev_start');
}

function form2_save_dev_start(data) {

    console.log('aici avem a patra chestie');
    console.log(data);

    var html = '<div style="padding:10px;"><form id="form_deviation_save">';
    html += HTML.formGenerate(data.form_deviation,  $.t("general.save_button"));
    html += '</form>' +
        '<div data-role="popup" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">'+
        '<div id="signature-holder">'+
        '<div id="signature" data-role="none"></div>'+
        '</div>' +
        '<button id="deviation-signature-close">'+ $.t("general.save_button")+ '</button>' +
    '</div>'+
        '</div>';

    sss_temp = data.form_deviation.task_id.value;

    mySwiper.appendSlide(html, 'swiper-slide');
    $('#' + $.mobile.activePage.attr('id')).trigger('create');

    $('#signature-reset').on('click', function(e){
        e.preventDefault();

        $('input[name="signature"]').val('user name');

        return false;
    });

    $('#signature-trigger').off('click').on('click', function(e){
        e.preventDefault();
        openSignaturePopup();

        //$('#deviation-signature-close').off('click').on('click',function(){
        $(document).off('click','#deviation-signature-close').on('click','#deviation-signature-close' ,function(){
            $('#signature_pop').popup('close');
            var data = {
                'client': User.client,
                'token': User.lastToken,
                'signature': JSON.stringify({
                    "name": $('#sign_name').val(),
                    "svg": $sigdiv.jSignature("getData", "svgbase64")[1],
                    "parameter": "task",
                    "task_id": sss_temp
                })
            };
            //console.log(JSON.stringify(data));
            console.log('forms.js 1256 document sign');
            Page.apiCall('documentSignature', data, 'get', 'documentSignature');
//            Page.apiCall('documentSignature', data, 'post', 'documentSignature');
        });

        return false;
    });

    $('#form_deviation_save').on('submit', function(e){
        e.preventDefault();
        console.log('da submit');
        var go = Form.validate($(this));

        if (go) {
            $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
            $('#form_back_btn i').removeClass('hided');
            var dd = HTML.getFormValues($(this).parent());
            var data = {
                'client': User.client,
                'token':User.lastToken,
                'task_id': sss_temp,
                'form': JSON.stringify(dd)
            };

            console.log('dev save:');
            console.log(data);

            Page.apiCall('deviation', data, 'get', 'form2_save_dev_start_save');

            uploadHACCPPictureForms();
        }

        return false;
    });

    $('#form_back_btn i').removeClass('hided');
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
    mySwiper.swipeTo(2, 300, true);
    mySwiper.swipeTo(3, 300, true);
}

function documentSignature(data) {
 //   console.log('document signature:');
    if($.isNumeric(data)){
        $('input[name="task_id"]').val(data);
    }
    $('#sign_name').attr('disabled', true);
    $('#signature-trigger').attr('disabled', true);
    $('#signature-trigger').val(data.current_time.date).button('refresh');
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

$( window ).on( "orientationchange", function( event ) {

    $sigdiv.jSignature("reset");
    $('.ui-popup-container').css({
        'top': 0,
        'left': 0,
        'max-width': '100%',
        'width': '100%',
        'height': parseInt($('body').height()) + 'px',
        'overflow': 'hidden',
        'position': 'fixed'
    });
    setTimeout(function(){
        $('#signature_pop-popup').css({
            'top': 0,
            'left': 0,
            'max-width': '100%',
            'width': '100%',
            'height': parseInt($('body').height()) + 'px'
        });
        console.log('asd');
    },500);
});


function form2_save_dev_start_save() {
    console.log('am ajuns pe save');
    var d = db.getDbInstance();
    d.transaction(getForms, db.dbErrorHandle);

    mySwiper.swipeTo(0, 300, false);
    mySwiper.removeSlide(1);
    mySwiper.removeSlide(1);
    mySwiper.removeSlide(1);
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
}

function takeHACCPPicture(id) {
	navigator.camera.getPicture(
    function(uri) {

        $('#'+id).css({'visibility': 'visible', 'display': 'block'}).attr('src', uri);
    },
    function(e) {
        console.log("Error getting picture: " + e);
    },
    { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI});
    
};

/*function selectHACCPPicture(id) {
    navigator.camera.getPicture(
        function(uri) {
            if ( uri.substring(0,21) == "content://com.android") {
                photo_split = uri.split("%3A");
                uri ="content://media/external/images/media/"+photo_split[1];
            }
            $('#'+id).css({'visibility': 'visible', 'display': 'block'}).attr('src', uri);
//            $('.ui-popup-container').css({
//                'top': 0,
//                'left': 0,
//                'max-width': '100%',
//                'width': '100%',
//                'height': parseInt($('body').height()) + 'px',
//                'overflow': 'hidden',
//                'position': 'fixed'
//            });
//            $('#popupDeviation').css('height', '100%');
        },
        function(e) {
            console.log("Error getting picture: " + e);
        },
        { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY});
        realignSlideHeight('max-height-task');
};*/
function selectHACCPPicture(id) {
	if(isNative()){
		navigator.camera.getPicture(
        function(uri) {
            if ( uri.substring(0,21) == "content://com.android") {
                photo_split = uri.split("%3A");
                uri ="content://media/external/images/media/"+photo_split[1];
            }
            $('#'+id).css({'visibility': 'visible', 'display': 'block'}).attr('src', uri);

        },
        function(e) {
            console.log("Error getting picture: " + e);
        },
        { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY});
	}else{
		
		var showPicture = $('#'+id);
		$("#take_picture").change(function(event){
			console.log("change");
			
			
			var files = event.target.files,
                file;
                
               console.log("web",showPicture); 
            if (files && files.length > 0) {
                file = files[0];
                var fileReader = new FileReader();
                        fileReader.onload = function (event) {
                        	console.log("show picture");
                            // showPicture.src = event.target.result;
                            showPicture.css({'visibility': 'visible', 'display': 'block'}).attr('src', event.target.result);
                        };
                        fileReader.readAsDataURL(file);
            }
		});
		$("#take_picture").trigger( "click", id );
	}
    
        realignSlideHeight('max-height-form');
};

function uploadHACCPPictureForms() {
 //   console.log('uploadHACCPPictureForms');
 //   console.log('task_id',$('.swiper-slide-active input[name="task_id"]').val());

    // Get URI of picture to upload
    var $img = $('#'+haccp_image_id);
    var imageURI = $img.attr('src');
    if (imageURI) {
        $img.css({'visibility': 'hidden', 'display': 'none'}).attr('src', '');
        // Verify server has been entered
        server = Page.settings.apiDomain + Page.settings.apiUploadPath;
        if (server) {

            // Specify transfer options
            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
            options.chunkedMode = false;

            var params = {};
            params.task_id = $('.swiper-slide-active input[name="task_id"]').val();
            params.client = User.client;
            params.token = User.lastToken;

            options.params = params;

            // Transfer picture to server
            var ft = new FileTransfer();
            ft.upload(imageURI, server, function(r) {
                console.log("Upload successful: "+r.bytesSent+" bytes uploaded.");
            }, function(error) {
                console.log("Upload failed: Code = "+error.code);
            }, options);
        }
    }
}

/* Add employee section*/
function registerEmployee(data) {
    if (data.success) {
        var html = '';
        html = '<form id="registerEmployeeForm">';
        html += HTML.formGenerate(data.form_register_employee, $.t('nav.add_employee'));
        html += '<input type="hidden" name="edit" value="false">';
        html += '</form>';

        mySwiper.appendSlide(html, 'swiper-slide');
        $('#' + $.mobile.activePage.attr('id')).trigger('create');
        mySwiper.swipeTo(1, 300, true);

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

                //console.log(JSON.stringify(data));

                $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
                $('#form_back_btn i').addClass('hided');
                Page.apiCall('registerEmployee', data, 'get', 'registerEmployeeSucess');
            }

            return false;
        });
    }
}

function registerEmployeeSucess(data) {
//    console.log(data);
    if (data.registration_steps != undefined && data.registration_steps.error != undefined) {
        //alert($.t('error.duplicate_employee'));
        //$('.overflow-wrapper').addClass('overflow-wrapper-hide');

        $('#alertPopup .alert-text').html($.t('error.duplicate_employee'));
        $('#alertPopup').on("popupafterclose",function(){
            $('#alertPopup').unbind("popupafterclose");
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
        });
        $('#alertPopup').popup( "open", {positionTo: 'window'});
    } else {
        $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
//        add_employeeInit();
        mySwiper.swipeTo(0, 300, false);
        mySwiper.removeSlide(1);
    }
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
}


/* Add supplier section */
function registerSupplier(data) {
    if (data.success) {
        var html = '';
        html = '<form id="registerSupplierForm">';
        html += HTML.formGenerate(data.form_register_supplier, $.t('nav.add_supplier'));
        html += '<input type="hidden" name="edit" value="false">';
        html += '</form';
//        $('#add_supplier_container').html(html);
//        $('#' + $.mobile.activePage.attr('id')).trigger('create');
        mySwiper.appendSlide(html, 'swiper-slide');
        $('#' + $.mobile.activePage.attr('id')).trigger('create');
        mySwiper.swipeTo(1, 300, true);

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

                //console.log(JSON.stringify(data));

                $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
                Page.apiCall('registerSupplier', data, 'get', 'registerSupplierSuccess');
            }

            return false;
        });
    }
}

function registerSupplierSuccess(data) {
    if (data.registration_steps != undefined && data.registration_steps.error != undefined) {
        console.log($.t('error.duplicate_employee'));
//        $('.overflow-wrapper').addClass('overflow-wrapper-hide');
    } else {
        console.log($.t('success.added_supplier'));
        $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
//        add_supplierInit();
    }
    mySwiper.swipeTo(0, 300, false);
    mySwiper.removeSlide(1);
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
}
