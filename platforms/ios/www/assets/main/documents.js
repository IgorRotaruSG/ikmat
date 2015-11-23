function documentsInit() {

    var data = {
        'client': User.client,
        'token': User.lastToken
    };

    Page.apiCall('reports', data, 'get', 'documentsCall');
}

function documentsCall(data) {

    if (data.success) {
        var form_data = {
            'signature': {
                'type': 'signature',
                'label': 'Sign this document'
            }
        };

        var html = '';
        console.log(data);

        html += decodeURIComponent(data.html);

        html += '<form id="documentsForm">';
        html += HTML.formGenerate(form_data, $.t('general.submit_button') );
        html += '</form>';

        $('#documents_container').html(html);

        $('#' + $.mobile.activePage.attr('id')).trigger('create');

        $('.overflow-wrapper').addClass('overflow-wrapper-hide');

        $('#documentsForm').submit(function(e){
            e.preventDefault();

            var data = {
                'client': User.client,
                'token': User.lastToken,
                'choose': '{"signed":true}'
            };

            console.log('documents.js data = > ');
            console.log(data);

            Page.apiCall('reports', data, 'get', 'reportsSigned');

            return false;
        });
    }
}

function reportsSigned(data) {
    console.log(data);

    $('html, body').animate({scrollTop: 0}, 500);
}