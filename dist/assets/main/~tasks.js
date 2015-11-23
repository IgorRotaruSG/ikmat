function getTasksCall(tx, results) {
    if (results.rows.length == 0) {
        var data = {
            'client': User.client,
            'token': User.lastToken
        }
        Page.apiCall('getTasksUncompleted', data, 'get', 'loadTasks');
    } else {
        if (!isOffline()) {
            // add loader here
            $('#_loader').html('syncing ...');

        } else {
            $('#_loader').html('');
        }

        var html = '';
        var c = '';
        var r = [];
        var j = 0;
        for (var i=0;i<results.rows.length;i++) {
            if (r[results.rows.item(i).date_start] == undefined) {
                r[results.rows.item(i).date_start] = new Array();
            }
            r[results.rows.item(i).date_start][j] = {
                title: results.rows.item(i).title,
                id: results.rows.item(i).id,
                overdue: results.rows.item(i).overdue
            };
            j++;
        }
        for (var i in r) {
            if (typeof r[i] != "function") {
                date = new Date(i);
                html += '<li data-role="list-divider">' + Page.formatTaskDate(date)  + '</li>';

                for (var j in r[i]) {
                    if (typeof r[i][j] != "function") {
                        if (r[i][j].overdue == 'true') {
                            c = '<span class="ui-li-count overdue">OVERDUE</span>';
                        } else {
                            c = '';
                        }
                        html += '<li><a href="task_view.html?id=' + r[i][j].id + '" data-transition="slide"><i class="fa fa-square-o"></i> ' + r[i][j].title + '</a>' + c + '</li>';
                    }
                }
            }
        }
        $('#tasks').find('#taskList').html(html).listview('refresh');
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
        alert('aici ma duc spre login');
        Page.redirect('login.html');
    }
}

function loadTasks(data) {
    if (data.success) {
        User.setToken(data.token);

        if (data.tasks) {
            var html = '';
            var date = '';
            var q = 'INSERT INTO "tasks"("id","title","overdue", "dueDate", "completed", "check", "date_start")';
            var h = false;
             for (var i in data.tasks) {
                 date = new Date(i);
                 html += '<li data-role="list-divider">' + Page.formatTaskDate(date)  + '</li>';

                 var c = '';
                 for (var j in data.tasks[i]) {
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
                        '"0" as "completed", ' +
                        '"' + md5(JSON.stringify(data.tasks[i][j])) + '" as "check", ' +
                        '"' + i + '" as date_start';

                     if (data.tasks[i][j].overdue) {
                         c = '<span class="ui-li-count overdue">OVERDUE</span>';
                     } else {
                         c = '';
                     }
                     //html += '<li><a href="task_view.html#id=' + data.tasks[i][j].id + '" class="link"><i class="icon icon-check-empty"></i> ' + data.tasks[i][j].taskName + '</a>' + c + '</li>';
                     html += '<li><a href="task_view.html?id=' + data.tasks[i][j].id + '" data-transition="slide"><i class="fa fa-square-o"></i> ' + data.tasks[i][j].taskName + '</a>' + c + '</li>';
                 }
            }
            db.clean();
            db.execute(q);
            $('#tasks').find('#taskList').html(html).listview('refresh');
        }
    }
};