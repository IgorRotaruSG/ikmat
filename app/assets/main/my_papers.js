var getIds = [];
var mp_currentTime = false;
var mp_settings_type = 'myPaperUpdated';

function getMyPapersCall(tx, results) {
    if (results.rows.length == 0 && isOffline()) {
        $('#my_papers_list_no_results').text($.t('error.no_papers_to_show'));
    }
    else if (results.rows.length == 0 && !isOffline()) {
        $('#my_papers_list_no_results').text('No papers to show, yet.');

        var data = {
            'client': User.client,
            'token': User.lastToken
        }

        Page.apiCall('myPapers', data, 'get', 'myPapers');
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
                'data':     '<a href="#" data-transition="slide"><i class="fa fa-file-o"></i> ' + results.rows.item(i).paper + '</a>'
            });
        }

        _append('#my_papers_list', data);
        $('#my_papers_list_no_results').hide();
    }
}

function getMyPapers(tx) {
    tx.executeSql('select * from papers', [], getMyPapersCall, db.dbErrorHandle);
}

function my_papersInit() {
    if (User.isLogged()) {
        var d = db.getDbInstance();
        d.transaction(getMyPapers, db.dbErrorHandle);
    } else {
        Page.redirect('login.html');
    }
}

function myPapers(data) {
    if (data.success) {
        //User.setToken(data.token);
        var add = [];

        if (data.my_papers) {
            var date = '';
            var q = 'INSERT INTO "papers"("id","paper")';
            var h = false;
            for (var i in data.my_papers) {
                if ((data.my_papers).hasOwnProperty(i)) {
                    getIds.push(data.my_papers[i].id);
                     if (h) {
                     q += ' UNION';
                     } else {
                     h = true;
                     }
                     q += ' SELECT ' +
                     '"' + data.my_papers[i].id + '" as "id", ' +
                     '"' + data.my_papers[i].paper + '" as "paper"';

                    add.push({
                        'id':       data.my_papers[i].id,
                        'data':     '<a href="#" data-transition="slide"><i class="fa fa-file-o"></i> ' + data.my_papers[i].paper + '</a>'
                    });
                }
            }
            console.log(q);
            db.clean();
            db.execute(q);

            $('#my_papers_list_no_results').hide();
            _append('#my_papers_list', add);
        }

        // sync duty
        //currentTime = data.currentTime;
        //var d = db.getDbInstance();
        //d.transaction(uncompletedTaskUpdated, d.dbErrorHandle);
        // sync duty
    }
}