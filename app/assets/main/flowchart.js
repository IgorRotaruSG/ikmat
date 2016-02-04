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
                	// new RTP.PinchZoom($('div .current'), {});
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
	console.log("flowchartId", $('#flowchart_list').find('a[data-id='+ flowchartId +']'));
	var flowEle = $('#flowchart_list').find('a[data-id='+ flowchartId +']');
	var data = {
		'image': $(flowEle).attr("href"),
		'title': $(flowEle).attr("title")
	};
	openNativeEmail(data);
    return;
}

function openNativeEmail(data){
    var subject = (data.title + " Flytskjema").toUpperCase();
    var mailObject = {
        subject: subject,
        cc: localStorage.getItem("user_email") ? localStorage.getItem("user_email"): "",
    };

    if(data.image.length > 0){
    	if(isNative()){
    		mailObject.isHtml = true;
    		mailObject.body = '<div>Trykk på lenken nedenfor for å se flytskjema: </div>' + '<div><a href="' + encodeURI(data.image) + '"><img width="100%" alt="' + encodeURI(data.image) + '" src="' + encodeURI(data.image) + '" ></a></div>';
    	}else{
    		mailObject.body = 'Trykk på lenken nedenfor for å se flytskjema: \n' + encodeURI(data.image);
    	}
            
    }
    /* Open native mail on mobile */
    if(isNative() && cordova.plugins && cordova.plugins.email) {
        cordova.plugins.email.isAvailable(
            function (isAvailable) {
                cordova.plugins.email.open(mailObject);
            }
        );
    } else { /* Open native mail on web */
        var mailto_link = 'mailto:?subject='+mailObject.subject+'&cc='+mailObject.cc+'&body=' + mailObject.body + '&attachment=' + encodeURI(data.image);
        location.href = mailto_link;

    }
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
        getFlowcharts();
    }
}


function sendEmailFlowchart(data) {
    $('#confirm-send').removeAttr('disabled');
    $("#confirm-send").parent().find('.ui-btn-text').html($.t('general.send'));

    $('#popup-send-email-flowchart').popup('close');
    $('.swiper-slide-active').scrollTop(0);
}