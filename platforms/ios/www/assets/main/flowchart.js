var mySwiper;
var _h_content = 0;
var _t;

//navigator.connection.type = Connection.NONE;

function getFlowchartCall(tx, results) {
    if ( !isOffline() ) {
        var data = {
            'client': User.client,
            'token': User.lastToken
        }
        Page.apiCall('flowchart', data, 'get', 'showFlowchart');
    } else {
        $('#alertPopup .alert-text').html($.t("error.no_internet_for_sync"));
        $('#alertPopup').on("popupafterclose",function(){
            $('#alertPopup').unbind("popupafterclose");
            window.location.href = 'index.html';
        });
        $('#alertPopup').popup( "open", {positionTo: 'window'});
        $('#no_results_flowchart').text($.t('forms.no_forms_connection'));
        $('.overflow-wrapper').addClass('overflow-wrapper-hide');
    }
    mySwiper.reInit();
    mySwiper.resizeFix();
}

function getFlowcharts(tx) {
    tx.executeSql('SELECT * FROM "flowchart"', [], getFlowchartCall);
}

function flowchartInit() {
    if (User.isLogged()) {
        executeSyncQuery();
        var d = db.getDbInstance();
        d.transaction(getFlowcharts, db.dbErrorHandle);

        mySwiper = new Swiper('.swiper-container-flowchart',{
            calculateHeight:        true,
            releaseFormElements:    true,
            preventLinks:           true,
            simulateTouch:          true,
            keyboardControl : false,
            noSwiping : true,
            noSwipingClass: 'ui-slider',
            onInit: function() {
                setSwiperMinHeight();
            },
            onSlideNext:            function(swiper) {
            },

            onSlidePrev:            function(swiper) {
            },

            onSlideChangeEnd:       function(swiper) {
            }
        });

    } else {
        Page.redirect('login.html');
    }
}

function showFlowchart(data) {
    if (data.success) {
        var add = '';
        if ( data.flowcharts.length > 0 ) {
            for (var i in data.flowcharts) {
                if ((data.flowcharts).hasOwnProperty(i)) {
                    //var thumb = settings.apiPath + data.flowcharts[i]['path'] + 'small/' + data.flowcharts[i]['name'];
                    //var big = settings.apiPath + data.flowcharts[i]['path'] + 'large/' + data.flowcharts[i]['name'];
                    var thumb = settings.apiPath + data.flowcharts[i]['path'] + 'originals/' + data.flowcharts[i]['name'];
                    var big = settings.apiPath + data.flowcharts[i]['path'] + 'originals/' + data.flowcharts[i]['name'];
                    add += '<div class="image_element">' +
                                '<a href="'+ big +'" class="swipebox" title="'+ data.flowcharts[i]['description'] +'" data-id="'+data.flowcharts[i]['id']+'" >' +
                                '<img src="'+thumb+'" alt="image" />' +
                                '</a>' +
                            '</div>';
                }
            }
            add += '<div class="clearfix"></div>';
            $('#no_results_flowchart').hide();
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
            $('#flowchart_list').html(add);
            $('.swipebox').swipebox({
                useCSS : true, // false will force the use of jQuery for animations
                useSVG : true, // false to force the use of png for buttons
                initialIndexOnArray : 0, // which image index to init when a array is passed
                hideCloseButtonOnMobile : true, // true will hide the close button on mobile devices
                hideBarsDelay : 17000, // delay before hiding bars on desktop
                videoMaxWidth : 1140, // videos max width
                beforeOpen: function() {
                }, // called before opening
                afterOpen: function(){
                }, // called after opening
                afterClose: function() {}, // called after closing
                loopAtEnd: true // true will return to the first image after the last image is reached
            });
            $('a[data-id="'+data.flowcharts[0]['id']+'"]').trigger("click");
        } else {
            $('#no_results_flowchart').text($.t('error.no_data'));
            $('#no_results_flowchart').show();
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
        }
        var reset_button = '<div class="row text-center" style="margin-top:20px;">' +
                                '<button title="Load more" id="reset-flowchart">Reset <i class="fa fa-undo"></i></button>' +
                            '</div>';
        $('#flowchart_list').append(reset_button);
        $('#' + $.mobile.activePage.attr('id')).trigger('create');
        $('#reset-flowchart').off('click').on('click',function(){
            var data = {
                'client': User.client,
                'token': User.lastToken
            };
            Page.apiCall('resetFlowchart', data, 'get', 'resetFlowchart');
        });

    }
}

$( window ).on( "orientationchange", function( event ) {

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
    },500);
});

function deleteFlowchart(flowchartId){
    confirm_action = false;
    $('#confirmPopup .alert-text').html($.t('general.flowchart_delete'));
    $('#confirmPopup').off("popupafteropen").on(
        "popupafteropen", function( event, ui ) {
            $('#confirmButton').off('click').on('click',function(){
                confirm_action = true;
                $('#confirmPopup').popup('close');
            });
        });
    $('#confirmPopup').off("popupafterclose").on(
        "popupafterclose", function( event, ui ) {
            //var a = false;
            $('#confirmButton').unbind("click");
            if ( confirm_action ) {
                if ( !isOffline() ) {
                    var data = {
                        'client': User.client,
                        'token': User.lastToken,
                        'flowchart_id': flowchartId
                    };
                    Page.apiCall('removeFlowchart', data, 'get', 'removeFlowchart');
                }
            } else {
                console.log("du nathing");
            }
        }
    );
    $('#confirmPopup').popup( "open", {positionTo: 'window'});

}

function printFlowchart(flowchartSrc){
    cordova.plugins.printer.print(encodeURIComponent(flowchartSrc), {name: 'Document.html', landscape: true}, function () {
        //alert('printing finished or canceled')
    });
    return;
}

function emailFlowchart(flowchartId){
    $('#popup-send-email-flowchart').unbind("popupafterclose");
    /*step 1: display the date chooser*/
    $("#popup-send-email-flowchart").popup("open");
    $("#popup-send-email-flowchart").parent().css({
        'top': 0,
        'left': 0,
        'max-width': '100%',
        'width': '100%',
        'height': parseInt($('body').height()) + 'px',
        'overflow': 'hidden',
        'position': 'fixed'
    });
    $('#popup-send-email-flowchart').css('height', '100%');

    $("#confirm-send").off('click').on("click", function( event, ui ) {
        var ok = HTML.validate($('#popup-send-email-flowchart'));

        if ( ok ) {
            $("#confirm-send").attr('disabled', true);
            $("#confirm-send").parent().find('.ui-btn-text').html($.t('general.loading'));
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
            var email_data = {
                'client': User.client,
                'token': User.lastToken,
                'report_id': 15,//flowcharts report
                'flowchart_id': flowchartId,//flowchart id to send in email
                'email' : $('#email').val()
            };
            Page.apiCall('send-report-by-email', email_data, 'get', 'sendEmailFlowchart');
        }
    });
    return;
}

function removeFlowchart (data){
    if ( data.success && data.success == "true" && data.flowchart_id ) {

        //$('#swipebox-slider .slide.current').remove();
        $('#swipebox-close').trigger("click");

        $('a[data-id="'+ data.flowchart_id +'"]').parent().remove();
        if ( $('#flowchart_list .image_element').length == 0 ) {
            $('#no_results_flowchart').text($.t('error.no_data'));
            $('#no_results_flowchart').show();
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
        }
    }
}

function resetFlowchart(data){
    if ( data.success && data.success == true) {
        //console.info('Success');
        var d = db.getDbInstance();
        d.transaction(getFlowcharts, db.dbErrorHandle);
    }
}


function sendEmailFlowchart(data) {
    $('#confirm-send').removeAttr('disabled');
    $("#confirm-send").parent().find('.ui-btn-text').html($.t('general.send'));

    $('#popup-send-email-flowchart').popup('close');
    $('.swiper-slide-active').scrollTop(0);
}