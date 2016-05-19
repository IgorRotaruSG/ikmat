var getIds = [];
var ct_currentTime = false;
var ct_settings_type = 'completedTaskUpdated';

function getTasksCompletedCall(tx, results) {
    if (results.rows.length == 0 && isOffline()) {
//        $('#no_results_taskList_complete').text('No task to show. Please connect to internet to sync.');
        $('#no_results_taskList_complete').text('Ingen oppgave å vise. Vennligst koble til internett for å synkronisere.');
    }
    else if (results.rows.length == 0 && !isOffline()) {
//        $('#no_results_taskList_complete').text('No task to show, yet.');
        $('#no_results_taskList_complete').text('Ingen oppgave å vise, ennå.');

        var data = {
            'client': User.client,
            'token': User.lastToken
        }

        Page.apiCall('getTasksCompleted', data, 'get', 'getTasksCompleted');
    }
    else if (results.rows.length > 0) {
        // sync duty
        if (!ct_currentTime || ct_currentTime == undefined) {
            tx.executeSql('SELECT * FROM "settings" WHERE "type" = "' + ct_settings_type + '"', [], completedTaskGet, db.dbErrorHandle);
        }
        // sync duty

        var data = [];
        var groups = [];
        var c;

        for (var i=0;i<results.rows.length;i++) {
            if (!in_array(results.rows.item(i).date_start, groups)) {
                data.push({
                    'id':       results.rows.item(i).date_start,
                    'data':     Page.formatTaskDate(date = new Date(results.rows.item(i).date_start)),
                    'extra':    'data-role="list-divider"'
                });
                groups.push(results.rows.item(i).date_start);
            }

            if (results.rows.item(i).overdue) {
                c = '<span class="ui-li-count overdue">OVERDUE</span>';
            } else {
                c = '';
            }

            data.push({
                'id':       results.rows.item(i).date_start,
                'data':     '<a href="task_view.html?id=' + results.rows.item(i).id + '" data-transition="slide"><i class="fa fa-check-square-o"></i> ' + results.rows.item(i).title + '</a>' + c
            });
        }

        _append('#taskList_complete', data);
        $('#no_results_taskList_complete').hide();
    }
}

function getTasksCompletedR(tx) {
    tx.executeSql('select * from tasks WHERE "completed" = 1', [], getTasksCompletedCall, db.dbErrorHandle);
}

function completed_tasksInit() {
    if (User.isLogged()) {
        var d = db.getDbInstance();
        d.transaction(getTasksCompletedR, db.dbErrorHandle);
    } else {
        Page.redirect('login.html');
    }
}

function getTasksCompleted(data) {
    if (data.success) {
        //User.setToken(data.token);
        var add = [];

        if (data.tasks) {
            var date = '';
            var q = 'INSERT INTO "tasks"("id","title","overdue", "dueDate", "completed", "check", "date_start")';
            var h = false;
            for (var i in data.tasks) {
                date = new Date(i);

                add.push({
                    'id':       i,
                    'data':     Page.formatTaskDate(date),
                    'extra':    'data-role="list-divider"'
                });

                for (var j in data.tasks[i]) {
                    getIds.push(data.tasks[i][j].id);
                    if (h) {
                        q += ' UNION';
                    } else {
                        h = true;
                    }
                    q += ' SELECT ' +
                        '"' + data.tasks[i][j].id + '" as "id", ' +
                        '"' + data.tasks[i][j].taskName + '" as "title", ' +
                        '"' + data.tasks[i][j].overdue + '" as "overdue", ' +
                        "'" + JSON.stringify(data.tasks[i][j].dueDate) + "'" + ' as "dueDate", ' +
                        '"1" as "completed", ' +
                        '"' + md5(JSON.stringify(data.tasks[i][j])) + '" as "check", ' +
                        '"' + i + '" as date_start';

                    if (data.tasks[i][j].overdue) {
                        c = '<span class="ui-li-count overdue">OVERDUE</span>';
                    } else {
                        c = '';
                    }
                    add.push({
                        'id':       i,
                        'data':     '<a href="task_view.html?id=' + data.tasks[i][j].id + '" data-transition="slide"><i class="fa fa-check-square-o"></i> ' + data.tasks[i][j].taskName + '</a>' + c
                    });
                }
            }
            db.clean();
            db.execute(q);
            $('#no_results_taskList_complete').hide();
            _append('#taskList_complete', add);
        }

        // sync duty
        ct_currentTime = data.currentTime;
        var d = db.getDbInstance();
        d.transaction(completedTaskUpdated, d.dbErrorHandle);
        // sync duty
    }
}

// sync duty
function completedTaskGet(tx, results) {
    if (results.rows.length > 0) {
        ct_currentTime = $.parseJSON(results.rows.item(0).value);
    }
}

function completedTaskUpdated(tx) {
    tx.executeSql('SELECT * FROM "settings" WHERE "type" = "' + ct_settings_type + '"', [], completedTaskCommitUpdate, db.dbErrorHandle);
}

function completedTaskCommitUpdate(tx, results) {
    if (results.rows.length > 0) {
        tx.executeSql('UPDATE "settings" SET "value" = \'' + JSON.stringify(ct_currentTime) + '\' WHERE "type" = "' + ct_settings_type + '"', [], [], db.dbErrorHandle);
    } else {
        tx.executeSql('INSERT INTO "settings"("type", "value") VALUES("' + ct_settings_type + '", \'' + JSON.stringify(ct_currentTime) + '\')', [], [], db.dbErrorHandle);
    }
}

function completed_tasksAsync() {
    setTimeout(function(){
        console.log('completed_tasks:' + ct_currentTime.date);
        var data = {
            'client':       User.client,
            'token':        User.lastToken,
            'date_from':    JSON.stringify(ct_currentTime)
        }

        Page.apiCall('getTasksCompleted', data, 'get', 'getTasksCompleted');
        completed_tasksAsync();
    }, Page.settings.syncIntervals.completed_tasks);
}
// sync duty