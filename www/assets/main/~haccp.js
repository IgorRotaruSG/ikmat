var mySwiper;

function getHaccpCall(tx, results) {
    if (results.rows.length == 0 && isOffline()) {
        $('#haccp_list_no_results').text('No HACCP to show. Please connect to internet to sync.');
    }
    else if (results.rows.length == 0 && !isOffline()) {
        $('#haccp_list_no_results').text('No HACCP to show, yet.');

        var data = {
            'client': User.client,
            'token': User.lastToken
        }

        Page.apiCall('haccp', data, 'post', 'haccp');
    }
    else if (results.rows.length > 0) {
        $('#haccp_list_no_results').hide();

        var html = '';

        html += getHaccpForm();

        $('.swiper-slide').html(html);

        $('.overflow-wrapper').addClass('overflow-wrapper-hide');
        $('#' + $.mobile.activePage.attr('id')).trigger('create');
    }
}

function getHaccp(tx) {
    tx.executeSql('select * from haccp_category', [], getHaccpCall, db.dbErrorHandle);
}

function haccpInit() {
    if (User.isLogged()) {
        var d = db.getDbInstance();
        d.transaction(getHaccp, db.dbErrorHandle);


        mySwiper = new Swiper('.swiper-container',{
            calculateHeight:        true,
            releaseFormElements:    true,
            preventLinks:           false,
            simulateTouch:          false,

            onSlideChangeStart:     function(swiper) {
                //startFade();
            },

            onSlideNext:            function(swiper) {
                _t = 'save';
            },

            onSlidePrev:            function(swiper) {
                _t = 'edit';
            },

            onSlideChangeEnd:       function(swiper) {
                if (swiper.activeIndex == 16) {
                    setTimeout(function(){
                        window.location.href = 'index.html';
                    }, 3000);
                }
                $('html, body').animate({scrollTop: 0}, 500);
                var go = Form.validate(swiper.getSlide(swiper.previousIndex));
                if (_t == 'save') {

                }
            }
        });

    } else {
        Page.redirect('login.html');
    }
}

function haccp(data) {
    if (data.success) {
        //User.setToken(data.token);
        var add = [];

        if (data.haccp_category) {
            var date = '';
            var q = 'INSERT INTO "haccp_category"("id","name")';
            var h = false;
            for (var i in data.haccp_category) {
                if ((data.haccp_category).hasOwnProperty(i)) {
                    if (h) {
                        q += ' UNION';
                    } else {
                        h = true;
                    }
                    q += ' SELECT ' +
                        '"' + data.haccp_category[i].id + '" as "id", ' +
                        '"' + data.haccp_category[i].haccp + '" as "name"';

                    add.push({
                        'id':       data.haccp_category[i].id,
                        'data':     '<a href="haccp_cat.html?catId=' + data.haccp_category[i].id + '" data-transition="slide"><i class="fa fa-pagelines"></i> ' + data.haccp_category[i].haccp + '</a>'
                    });
                }
            }
            //console.log(q);
            db.clean();
            db.execute(q);

            $('#haccp_list_no_results').hide();
            _append('#haccp_list', add);
        }

        // sync duty
        //currentTime = data.currentTime;
        //var d = db.getDbInstance();
        //d.transaction(uncompletedTaskUpdated, d.dbErrorHandle);
        // sync duty
    }
}

function getHaccpForm() {
    var html = '';

    html += Form.radioListHACCP('possibility', '', ["Small: Seldom or nerver","Medium: Once a month","Big: Several times a week"], false);
    html += Form.radioListHACCP('consequence', 'If this happens, what do you think are the consequences for your customers?', ["Small: None","Medium: Food poisoning","Big: Death"], false);

    html += '<table class="haccp_color_table" cellspacing="7">';
    html += '<tr>';
    html += '<td rowspan="4" style="border:0;width:10px;;height:auto;"><div style="-webkit-transform:rotate(270deg);width:12px;">Possibility</div></td>';
    html += '<td></td>';
    html += '<td>low</td>';
    html += '<td style="word-wrap: break-word;">medium</td>';
    html += '<td>high</td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>high</td>';
    html += '<td style="background:#efef00;"></td>';
    html += '<td style="background:#cf2a27;"></td>';
    html += '<td style="background:#cf2a27;"></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td style="word-wrap: break-word;">medium</td>';
    html += '<td style="background:#009e0f;"></td>';
    html += '<td style="background:#efef00;"></td>';
    html += '<td style="background:#cf2a27;"></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>low</td>';
    html += '<td style="background:#009e0f;"></td>';
    html += '<td style="background:#009e0f;"></td>';
    html += '<td style="background:#efef00;"></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td colspan="5" style="border:0;width:auto;height:auto;">Consequence</td>';
    html += '</tr>';
    html += '</table>';

    return html;
}