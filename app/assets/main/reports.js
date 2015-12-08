var add = [];
var reports_type = null;
var company_year = new Date().getFullYear();
var get;
var mySwiper;
var $sigdiv;
var current_month;
var current_month_nr;

//navigator.connection.type = Connection.NONE;

if (localStorage.getItem('company_join_date')) {
	company_year = localStorage.getItem('company_join_date').split('-')[0];
}

function reportsGetCurrentDate() {
	var d = new Date();

	var today = new Date();
	var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

	return d.getFullYear() + '-' + (d.getMonth() + 1).toString().replace(/\d{0,2}/, function(m) {
		return '0'.slice(m.length - 1) + m;
	}) + '-' + (lastDayOfMonth.getDate()).toString().replace(/\d{0,2}/, function(m) {
		return '0'.slice(m.length - 1) + m;
	});
	//(d.getDate()).toString().replace(/\d{0,2}/,function(m){return '0'.slice(m.length-1) + m;});
}

var reports_date_start = new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().replace(/\d{0,2}/, function(m) {
	return '0'.slice(m.length - 1) + m;
}) + '-01';
var reports_date_end = reportsGetCurrentDate();

function bindExtraSelectors() {
	$('#reports-select-yearly-year').off('change').on('change', function() {
		var y = $(this).val();

		reports_date_start = y + '-01-01';
		reports_date_end = y + '-12-31';

	});
	//    $('#reports-select-monthly-month').off('change').on('change', function(){
	$('#reports-select-monthly-month').on('change', function() {
		var m = $(this).val(),
		    d = new Date();

		var m_m = m.toString().replace(/\d{0,2}/, function(m) {
			return '0'.slice(m.length - 1) + m;
		});
		reports_date_start = d.getFullYear() + '-' + m_m + '-' + '01';
		reports_date_end = d.getFullYear() + '-' + m_m + '-' + new Date(d.getFullYear(), m, 0).getDate();

	});
	$('#report-select-date-from').off('change').on('change', function() {
		reports_date_start = $(this).val();
	});
	$('#report-select-date-to').off('change').on('change', function() {
		reports_date_end = $(this).val();
	});
}

function getReportsCall(tx, results) {
	if (results.rows.length == 0 && isOffline()) {
		//    if (results.rows.length == 0 ) {
		//alert('No reports to show and no connectivity to fetch.');
		//        Page.redirect('index.html');
		$('#raportList').parent().prepend('<div class="text-center">' + $.t("error.no_internet_for_sync") + '</div>');
		$('#alertPopup .alert-text').html($.t("error.no_internet_for_sync"));
		$('#alertPopup').off("popupafterclose").on("popupafterclose", function() {
			Page.redirect('index.html');
		});
		$("#alertPopup").popup("open", {
			positionTo : 'window'
		});
	} else if (!isOffline()) {
		var data = {
			'client' : User.client,
			'token' : User.lastToken
		};

		Page.apiCall('reportTables', data, 'get', 'reportTables');
		mySwiper.reInit();
		//mySwiper.resizeFix();
	} else if (results.rows.length > 0) {
		var db_data = [];
		for (var i = 0; i < results.rows.length; i++) {
			db_data.push(results.rows.item(i));
		}
		showOfflineReports(db_data);

		mySwiper.reInit();
		//mySwiper.resizeFix();
	}
}

function getReports(tx) {
	tx.executeSql('select "id","name" from "reports"', [], getReportsCall, db.dbErrorHandle);
}

function reportsInit() {
	displayDocumnetList(false);
	var table = $('.resp_table');
    if($('#table04').length||$('#table08').length||$('#table09').length){
        console.log("aaaa");
    }
    else if($('#table07').length){
        table.find('tr').each(function(){
        var that = $(this);
        that.find('td').each(function(){
            var thisTd = $(this);
            var tdIndex = thisTd.index();
            var content = table.find('thead  tr:eq(1) th:eq('+tdIndex+')').html();
            if (tdIndex==0) {
                content = table.find('thead  tr:eq(0) th:eq('+tdIndex+')').html();
            }
            else if (tdIndex==1 || tdIndex==2) {
                content = table.find('thead  tr:eq(0) th:eq(1)').html() + " / " + table.find('thead  tr:eq(1) th:eq('+(tdIndex-1)+')').html();
            }
            else if (tdIndex==3 || tdIndex==4) {
                content = table.find('thead  tr:eq(0) th:eq(2)').html() + " / " + table.find('thead  tr:eq(1) th:eq('+(tdIndex-1)+')').html();
            }
            else if (tdIndex==5 || tdIndex==6) {
                content = table.find('thead  tr:eq(0) th:eq(3)').html() + " / " + table.find('thead  tr:eq(1) th:eq('+(tdIndex-1)+')').html();
            }
            if (tdIndex>6) {
                content = table.find('thead  tr:eq(0) th:eq('+(tdIndex-3)+')').html();
            }
            var data = "<span class='td_before'>"+content+"</span>"
            thisTd.prepend(data);
            });
        });
        
    }else{
        
    table.find('tr').each(function(){
        var that = $(this);
        that.find('td').each(function(){
            var thisTd = $(this);
            var tdIndex = thisTd.index();
            var content = table.find('thead  tr th:eq('+tdIndex+')').html();
            var data = "<span class='td_before'>"+content+"</span>"
            thisTd.prepend(data);
            });
        });
    }
	if (User.isLogged()) {
		executeSyncQuery();
		var d = db.getDbInstance();
		d.transaction(getReports, db.dbErrorHandle);
		mySwiper = new Swiper('.swiper-container-reports', {
			calculateHeight : true,
			releaseFormElements : true,
			preventLinks : false,
			simulateTouch : false, //todo set this to false
			//pagination: '.pagination',
			onInit : function() {
				if ( mySwiper.slides.length == 1 ) {
                    displayDocumnetList(false);
                }
				setSwiperMinHeight();
			},
			onSlideNext : function(swiper) {
				displayDocumnetList(false);
				_t = 'next';
			},

			onSlidePrev : function(swiper) {
				displayDocumnetList(false);
				_t = 'prev';
			},

			onSlideChangeEnd : function(swiper) {
				$('html, body').animate({
					scrollTop : 0
				}, 500);
				//mySwiper.resizeFix();
				if (parseInt(swiper.activeIndex) == parseInt(swiper.previousIndex)) {
					swiper.previousIndex--;
				}

				if (_t == 'prev') {
					swiper.removeSlide(parseInt(swiper.activeIndex) + 1);
				}

				if ($.mobile.activePage.attr('id') == 'reports') {
					if (swiper.activeIndex == 0) {
						$('h1.ui-title').html('Rapporter');
						$('div#global_footer').hide();
					} else {
						$('div#global_footer').show();
					}
				}
			}
		});

		$.mobile.touchOverflowEnabled = true;

		$('#reports-type-select').on('change', function() {
			var type = $(this).val(),
			    d = new Date(),
			    d_start = null,
			    d_end = null,
			    html = '';
			switch (type) {
			case 'crt_year':
				d_start = d.getFullYear() + '-01-01';
				d_end = reportsGetCurrentDate();
				break;
			case 'crt_month':
				d_start = d.getFullYear() + '-' + (d.getMonth() + 1).toString().replace(/\d{0,2}/, function(m) {
					return '0'.slice(m.length - 1) + m;
				}) + '-01';
				d_end = reportsGetCurrentDate();
				break;
			case 'yearly':
				html += '<select id="reports-select-yearly-year">';
				for (var i = d.getFullYear(); i >= parseInt(company_year); i--) {
					html += '<option value="' + i + '">' + i + '</option>';
				}
				html += '</select>';
				d_start = (d.getFullYear()) + '-01-01';
				d_end = (d.getFullYear()) + '-12-31';
				break;
			case 'monthly':
				var months = {
					'1' : $.t('reports_filter.months.1'),
					'2' : $.t('reports_filter.months.2'),
					'3' : $.t('reports_filter.months.3'),
					'4' : $.t('reports_filter.months.4'),
					'5' : $.t('reports_filter.months.5'),
					'6' : $.t('reports_filter.months.6'),
					'7' : $.t('reports_filter.months.7'),
					'8' : $.t('reports_filter.months.8'),
					'9' : $.t('reports_filter.months.9'),
					'10' : $.t('reports_filter.months.10'),
					'11' : $.t('reports_filter.months.11'),
					'12' : $.t('reports_filter.months.12')
				};
				//if (d.getFullYear() != parseInt(company_year)) {
				html += '<select id="reports-select-monthly-month" class="">';
				for (var i = d.getMonth(); i > 0; i--) {
					html += '<option value="' + i + '">' + months[i] + '</option>';
				}
				html += '</select>';
				var m = d.getMonth().toString().replace(/\d{0,2}/, function(m) {
					return '0'.slice(m.length - 1) + m;
				});
				d_start = d.getFullYear() + '-' + m + '-' + '01';
				d_end = d.getFullYear() + '-' + m + '-' + new Date(d.getFullYear(), d.getMonth(), 0).getDate();
				break;
			case 'custom':
				html += '<label>From</label><input type="date" value="' + reportsGetCurrentDate() + '" id="report-select-date-from"/>';
				html += '<label>To</label><input type="date" value="' + reportsGetCurrentDate() + '" id="report-select-date-to"/>';

				d_start = reportsGetCurrentDate();
				d_end = reportsGetCurrentDate();
				break;
			}
			$('#extra-reports-type-select').html(html).trigger("create");
			bindExtraSelectors();

			reports_date_start = d_start;
			reports_date_end = d_end;
			reports_type = type;
		});

		realignSlideHeight('max-height-reports');
		//$('#reports-type-select').val(reports_type).trigger('change');
	} else {
		Page.redirect('login.html');
	}
}

function showOfflineReports(data) {
    var add = '';
    data.push({'id':0,'name':$.t('nav.documents')});
    
    data.sort(function(a, b) {
            a = a.name;
            b = b.name;
            return a < b ? -1 : (a > b ? 1 : 0);
        });          
   
    for (var i in data) {
        if (data.hasOwnProperty(i)) {
            if ( data[i].id == 0 ) {//company document report
                add += '<li><a href="#" data-type="doc" class="report_generator_link"></i> ' + data[i].name + '</a></li>';
            }
            else if ( data[i].id == 15 ) {//flowcharts export
                add += '<li><a href="#" data-type="'+  data[i].id  +'" class="email_flowcharts">' + data[i].name + '</a></li>'
            } 
            else {
                add += '<li><a href="#" data-type="'+  data[i].id  +'" class="report_generator_link" data-from="'+reports_date_start+'" data-to="' + reports_date_end + '" >' + data[i].name + '</a></li>'
            }
        }
    }

    $('#no_results_raports').hide();
    $('.overflow-wrapper').addClass('overflow-wrapper-hide');

    $('#raportList').html('').html(add).listview('refresh');

    bind_form_click_handler_r();

}

function reportTables(data) {
	if (data.success) {
		var add = '',
		    db_data = [];
		var f = data.reports_list;
		var tuples = [['doc', $.t('nav.documents')]];
		for (var key in f) {
			if ( typeof f[key] == 'object') {
				tuples.push([key, f[key].alias]);
			} else {
				tuples.push([key, f[key]]);
			}
		}

		tuples.sort(function(a, b) {
			a = a[1];
			b = b[1];

			return a < b ? -1 : (a > b ? 1 : 0);
		});

		if (localStorage.getItem('role') != 'ROLE_EMPLOYEE') {
			for (var i = 0; i < tuples.length; i++) {
				var key = tuples[i][0];
				var value = tuples[i][1];
				if (key == 'doc') {
					add += '<li><a href="#" data-type="' + key + '" class="report_generator_link">' + value + '</a></li>';
				} else {
					add += '<li><a href="#" data-type="' + key + '" class="report_generator_link" data-from="' + reports_date_start + '" data-to="' + reports_date_end + '" >' + value + '</a></li>';

					db_data.push([key, value]);
				}
			}
		}

		if (db_data.length > 0) {
			var q = 'INSERT OR REPLACE INTO "reports"("id","name") VALUES(?,?)';
			db.lazyQuery({
				'sql' : q,
				'data' : db_data
			}, 0);
		}

		$('#no_results_raports').hide();
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');

		$('#raportList').html(add).listview('refresh');

		$('.report_link').off('click').on('click', function(e) {
			e.preventDefault();
			Page.redirect($(this).attr('href') + '&from=' + reports_date_start + '&to=' + reports_date_end);
		});
		bind_form_click_handler_r();
	}
}

function bind_form_click_handler_r() {
	$('.report_generator_link').off('click').on('click', function(e) {
		$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
		document.form_cat = $(this).data('type');
		document.date_from = $(this).data('from');
		document.date_to = $(this).data('to');
		var d = db.getDbInstance();
		displayDocumnetList(false);
		d.transaction(function(tx) {
			tx.executeSql('SELECT * FROM "form_item" WHERE "type"=?', [document.form_cat], function(tx, results) {
				// if (results.rows.length == 0 && !isOffline() ) {
				if (results.rows.length == 0) {
					//                if (!isOffline()) {
					switch(document.form_cat) {
					case 'doc':
						var data = {
							'client' : User.client,
							'token' : User.lastToken
						};

						Page.apiCall('reports', data, 'get', 'documentsCall');
						break;
					default:
						var d = db.getDbInstance();
						d.transaction(getReportsView, db.dbErrorHandle);
						break;
					}
				} else if (results.rows.length > 0) {
					alert('Connection offline. No results to show.');
					//                    $('.overflow-wrapper').addClass('overflow-wrapper-hide');
					$('#alertPopup .alert-text').html($.t("error.no_internet_for_sync"));
					$('#alertPopup').off("popupafterclose").on("popupafterclose", function() {
						$('.overflow-wrapper').addClass('overflow-wrapper-hide');
					});
					$('#alertPopup').popup("open", {
						positionTo : 'window'
					});
				} else {
					//alert('Connection offline. No results to show. 2');
					//$('.overflow-wrapper').addClass('overflow-wrapper-hide');
					$('#alertPopup .alert-text').html($.t("error.no_internet_for_sync"));
					$('#alertPopup').off("popupafterclose").on("popupafterclose", function() {
						$('.overflow-wrapper').addClass('overflow-wrapper-hide');
					});
					$('#alertPopup').popup("open", {
						positionTo : 'window'
					});
				}
			});
		});
	});

}

/* Reports view */

function reportsView(data) {
	if (!data) {
		$('#alertPopup .alert-text').html($.t("error.no_internet_for_sync"));
		$('#alertPopup').off("popupafterclose").on("popupafterclose", function() {
			$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		});
		$('#alertPopup').popup("open", {
			positionTo : 'window'
		});
		return;
	}
	$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	var current_date = new Date();
	if (current_month === undefined) {
		current_month = getMonth(current_date.getMonth() + 1);
		current_month_nr = current_date.getMonth() + 1;
	}
	var months = getMonths();
	var years = getYears();

	var html = '<div class="report-date-selector-container">' + '<div class="report-date-selector">' + '<select name="month" data-icon="false" class="report-date-selector" id="report-month">' + months + '</select>' + '</div>' + '<div class="report-date-selector">' + '<select name="year" data-icon="false" class="report-date-selector" id="report-year">' + years + '</select>' + '</div>' + '<div class="clearfix"></div>' + '</div>';
	html += data.report_returned;

	mySwiper.appendSlide(html, 'swiper-slide');
	$('#' + $.mobile.activePage.attr('id')).trigger('create');
	mySwiper.swipeTo(1, 300, true);

	//$('#raportItem').html(html);
	//$('#' + $.mobile.activePage.attr('id')).trigger('create');
	$('.overflow-wrapper').addClass('overflow-wrapper-hide');

	$('h1.ui-title').html('Rapporter');

	$('.svgString').each(function() {
		if ($(this).val() != '') {
			var svgStr = $(this).val();
			var i = new Image()
			i.src = "data:image/svg+xml;base64," + svgStr;
			i.width = '150';
			$(i).appendTo($(this).parent());
			// append the image (SVG) to DOM.
		}
	});

	$('.report_4_link').off('click').on('click', function(e) {
		e.preventDefault();
		Page.redirect('reports_task.html?report=' + get.id + '&task_id=' + $(this).data('id'));
	});

	$('#send_email').off('click').on('click', function(e) {
		$('#popup-send-email').unbind("popupafterclose");
		/*step 1: display the date chooser*/
		$("#popup-send-email").popup("open");
		$("#popup-send-email").parent().css({
			'top' : 0,
			'left' : 0,
			'max-width' : '100%',
			'width' : '100%',
			'height' : parseInt($('body').height()) + 'px',
			'overflow' : 'hidden',
			'position' : 'fixed'
		});
		$('#popup-send-email').css('height', '100%');
		//$('#popup-send-email').css('height', $(window).height()+'px');

	});

	$("#confirm-send").off('click').on("click", function(event, ui) {
		var ok = HTML.validate($('#popup-send-email'));

		if (ok) {
			$("#confirm-send").attr('disabled', true);
			$("#confirm-send").parent().find('.ui-btn-text').html($.t('general.loading'));
			$('.overflow-wrapper').addClass('overflow-wrapper-hide');
			var email_data = {
				'client' : User.client,
				'token' : User.lastToken,
				'report_id' : data.report_number,
				'email' : $('#email').val(),
				'filter_date_from' : reports_date_start,
				'filter_date_to' : reports_date_end
			};
			Page.apiCall('send-report-by-email', email_data, 'get', 'sendEmail');
		}
	});

	$(".photopopup").on({
		popupbeforeposition : function() {
			//            alert('wadafac');
			var maxHeight = $(window).height() - 60 + "px";
			$(".photopopup img").css("max-height", maxHeight);
		}
	});

	$('#current-year').off('click').on('click', function(e) {
		$('#report-year-wrap').show();
	});

	$('#current-month').off('click').on('click', function(e) {
		$('#report-month-wrap').show();
	});

	$('#report-year').off('click').on('click', function(e) {
		$('#report-year').closest('.report-date-selector').on("click").on("click", function() {
			e.preventDefault();
			var date = new Date($('#report-year').val());
			var date_start = (date.getFullYear()) + '-01-01';
			var date_end = (date.getFullYear()) + '-12-31';
			$('#current-year').html($(this).find('option:selected').html());
			$('#current-year').parent().children('span.ui-btn-inner').html($(this).find('option:selected').html());

			reports_date_start = date_start;
			reports_date_end = date_end;
			getNewReport(date_start, date_end);
		});

	});

	$('#report-month').off('change').on('change', function(e) {
		e.preventDefault();
		var date = new Date($('#report-year').val());
		var date_start = (date.getFullYear()) + '-' + $(this).val() + '-01';
		var last_day = new Date((date.getFullYear()), $(this).val(), 0);
		var date_end = (date.getFullYear()) + '-' + $(this).val() + '-' + last_day.getDate();
		$('#current-month').html($(this).find('option:selected').html());
		$('#current-month').parent().children('span.ui-btn-inner').html($(this).find('option:selected').html());
		current_month = getMonth($(this).val());
		current_month_nr = $(this).val();

		var m = $(this).val();

		var m_m = m.toString().replace(/\d{0,2}/, function(m) {
			return '0'.slice(m.length - 1) + m;
		});
		reports_date_start = date.getFullYear() + '-' + m_m + '-' + '01';
		reports_date_end = date.getFullYear() + '-' + m_m + '-' + new Date(date.getFullYear(), m, 0).getDate();

		//alert(current_month);
		getNewReport(date_start, date_end);
	});

	if (document.form_cat == '12' || document.form_cat == '1' || document.form_cat == '3' || document.form_cat == '15') {
		$('.report-date-selector-container').hide();
		$('.semi-title').css('margin-top', '10px');
	} else {
		$('.report-date-selector-container').show();
		$('.semi-title').css('margin-top', '0px');
	}
	realignSlideHeight('max-height-reports');

}

function getReportsViewCall(tx, results, id) {
	if (results.rows.length > 0) {
		//        alert('nu');
		var report = $.extend({}, results.rows.item(0));

		if (report.html == null) {
			var data = {
				'client' : User.client,
				'token' : User.lastToken,
				'report_number' : document.form_cat,
				'filter_date_from' : document.date_from,
				'filter_date_to' : document.date_to
			};

			Page.apiCall('reportTables', data, 'get', 'reportsView');
		} else {
			reportsView(data);

		}
	} else {
		Page.redirect('reports.html');
	}
}

function getReportsView(tx) {
	tx.executeSql('SELECT "html", "link" FROM "reports" WHERE "id"=?', [document.form_cat], getReportsViewCall, db.dbErrorHandle);
}

function displayDocumnetList(isShow) {
	if(isShow){
		$('#document-anchors').removeClass("hidden");
	}else{
		$('#document-anchors').addClass("hidden");
	}
	
}

/*Documents*/
function documentsCall(data) {
	if (data.success) {
		var form_data = {
			'signature' : {
				'type' : 'signature',
				'label' : 'Sign this document'
			}
		};
		// Anchor for documents
		displayDocumnetList(true);
		$('h1.ui-title').html('Selskapsdokument');
		var docsContentList = '';
		$(data.html).find("h2.heading").each(function(index, value){
			docsContentList += '<dt><a data-rel="close" class="anchor-item" data-transition="slide" href="' + index + '" class="email_flowcharts">' + (index + 1) + ". "+value.innerText + '</a></dt>';
		});
		$('#doc-list-contents').html('').html(docsContentList);
		$('#document-list .ui-panel-inner').css({"overflow-y":"scroll", "height": $(window).height()});
		
		var html = '';
		html += decodeURIComponent(data.html);

		html += '<form id="documentsForm">';
		html += HTML.formGenerate(form_data, $.t('general.submit_button'));
		html += '</form>';

		html += '<div data-role="popup" id="signature_pop"   data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">' + '<div id="signature-holder">' + '<div id="signature" data-role="none"></div>' + '</div>' + '<button id="deviation-signature-close">' + $.t('general.sign_button') + '</button>' + '</div>';

		mySwiper.appendSlide(html, 'swiper-slide');
		
		
		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		mySwiper.swipeTo(1, 300, true);
		$('#documents_container').html(html);

		$('#' + $.mobile.activePage.attr('id')).trigger('create');

		$('.overflow-wrapper').addClass('overflow-wrapper-hide');

		$('#documentsForm').submit(function(e) {
			e.preventDefault();

			var data = {
				'client' : User.client,
				'token' : User.lastToken,
				'choose' : '{"signed":true}'
			};

			Page.apiCall('reports', data, 'get', 'reportsSigned');

			return false;
		});
		
		$('.anchor-item').off('click').on('click', function () {
		 	// var target = $($(this).attr("href")).position().top;
		 	// $.mobile.silentScroll(target);
		 	 // $("#max-height-reports").scrollTop(target);
		 	 console.log(parseInt($(this).attr("href")));
		 	 $('#document-list').panel("close");
		 	 $('#max-height-reports').animate({
				    scrollTop: $('#max-height-reports h2.heading').eq(parseInt($(this).attr("href"))).position().top
				});
         	return false;
		});

		$('#signature-trigger').off('click').on('click', function(e) {
			e.preventDefault();

			openSignaturePopup();

			$('#deviation-signature-close').off('click').on('click', function() {
				$('#signature_pop').popup('close');
				console.log("deviation-signature-close15");
				var data = {
					'client' : User.client,
					'token' : User.lastToken,
					'signature' : JSON.stringify({
						"name" : $('#sign_name').val(),
						"svg" : $sigdiv.jSignature("getData", "svgbase64")[1],
						"parameter" : "document"
					})
				};
				/*
				var data = {
				'client': User.client,
				'token': User.lastToken,
				'choose': '{"signed":true}'
				};*/
				//                Page.apiCall('reports', data, 'get', 'reportsSigned');
				//                Page.apiCall('reports', data, 'post', '');

				Page.apiCall('documentSignature', data, 'get', 'documentSignature');
			});

			return false;
		});

		$('#send_email').off('click').on('click', function(e) {
			/*step 1: display the date chooser*/
			$("#popup-send-email").popup("open");
			$('#popup-send-email').parent().css({
				'top' : 0,
				'left' : 0,
				'max-width' : '100%',
				'width' : '100%',
				'height' : parseInt($('body').height()) + 'px',
				'overflow' : 'hidden',
				'position' : 'fixed'
			});
			$('#popup-send-email').css('height', '100%');
			$("#confirm-send").off('click').on("click", function(event, ui) {
				var ok = HTML.validate($('#popup-send-email'));

				if (ok) {
					$("#confirm-send").attr('disabled', true);
					$("#confirm-send").parent().find('.ui-btn-text').html($.t('general.loading'));
					$('.overflow-wrapper').addClass('overflow-wrapper-hide');
					var email_data = {
						'client' : User.client,
						'token' : User.lastToken,
						'report_id' : 0,
						'email' : $('#email').val(),
						'filter_date_from' : reports_date_start,
						'filter_date_to' : reports_date_end
					};
					Page.apiCall('send-report-by-email', email_data, 'get', 'sendEmail');
				} else {

				}
			});

		});
	}
}

function reportsSigned(data) {
	$('html, body').animate({
		scrollTop : 0
	}, 500);
}

function documentSignature(data) {
	$('#sign_name').attr('disabled', true);
	$('#signature-trigger').attr('disabled', true);
	$('#signature-trigger').val(data.current_time.date).button('refresh');
}

function sendEmail(data) {
	$('#confirm-send').removeAttr('disabled');
	$("#confirm-send").parent().find('.ui-btn-text').html($.t('general.send'));
	reports_date_start = new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().replace(/\d{0,2}/, function(m) {
		return '0'.slice(m.length - 1) + m;
	}) + '-01';
	reports_date_end = reportsGetCurrentDate();
	/*$('#popup-send-email').off("popupafterclose").on("popupafterclose",function(){
	 $('#alertPopup .alert-text').html("E-post ble sendt!");
	 $('#alertPopup').popup( "open", {positionTo: "window"});
	 });*/
	$('#popup-send-email').popup('close');
	$('.swiper-slide-active').scrollTop(0);
	$('.semi-title-blue').parent().find('p').append('<div class="report_email_sent">' + $.t('general.email_sent') + '</div>');
}

var months = {
	'1' : $.t('reports_filter.months.1'),
	'2' : $.t('reports_filter.months.2'),
	'3' : $.t('reports_filter.months.3'),
	'4' : $.t('reports_filter.months.4'),
	'5' : $.t('reports_filter.months.5'),
	'6' : $.t('reports_filter.months.6'),
	'7' : $.t('reports_filter.months.7'),
	'8' : $.t('reports_filter.months.8'),
	'9' : $.t('reports_filter.months.9'),
	'10' : $.t('reports_filter.months.10'),
	'11' : $.t('reports_filter.months.11'),
	'12' : $.t('reports_filter.months.12')
};

function getMonths() {
	var html = '';
	//var d = new Date();

	html += '';
	for (var i = 12; i > 0; i--) {
		html += '<option value="' + i + '" ' + (current_month_nr == i ? 'selected' : '' ) + '>' + months[i] + '</option>';
	}
	return html;
}

function getMonth(nr) {

	var html = months[nr];

	return html;
}

function getWeeks() {
	var d = new Date(),
	    d_start = null,
	    d_end = null,
	    html = '';

	html += '';
	for (var i = d.get; i > 0; i--) {
		html += '<option value="' + i + '">' + i + '</option>';
	}
	return html;

	//    html += '</select>';
	//    var m = d.getMonth().toString().replace(/\d{0,2}/,function(m){return '0'.slice(m.length-1) + m;});
	d_start = d.getFullYear() + '-' + m + '-' + '01';
	d_end = d.getFullYear() + '-' + m + '-' + new Date(d.getFullYear(), d.getMonth(), 0).getDate();
}

function getYears() {
	var d = new Date(),
	    d_start = null,
	    d_end = null,
	    html = '',
	    date_1 = d.getFullYear() + 1;
	var report_year = new Date(reports_date_start);
	for (var i = date_1; i >= parseInt(company_year); i--) {
		html += '<option value="' + i + '" ' + (i == report_year.getFullYear() ? 'selected' : '' ) + '>' + i + '</option>';
	}
	return html;
}

function getNewReport(date_start, date_end) {
	$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
	var data = {
		'client' : User.client,
		'token' : User.lastToken,
		'report_number' : document.form_cat,
		'filter_date_from' : date_start,
		'filter_date_to' : date_end
	};
	Page.apiCall('reportTables', data, 'get', 'reportsView');

	mySwiper.removeSlide(1);
}
