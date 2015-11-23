function getFormItemCall(tx, results) {
    if (results.rows.length == 0 && isOffline()) {
        Page.redirect('forms.html');
    }
    else if (results.rows.length == 0 && !isOffline()) {
        var data = {
            'client': User.client,
            'token': User.lastToken,
            'category': get.type
        };

        Page.apiCall('formDeviationStart', data, 'get', 'formItemData');
    } else {
        var data = [];

        for (var i=0;i<results.rows.length;i++) {
            data.push({
                'id':       results.rows.item(i).id,
                'data':     '<a href="form_view2.html?id=' + results.rows.item(i).id + '" data-transition="slide"><i class="fa fa-edit"></i> ' + results.rows.item(i).label + '</a>'
            });
        }

        _append('#form_item_data', data);
    }
}

function getFormItem(tx) {
    tx.executeSql('SELECT * FROM "form_item" WHERE "type"=?', [get.type], getFormItemCall);
}

function form_viewInit() {
    if (User.isLogged()) {
        get = Page.get();

        var d = db.getDbInstance();
        d.transaction(getFormItem, db.dbErrorHandle);
    } else {
        Page.redirect('login.html');
    }
}

function formItemData(data) {
    console.log(data);

    if (data.success) {
        var f = data.form_list_question;
        var data = [];
        var db_data = [];


        for (var i in f) {
            if (f.hasOwnProperty(i)) {
                data.push({
                    'id':       i,
                    'data':     '<a href="form_view2.html?id=' + f[i].info.id + '" data-transition="slide"><i class="fa fa-edit"></i> ' + f[i].info.label + '</a>'
                });

                db_data.push([
                    f[i].info.id,
                    f[i].info.label,
                    JSON.stringify(f[i].form),
                    get.type
                ]);
            }
        }

        db.lazyQuery({
            'sql': 'INSERT INTO "form_item"("id", "label", "form", "type") VALUES(?,?,?,?)',
            'data': db_data
        },0);

        _append('#form_item_data', data);
    }
}