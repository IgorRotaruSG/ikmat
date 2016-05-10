function getEmployeesCall(error, results) {
    if (results.rows.length == 0 && isOffline()) {
        $('#employee_no_results').text($.t('error.employee_no_result'));
    }
    else if (results.rows.length == 0 && !isOffline()) {
        $('#employee_no_results').text($.t('error.employee_no_result_online'));

        var data = {
            'client': User.client,
            'token': User.lastToken
        };

        Page.apiCall('getEmployees', data, 'get', 'getEmployees');
    }
    else if (results.rows.length > 0) {
        var html = '';

        for (var i=0;i<results.rows.length;i++) {

            html += '<li data-role="list-divider">' + results.rows[i].doc.first_name + ' ' + results.rows[i].doc.last_name  + '</li>';
            html += '<li>' + results.rows[i].doc.email + ' ' + results.rows[i].doc.role + '</li>';
        }

        $('#employee_no_results').hide();
        $('#employee_list').html(html).listview('refresh');
    }
}

function employeesInit() {
    if (User.isLogged()) {
        db.getDbInstance('employees').allDocs({'include_docs': true}, getEmployeesCall);
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
