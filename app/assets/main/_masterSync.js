var _syncCount = 0;
var _syncGlobalData = null;
var _data = {};
var _modulesToSync = ['registration','tasks','forms','form_item'];
var _login_client = null;
var _login_token = null;


function dump(data) {
    console.log('-----------------------------------------[dump]-----------------------------------------');
    console.log(data);
    console.log('-----------------------------------------[/dump]-----------------------------------------');
}

function repeat(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 0) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result;
}

function SyncMaster(data) {
    //console.log('SyncMaster(data) {');
    if (data != undefined) {
        _data = data;
    }

    this.getAll = function(i) {
        if (i == undefined) {
            i = 0;
        }
        if (i >= _modulesToSync.length) {
            return false;
        }
        var data = {
            'client':   _data.client,
            'token':    _data.token,
            'module':   _modulesToSync[i]
        };

        var req = $.ajax({
            'type': 'POST',
            'url': settings.apiDomain + 'sync',
            'dataType': 'jsonp',
            'jsonpCallback': '_syncGetAll',
            'data': data,
            'timeout': settings.requestTimeout
        });

        req.error(function(a,b,c) {
            console.warn(a);
            console.warn(b);
            console.warn(c);
            $('#alertPopup .alert-text').html($.t("error.no_internet_for_sync"));
            $('#alertPopup').on("popupafterclose",function(){
                $('#alertPopup').unbind("popupafterclose");
                //window.location.href = 'index.html';
            });
            $('#alertPopup').popup( "open", {positionTo: 'window'});
            //alert('Internet connection error!');

            //window.location.href = 'index.html';
        });
    };
}

function _syncGetAll(data){
    $('#login_done').text($.t('login.text.login_done'));
    $('#login_done').removeClass('hide');
    //$('.overflow-wrapper').addClass('overflow-wrapper-hide');
    //$('#clean-overflow-wrapper').removeClass('overflow-wrapper-hide');
    //$('.login-page').hide('');
    //return;
    var sql = '';
    for (var i in data) {
    	//pouchdb
    	if (data.hasOwnProperty(i) && i != 'token' && i != 'success' && i != 'currentTime' && i != 'form') {
            sql = {collection: i, keys : data[i].cols.split(',')};
            db.lazyQuerySync(i,castToListObject(data[i].cols.split(','), data[i].rows) , '_syncDone', i);
        }
    }

}

function _syncDone(i) {
    if (_modulesToSync.indexOf(i) > -1) {
        _syncCount = parseInt(_syncCount) + 1;
        //console.log(i + ' is done');
        i = _modulesToSync.indexOf(i);
        new SyncMaster().getAll(parseInt(i) + 1);
    }
    //console.log('sync count:' + _syncCount);
    //console.log('module count:' + _modulesToSync.length);
    if (_syncCount == _modulesToSync.length) {
        //console.warn('login  here');
        var data = _syncGlobalData;
        document._login_client = _data.client;
        document._login_token = _data.token;

        var userLoginCallback = 'user_login_now';
        if ( fromLandingPage ) {
            userLoginCallback = 'landingUserLogin';
        }
        db.lazyQuery('settings', [
            {_id: 'register_edit', type:'register_edit', value: _data.first_edit},
            {_id: 'haccp', type:'haccp', value: _data.first_haccp},
            {_id: 'name', type:'name', value: _data.company_name},
            {_id: 'role', type:'role', value: _data.role},
            {_id: 'deviation_form', type:'deviation_form', value: JSON.stringify(_data.deviation_form) },
            {_id: 'contact_name', type:'contact_name', value: _data.contact_name}
        ], userLoginCallback);

        var company_join_date = '';
        if (_data.company_date_added != undefined) {
            var tmp = _data.company_date_added.date;
            tmp = tmp.split(' ');
            tmp = tmp[0].split('-');
            company_join_date = tmp.join('-');
        }

        localStorage.setItem('user_name', _data.company_name);
        localStorage.setItem('contact_name', _data.contact_name);
        //set Company name
        localStorage.setItem('company_name', _data.company_name);
        localStorage.setItem('role', _data.role);
        localStorage.setItem('company_join_date', company_join_date);
        $('.overflow-wrapper').removeClass('overflow-wrapper-hide');
    }
    return false;
}
