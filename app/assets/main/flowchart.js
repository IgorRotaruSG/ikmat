var mySwiper;
var _h_content = 0;
var _t;

//navigator.connection.type = Connection.NONE;

function getFlowchartCall(error, results) {
    if ( !isOffline() ) {
        var data = {
            'client': User.client,
            'token': User.lastToken
        };
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

function getFlowcharts() {
	db.getDbInstance('flowchart').allDocs({'include_docs': true}, getFlowchartCall);
}

function flowchartInit() {
    if (User.isLogged()) {
        executeSyncQuery();
        getFlowcharts();

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
                    var thumb = settings.apiPath + data.flowcharts[i]['path'] + 'thumbnails/' + data.flowcharts[i]['thumbnail'];
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
            $('.flowchart_list').html(add);
            $('.swipebox').swipebox({
                useCSS : true, // false will force the use of jQuery for animations
                useSVG : true, // false to force the use of png for buttons
                initialIndexOnArray : 0, // which image index to init when a array is passed
                hideCloseButtonOnMobile : true, // true will hide the close button on mobile devices
                hideBarsDelay : 17000, // delay before hiding bars on desktop
                videoMaxWidth : 1140, // videos max width
                beforeOpen: function() {
                	 // Set envelope icon for app, pdf icon for web
        			if (isNative()) {
           				 $('.fa-file-pdf-o').addClass('fa-envelope-o');
           				 $('.fa-envelope-o').removeClass('fa-file-pdf-o');
        			} else {
           				 $('.fa-envelope-o').addClass('fa-file-pdf-o');
           				 $('.fa-file-pdf-o').removeClass('fa-envelope-o');
        			}
                }, // called before opening
                afterOpen: function(){
                	 // Set envelope icon for app, pdf icon for web
        			if (isNative()) {
           				 $('.fa-file-pdf-o').addClass('fa-envelope-o');
           				 $('.fa-envelope-o').removeClass('fa-file-pdf-o');
        			} else {
           				 $('.fa-envelope-o').addClass('fa-file-pdf-o');
           				 $('.fa-file-pdf-o').removeClass('fa-envelope-o');
        			}
                	// new RTP.PinchZoom($('div .current'), {});
                }, // called after opening
                afterClose: function() {      
                }, // called after closing
                loopAtEnd: true // true will return to the first image after the last image is reached
            });
            $('a[data-id="'+data.flowcharts[0]['id']+'"]').trigger("click");
        } else {
            $('#no_results_flowchart').text($.t('error.no_data'));
            $('#no_results_flowchart').show();
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
        }
        // var reset_button = '<div class="row text-center" style="margin-top:20px;">' +
                                // '<button title="Load more" id="reset-flowchart">Reset <i class="fa fa-undo"></i></button>' +
                            // '</div>';
        // $('#flowchart_list').append(reset_button);
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
            $.each( $('*[data-lang]'), function( k, v ) {
                var tKey = $(v).attr('data-lang');
                $(v).find("span.ui-btn-text").text($.t(tKey));
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

function printFlowchart(flowchartSrc, flowchartTitle){
    if(isNative() && cordova.plugins && cordova.plugins.email) {
    	var urlDocument =  encodeURI(flowchartSrc);
        cordova.plugins.printer.print(urlDocument, {name: 'Document.html', landscape: false}, function () {
        //alert('printing finished or canceled')
        });
    }
    else {
        w=window.open();

        var flowchartHtml = '<style>' +
        '.image_element {' +
            'width: 96%;' +
            'height: 96%;' +
            'text-align: left;' +
            'line-height: normal;' +
            'display: block;' +
            'margin: 0 1px 1px 0;' +
            'float: left;' +
        '}' +
        '.image_element a {' +
            'display: block;' +
            'height: 100%;' +
            'width: 100%;' +
            'padding-left: 20px' +
        '}' +
        '.image_element a img {' +
            'max-width:100% !important;' +
            'max-height:100%!important;' +
            'display:block;' +
        '}' +
        '</style>' +
        '<div class="image_element">' +
            '<strong>' + flowchartTitle + '</trong><br>' +
            '<a class="ui-link"><img src="' + flowchartSrc + '" /></a>' +
        '</div>';

        w.document.write('<title>HACCP</title>');
        w.document.write(flowchartHtml);
        w.print();
        //w.close();
    }
    return;
}

function emailFlowchart(flowchartId){
	console.log("flowchartId", $('.flowchart_list').find('a[data-id='+ flowchartId +']'));
	var flowEle = $('.flowchart_list').find('a[data-id='+ flowchartId +']');

    $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
    var email_data = {
        'client' : User.client,
        'token' : User.lastToken,
        'report_id' : 15,
        'flowchart_id' : flowchartId,
        'flowchart_name' : $(flowEle).attr("title")
    };

    // Open app on mobile
    if (isNative()) {
            Page.apiCall('exportBase64ReportPdf', email_data, 'get', 'openNativeEmail', email_data);
    } else {
        Page.apiCall('exportReportPdfForDownload', email_data, 'get', 'downloadPdf', email_data);
    }
}

function openNativeEmail(pdf, email_data){
    var subject = "Flytskjema " + email_data.flowchart_name;
    var companyName = localStorage.getItem('company_name');
    subject += companyName ? (" av " + companyName) : "";
  
    var mailObject = {
        subject: subject,
        cc: localStorage.getItem("user_email") ? localStorage.getItem("user_email"): "",
    };
    
    console.log ("email object flow chart: ", mailObject);
    
    if(pdf){
        mailObject.attachments = "base64:" + pdf.name + "//" + pdf.data;
    }
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
    /* Open native mail on mobile */
    if(isNative() && cordova.plugins && cordova.plugins.email) {
        cordova.plugins.email.isAvailable(
            function (isAvailable) {
                cordova.plugins.email.open(mailObject);
            }
        );
    }
}

//Same as downloadPdf function in reports.js
function downloadPdf(pdf, email_data){
    if (pdf.data) {
        window.open(pdf.data, '_blank');
    }
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
}

function removeFlowchart (data){
    if ( data.success && data.success == "true" && data.flowchart_id ) {

        //$('#swipebox-slider .slide.current').remove();
        $('#swipebox-close').trigger("click");

        $('a[data-id="'+ data.flowchart_id +'"]').parent().remove();
        if ( $('.flowchart_list .image_element').length == 0 ) {
            $('#no_results_flowchart').text($.t('error.no_data'));
            $('#no_results_flowchart').show();
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
        }
    }
}

function resetFlowchart(data){
    if ( data.success && data.success == true) {
        //console.info('Success');
        getFlowcharts();
    }
}


function sendEmailFlowchart(data) {
    $('#confirm-send').removeAttr('disabled');
    $("#confirm-send").parent().find('.ui-btn-text').html($.t('general.send'));

    $('#popup-send-email-flowchart').popup('close');
    $('.swiper-slide-active').scrollTop(0);
}