var _sync_data_rows = false;
var _sync_data_i = 0;
var _sync_lock = false;

function selectTaskById(task_id, callback) {
	db.getDbInstance('sync_query').get(task_id, function(error, results) {
		if (results && results.executed) {
			callback(results);
		} else {
			callback({
				extra : task_id
			});
		}
	});
}

function sync_updateDB(data, params) {
	console.log('sync_updateDB', data, params);
	try {
		if (params && params.id) {
			var request = [];
			if (data) {
				var extra = data;
				if (params.api == 'formDeviationStart') {
					extra = data.form_deviation.last_task_inserted;
				}
				request = [{'executed': 1, 'extra': extra, '_id': params.id}];
			} else {
				request = [{'executed': 1, '_id': params.id}];
			}
			db.lazyQuery('sync_query', request, function() {
				console.log('sync_query updae', params.id);
				_sync_lock = false;
				_sync_data_i = parseInt(_sync_data_i) + 1;
				if (_sync_data_i >= _sync_data_rows.length || !_sync_data_rows) {
					$('#syncing_tasks').addClass('hide');
					$('.overflow-wrapper').addClass('overflow-wrapper-hide');
				}
				sync_query(data, params);
			});
		}
	} catch (err) {
		_sync_lock = false;
		_sync_data_i = parseInt(_sync_data_i) + 1;
		console.error('wtf');
		sync_query();
	}
}

function sync_query(data, params) {
	/*
	 console.log('----------------------------------------|data|---------------------------------');
	 console.log(data);
	 console.log('----------------------------------------|/data|---------------------------------');
	 */

	if (isOffline()) {
		_sync_data_rows = false;
		_sync_lock = false;
		$('#syncing_tasks').addClass('hide');
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		return;
	}
	if (!_sync_data_rows) {
		db.getDbInstance("sync_query").query('get_sync', {'include_docs': true}, function(error, results) {
			console.log("test", error, results);
				_sync_data_rows = results.rows;
				console.log("_sync_data_rows", _sync_data_rows);
				_sync_data_i = 0;
				sync_query();
		});
	} else {
		if (_sync_data_i < _sync_data_rows.length && !_sync_lock) {
			if ($('#syncing_tasks').hasClass('hide')) {
				$('#syncing_tasks').removeClass('hide');
			}
			$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
			var e = object = $.extend({}, _sync_data_rows[_sync_data_i].doc);
			console.log("test _sync_data_i", e, e._id);
			try {
				e.data = JSON.parse(e.data);
				e.data.client = User.client;
				e.data.token = User.lastToken;
				_sync_lock = true;
				if (e.api == "uploadPhotos") {
					selectTaskById(e.extra, function(success) {
						if (success.extra) {
							e.data.task_id = success.extra;
							if (e.data.imageURI && e.data.task_id) {
								Page.uploadImage(e.data, function() {
									sync_updateDB(null, {
										id : e._id
									});
								}, function() {
									var obj = sync_updateDB(null, {
										id : e._id
									});
								});
							}
						}
					});
				} else if (e.api != "companyEdit") {
					selectTaskById(e.extra, function(success) {
						if (success.extra) {
							if (e.data.hasOwnProperty("task_id")) {
								e.data.task_id = success.extra;
							}
							if (e.data.form) {
								var form = JSON.parse(e.data.form);
								form.task_id = success.extra;
								e.data.form = JSON.stringify(form);
							}
							if (e.data.signature) {
								var signature = JSON.parse(e.data.signature);
								signature.task_id = success.extra;
								e.data.signature = JSON.stringify(signature);
							}
							if (e.data.results) {
								var results = JSON.parse(e.data.results);
								results.task_id = success.extra;
								e.data.results = JSON.stringify(results);
							}
							Page.apiCall(e.api, e.data, 'post', 'sync_updateDB', {
								id : e._id,
								api : e.api
							});
						} else {
							Page.apiCall(e.api, e.data, 'post', 'sync_updateDB', {
								id : e._id,
								api : e.api
							});
						}
					});

				} else {
					Page.apiCall(e.api, e.data, 'post', 'sync_updateDB', {
						id : e._id,
						api : e.api
					});
				}

			} catch (err) {
				console.error('wtf');
				sync_query();
			}
		} else if (_sync_data_i > 0) {
			_sync_lock = false;
			_sync_data_rows = false;
			$('#syncing_tasks').addClass('hide');
			$('.overflow-wrapper').addClass('overflow-wrapper-hide');
			window.location.reload();
		}
	}
}
