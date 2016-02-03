
/**
 * Handle the results and redirects to login if we don't have
 * any user logged.
 * @param tx
 * @param results
 */
function getUserHandle(error, results) {
	console.log(error, results);
    if (results.rows.length != 4) {
        Page.redirect('login.html');
    } else {
        var token, client, user_name, role;
        for (var i=0;i<results.rows.length;i++) {
            switch (results.rows[i].key) {
                case 'token':
                    token = results.rows[i].value;
                    break;
                case 'client':
                    client = results.rows[i].value;
                    break;
                case 'name':
                    user_name = results.rows[i].value;
                    break;
                case 'role':
                    role = results.rows[i].value;
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
	db.getDbInstance("settings").query({
		map: function(doc, emit){
			if(["token", "client", "name", "role"].indexOf(doc.type) != -1){
				emit(doc.type, doc.value);
			}
		}
	}, getUserHandle);
    executeSyncQuery();
}