var get;

function getReportsViewCall(tx, results) {
    console.log('function getReportsViewCall(tx, results) {');
    console.log('ma ce cauti aici?');
    if (results.rows.length > 0) {
        var report = $.extend({}, results.rows.item(0));
        console.log(report);

        if (report.html == null) {
            var data = {
                'client': User.client,
                'token': User.lastToken,
                'report_number': get.id,
                'filter_date_from': get.from,
                'filter_date_to': get.to
            };

            Page.apiCall('reportTables', data, 'get', 'reportsView');
        } else {
            console.log(report);
        }
    } else {
        Page.redirect('reports.html');
    }
}

function getReportsView(tx) {
    tx.executeSql('SELECT "html", "link" FROM "reports" WHERE "id"=?',[get.id], getReportsViewCall, db.dbErrorHandle);
}

function reports_viewInit() {
    if (User.isLogged()) {
        get = Page.get();

        var d = db.getDbInstance();
        d.transaction(getReportsView, db.dbErrorHandle);
    } else {
        Page.redirect('login.html');
    }
}

function reportsView(data) {
    var html = data.report_returned;
    html += "<button onclick=\"window.open('" + data.link + "', '_system');\">" + $.t('reports.download') + "</button>";
    $('#raportItem').html(html);
    $('#' + $.mobile.activePage.attr('id')).trigger('create');
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');

    $('.report_4_link').off('click').on('click', function(e){
        e.preventDefault();
        Page.redirect('reports_task.html?report=' + get.id + '&task_id=' + $(this).data('id'));
    });

    var d = db.getDbInstance();
    d.transaction(function(tx){
        tx.executeSql('UPDATE "reports" SET "html"=?,"link"=? WHERE "id"=?',[data.report_returned,data.link,get.id],function(tx, results){
        },function(a,b){
            console.warn(a);
            console.warn(b);
        });
    });
}