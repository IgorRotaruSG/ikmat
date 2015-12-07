var _sync_data_rows = false;
var _sync_data_i = 0;
function sync_query(data, params) {
    /*
    console.log('----------------------------------------|data|---------------------------------');
    console.log(data);
    console.log('----------------------------------------|/data|---------------------------------');
    */
   
   console.log("sync_query");
    d = db.getDbInstance();
	if(params && params.id){
		d.transaction(function(tx){
            tx.executeSql('UPDATE "sync_query" SET "executed"=? WHERE "id"=?', [1, params.id], function(){
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
        if (_sync_data_i < _sync_data_rows.length) {
            if ( $('#syncing_tasks').hasClass('hide') ) {
                $('#syncing_tasks').removeClass('hide');
            }
            $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
            var e = object = $.extend({}, _sync_data_rows.item(_sync_data_i));
            try {
                e.data = JSON.parse(e.data);
                e.data.client = User.client;
                e.data.token = User.lastToken;
                Page.apiCall(e.api, e.data, 'post', 'sync_query', {id: e.id});
            } catch (err) {
                console.error('wtf');
                sync_query();
            }
        } else if ( _sync_data_i > 0 ) {
            $('#syncing_tasks').addClass('hide');
            $('.overflow-wrapper').addClass('overflow-wrapper-hide');
            window.location.reload();
        }
    }
}
