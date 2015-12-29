function getEmployeesCall(tx, results) {
    if (results.rows.length == 0 && isOffline()) {
        $('#employee_no_results').text('No employees to show. Please connect to internet to sync.');
    }
    else if (results.rows.length == 0 && !isOffline()) {
        $('#employee_no_results').text('No employees to show, yet.');

        var data = {
            'client': User.client,
            'token': User.lastToken
        }

        Page.apiCall('getEmployees', data, 'get', 'getEmployees');
    }
    else if (results.rows.length > 0) {
        var html = '';

        for (var i=0;i<results.rows.length;i++) {

            html += '<li data-role="list-divider">' + results.rows.item(i).first_name + ' ' + results.rows.item(i).last_name  + '</li>';
            html += '<li>' + results.rows.item(i).email + ' ' + results.rows.item(i).role + '</li>';
        }

        $('#employee_no_results').hide();
        $('#employee_list').html(html).listview('refresh');
    }
}

function getEmployeesR(tx) {
    query = 'select * from employees';
    tx.executeSql(query, [], getEmployeesCall, db.dbErrorHandle);
}

function employeesInit() {
    if (User.isLogged()) {
        var d = db.getDbInstance();
        d.transaction(getEmployeesR, db.dbErrorHandle);
    } else {
        Page.redirect('login.html');
    }
}


function getEmployees(data) {
    if (data.success) {
        User.setToken(data.token);

        if (data.employees) {

            var html = '';
            var q = 'INSERT INTO "employees"("first_name","last_name","email", "role")';
            var h = false;

            for (var i in data.employees) {
                if (typeof data.employees[i] == 'object') {

                    if (h) {
                        q += ' UNION';
                    } else {
                        h = true;
                    }

                    q += ' SELECT ' +
                        '"' + data.employees[i]['First Name'] + '" as "first_name", ' +
                        '"' + data.employees[i]['Last Name'] + '" as "last_name", ' +
                        '"' + data.employees[i]['Email'] + '" as "email", ' +
                        "'" + data.employees[i]['Role'] + "'" + ' as "role"';


                    html += '<li data-role="list-divider">' + data.employees[i]['First Name'] + ' ' + data.employees[i]['Last Name']  + '</li>';
                    html += '<li>' + data.employees[i]['Email'] + ' ' + data.employees[i]['Role'] + '</li>';
                }
            }
            db.clean();
            db.execute(q);
            $('#employee_no_results').hide();
            $('#employee_list').html(html).listview('refresh');
        }
    }
}
