//navigator.connection.type = Connection.NONE;
/**
 * Check if we have a session of a user in local database
 * @param tx
 */

function checkUserSession(tx) {
    //console.log('checkUserSession');
    tx.executeSql('SELECT * FROM "settings" WHERE "type" IN ("token", "client", "name", "role")', [], getUserHandle, db.dbErrorHandle);
}

/**
 * Handle the results and redirects to login if we don't have
 * any user logged.
 * @param tx
 * @param results
 */
function getUserHandle(tx, results) {
    if (results.rows.length != 4) {
        Page.redirect('login.html');
    } else {
        var token, client, user_name, role;
        for (var i=0;i<results.rows.length;i++) {
            switch (results.rows.item(i).type) {
                case 'token':
                    token = results.rows.item(i).value;
                    break;
                case 'client':
                    client = results.rows.item(i).value;
                    break;
                case 'name':
                    user_name = results.rows.item(i).value;
                    break;
                case 'role':
                    role = results.rows.item(i).value;
                    break;
            }
        }
        localStorage.setItem('user_name', user_name);
        localStorage.setItem('role', role);
        User.login(client, token);
    }
}

/**
 * Init Method
 */
function indexInit() {
    var d = db.getDbInstance();
    d.transaction(checkUserSession, db.dbErrorHandle);

    executeSyncQuery();
}