var get;
var $sigdiv;

function getTask() {
	db.getDBInstance('tasks').get(get.id, getTaskCall);
}

function getTaskCall(error, results) {
    if (error) {
        alert('Task not found!');
        Page.redirect('tasks.html');
    } else {
        if (results.taskData == '' || results.taskData == null || (results.taskData).length == 0) {
            if (isOffline()) {
                alert('This task has not fetched information. Please connect to internet.');
                Page.redirect('tasks.html');
            } else {
                var data = {
                    'client': User.client,
                    'token': User.lastToken,
                    'task_id': get.id
                };
                Page.apiCall('getTask', data, 'get', 'taskInfo');
            }

        } else {
            completedDate = '';
            if (results.completeDate != '' && results.completeDate != null) {
                completedDate = $.parseJSON(results.completeDate);
            }

            taskData = '';
            if (results.taskData != '' && results.taskData != null) {
                taskData = $.parseJSON(results.taskData)
            }

            var data = {
                'tasks': {
                    'taskName': results.title,
                    'completedBy': results.completedBy,
                    'completeDate': completedDate,
                    'taskData': taskData
                }
            };
            showTaskInfo(data);
        }
    }
}

function task_viewInit() {
    if (User.isLogged()) {
        get = Page.get();

        getTask();
    } else {
        Page.redirect('login.html');
    }
}


function taskInfo(data) {
    var html = '';
    if (data.success) {
        if (data.tasks != undefined && data.tasks.taskData != undefined) {
            q = 'UPDATE tasks SET "taskData" = ' + "'" + JSON.stringify(data.tasks.taskData) + "'" + ' WHERE "id" = "' + data.tasks.id + '"';
            db.clean();
            db.execute(q);
        }
        showTaskInfo(data);
    }

}

function showTaskInfo(data) {
    console.log('----------------------------------------------------');
    console.log(data);

    var html = '';
    if (data.success) {
        if (data.form_list_question) {
            html += '<form id="task_form_submit">';
            html += '<legend>' + data.form_list_question.label + '</legend>';
            html += Form.inputHidden('type', data.form_list_question.type);
            html += Form.inputHidden('question_id', data.form_list_question.id);
            html += Form.inputHidden('module', data.form_list_question.module);
            html += Form.inputHidden('task_id', get.id);

            var f = data[data.form_list_question.type];
//            console.log(f);
            for (var i in f) {
                if (f.hasOwnProperty(i)) {
                    inp = f[i];
                    /*console.log('inp ---------------------------------------');
                    console.log(inp);*/
                    if (inp.input != undefined) {
                        switch (inp.input.type) {
                            case 'text':
                                html += Form.inputText(i, inp.label, inp.input.placeholder, inp.validation, inp.name, inp.value);
                                break;
                            case 'multiple_text':
                                if (i == 'form12' || i == 'form13' || i == 'form14' || i == 'form15' || i == 'form16') {
                                    html += Form.multipleInputTextFridge(j, inp.label, inp.input.placeholder, inp.validation, inp.input.fields);
                                } else {
                                    html += Form.multipleInputText(j, inp.label, inp.input.placeholder, inp.validation);
                                }
                                break;
                            case 'textarea':
                                html += Form.textarea(i, inp.label, inp.input.placeholder, inp.validation);
                                break;
                            case 'select':
                                html += Form.selectBox(i, inp.label, inp.input.data, inp.input.placeholder, inp.validation);
                                break;
                            case 'checkbox_list':
                                html += Form.checkboxList(i, inp.label, inp.input.value, inp.answers, inp.name);
                                break;
                            case 'multiple_text_color':
                                html += Form.multipleTextColor(i, inp.label, inp.answers);
                                break;
                            case 'radio_list':
                                if (i == 'form7' || i == 'form9' || i == 'form8' || i == 'form11') {
                                    html += Form.radioList(i, inp.label, inp.input.value, inp.answers, inp.name, true);
                                } else {
                                    html += Form.radioList(i, inp.label, inp.input.value, inp.answers, inp.name);
                                }
                                break;
                            case 'date':
                                if (i == 'form7' || i == 'form9' || i == 'form8' || i == 'form11') {
                                    html += Form.inputDate(i, inp.label, inp.input.placeholder, true);
                                } else {
                                    html += Form.inputDate(i, inp.label, inp.input.placeholder);
                                }
                                break;
                            case 'custom':
                                html += Form.customStep10(i, inp.label, inp.measurement_question_id, inp.frequency, inp.haccp);
                                break;
                            case 'text_clicker':
                                html += Form.clickIncrement(i, inp.label, inp.input.data, inp.validation);
                                break;
                            case 'slider':
                                html += Form.slider(i, inp.label, inp.unit, inp.interval.min, inp.interval.max, 0);
                                break;
                        }
                    }
                }
            }

            html += Form.submitButton();
            html += '</form>';

            $('#task_info').html(html);
            $('#' + $.mobile.activePage.attr('id')).trigger('create');

            $('#task_form_submit').submit(function(e){
                e.preventDefault();

                var dd = Form.getValues($(this));

                var data = {
                    'client': User.client,
                    'token': User.lastToken,
                    'results': JSON.stringify(dd)
                };

                console.log(data);

                Page.apiCall('formDeviationStart', data, 'get', 'saveFormFridgeDone');

                return false;
            });
        }
    }

/*    var html = '';
    var type = '';
    if (data.form_list_question != undefined) {
        for (var i in data.form_list_question) {
            if ((data.form_list_question).hasOwnProperty(i)) {
                if (data.form_list_question[i].task_id == get.id) {
                    type = data.form_list_question[i].type;
                    break;
                }
            }
        }
        console.log(type);
        switch (type) {
            case 'form_cooler_and_fridges':
                html += '<form id="form_fridge">'
                *//*for (var i in data[type]) {
                 if ((data[type]).hasOwnProperty(i)) {
                 switch (data[type][i].input.type) {*//*
                html += '<input type="hidden" value="' + data[type][0][type].id + '" name="cooler_frizer_id">';
                html += '<input type="hidden" value="fridge" name="type">';
                html += '<input type="hidden" value="coolers_and_fridges" name="module">';
                html += '<input type="hidden" value="' + get.id + '" name="task_id">';
                html += Form.slider('temperature', data[type][0][type].label, data[type][0][type].form_fridge.temperature.unit, data[type][0][type].form_fridge.temperature.interval.min, data[type][0][type].form_fridge.temperature.interval.max, 0);
                *//*        }
                 }
                 }*//*
                html += '</form>';
                html += '<a href="" onclick="saveFridge();" data-role="button">Save</a>';
                break;
            case 'form_cooling_down_food':
                html += '<form id="form_food">'
                html += '<input type="hidden" value="' + data[type][0][type].id + '" name="question_id">';
                html += '<input type="hidden" value="cooling_food" name="type">';
                html += '<input type="hidden" value="measurement_questions" name="module">';
                html += '<input type="hidden" value="' + get.id + '" name="task_id">';
                var form = data[type][0][type];
                for (var i in form) {
                    if (form.hasOwnProperty(i) && i != 'label' && i != 'id' && i != 'type') {
                        switch (form[i].input.type) {
                            case 'text':
                                html += Form.inputText(i, form[i].label, form[i].input.placeholder, form[i].validation);
                                break;
                            case 'slider':
                                html += Form.slider(i, form[i].label, form[i].unit, form[i].interval.min, form[i].interval.max, 0);
                                break;
                        }
                    }
                }
                html += '</form>'
                html += '<a href="" onclick="saveFormFood();" data-role="button">Save</a>';
                break;
            case 'form_food':
            case 'text':
                //html += Form.inputText('question', data.form_list_question[0].label, '', {});
                html += '<input type="text" name="answer" class="sendThis" placeholder="" />';
                html += '<a href="" onclick="markTaskAsComplete();" data-role="button">Save</a>';
                break;
        }
    } else {
        if (data.tasks.completed) {
            $('#task_view').find('#mark_as_complete').hide();
            var t = (data.tasks.completeDate.date).split(' ');
            html += '<li data-role="list-divider">' + data.tasks.taskName  + '</li>';
            html += '<li><label class="left">Completed by:</label><span class="right">' + data.tasks.completedBy + '</span></li>';
            html += '<li><label class="left">Completed date:</label><span class="right">' + t[0] + '</span></li>';
            html += '<li></li>';

            if (data.tasks) {
                for (i in data.tasks.taskData) {
                    if (data.tasks.taskData[i] !== null && data.tasks.taskData[i].date !== undefined) {
                        var t = (data.tasks.taskData[i].date).split(' ');
                        html += '<li><label class="left">' + i + ':</label><span class="right">' + t[0] + '</span></li>';
                    } else {
                        if (data.tasks.taskData[i] != null) {
                            html += '<li><label class="left">' + i + ':</label><span class="right">' + data.tasks.taskData[i] + '</span></li>';
                        }
                    }
                }
            }
        } else {
            if (data.tasks.taskData) {
                $('#task_view').find('#mark_as_complete').show();
                html += '<li data-role="list-divider">' + data.tasks.taskName  + '</li>';
                for (var i in data.tasks.taskData.form) {
                    html += '<li>';
                    html += '<label for="inp_' + i + '">' + data.tasks.taskData.form[i].label + '</label>';
                    var t, type, special;
                    if ((data.tasks.taskData.form[i].input.type).indexOf('/') !== -1) {
                        special = true;
                        t = (data.tasks.taskData.form[i].input.type).split('/');
                        type = t[0];
                    } else {
                        special = false;
                        type = data.tasks.taskData.form[i].input.type;
                    }
                    switch (type) {
                        case 'text':
                            if (!special) {
                                html += '<input type="text" name="' + i + '" class="sendThis" placeholder="' + data.tasks.taskData.form[i].input.placeholder + '" id="inp_' + i + '" required/>';
                            } else {
                                switch (t[1]) {
                                    case 'deg':
                                        html += '<div class="input-group"><input type="text" class="form-control sendThis" name="' + i + '" placeholder="' + data.tasks.taskData.form[i].input.placeholder + '"><span class="input-group-addon">&deg;C</span></div>';
                                        break;
                                }
                            }

                            break;
                        case 'date':
                            html += '<input type="date" name="' + i + '" class="sendThis" placeholder="' + data.tasks.taskData.form[i].input.placeholder + '" />';
                            break;
                        case 'select':
                            html += '<select class="form-control sendThis" name="' + i + '">';
                            for (j in data.tasks.taskData.form[i].input.data) {
                                html += '<option value="' + j + '">' + data.tasks.taskData.form[i].input.data[j] + '</option>';
                            }
                            html += '</select>'
                            break;
                        case 'checkbox':
                            html += '<div class="checkbox"><input type="checkbox" name="' + i + '" class="sendThis"/></div>';
                            break;
                    }
                    html += '</li>';
                }
            }
        }
    }
    $('#task_view').find('#task_info').html('');
    $(html).appendTo("#task_info").trigger("create");
    //$('#task_view').find('#task_info').listview('refresh');
    $('#' + $.mobile.activePage.attr('id')).trigger('create');*/
}

function saveFridge() {
    var dd = Form.getValues($('#form_fridge'));

    var data = {
        'client': User.client,
        'token': User.lastToken,
        'results': JSON.stringify(dd)
    };

    console.log(data);

    Page.apiCall('formDeviationStart', data, 'get', 'saveFormFridgeDone');

}

function saveFormFridgeDone(data) {
    console.log('aici am facut save');
    console.log(data);
    if (data.form_deviation != undefined) {
        if (data.form_deviation.last_task_inserted != undefined && data.form_deviation.deviation) {
            Page.redirect('haccp_deviation.html?id=' + data.form_deviation.last_task_inserted);
        } else {
            Page.redirect('tasks.html');
        }
    } else {
        Page.redirect('tasks.html');
    }
}

function saveFormFood() {
    var dd = Form.getValues($('#form_food'));

    var data = {
        'client': User.client,
        'token': User.lastToken,
        'results': JSON.stringify(dd)
    };

    console.log(data);

    Page.apiCall('formDeviationStart', data, 'get', 'saveFormFoodDone');
}

function saveFormFoodDone(data) {
    Page.redirect('tasks.html');
}

function markTaskAsComplete() {
    var data = {};
    $('.sendThis').each(function(){
        if ($(this).attr('type') == 'checkbox') {
            if ($(this).is(':checked')) {
                data[$(this).attr('name')] = 'true';
            } else {
                data[$(this).attr('name')] = 'false';
            }
        } else {
            data[$(this).attr('name')] = $(this).val();
        }
    });
    var s_data = {
        'client': User.client,
        'token': User.lastToken,
        'task_id': get.id,
        'data': JSON.stringify(data)
    }

    Page.apiCall('setTaskComplete', s_data, 'get', 'setTaskComplete');
    uploadPicture();
}

function setTaskComplete(data) {
    console.log('asdasdadsa:');
    console.log(data);
    if (data.response != undefined && data.response.response != undefined) {
        alert(data.response.response);
        Page.redirect('tasks.html');
    }
    if (data.success == true) {
        if (data.response.Success != undefined && data.response.Success == true) {
            //alert('aici facem redirect si trebuie si update in local db sa il setam ca si completed');
            Page.redirect('tasks.html');
        }
        if (data.response.form_deviation != undefined) {
            /*$('#task_view').find('#upload_photo').hide();
            $('#task_view').find('#mark_as_complete').show();*/
            var html = '<input type="hidden" name="is_deviation" value="1" class="sendThis">';
            for (i in data.response.form_deviation) {
                console.log(data.response.form_deviation[i]);
                if (i == 'action_needed') {
                    html += '<li style="display:none;" id="li_action_needed">';
                } else {
                    html += '<li>';
                }
                html += '<fieldset data-role="controlgroup">';
                if (data.response.form_deviation[i].input.type != 'checkbox') {
                    html += '<label for="inp_' + i + '">' + data.response.form_deviation[i].label + '</label>';
                }
                var t, type, special;
                if ((data.response.form_deviation[i].input.type).indexOf('/') !== -1) {
                    special = true;
                    t = (data.response.form_deviation[i].input.type).split('/');
                    type = t[0];
                } else {
                    special = false;
                    type = data.response.form_deviation[i].input.type;
                }
                switch (type) {
                    case 'textarea':
                        html += '<textarea name="' + i + '" class="sendThis" placeholder="' + data.response.form_deviation[i].input.placeholder + '" id="inp_' + i + '"></textarea>';
                        break;
                    case 'text':
                        if (!special) {
                            html += '<input type="text" name="' + i + '" class="sendThis" placeholder="' + data.response.form_deviation[i].input.placeholder + '" id="inp_' + i + '" />';
                        } else {
                            switch (t[1]) {
                                case 'deg':
                                    html += '<div class="input-group"><input type="text" class="form-control sendThis" name="' + i + '" placeholder="' + data.response.form_deviation[i].input.placeholder + '"><span class="input-group-addon">&deg;C</span></div>';
                                    break;
                            }
                        }

                        break;
                    case 'date':
                        html += '<input type="date" name="' + i + '" class="sendThis" placeholder="' + data.response.form_deviation[i].input.placeholder + '" />';
                        break;
                    case 'select':
                        html += '<select class="form-control sendThis" name="' + i + '">';
                        for (j in data.response.form_deviation[i].data) {
                            if ((data.response.form_deviation[i].data).hasOwnProperty(j)) {
                                for (var k in data.response.form_deviation[i].data[j]) break
                                html += '<option value="' + k + '">' + data.response.form_deviation[i].data[j][k] + '</option>';
                            }
                        }
                        html += '</select>'
                        break;
                    case 'checkbox':
                        if (i == 'now_or_further') {
                            html += '<input type="checkbox" id="inp_' + i + '" name="' + i + '" class="sendThis" onclick="if($(this).is(\':checked\')){$(\'#li_action_needed\').show();}else{$(\'#li_action_needed\').hide();}$(\'#task_view\').find(\'#task_info\').listview(\'refresh\');" />';
                        } else {
                            html += '<input type="checkbox" id="inp_' + i + '" name="' + i + '" class="sendThis"/>';
                        }
                        html += '<label for="inp_' + i + '">' + data.response.form_deviation[i].label + '</label>';
                        break;
                    case 'file':
                        html += '<div data-role="controlgroup">';

                        html += '<a href="#" onclick="takePicture();" data-role="button" data-theme="a">' + $.t('pictures.take') + '</a>';
                        html += '<a href="#" onclick="selectPicture();" data-role="button" data-theme="a">' + $.t('pictures.select') + '</a>';
                        html += '</div>';
                        break;
                    case 'signature':
                        html += '<div id="signature-holder">';
                        html += '<div id="signature" data-role="none"></div>';
                        html += '</div>';
                        html += '<span id="signature-status-message">Sign in landscape mode for better accuracy</span>';

                        html += '<button id="signature-reset" data-theme="a">Reset Signature</button>';
                        break;
                }
                html += '</fieldset>';
                html += '</li>';
            }
            $('#task_view').find('#task_info').html('');
            $(html).appendTo("#task_info").trigger("create");
            $('#task_view').find('#task_info').listview('refresh');
            /*$sigdiv = $("#signature").jSignature();
            $sigdiv.jSignature("reset");*/

            /*$('#signature-reset').off('click').on('click', function(e){
                e.preventDefault();
                $sigdiv.jSignature("reset");
                return false;
            });*/
        }
    }
}

// Camera manipulation

function takePicture() {
    navigator.camera.getPicture(
        function(uri) {
            $('#camera_image').css({'visibility': 'visible', 'display': 'block'}).attr('src', uri);
        },
        function(e) {
            console.log("Error getting picture: " + e);
        },
        { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI});
};

function selectPicture() {
    navigator.camera.getPicture(
        function(uri) {
            if ( uri.substring(0,21) == "content://com.android") {
                photo_split = uri.split("%3A");
                uri ="content://media/external/images/media/"+photo_split[1];
            }
            $('#camera_image').css({'visibility': 'visible', 'display': 'block'}).attr('src', uri);
        },
        function(e) {
            console.log("Error getting picture: " + e);
        },
        { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY});
};

function uploadPicture() {

    // Get URI of picture to upload
    var $img = $('#camera_image');
    var imageURI = $img.attr('src');
    if (imageURI) {
        $img.css({'visibility': 'hidden', 'display': 'none'}).attr('src', '');
        // Verify server has been entered
        server = Page.settings.apiDomain + Page.settings.apiUploadPath;
        console.log(server);
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

/*
$( window ).on( "orientationchange", function( event ) {
    $sigdiv.jSignature("reset");
    if (event.orientation == 'landscape') {
        $('#signature-status-message').hide();
    } else {
        $('#signature-status-message').show();
    }
});*/
