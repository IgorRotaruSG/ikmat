function tosInit() {
    var html = $.t('tos.text');
    //html += '<button data-theme="d" onclick="Page.redirect(\'register_company.html\')">' + $.t('tos.back') + '</button>';
    $('#tos_back_button').html($.t('tos.back'));
    $('#tos_back_button').siblings('.ui-btn-inner').find('span.ui-btn-text').html($.t('tos.back'));
    $('#tos_container').html(html);
}