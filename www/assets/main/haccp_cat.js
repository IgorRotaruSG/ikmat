var get;

var hpc_currentTime = false;
var hpc_settings_type = 'haccpSubUpdated';

function getHaccpCatCall(tx, results) {
    if (results.rows.length == 0 && isOffline()) {
        $('#haccp_cat_list_no_results').text('No HACCP to show. Please connect to internet to sync.');
    }
    else if (results.rows.length == 0 && !isOffline()) {
        $('#haccp_cat_list_no_results').text('No HACCP to show, yet.');

        var data = {
            'client': User.client,
            'token': User.lastToken,
            'haccp_category': get.catId
        }

        Page.apiCall('haccp', data, 'get', 'haccpCat');
    }
    else if (results.rows.length > 0) {
        // sync duty
        //if (!currentTime || currentTime == undefined) {
        //    tx.executeSql('SELECT * FROM "settings" WHERE "type" = "' + settings_type + '"', [], uncompletedTaskGet, db.dbErrorHandle);
        //}
        // sync duty

        var data = [];

        for (var i=0;i<results.rows.length;i++) {
            data.push({
                'id':       results.rows.item(i).id,
                'data':     '<a href="haccp_item.html?id=' + results.rows.item(i).id + '&catId=' + get.catId + '" data-transition="slide"><i class="fa fa-pagelines"></i> ' + results.rows.item(i).content + '</a>'
            });
        }

        _append('#haccp_cat_list', data);
        $('#haccp_cat_list_no_results').hide();
    }
}

function getHaccpCat(tx) {
    tx.executeSql('select * from haccp_items where "cat" = "' + get.catId + '"', [], getHaccpCatCall, db.dbErrorHandle);
}

function haccp_catInit() {
    if (User.isLogged()) {
        get = Page.get();

        var d = db.getDbInstance();
        d.transaction(getHaccpCat, db.dbErrorHandle);
    } else {
        Page.redirect('login.html');
    }
}

function haccpCat(data) {
    if (data.success) {
        //User.setToken(data.token);
        var add = [];

        var ans = {};
        var answer;
        if (data.haccp_subcategories_form && data.haccp_subcategories_form.answer != undefined) {
            answer = data.haccp_subcategories_form.answer;
            for (var i in answer) {
                if (answer.hasOwnProperty(i)) {
                    ans[answer[i]['subcategory']] = JSON.stringify(answer[i]);
                }
            }
        }

        if (data.haccp_subcategories) {
            var date = '';
//            var q = 'INSERT INTO "haccp_items"("id","cat","content","form","response")';
            var q = 'INSERT OR REPLACE INTO "haccp_items"("id","cat","content","form","response")';
            var h = false;
            var response;
            for (var i in data.haccp_subcategories) {
                if ((data.haccp_subcategories).hasOwnProperty(i)) {
                    if (ans[data.haccp_subcategories[i].id] != undefined) {
                        response = ans[data.haccp_subcategories[i].id];
                    } else {
                        response = 0;
                    }

                    if (h) {
                        q += ' UNION';
                    } else {
                        h = true;
                    }
                    q += ' SELECT ' +
                        '"' + data.haccp_subcategories[i].id + '" as "id", ' +
                        '"' + get.catId + '" as "cat", ' +
                        '"' + data.haccp_subcategories[i].content + '" as "content",' +
                        "'" + JSON.stringify(data.haccp_subcategories_form) + "'" + ' as "form", ' +
                        "'" + response + "'" + ' as "response"';

                    add.push({
                        'id':       data.haccp_subcategories[i].id,
                        'data':     '<a href="haccp_item.html?id=' + data.haccp_subcategories[i].id + '&catId=' + get.catId + '" data-transition="slide"><i class="fa fa-pagelines"></i> ' + data.haccp_subcategories[i].content + '</a>'
                    });
                }
            }
            db.clean();
            db.execute(q);

            $('#haccp_cat_list_no_results').hide();
            _append('#haccp_cat_list', add);
        }

        // sync duty
        //currentTime = data.currentTime;
        //var d = db.getDbInstance();
        //d.transaction(uncompletedTaskUpdated, d.dbErrorHandle);
        // sync duty
    }
}