var get;
var dd = {};

function getHaccpItemCall(tx, results) {
    if (results.rows.length == 0) {
        Page.redirect('haccp.html');
    } else {

        var resp = false;
        if (results.rows.item(0).response != 0) {
            resp = $.parseJSON(results.rows.item(0).response);
        }

        var form = $.parseJSON(results.rows.item(0).form);
        var html = '';
        var r;
        for (var i in form) {
            if (form.hasOwnProperty(i)) {
                r = false;
                if (i == 'answer') {
                    continue;
                }
                if (i == 'possibility') {
                    form[i].label = results.rows.item(0).content;
                }
                if (resp[i] != undefined) {
                    r = resp[i];
                }
                html += Form.radioListHACCP(i, form[i].label, form[i].answers, r);
            }
        }
        if (!resp) {
            html += Form.submitHACCP();
        } else {
            console.log(resp);
            $('.haccp_color_table').find('tr').eq(3-parseInt(resp['possibility'])).find('td').eq(parseInt(resp['consequence'])+1).html('<i class="fa fa-check"></i>');
        }

        $('#haccp_item_data').html(html);
        $('#' + $.mobile.activePage.attr('id')).trigger('create');
    }
}

function getHaccpItem(tx) {
    query = 'select * from haccp_items where "id" = "' + get.id + '"';
    tx.executeSql('select * from haccp_items where "id" = "' + get.id + '"', [], getHaccpItemCall, db.dbErrorHandle);
}

function haccp_itemInit() {
    if (User.isLogged()) {
        $('#haccp_item_data').off('submit').on('submit',function(e){
            e.preventDefault();

            var $f = $(this);
            $(this).find('input').each(function(){
                if (dd[$(this).attr('name')] == undefined) {
                    dd[$(this).attr('name')] = -1;
                }
                if ($(this).is(':checked')) {
                    dd[$(this).attr('name')] = $(this).val();
                }
            });

            var cango = true;
            for (i in dd) {
                if (dd.hasOwnProperty(i)) {
                    if (d[i] == -1) {
                        cango = false;
                        $f.find('input[name="' + i + '"]').first().parent().parent().find('p').remove();
                        $f.find('input[name="' + i + '"]').first().parent().parent().append($('<p style="color:red;">This is required</p>'));
                    } else {
                        $f.find('input[name="' + i + '"]').first().parent().parent().find('p').remove();
                    }
                }
            }

            if (cango) {
                dd['subcategory'] = get.id;

                var data = {
                    'client': User.client,
                    'token': User.lastToken,
                    'haccp_category': get.catId,
                    'response': JSON.stringify(dd)
                }

                //console.log(data);

                Page.apiCall('haccp', data, 'get', 'haccpComplete');
            }

            return false;
        });

        get = Page.get();

        var d = db.getDbInstance();
        d.transaction(getHaccpItem, db.dbErrorHandle);
    } else {
        Page.redirect('login.html');
    }
}

function haccpComplete(data) {
    var q = "UPDATE haccp_items SET response = '" + JSON.stringify(dd) + "' WHERE id = '" + get.id + "'";
    db.clean();
    db.execute(q);
    if (data.success) {
        if (data.haccp_response) {
            if (data.haccp_response.deviation && data.haccp_response.task_id) {
                Page.redirect('haccp_deviation.html?id=' + data.haccp_response.task_id);
            } else {
                Page.redirect('haccp_cat.html?catId=' + get.catId);
            }
        } else {
            Page.redirect('haccp_cat.html?catId=' + get.catId);
        }
    } else {
        Page.redirect('haccp_cat.html?catId=' + get.catId);
    }
}