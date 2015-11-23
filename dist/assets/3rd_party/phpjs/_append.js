function _append(dest, data) {
    var w = false;
    var html = '';
    for (var i=0; i<data.length; i++) {
        w = false;
        extra = '';
        $(dest).find('li').each(function(){
            if ($(this).data('id') <= data[i].id) {
                w = $(this);
            }
        });
        if (data[i].extra != undefined) {
            extra = ' ' + data[i].extra;
        }
        html = '<li data-id="' + data[i].id + '"' + extra + '>' + data[i].data + '</li>';
        if (w) {
            $(w).after(html);
        } else {
            $(dest).prepend(html);
        }
    }
    $(dest).listview('refresh');
}