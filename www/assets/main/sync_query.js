var _sync_data_rows = false;
var _sync_data_i = 0;
var _sync_lock = false;

function selectTaskById(task_id, callback){
	d = db.getDbInstance();
	d.transaction(function(tx){
		tx.executeSql('SELECT * FROM "sync_query" WHERE "id"=?', [task_id], function(tx, results){
			
		    if(results.rows.length > 0){
		    	console.log("selectTaskById", results.rows.item(0));
		    	callback(results.rows.item(0));
		    }
		});
	});
}

function sync_query(data, params) {
    /*
    console.log('----------------------------------------|data|---------------------------------');
    console.log(data);
    console.log('----------------------------------------|/data|---------------------------------');
    */
   
   console.log("sync_query", data);
    d = db.getDbInstance();
	if(params && params.id){
		d.transaction(function(tx){
			var request = {};
			if(data){
				request.sql = 'UPDATE "sync_query" SET "executed"=?,"extra"=? WHERE "id"=?';
				request.args = [1, data, params.id];
			}else{
				request.sql = 'UPDATE "sync_query" SET "executed"=? WHERE "id"=?';
				request.args = [1, params.id];
			}
            tx.executeSql(request.sql, request.args, function(){
            	_sync_lock = false;
                _sync_data_i = parseInt(_sync_data_i)+1;
                if(_sync_data_i >= _sync_data_rows.length || !_sync_data_rows){
                	 $('#syncing_tasks').addClass('hide');
        			$('.overflow-wrapper').addClass('overflow-wrapper-hide');
                }
            });
        });
	}
	if(isOffline()){
		_sync_data_rows = false;
		_sync_data_i = 0;
		_sync_lock = false;
		$('#syncing_tasks').addClass('hide');
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		return;
	}
	console.log("_sync_data_rows", _sync_data_rows);
    if (!_sync_data_rows) {
        d.transaction(function(tx){
            tx.executeSql('SELECT * FROM "sync_query" WHERE "executed"=?', [0], function(tx, results){
                _sync_data_rows = results.rows;
                console.log("_sync_data_rows", _sync_data_rows);
                _sync_data_i = 0;
                sync_query();
            });
        });
    } else {
        if (_sync_data_i < _sync_data_rows.length && !_sync_lock) {
            if ( $('#syncing_tasks').hasClass('hide') ) {
                $('#syncing_tasks').removeClass('hide');
            }
            $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
            var e = object = $.extend({}, _sync_data_rows.item(_sync_data_i));
            try {
                e.data = JSON.parse(e.data);
                e.data.client = User.client;
                e.data.token = User.lastToken;
                _sync_lock = true;
                if(e.api != "uploadPhotos"){
                	Page.apiCall(e.api, e.data, 'post', 'sync_query', {id: e.id});	
                }else{
                	console.log("uploadPhotos", e);
                	selectTaskById(e.extra, function(success){
                		console.log("success", success);
	            		if(success.extra){
	            			success.data = JSON.parse(success.data);
	            			e.data.task_id = success.extra;
	            			if(e.data.imageURI && e.data.task_id){
		                		Page.uploadImage(e.data, function(){
		                			window.URL.revokeObjectURL(e.data.imageURI);
		                			sync_query(null, {id: e.id});
		                		});	
		                	}
	            		}
	            	});
                }
                
            } catch (err) {
                console.error('wtf');
                sync_query();
            }
        } else if ( _sync_data_i > 0 ) {
        	_sync_lock = false;
            $('#syncing_tasks').addClass('hide');
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
            // window.location.reload();
        }
    }
}
