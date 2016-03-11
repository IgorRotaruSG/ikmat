/**
 * Handle the results and redirects to login if we don't have
 * any user logged.
 * @param tx
 * @param results
 */
function getUserHandle(error, results) {
	console.log('getUserHandle', results);
	var token,
	    client,
	    user_name,
	    role,
	    isValid = true;
	if (error) {
		isValid = false;
	} else {
		for (var i = 0; i < results.rows.length; i++) {
			if (results.rows[i].error || !results.rows[i].doc) {
				isValid = false;
				break;
			}
			switch (results.rows[i].key) {
			case 'token':
				token = results.rows[i].doc.value;
				break;
			case 'client':
				client = results.rows[i].doc.value;
				break;
			case 'name':
				user_name = results.rows[i].doc.value;
				break;
			case 'role':
				role = results.rows[i].doc.value;
				break;
			}
		}
	}

	if (!isValid) {
		Page.redirect('login.html');
	} else {
		localStorage.setItem('user_name', user_name);
		localStorage.setItem('role', role);
		User.login(client, token);
	}
}

/**
 * Init Method
 */
function indexInit() {
	db.getDbInstance("settings").allDocs({
		keys : ["token", "client", "name", "role"],
		include_docs : true
	}, getUserHandle);
	executeSyncQuery();
	document.addEventListener('resume', function() {
		var activePage = $.mobile.activePage.attr("id");
		if (activePage == 'tasks') {
			getTasks();
		}
	}, false);
}