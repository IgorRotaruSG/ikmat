function getSuppliersCall(tx, results) {
    if (results.rows.length == 0 && isOffline()) {
        $('#suppliers_no_results').text('No suppliers to show. Please connect to internet to sync.');
    }
    else if (results.rows.length == 0 && !isOffline()) {
        $('#suppliers_no_results').text('No suppliers to show, yet.');

        var data = {
            'client': User.client,
            'token': User.lastToken
        }

        Page.apiCall('getSuppliers', data, 'get', 'getSuppliers');
    }
    else if (results.rows.length > 0) {
        var html = '';

        for (var i=0;i<results.rows.length;i++) {

            html += '<li data-role="list-divider">' + results.rows.item(i).name + '</li>';
            html += '<li>Address: ' + results.rows.item(i).address + '</li>';
            html += '<li>Phone Number:' + results.rows.item(i).phone_number + '</li>';
            html += '<li>Id Number: ' + results.rows.item(i).id_number + '</li>';
        }

        $('#suppliers_list').html(html).listview('refresh');
        $('#suppliers_no_results').hide();
    }
}

function getSuppliersR(tx) {
    query = 'select * from suppliers';
    tx.executeSql(query, [], getSuppliersCall, db.dbErrorHandle);
}

function suppliersInit() {
    if (User.isLogged()) {
        var d = db.getDbInstance();
        d.transaction(getSuppliersR, db.dbErrorHandle);
    } else {
        Page.redirect('login.html');
    }
}

function getSuppliers(data) {
    if (data.success) {
        //User.setToken(data.token);

        if (data.suppliers) {
            var html = '';
            var q = 'INSERT INTO "suppliers"("name","address","phone_number", "id_number")';
            var h = false;
            for (var i in data.suppliers) {
                if (typeof data.suppliers[i] == 'object') {
                    if (h) {
                        q += ' UNION';
                    } else {
                        h = true;
                    }

                    q += ' SELECT ' +
                        '"' + data.suppliers[i]['Name'] + '" as "name", ' +
                        '"' + data.suppliers[i]['Address'] + '" as "address", ' +
                        '"' + data.suppliers[i]['Phone Number'] + '" as "phone_number", ' +
                        "'" + data.suppliers[i]['Id Number'] + "'" + ' as "id_number"';

                    html += '<li data-role="list-divider">' + data.suppliers[i]['Name'] + '</li>';
                    html += '<li>Address: ' + data.suppliers[i]['Address'] + '</li>';
                    html += '<li>Phone Number:' + data.suppliers[i]['Phone Number'] + '</li>';
                    html += '<li>Id Number: ' + data.suppliers[i]['Id Number'] + '</li>';
                }
            }
            db.clean();
            db.execute(q);
            $('#suppliers_no_results').hide();
            $('#suppliers_list').html(html).listview('refresh');
        }
    }
}
