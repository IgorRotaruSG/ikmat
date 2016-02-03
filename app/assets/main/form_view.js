function getFormItemCall(error, results) {
    if (results && isOffline()) {
        Page.redirect('forms.html');
    }
    else if (results.length == 0 && !isOffline()) {
        var data = {
            'client': User.client,
            'token': User.lastToken,
            'category': get.type
        };

        Page.apiCall('formDeviationStart', data, 'get', 'formItemData');
    } else {
        var data = [];

        data.push({
            'id':       results.id,
            'data':     '<a href="form_view2.html?id=' + results.id + '" data-transition="slide"><i class="fa fa-edit"></i> ' + results.label + '</a>'
        });

        _append('#form_item_data', data);
    }
}

function getFormItem() {
	db.getDbInstance('form_item').get([get.type], getFormItemCall);
}

function form_viewInit() {
    if (User.isLogged()) {
        get = Page.get();
        getFormItem();
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