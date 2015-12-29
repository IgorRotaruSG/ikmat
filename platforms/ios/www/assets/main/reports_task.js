/**
 * Created by gabi on 5/24/14.
 */

var get;

function reports_taskInit() {
    get = Page.get();
    if (User.isLogged()) {

        var data = {
            'client': User.client,
            'token': User.lastToken,
            'report_number': get.report,
            'task_id': get.task_id
        };

        Page.apiCall('reportTables', data, 'get', 'reportsTaskShow');
    } else {
        Page.redirect('login.html');
    }
}

function reportsTaskShow(data) {
    var html = data.report_returned;
    $('#reports_taskItem').html(html);
    $('#' + $.mobile.activePage.attr('id')).trigger('create');
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
}