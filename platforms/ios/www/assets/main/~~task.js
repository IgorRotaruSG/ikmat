var getIds = [];
var currentTime = false;
var settings_type = 'uncompletedTaskUpdated';

function getTasksCall(tx, results) {
    if (results.rows.length == 0 && isOffline()) {
        $('#no_results').text('No task to show. Please connect to internet to sync.');
    }
    else if (results.rows.length == 0 && !isOffline()) {
        $('#no_results').text('No task to show, yet.');

        var data = {
            'client': User.client,
            'token': User.lastToken
        }

        Page.apiCall('getTasksUncompleted', data, 'get', 'getTasksUncompleted');
    }
    else if (results.rows.length > 0 && !isOffline()) {
        $('#no_results').text('No task to show, yet.');

        var data = {
            'client': User.client,
            'token': User.lastToken
        };

        Page.apiCall('getTasksUncompleted', data, 'get', 'getTasksUncompletedShow');
    }
    else if (results.rows.length > 0) {
        // sync duty
        if (!currentTime || currentTime == undefined) {
            tx.executeSql('SELECT * FROM "settings" WHERE "type" = "' + settings_type + '"', [], uncompletedTaskGet, db.dbErrorHandle);
        }
        // sync duty

        var data = [];
        var groups = [];
        var c;
        var add_data;

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
            if (results.rows.item(i).type == 'deviation') {
                add_data = '<a href="haccp_deviation_fix.html?id=' + results.rows.item(i).id + '" data-transition="slide"><i class="fa fa-warning"></i> ' + results.rows.item(i).title + '</a>' + c;
            } else {
                add_data = '<a href="task_view.html?id=' + results.rows.item(i).id + '" data-transition="slide"><i class="fa fa-square-o"></i> ' + results.rows.item(i).title + '</a>' + c;
            }

            data.push({
                'id':       results.rows.item(i).date_start,
                'data':     add_data
            });
        }

        _append('#taskList', data);
        $('#no_results').hide();
    }
}

function getTasks(tx) {
    tx.executeSql('select * from tasks WHERE "completed" = 0', [], getTasksCall, db.dbErrorHandle);
}

function tasksInit() {
    if (User.isLogged()) {
        var d = db.getDbInstance();
        d.transaction(getTasks, db.dbErrorHandle);
    } else {
        Page.redirect('login.html');
    }
}

function getTasksUncompleted(data) {
    console.log(data);
    if (data.success) {
        //User.setToken(data.token);
        var add = [];

        if (data.tasks) {
            var date = '';
            var q = 'INSERT INTO "tasks"("id","title","type", "overdue", "dueDate", "completed", "check", "date_start")';
            var h = false;
            var add_data = '';
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
                        '"' + data.tasks[i][j].type + '" as "type", ' +
                        '"' + data.tasks[i][j].overdue + '" as "overdue", ' +
                        "'" + JSON.stringify(data.tasks[i][j].dueDate) + "'" + ' as "dueDate", ' +
                        '"0" as "completed", ' +
                        '"' + md5(JSON.stringify(data.tasks[i][j])) + '" as "check", ' +
                        '"' + i + '" as date_start';

                    if (data.tasks[i][j].overdue) {
                        c = '<span class="ui-li-count overdue">OVERDUE</span>';
                    } else {
                        c = '';
                    }
                    if (data.tasks[i][j].type == 'deviation') {
                        add_data = '<a href="haccp_deviation_fix.html?id=' + data.tasks[i][j].id + '" data-transition="slide"><i class="fa fa-warning"></i> ' + data.tasks[i][j].taskName + '</a>' + c;
                    } else {
                        add_data = '<a href="task_view.html?id=' + data.tasks[i][j].id + '" data-transition="slide"><i class="fa fa-square-o"></i> ' + data.tasks[i][j].taskName + '</a>' + c;
                    }
                    add.push({
                        'id':       i,
                        'data':     add_data
                    });
                }
            }
            db.clean();
            db.execute(q);

            $('#no_results').hide();
            _append('#taskList', add);
        }

        // sync duty
        currentTime = data.currentTime;
        var d = db.getDbInstance();
        d.transaction(uncompletedTaskUpdated, d.dbErrorHandle);
        // sync duty
    }
}

function getTasksUncompletedShow(data) {
    console.log(data);
    if (data.success) {
        //User.setToken(data.token);
        var add = [];

        if (data.tasks) {
            var date = '';
            var q = 'INSERT INTO "tasks"("id","title","type", "overdue", "dueDate", "completed", "check", "date_start")';
            var h = false;
            var add_data = '';
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
                        '"' + data.tasks[i][j].type + '" as "type", ' +
                        '"' + data.tasks[i][j].overdue + '" as "overdue", ' +
                        "'" + JSON.stringify(data.tasks[i][j].dueDate) + "'" + ' as "dueDate", ' +
                        '"0" as "completed", ' +
                        '"' + md5(JSON.stringify(data.tasks[i][j])) + '" as "check", ' +
                        '"' + i + '" as date_start';

                    if (data.tasks[i][j].overdue) {
                        c = '<span class="ui-li-count overdue">OVERDUE</span>';
                    } else {
                        c = '';
                    }
                    if (data.tasks[i][j].type == 'deviation') {
                        add_data = '<a href="haccp_deviation_fix.html?id=' + data.tasks[i][j].id + '" data-transition="slide"><i class="fa fa-warning"></i> ' + data.tasks[i][j].taskName + '</a>' + c;
                    } else {
                        add_data = '<a href="task_view.html?id=' + data.tasks[i][j].id + '" data-transition="slide"><i class="fa fa-square-o"></i> ' + data.tasks[i][j].taskName + '</a>' + c;
                    }
                    add.push({
                        'id':       i,
                        'data':     add_data
                    });
                }
            }
            db.clean();
            //db.execute(q);

            $('#no_results').hide();
            _append('#taskList', add);
        }

        // sync duty
        currentTime = data.currentTime;
        var d = db.getDbInstance();
        d.transaction(uncompletedTaskUpdated, d.dbErrorHandle);
        // sync duty
    }
}

// sync duty
function uncompletedTaskGet(tx, results) {
    if (results.rows.length > 0) {
        currentTime = $.parseJSON(results.rows.item(0).value);
    }
}

function uncompletedTaskUpdated(tx) {
    tx.executeSql('SELECT * FROM "settings" WHERE "type" = "' + settings_type + '"', [], uncompletedTaskCommitUpdate, db.dbErrorHandle);
}

function uncompletedTaskCommitUpdate(tx, results) {
    if (results.rows.length > 0) {
        tx.executeSql('UPDATE "settings" SET "value" = \'' + JSON.stringify(currentTime) + '\' WHERE "type" = "' + settings_type + '"', [], function(){}, db.dbErrorHandle);
    } else {
        tx.executeSql('INSERT INTO "settings"("type", "value") VALUES("' + settings_type + '", \'' + JSON.stringify(currentTime) + '\')', [], function(){}, db.dbErrorHandle);
    }
}
// sync duty


function tasksAsync() {
    setTimeout(function(){
        console.log('tasks:' + currentTime.date);
        var data = {
            'client':       User.client,
            'token':        User.lastToken,
            'date_from':    JSON.stringify(currentTime)
        }

        Page.apiCall('getTasksUncompleted', data, 'get', 'getTasksUncompleted');
        tasksAsync();
    }, Page.settings.syncIntervals.tasks);
}

function clearTasksRefresh() {
    window.location.href = ''
}

function clearTasksCall(tx) {
    tx.executeSql('DELETE FROM tasks WHERE "completed" = 0', [], clearTasksRefresh, db.dbErrorHandle);
}

function clearTasks() {
    var d = db.getDbInstance();
    d.transaction(clearTasksCall, d.dbErrorHandle);
}