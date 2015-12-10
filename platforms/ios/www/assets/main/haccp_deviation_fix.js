/*
var get;

function haccp_deviation_fixInit() {
    console.log('haccp_deviation_fixInit');
    if (User.isLogged()) {
        get = Page.get();

        var data = {
            'client': User.client,
            'token': User.lastToken,
            'task_id': get.id
        };
        if ( !isOffline() ) {
            Page.apiCall('deviation', data, 'get', 'haccpDeviationFix');
        } else {
            setTimeout(function(){
                noInternetError($.t("error.no_internet_for_sync"));
            },1500);
            return;
        }

        $('#form_haccp_deviation_fix').off('submit').on('submit', function(e){
            e.preventDefault;

            var go = HTML.validate($(this).parent());

            if (go) {
                var dd = Form.getValues($(this));
                var data = {
                    'client': User.client,
                    'token':User.lastToken,
                    'task_id': get.id,
                    'form': JSON.stringify(dd)
                };

                Page.apiCall('deviation', data, 'get', 'haccpDeviationFixSave');

                uploadHACCPFixPicture();

                db.lazyQuery({
                    'sql': 'UPDATE "tasks" SET "completed"=? WHERE "id"=?',
                    'data': [['1',get.id]]
                },0);

            }

            return false;
        });

    } else {
        Page.redirect('login.html');
    }
}

function uploadHACCPFixPicture() {
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
            params.task_id = get.id;
            params.client = User.client;
            params.role = 'fixed';
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

function haccpDeviationFix(data) {
    console.log('haccpDeviationFix data: ');
    if (data.form_fix_deviation) {
        //var d = new Date(data.form_fix_deviation.deviation_date.date);
        var d = new Date(data.form_fix_deviation.deviation_date.date.replace(' ', 'T'));
        var html = '<h3>'+ $.t('tasks.deviation_fix') +'</h3>';

        if (data.form_fix_deviation.deviation_photos != undefined && (data.form_fix_deviation.deviation_photos).length > 0) {
            var p = $.parseJSON(data.form_fix_deviation.deviation_photos);
            for (var i in p) {
                if (p.hasOwnProperty(i)) {
                    html += '<img width="100%" height="auto" style="margin:0 auto;" src="' + p[i] + '" />';
                }
            }
        }

        html += '<fieldset data-role="controlgroup">'+ $.t("haccp_deviation_fix.deviation")+ ': ' + data.form_fix_deviation.deviation.replace(/\+/g,' ') + '</fieldset>';

        html += '<fieldset data-role="controlgroup">'+ $.t("haccp_deviation_fix.initial_action")+ ': ' + data.form_fix_deviation.initial_action.replace(/\+/g,' ') + '</fieldset>';

        html += '<fieldset data-role="controlgroup">'+ $.t("haccp_deviation_fix.deviation_date")+ ': ' + d.getDate() + '.' + (parseInt(d.getMonth()) + 1) + '.' + d.getFullYear() + '</fieldset>';

        html += '<fieldset data-role="controlgroup">'+ $.t("haccp_deviation_fix.responsible")+ ': ' + (data.form_fix_deviation.form.responsible_fix_deviation.value+'').replace(/\+/g,' ') + '</fieldset>';

        html += '<hr />';

        data.form_fix_deviation.form['signature'] = {
            'type': 'signature',
            'label': 'Signature'
        };

        html += HTML.formGenerate(data.form_fix_deviation.form,  $.t("general.save_button"), 'dev');
        html +='<div data-role="popup" id="signature_pop" data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">'+
                    '<div id="signature-holder">'+
                        '<div id="signature" data-role="none"></div>'+
                        '</div>' +
                        '<button id="deviation-signature-close">'+$.t("general.sign_button")+'</button>' +
                    '</div>'+
                '</div>';

        $('#form_haccp_deviation_fix').html(html);
        $('#' + $.mobile.activePage.attr('id')).trigger('create');
        $('#signature-reset').on('click', function(e){
            e.preventDefault();

            $('input[name="signature"]').val('user name');

            return false;
        });
        $('#signature-trigger').off('click').on('click', function(e){
            e.preventDefault();

            openSignaturePopup();

            $(document).off('click','#deviation-signature-close').on('click','#deviation-signature-close' ,function(){
                $('#signature_pop').popup('close');
                var data = {
                    'client': User.client,
                    'token': User.lastToken,
                    'signature': JSON.stringify({
                        "name": $('#sign_name').val(),
                        "svg": $sigdiv.jSignature("getData", "svgbase64")[1],
                        "parameter": "task",
                        "task_id": get.id
                    })
                };

                Page.apiCall('documentSignature', data, 'post', 'documentSignature');
            });

            return false;
        });
    } else {
        Page.redirect('haccp_deviation.html?id='+get.id);
    }
}

function documentSignature(data) {
    $('#sign_name').attr('disabled', true);
    $('#signature-trigger').attr('disabled', true);
    $('#signature-trigger').val(data.current_time.date).button('refresh');
}

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

function selectHACCPPicture(id) {
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
    resizePage('haccp_deviation_fix');
};

function haccpDeviationFixSave(data) {
    Page.redirect('tasks.html');
}*/
