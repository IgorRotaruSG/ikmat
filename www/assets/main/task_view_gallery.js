function task_view_galleryInit() {
    if (User.isLogged()) {
        get = Page.get();

        var data = {
            'client': User.client,
            'token': User.lastToken,
            'task_id': get.id
        }
        Page.apiCall('getTask', data, 'get', 'taskInfo');

    } else {
        Page.redirect('login.html');
    }
}

function taskInfo(data) {
    if (data.success) {
        if (data.tasks != undefined && data.tasks.photos != undefined) {
            var photos = $.parseJSON(data.tasks.photos);
            var html = '';
            for (var i=0; i<photos.length;i++) {
                html += '<li><a href="' + photos[i] + '" rel="external" class="photoswipe"><img src="' + photos[i] + '" width="150" height="150" alt="" /></a></li>';
            }
            $("#task_view_gallery").find('#gallery').html(html).listview('refresh');
            $("#task_view_gallery").find('.photoswipe').photoSwipe();
        }
    }
}