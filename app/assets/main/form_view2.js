var last_data_received;

function getForm2ItemCall(tx, results) {
    if (results.rows.length == 0) {
        Page.redirect('forms.html');
    } else {
        var data = $.extend({}, results.rows.item(0));

        last_data_received = JSON.parse(data.form);

        var html = '<form id="form_item_data_save">';
        html += HTML.formGenerate(last_data_received,  $.t("general.save_button"));
        html += '</form>';

        $('#form_item_data2').html(html);
        $('#' + $.mobile.activePage.attr('id')).trigger('create');

        $('#form_item_data_save').on('submit', function(e){
            e.preventDefault();

            var dd = HTML.getFormValues($(this).parent());

            var data = {
                'client': User.client,
                'token': User.lastToken,
                'results': JSON.stringify(dd)
            };

            var deviation = false;

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
                var a = confirm($.t('general.deviation_accept_message'));
                if (a) {
                    if (!isOffline()) {
                        console.log('aici avem prima chestie');
                        console.log(data);
                        Page.apiCall('formDeviationStart', data, 'get', 'getDeviation');
                    } else {
                        db.lazyQuery({
                            'sql': 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
                            'data': [[
                                'formDeviationStart',
                                JSON.stringify(data),
                                document.task_id,
                                'task_saved'
                            ]]
                        },0);
                        var d = db.getDbInstance();
                        d.transaction(function(tx){
                            tx.executeSql('SELECT "value" FROM "settings" WHERE "type"=?', ['deviation_form'], function(tx, results){
                                if (results.rows.length > 0) {
                                    db.lazyQuery({
                                        'sql': 'UPDATE "tasks" SET "completed"=? WHERE "id"=?',
                                        'data': [['1',document.task_id]]
                                    },0);

                                    var f = JSON.parse(results.rows.item(0).value);
                                    getDeviationForm(f);
                                } else {
                                    alert($.t('error.internal_error'));
                                    window.location.href = 'index.html';
                                }
                            });
                        });
                    }
                }
            } else {
                console.log('de aici 1');
                /*if (navigator.connection.type != Connection.NONE) {
                    Page.apiCall('formDeviationStart', data, 'get', 'redirectToTasks');
                } else {
                    db.lazyQuery({
                        'sql': 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
                        'data': [[
                            'formDeviationStart',
                            JSON.stringify(data),
                            document.task_id,
                            'task_saved'
                        ]]
                    },0, 'redirectToTasks');
                }*/
            }

            return false;
        });
    }
}

function getForm2Item(tx) {
    tx.executeSql('SELECT * FROM "form_item" WHERE "id"=?', [get.id], getForm2ItemCall);
}

function form_view2Init() {
    if (User.isLogged()) {
        get = Page.get();

        var d = db.getDbInstance();
        d.transaction(getForm2Item, db.dbErrorHandle);
    } else {
        Page.redirect('login.html');
    }
}