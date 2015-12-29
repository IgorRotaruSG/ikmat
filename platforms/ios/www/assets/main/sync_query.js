var _sync_data_rows = false;
var _sync_data_i = 0;
var _sync_lock = false;

function selectTaskById(task_id, callback) {
	d = db.getDbInstance();
	d.transaction(function(tx) {
		tx.executeSql('SELECT * FROM "sync_query" WHERE "id"=? and executed=1', [task_id], function(tx, results) {

			if (results.rows.length > 0) {
				console.log("selectTaskById", results.rows.item(0));
				callback(results.rows.item(0));
			}
		});
	});
}

function sync_updateDB(data, params){
	d = db.getDbInstance();
	try{
		if (params && params.id) {
			d.transaction(function(tx) {
				var request = {};
				if (data) {
					var extra = data;
					if(params.api == 'formDeviationStart'){
						extra = data.form_deviation.last_task_inserted;
					}
					request.sql = 'UPDATE "sync_query" SET "executed"=?,"extra"=? WHERE "id"=?';
					request.args = [1, extra, params.id];
				} else {
					request.sql = 'UPDATE "sync_query" SET "executed"=? WHERE "id"=?';
					request.args = [1, params.id];
				}
				tx.executeSql(request.sql, request.args, function() {
					_sync_lock = false;
					_sync_data_i = parseInt(_sync_data_i) + 1;
					if (_sync_data_i >= _sync_data_rows.length || !_sync_data_rows) {
						$('#syncing_tasks').addClass('hide');
						$('.overflow-wrapper').addClass('overflow-wrapper-hide');
					}
					sync_query(data, params);
				});
			});
		}
	}catch (err) {
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
		d.transaction(function(tx) {
			tx.executeSql('SELECT * FROM "sync_query" WHERE "executed"=?', [0], function(tx, results) {
				_sync_data_rows = results.rows;
				console.log("_sync_data_rows", _sync_data_rows);
				_sync_data_i = 0;
				sync_query();
			});
		});
	} else {
		if (_sync_data_i < _sync_data_rows.length && !_sync_lock) {
			if ($('#syncing_tasks').hasClass('hide')) {
				$('#syncing_tasks').removeClass('hide');
			}
			$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
			var e = object = $.extend({}, _sync_data_rows.item(_sync_data_i));
			try {
				e.data = JSON.parse(e.data);
				e.data.client = User.client;
				e.data.token = User.lastToken;
				_sync_lock = true;
				if (e.api == "deviation" || e.api == "documentSignature") {
					console.log("deviation", e.extra);
					selectTaskById(e.extra, function(success) {
						console.log("success", success);
						if (success.extra) {
							success.data = JSON.parse(success.data);
							e.data.task_id = success.extra;
							if(e.data.form){
								var form = JSON.parse(e.data.form);
								form.task_id = success.extra;
								e.data.form = JSON.stringify(form);
							}
							if(e.data.signature){
								var signature = JSON.parse(e.data.signature);
								signature.task_id = success.extra;
								e.data.signature = JSON.stringify(signature);
							}
							Page.apiCall(e.api, e.data, 'post', 'sync_updateDB', {
								id : e.id,
								api: e.api
							});
						}
					});
					
				} else if(e.api == "uploadPhotos"){
					console.log("uploadPhotos", e);
					selectTaskById(e.extra, function(success) {
						console.log("success", success);
						if (success.extra) {
							success.data = JSON.parse(success.data);
							e.data.task_id = success.extra;
							if (e.data.imageURI && e.data.task_id) {
								Page.uploadImage(e.data, function() {
									// window.URL.revokeObjectURL(e.data.imageURI);
									sync_updateDB(null, {
										id : e.id
									});
								}, function() {
									var obj = 
									sync_updateDB(null, {
										id : e.id
									});
								});
							}
						}
					});
				}else{
					Page.apiCall(e.api, e.data, 'post', 'sync_updateDB', {
						id : e.id,
						api: e.api
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
			// window.location.reload();
		}
	}
}
