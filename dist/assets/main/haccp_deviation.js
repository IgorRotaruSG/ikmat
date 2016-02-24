var get;
var $sigdiv;
var haccp_image_id;

function haccp_deviationInit() {
	console.log("haccp_deviationInit");
    if (User.isLogged()) {
        get = Page.get();

        var data = {
            'client': User.client,
            'token': User.lastToken,
            'task_id': get.id
        }
        if ( !isOffline() ) {
            Page.apiCall('deviation', data, 'get', 'haccpDeviation');
        } else {
            var d = db.getDbInstance();
            d.transaction(function(tx){
                tx.executeSql('SELECT "taskData" FROM "tasks" WHERE "id"=?', get.id, function(tx, results){
                    if ( results.rows.item(0).taskData != '' && results.rows.item(0).taskData != null ) {
                        getTaskData(JSON.parse(results.rows.item(0).taskData));
                    } else {
                        $('#alertPopup .alert-text').html($.t("error.no_internet_for_sync"));
                        $('#alertPopup').off("popupafterclose").on("popupafterclose",function(){
                            //window.location.href = 'index.html';
                        });
                        $('#alertPopup').popup( "open", {positionTo: 'window'});
                    }
                });
            });
            haccpDeviation(data);
        }

    } else {
        Page.redirect('login.html');
    }
}

function haccpDeviation(data) {
    var s = false;
    //console.log(data);
    if (data.form_deviation) {
        var f = data.form_deviation;
        var html = '';
        for (var i in f) {
            if (f.hasOwnProperty(i)) {
                switch (f[i].type) {
                    case 'textarea':
                        if(!f[i].value){
                           f[i].value = '';
                        }
                        html += Form.textarea(i, f[i].label, f[i].placeholder, f[i].validation,f[i].value);
                        break;
                    case 'date':
                        html += HTML.inputDate(i, f[i].label, f[i].placeholder, null, true, f[i].validation);
                        break;
                    case 'select':
                        html += HTML.selectBox(i, f[i].label, f[i].list, '', f[i].validation);
                        break;
                    case 'file':
                        html += Form.fileBox(i, f[i].label);
                        break;
                    case 'signature':
                        s = true;
                        html += Form.signature(i, f[i].label);
                        break;
                }
            }
        }
        console.log('111 haccp_deviation.js');
        html += Form.submitHACCP();

        $('#' + $.mobile.activePage.attr('id') + ' #form_haccp_deviation').html(html);
        $('#' + $.mobile.activePage.attr('id') + ' #form_haccp_deviation').off('submit').on('submit', function(e){
            e.preventDefault();
            var go = Form.validate($(this));

            if (go) {
                var dd = Form.getValues($(this));
                var data = {
                    'client': User.client,
                    'token':User.lastToken,
                    'task_id': get.id,
                    'form': JSON.stringify(dd)
                };
                Page.apiCall('deviation', data, 'get', 'haccpDeviationSave2');
                uploadHACCPPictureHaccpDev();
            }
            return false;
        });


        $('#' + $.mobile.activePage.attr('id') + ' #signature-trigger').off('click').on('click', function(e){
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
                //console.log(JSON.stringify(data));

                Page.apiCall('documentSignature', data, 'get', 'documentSignature');
//                Page.apiCall('documentSignature', data, 'post', 'documentSignature');
            });

            return false;
        });

        $('#' + $.mobile.activePage.attr('id')).trigger('create');

    } else {
        $('#alertPopup .alert-text').html($.t("error.404"));
        $('#alertPopup').off("popupafterclose").on("popupafterclose",function(){
            Page.redirect('index.html');
        });
        $('#alertPopup').popup( "open", {positionTo: 'window'});

    }
}

function documentSignature(data) {
    console.log('signature:');
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

function selectHACCPPicture(id) {
	Page.selectImage(id, function(uri){
		$('#'+id).css({'visibility': 'visible', 'display': 'block'}).attr('src', uri);
	});
};

function uploadHACCPPictureHaccpDev() {
    // Get URI of picture to upload
    var $img = $('#'+haccp_image_id);
    var imageURI = $img.attr('src');
    Page.uploadImage(imageURI, function(data){
    	$img.css({'visibility': 'hidden', 'display': 'none'}).attr('src', '');
    });
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

function haccpDeviationSave2(data) {
    //Page.redirect('haccp_deviation_fix.html?id=' + get.id);
    if (get.return_haccp_id != undefined) {
        Page.redirect('haccp.html?continue=' + get.return_haccp_id);
    } else {
        Page.redirect('tasks.html');
    }
}