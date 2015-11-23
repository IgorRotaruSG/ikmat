var _sync_data_rows = false;
var _sync_data_i = 0;
function sync_query(data) {
    /*
    console.log('----------------------------------------|data|---------------------------------');
    console.log(data);
    console.log('----------------------------------------|/data|---------------------------------');
    */
    d = db.getDbInstance();

    if (!_sync_data_rows) {
//        alert('sync_12');
//        console.log('sync_query.js 10');
        d.transaction(function(tx){
            tx.executeSql('SELECT * FROM "sync_query" WHERE "executed"=?', [0], function(tx, results){
                _sync_data_rows = results.rows;
                _sync_data_i = 0;
                sync_query();
            });
        });
    } else {
        console.log('synquery 23');
//        alert('sync_23');
        if (_sync_data_i < _sync_data_rows.length) {
            //console.log('xxxxx');
            if ( $('#syncing_tasks').hasClass('hide') ) {
                $('#syncing_tasks').removeClass('hide');
            }
            var e = object = $.extend({}, _sync_data_rows.item(_sync_data_i));
            d.transaction(function(tx){
                tx.executeSql('UPDATE "sync_query" SET "executed"=? WHERE "id"=?', [1, e.id], function(){
                    _sync_data_i = parseInt(_sync_data_i)+1;
                    try {
                        e.data = JSON.parse(e.data);
                        e.data.client = User.client;
                        e.data.token = User.lastToken;
                        /*console.log(e.data);
                        console.log('e.api');
                        console.log(e.api);*/
                        Page.apiCall(e.api, e.data, 'post', 'sync_query');
                    } catch (err) {
                        console.error('wtf');
                        sync_query();
                    }

                })
            });
        } else if ( _sync_data_i > 0 ) {
            $('#syncing_tasks').addClass('hide');
            //alert('Task are done syncing. Page will refresh.');
            window.location.reload();
        }
        //console.log('111');
    }
}
