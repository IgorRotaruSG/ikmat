var _t;
var get = {};
var fq = [];
var fqi = -1;
var f_i = 2;
var candelete = false;
var universal_cango = false;
var he_have_something = false;
var _h_content = 800;
var last_id = 0;
var mySwiper;
var zh_h;

var signature_open = false;
var offline_signature;

var activeQuestion = 0;

var confirm_action = false;
var nextSlide = true;
var createDeviation = false;
var deviationAnswers = {};

//navigator.connection.type = Connection.NONE;

function getHaccpCall(err, results) {
	console.info("getHaccpCall", results, err);
	if ((!results || results.rows.length == 0) && isOffline() && !he_have_something) {
		console.log('getHaccpCall 18');
		$('#haccp_list_no_results').text($.t('haccp.no_haccp_yet'));
		setTimeout(function() {
			Page.redirect('index.html');
		}, 3500);
	} else if ((!results || results.rows.length == 0) && !isOffline() && !he_have_something && get.continue == undefined) {
		console.log('getHaccpCall from API');
		var data = {
			'client' : User.client,
			'token' : User.lastToken
		};
		console.log('26 haccp.js');
		Page.apiCall('haccp', data, 'post', 'haccp');
	} else if (results.rows.length > 0) {
		console.log('din local');
		he_have_something = true;
		//        $('#haccp_list_no_results').show();

		var html = '';
		var response;
		for (var i = 0; i < results.rows.length; i++) {
			//html = '<h1>' + results.rows[i].doc.id + '/' + results.rows[i].doc.cat + '</h1>';
			html = getHaccpForm(results.rows[i].doc.content, results.rows[i].doc.id, results.rows[i].doc.cat, results.rows[i].doc.response);
			mySwiper.appendSlide(html, 'swiper-slide');

			if (results.rows[i].doc.response != 0) {
				try {
					response = JSON.parse(results.rows[i].doc.response);
					var response_possibility = response.possibility;
					var response_consequence = response.consequence;
				} catch(err) {
					var response_possibility = -1;
					var response_consequence = -1;
					response = false;
				}
			} else {
				var response_possibility = -1;
				var response_consequence = -1;
				response = false;
			}

			$('#haccp_radio_possibility_' + results.rows[i].doc.id + '_' + response_possibility).trigger('click');
			$('#haccp_radio_consequence_' + results.rows[i].doc.id + '_' + response_consequence).trigger('click');
		}

		if (results.rows.length > 1) {
			mySwiper.removeSlide(0);
			mySwiper.reInit();
			mySwiper.resizeFix();
		} else {
			candelete = true;
		}
		//console.log($.mobile.activePage.attr('id'));
		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		//setTimeout(function(){
		//}, 1000);
	} else if (he_have_something) {
		//    else if ( !he_have_something) {
		console.log('haccp 77 he_have_something');
		var html = '<div class="no_results" style="color:#00cde7;font-size:34px;">';
		html += $.t('haccp.no_haccp') + '<br /><br />';
		html += '</div>';

		mySwiper.appendSlide(html, 'swiper-slide');
		check_haccp();

		//        $('[data-role="footer"]').hide();
	} else {
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		$('#haccp_list_no_results').html($.t('haccp.no_haccp'));
		$('[data-role="footer"]').hide();
		//alert('100');return;
		setTimeout(function() {
			Page.redirect('index.html');
		}, 3500);
	}
}

function getHaccpCallPrev(tx, results) {
	//alert('getHaccpCallPrev');
	if (results.rows.length == 0 && isOffline() && !he_have_something) {
		console.log('getHaccpCall 18');
		$('#haccp_list_no_results').text($.t('haccp.no_haccp_yet'));
		setTimeout(function() {
			Page.redirect('index.html');
		}, 3500);
	} else if (results.rows.length == 0 && !isOffline() && !he_have_something) {
		//console.log('getHaccpCall from API');
		var data = {
			'client' : User.client,
			'token' : User.lastToken
		}
		console.log('112 haccp.js');
		Page.apiCall('haccp', data, 'post', 'haccp');
	} else if (results.rows.length > 0) {
		console.log('din local');
		he_have_something = true;
		//        $('#haccp_list_no_results').show();

		var html = '';
		var response;
		for (var i = 0; i < results.rows.length; i++) {
			//html = '<h1>' + results.rows[i].doc.id + '/' + results.rows[i].doc.cat + '</h1>';
			html += getHaccpForm(results.rows[i].doc.content, results.rows[i].doc.id, results.rows[i].doc.cat, results.rows[i].doc.response);
			mySwiper.prependSlide(html, 'swiper-slide');
			mySwiper.swipeTo(mySwiper.activeIndex + 1, 0, false);
			if (results.rows[i].doc.response != 0) {
				try {
					response = JSON.parse(results.rows[i].doc.response);
					var response_possibility = response.possibility;
					var response_consequence = response.consequence;
				} catch(err) {
					var response_possibility = -1;
					var response_consequence = -1;
					response = false;
				}
			} else {
				var response_possibility = -1;
				var response_consequence = -1;
				response = false;
			}

			$('#haccp_radio_possibility_' + results.rows[i].doc.id + '_' + response_possibility).trigger('click');
			$('#haccp_radio_consequence_' + results.rows[i].doc.id + '_' + response_consequence).trigger('click');
		}
		//console.error('hey broyher');
		if (results.rows.item.length > 1) {
			//alert('here');
			mySwiper.removeSlide(0);
			mySwiper.reInit();
			mySwiper.resizeFix();
		} else {
			candelete = true;
		}

		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	} else if (he_have_something) {
		var html = '<div class="no_results" style="color:#00cde7;font-size:34px;">';
		html += $.t('haccp.no_haccp') + '<br /><br />';
		html += '</div>';
		//        alert('prepend xx');
		mySwiper.prependSlide(html, 'swiper-slide');
		mySwiper.swipeTo(mySwiper.activeIndex + 1, 0, false)
		check_haccp();
	}
}

function getHaccp() {
	console.log('getHaccp11');
	if (get != undefined && get.continue != undefined) {
		db.getDbInstance('haccp_items').query('sort_index', {
			'include_docs' : true,
			'skip' : get.continue,
			'limit' : 3
		}, getHaccpCall);
	} else {
		db.getDbInstance('haccp_items').query('sort_index', {
			'include_docs' : true,
			'limit' : 3
		}, getHaccpCall);
	}
}

function getHaccpWithLimit() {
	db.getDbInstance('haccp_items').query('sort_index', {
		'include_docs' : true,
		'skip' : f_i,
		'limit' : 1
	}, getHaccpCall);
}

function getHaccpWithLimitPrev() {
	db.getDbInstance('haccp_items').query('sort_index', {
		'include_docs' : true,
		'skip' : activeQuestion,
		'limit' : 1
	}, getHaccpCallPrev);
}

function haccpInit() {
	if (User.isLogged()) {
		executeSyncQuery();
		get = {};
		fq = [];
		fqi = -1;
		f_i = 2;
		candelete = false;
		universal_cango = false;
		he_have_something = false;
		_h_content = 800;
		last_id = 0;
		zh_h = parseInt($('body').height()) - 90;

		get = Page.get();
		if (get.continue) {
			last_id = get.continue;
			f_i = parseInt(get.continue) + 1;
			//            f_i = parseInt(get.continue);
		}
		//console.log('lastid = ',last_id);
		getHaccp();

		mySwiper = new Swiper('.swiper-container-haccp', {
			calculateHeight : true,
			releaseFormElements : false,
			preventLinks : false,
			simulateTouch : true,
			noSwiping : true,
			//pagination: '.pagination',
			onInit : function() {
				setSwiperMinHeight();
			},
			onSlideChangeStart : function(swiper) {
				if (parseInt(swiper.activeIndex) == parseInt(swiper.previousIndex)) {
					swiper.previousIndex--;
				}
				// Verify deviation before save
				var deviation = 0;
				var $f = $(swiper.getSlide(swiper.previousIndex));
				$f.find('input').each(function() {
					if ($(this).attr('type') == 'radio') {
						if ($(this).is(':checked')) {
							deviation += parseInt($(this).val());
						}
					}
				});
				if (deviation >= 3 && _t == 'save') {
					decisionTree(swiper);
				} else {
					//continueHaccp(swiper);
				}
				check_haccp();
			},

			onSlideNext : function(swiper) {
				_t = 'save';

			},

			onSlidePrev : function(swiper) {
				_t = 'edit';
			},

			onSlideChangeEnd : function(swiper) {
				if (parseInt(swiper.activeIndex) == parseInt(swiper.previousIndex)) {
					swiper.previousIndex--;
				}// Verify deviation before save
				var deviation = 0;
				var $f = $(swiper.getSlide(swiper.previousIndex));
				$f.find('input').each(function() {
					if ($(this).attr('type') == 'radio') {
						if ($(this).is(':checked')) {
							deviation += parseInt($(this).val());
						}
					}
				});
				if (deviation >= 3 && _t == 'save') {
					//decisionTree(swiper);
				} else {
					continueHaccp(swiper);
				}
				swiper.resizeFix();
				var $n = $(swiper.getSlide(swiper.activeIndex));

				if ($n.find('div.no_results').length > 0) {
					$('#footer').hide();
					$('.overflow-wrapper').addClass('overflow-wrapper-hide');
					return;
				} else {
					$('#footer').show();
				}
			}
		});

		mySwiper.reInit();
		mySwiper.resizeFix();

	} else {
		Page.redirect('login.html');
	}
}

function insertHaccpItem() {
	console.log('insertHaccpItem cast', castToListObject(["id", "cat", "content", "form", "response"], fq));
	db.lazyQuery('haccp_items', castToListObject(["id", "cat", "content", "form", "response"], fq), function(err, results) {
		console.log('insertHaccpItem', err, results);
		db.getDbInstance('haccp_items').query('sort_index', {
			'include_docs' : true,
			'limit' : 3
		}, getHaccpCall);
	});
}

function haccp(data) {
	console.log('haccp(data)',JSON.stringify(data));
	if (data.success) {
		if (data.haccp_category.length > 0) {
			//var c = data.haccp_category;
			var s,
			    h,
			    j,
			    catid,
			    ll;
			var response = 0;
			for (var i in data.haccp_category) {
				if ((data.haccp_category).hasOwnProperty(i)) {
					//console.log('insert into haccp-items');
					//q = 'INSERT OR REPLACE INTO "haccp_items"("id","cat","content","form","response")';
					h = false;
					ll = false;
					catid = data.haccp_category[i].id;

					for (j in data.haccp_category[i].subcategories) {
						if ((data.haccp_category[i].subcategories).hasOwnProperty(j)) {
							fq.push([j, catid, data.haccp_category[i].subcategories[j], JSON.stringify(data.haccp_subcategories_form), response]);
						}
					}
				}
			}
			insertHaccpItem();
		} else {
			//alert('no_results');
			console.log('no_results');
			$('.overflow-wrapper').addClass('overflow-wrapper-hide');
			$('#haccp_list_no_results').html($.t('error.no_haccps'));
			$('[data-role="footer"]').hide();
		}
	}
}

function getHaccpForm(label, id, cat, response) {
	if (response != 0) {
		try {
			response = JSON.parse(response);
			var response_possibility = response.possibility;
			var response_consequence = response.consequence;
		} catch(err) {
			var response_possibility = false;
			var response_consequence = false;
			response = false;
		}
	} else {
		var response_possibility = false;
		var response_consequence = false;
		response = false;
	}

	$(document).ready(function() {

		check_haccp();
	});

	var html = '<div style="padding:5px 10px;overflow:auto;height: ' + zh_h + 'px;" class="scrollTop"><form>';

	html += Form.radioListHACCP('possibility', label, [$.t("haccp.small_answer"), $.t("haccp.medium_answer"), $.t("haccp.big_answer")], id);
	html += '<div style="height:20px;"></div>';
	html += Form.radioListHACCP('consequence', $.t("haccp.consequence_question"), [$.t("haccp.small_answer_cons"), $.t("haccp.medium_answer_cons"), $.t("haccp.big_answer_cons")], id);
	html += Form.inputHidden('subcategory', id);
	html += Form.inputHidden('category', cat);

	html += '<table class="haccp_color_table table_separate" cellspacing="12">';
	html += '<tr>';
	html += '<td rowspan="4" style="border:0;width:10px;;height:auto;"><div style="-webkit-transform:rotate(270deg);width:12px;">' + $.t("haccp.possibility") + '</div></td>';
	html += '<td></td>';
	html += '<td>' + $.t("haccp.low_matrix") + '</td>';
	html += '<td style="word-wrap: break-word;">' + $.t("haccp.medium_matrix") + '</td>';
	html += '<td>' + $.t("haccp.high_matrix") + '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>' + $.t("haccp.high_matrix") + '</td>';
	html += '<td style="background:#ffa800 ;">' + showV(response, 2, 0) + '</td>';
	html += '<td style="background:#cf2a27;">' + showV(response, 2, 1) + '</td>';
	html += '<td style="background:#cf2a27;">' + showV(response, 2, 2) + '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="word-wrap: break-word;">' + $.t("haccp.medium_matrix") + '</td>';
	html += '<td style="background:#6ca604;">' + showV(response, 1, 0) + '</td>';
	html += '<td style="background:#ffa800 ;">' + showV(response, 1, 1) + '</td>';
	html += '<td style="background:#cf2a27;">' + showV(response, 1, 2) + '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>' + $.t("haccp.low_matrix") + '</td>';
	html += '<td style="background:#6ca604;">' + showV(response, 0, 0) + '</td>';
	html += '<td style="background:#6ca604;">' + showV(response, 0, 1) + '</td>';
	html += '<td style="background:#ffa800;">' + showV(response, 0, 2) + '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td colspan="5" style="border:0;width:auto;height:auto;">' + $.t("haccp.consequence") + '</td>';
	html += '</tr>';
	html += '</table>';
	html += Form.inputHidden('critical_point', '');
	html += '</form></div>';

	return html;
}

function showV(r, p, c) {
	if (r) {
		if (r.possibility == p && r.consequence == c) {
			var color = '#fff';

			if ((p == 2 && c == 0) || (p == 0 && c == 2) || (p == 1 && c == 1)) {
				color = '#000';
			}
			return '<i class="fa fa-check" style="color:' + color + ';"></i>';
		} else {
			return '';
		}
	} else {
		return '';
	}
}

function haccpComplete(data) {
	console.log('aici 1');
	$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
	//console.log(data);
	var d = db.getDbInstance();
	if (data.success) {
		if (data.haccp_response) {
			if (data.haccp_response.deviation && data.haccp_response.task_id) {

				//mySwiper.swipePrev();

				var data = {
					'client' : User.client,
					'token' : User.lastToken,
					'task_id' : data.haccp_response.task_id
				};
				console.log('aici 2');
				//console.log(data);

				Page.apiCall('deviation', data, 'get', 'haccpDeviation_s');
			} else {
				f_i = parseInt(f_i) + 1;
				getHaccpWithLimit();
				$('.overflow-wrapper').addClass('overflow-wrapper-hide');
			}
		} else {

			noInternetError($.t("error.no_internet_for_sync"));
		}
	} else {
		noInternetError($.t("error.no_internet_for_sync"));
	}
}

function showLocalDevPopup() {
	//console.log('showLocalDevPopup');
	db.getDbInstance('settings').get('deviation_form', function(err, results) {
		if (results) {
			var f = JSON.parse(results.value);
			haccpDeviation_s(f);
		} else {
			$('#alertPopup .alert-text').html($.t("error.no_internet_for_sync"));
			$('#alertPopup').on("popupafterclose", function() {
				$('#alertPopup').unbind("popupafterclose");
				window.location.href = 'index.html';
			});
			$('#alertPopup').popup("open", {
				positionTo : 'window'
			});
		}
	});
};

function haccpDeviation_s(data) {
	console.log('aici 3');
	//console.log(data);
	//get.id = data.task_id;
	if (isOffline() && data.form_deviation) {
		//            var html = '<legend>Deviation registration form</legend>';
		html = HTML.formGenerate(data.form_deviation, 'Lagre');
		//generate deviation form
		console.log('no way it gets here');
		$('#form_haccp_deviation').html(html);
		var qresults = null;
		//d.transaction(function(tx){
		//    tx.executeSql('SELECT "data","id" FROM "sync_query" WHERE "q_type"=? AND "executed"=? ORDER BY "id" DESC', ['haccp_deviation','0'], function(tx, results){
		//        if (results.rows.length > 0) {
		//            qresults = results;
		//            var haccp_id = JSON.parse(JSON.parse(results.rows.item(0).data).response).subcategory; // get haccp_data from haccp_items
		//            //console.log('haccp_id',haccp_id);
		//            tx.executeSql('SELECT "content" FROM "haccp_items" WHERE "id"=? ', [haccp_id], function (tx, results) {
		//                //console.info('here');
		//                if (results.rows.length > 0) {
		//                    //console.log(results.rows.item(0).content);
		//                    $('#form_haccp_deviation').find('textarea[name="deviation_description"]').text(results.rows.item(0).content);
		//                }
		//            });
		//
		//        }
		//
		//    });
		//});
		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		$('#signature-reset').off('click').on('click', function(e) {
			e.preventDefault();

			$('input[name="' + s + '"]').val('numele va fi aici');

			return false;
		});

		$('#form_haccp_deviation').off('submit').on('submit', function(e) {
			e.preventDefault();

			var go = HTML.validate($(this));

			if (go) {
				var form_values = HTML.getFormValues($(this).parent());

				if (qresults != null) {
					//console.log(qresults.rows.item(0).id);
					var task = qresults.rows.item(0).data;
					task = JSON.parse(task);
					var response = JSON.parse(task.response);
					response.deviation_data = form_values;
					response.deviation_data.signature = offline_signature;
					task.response = JSON.stringify(response);
					//console.log('task',task);
					var new_task = JSON.stringify(task);
					//console.log('newtask',new_task);
					db.lazyQuery('sync_query', [{
						'_id' : qresults.rows.item(0).id,
						'data' : new_task
					}]);
					$('#popupDeviation').popup('close');
				}
			}
			//console.log('f_i',f_i);
			f_i = parseInt(f_i) + 1;
			getHaccpWithLimit();
			$('.overflow-wrapper').addClass('overflow-wrapper-hide');

			return false;
		});

		$("#popupDeviation").popup("open");
		$('.ui-popup-container').css({
			'top' : 0,
			'left' : 0,
			'max-width' : '100%',
			'width' : '100%',
			'height' : parseInt($('body').height()) + 'px',
			'overflow' : 'hidden',
			'position' : 'fixed'
		});
		$('#popupDeviation').css('height', '100%');
		$("#popupDeviation").on("popupafterclose", function(event, ui) {
			$('.overflow-wrapper').addClass('overflow-wrapper-hide');
			//console.log('afterclose');
			if (signature_open == true) {
				$("#signature_pop").popup("open", {
					positionTo : 'window'
				});
				$('.ui-popup-container').css({
					'top' : 0,
					'left' : 0,
					'max-width' : '100%',
					'width' : '100%',
					'height' : parseInt($('body').height()) + 'px',
					'overflow' : 'hidden',
					'position' : 'fixed'
				});
				$('#signature_pop').css('height', '100%');
			}
		});

		$('#signature-trigger').off('click').on('click', function(e) {
			e.preventDefault();
			var sign_name = $('#sign_name').val();
			if (sign_name.replace(/\s/g, "") == "") {
				$('#sign_name').parent().parent().append('<label class="validate_error">' + $.t('error.signature_name') + '</label>');
			} else {
				$('#sign_name').parent().parent().find('.validate_error').remove();
				signature_open = true;
				$("#signature_pop").on("popupafterclose", function(event, ui) {
					//console.log('popupafterclose');
					$("#popupDeviation").popup("open");
				});
				$("#signature").html('');
				$("#popupDeviation").popup("close");
				$('.ui-popup-container').css({
					'top' : 0,
					'left' : 0,
					'max-width' : '100%',
					'width' : '100%',
					'height' : parseInt($('body').height()) + 'px',
					'overflow' : 'hidden',
					'position' : 'fixed'
				});
				$('#signature_pop').css('height', '100%');
				$sigdiv = $("#signature").jSignature();
				$sigdiv.jSignature("reset");

				$(document).off('click', '#deviation-signature-close').on('click', '#deviation-signature-close', function() {
					signature_open = false;
					//console.log('signature close');
					$('#signature_pop').popup('close');
					offline_signature = {
						"name" : $('#sign_name').val(),
						"svg" : $sigdiv.jSignature("getData", "svgbase64")[1],
						"parameter" : "task",
						"task_id" : get.id
					};

					$('#sign_name').attr('disabled', true);
					$('#signature-trigger').attr('disabled', true);

					var this_date = new Date();
					var sig_date = this_date.getFullYear() + '-' + (this_date.getMonth() + 1) + '-' + this_date.getDate() + ' ' + this_date.getHours() + ':' + this_date.getMinutes() + ':' + this_date.getSeconds();
					$('#signature-trigger').val(sig_date).button('refresh');

					$('#popupDeviation').popup('open');
				});
			}

			return false;
		});

	} else {
		Page.redirect('haccp_deviation.html?id=' + data.form_deviation.task_id.value + '&return_haccp_id=' + last_id);
	}
};

function takeHACCPPicture(id) {
	navigator.camera.getPicture(function(uri) {
		$('#' + id).css({
			'visibility' : 'visible',
			'display' : 'block'
		}).attr('src', uri);
		$('.ui-popup-container').css({
			'top' : 0,
			'left' : 0,
			'max-width' : '100%',
			'width' : '100%',
			'height' : parseInt($('body').height()) + 'px',
			'overflow' : 'hidden',
			'position' : 'fixed'
		});
		$('#popupDeviation').css('height', '100%');
	}, function(e) {
		console.log("Error getting picture: " + e);
	}, {
		quality : 50,
		destinationType : navigator.camera.DestinationType.FILE_URI
	});
};

function selectHACCPPicture(id) {
	Page.selectImage(id, function(uri) {
		$('#' + id).css({
			'visibility' : 'visible',
			'display' : 'block'
		}).attr('src', uri);
		$('.ui-popup-container').css({
			'top' : 0,
			'left' : 0,
			'max-width' : '100%',
			'width' : '100%',
			'height' : parseInt($('body').height()) + 'px',
			'overflow' : 'hidden',
			'position' : 'fixed'
		});
		$('#popupDeviation').css('height', '100%');
	});
};

function uploadHACCPPictureHaccp() {
	var $img = $('#' + haccp_image_id);
	var imageURI = $img.attr('src');
	Page.uploadImage(imageURI, function(data) {
		$img.css({
			'visibility' : 'hidden',
			'display' : 'none'
		}).attr('src', '');
	});
};

function haccpDeviationSave(data) {
	universal_cango = true;
	$("#popupDeviation").popup("close");
}

/***************************************************************************/

function check_haccp() {
	var checked = $('.haccp_color_table').find("i");
	var cons = 0;
	var poss = 0;
	cons = checked.parent().index() + 1;
	poss = checked.parent().parent().index();
	poss = 3 - poss + 2;
	/* because the possibility table is reversed */
	if (cons != 1) {
		cons = 2;
	}
	if (poss != 1) {
		poss = 4;
	}
	//        console.log('cons + poss' + cons + ' + ' +poss);
	$('input[type="radio"]').change(function() {
		if ($(this).attr("name") == 'possibility') {
			poss = $(this).parent().index() + 1;
			/* selected possibility */
			poss = 3 - poss + 2;
			/* because the possibility table is reversed */
		} else if ($(this).attr("name") == 'consequence') {
			cons = $(this).parent().index() + 2;
			/* selected consequence */
		}
		$('.swiper-slide-active .haccp_color_table').find("i").remove();
		$('.swiper-slide-active .haccp_color_table tr:nth-child(' + poss + ') td:nth-child(' + cons + ')').html('<i class="fa fa-check" style="color:#000;"></i>');
	});
}

function continueHaccp(swiper) {
	confirm_action = false;

	$('#confirmDevPopup').unbind("popupafterclose");
	//unbind popup function so it won't call twice
	$('#confirmDevPopup').unbind("popupafteropen");
	//unbind popup function so it won't call twice
	$('#confirmDevPopup').popup('close');
	if (_t == 'save' && !universal_cango) {
		$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
		var dd = {};
		//console.log('swiper.previousIndex',swiper.previousIndex);
		if (isNaN(swiper.previousIndex)) {
			var $f = $(swiper.getSlide(swiper.activeIndex));
		} else {
			var $f = $(swiper.getSlide(swiper.previousIndex));
		}
		$f.find('input').each(function() {
			if ($(this).attr('type') == 'radio') {
				if (dd[$(this).attr('name')] == undefined) {
					dd[$(this).attr('name')] = -1;
				}
				if ($(this).is(':checked')) {
					dd[$(this).attr('name')] = $(this).val();
				}
			} else {
				dd[$(this).attr('name')] = $(this).val();
			}
		});

		var cango = true;
		for (i in dd) {
			if (dd.hasOwnProperty(i)) {
				if (i != 'subcategory' && i != 'category') {
					if (dd[i] == -1) {
						cango = false;
						$f.find('input[name="' + i + '"]').first().parent().parent().parent().find('p').remove();
						$f.find('input[name="' + i + '"]').first().parent().parent().parent().append($('<p style="color:red;">' + $.t("haccp.this_is_required") + '</p>'));
					} else {
						$f.find('input[name="' + i + '"]').first().parent().parent().parent().find('p').remove();
					}
				}
				if (i == 'subcategory') {
					last_id = $f.find('input[name="' + i + '"]').val();
					//console.log('i = ',i,',k:',last_id);
					//console.log('Last id,  ..... k:'+last_id);
				}
			}
		}

		dd.critical_point = $("input[name='critical_point']").val();
		$("input[name='critical_point']").val('');
		dd.deviation = createDeviation;
		dd.deviationAnswers = deviationAnswers;
		createDeviation = false;
		//reset
		deviationAnswers = {};
		//reset
		//if (cango) {
		if (nextSlide && cango) {
			console.log('cango');
			var $n = $(swiper.getSlide(swiper.activeIndex));
			//console.log($n.find('div.no_results').length);
			if ($n.find('div.no_results').length > 0) {
				$('[data-role="footer"]').hide();
			}

			var data = {
				'client' : User.client,
				'token' : User.lastToken,
				'haccp_category' : dd.category,
				'response' : JSON.stringify(dd)
			};

			db.lazyQuery('haccp_items', [{
				'_id' : dd.subcategory,
				'response' : JSON.stringify(dd)
			}]);

			db.lazyQuery('settings', [{
				'_id' : 'haccp',
				'value' : true
			}]);

			if (!isOffline()) {
				console.log('haccp 244');
				Page.apiCall('haccp', data, 'get', 'haccpComplete');
				/*if ( mySwiper.slides.length >= 4 && mySwiper.activeIndex >= 3) { //if we have at least 5 slides
				 //Remove fist slide:
				 mySwiper.removeSlide(0);
				 //And fix position
				 // mySwiper.swipeTo( mySwiper.activeIndex - 1, 0, false );
				 mySwiper.swipePrev();
				 }*/
			} else {
				//                                alert('238 no internet');
				console.log('942 no internet');
				var sum = parseInt(dd.possibility) + parseInt(dd.consequence);
				if (sum >= 3) {
					db.lazyQuery('sync_query', [{
						'api' : 'haccp',
						'data' : JSON.stringify(data),
						'q_type' : 'haccp_deviation'
					}], 'showLocalDevPopup');

				} else {
					db.lazyQuery('sync_query', [{
						'api' : 'haccp',
						'data' : JSON.stringify(data),
						'q_type' : 'haccp_deviation'
					}]);

					f_i = parseInt(f_i) + 1;
					getHaccpWithLimit();
					$('.overflow-wrapper').addClass('overflow-wrapper-hide');
					//swiper.destroy();
				}
			}

			$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		} else {
			$('.overflow-wrapper').addClass('overflow-wrapper-hide');
			mySwiper.swipePrev();
		}
	} else {
		universal_cango = false;
		//console.info('1266'+activeQuestion);
		if (activeQuestion <= 0) {
			activeQuestion = f_i - mySwiper.slides.length;
		} else {
			activeQuestion--;
		}
		//console.info('1272 activeQuestion '+ activeQuestion );
		if (activeQuestion >= 0) {
			console.log('try to get haccp with prev');
			//d.transaction(getHaccpWithLimitPrev, db.dbErrorHandle);
		}
		//action for getting previous slide

	}
	return false;
}

var step1,
    step2,
    step3,
    step4,
    step5,
    step6,
    step7,
    step8;

step8 = {
	'message' : 'Gjennomfør etterfølgende trinn for å fjerne eller redusere faren til akseptabelt nivå.',
	'confirm' : function() {
		deviationAnswers.step8 = 1;
		goNextWithCriticalControl(mySwiper, step8.message);
	},
	'cancel' : function() {
		deviationAnswers.step8 = 0;
		goNext(mySwiper);
	}
};
step7 = {
	'message' : 'Vil etterfølgende trinn fjerne eller redusere faren til akseptabelt nivå?',
	'confirm' : function() {
		deviationAnswers.step7 = 1;
		goNext(mySwiper);
	},
	'cancel' : function() {
		deviationAnswers.step7 = 0;
		openConfirmDialog(step8.message, step8.confirm, step8.cancel, 8);
	}
};
step6 = {
	'message' : 'Kan forurensing øke til uakseptabelt nivå?',
	'confirm' : function() {
		deviationAnswers.step6 = 1;
		openConfirmDialog(step7.message, step7.confirm, step7.cancel, 7);
	},
	'cancel' : function() {
		deviationAnswers.step6 = 0;
		goNext(mySwiper);
	}
};
step5 = {
	'message' : 'Fjern eller reduser faren til et akseptabelt nivå.',
	'confirm' : function() {
		deviationAnswers.step5 = 1;
		goNextWithCriticalControl(mySwiper, step5.message);
	},
	'cancel' : function() {
		deviationAnswers.step5 = 0;
		goNext(mySwiper);
	}
};
step4 = {
	'message' : 'Er hensikten med dette trinnet å fjerne eller redusere faren til et akseptabelt nivå?',
	'confirm' : function() {
		deviationAnswers.step4 = 1;
		openConfirmDialog(step5.message, step5.confirm, step5.cancel, 5);
	},
	'cancel' : function() {
		deviationAnswers.step4 = 0;
		openConfirmDialog(step6.message, step6.confirm, step6.cancel, 6);
	}
};
step3 = {
	'message' : 'Modifiser trinn, prosess eller produkt.',
	'confirm' : function() {
		deviationAnswers.step3 = 1;
		goNextWithCriticalControl(mySwiper, step3.message);
	},
	'cancel' : function() {
		deviationAnswers.step3 = 0;
		goNext(mySwiper);
	}
};
step2 = {
	'message' : 'Er styring på dette trinnet nødvendig for sikkerheten?',
	'confirm' : function() {
		deviationAnswers.step2 = 1;
		openConfirmDialog(step3.message, step3.confirm, step3.cancel, 3);

	},
	'cancel' : function() {
		deviationAnswers.step2 = 0;
		goNext(mySwiper);
	}
};
step1 = {
	'message' : 'Finnes det forebyggende kontroll eller styringstiltak for den påviste faren?',
	'confirm' : function() {
		deviationAnswers.step1 = 1;
		openConfirmDialog(step4.message, step4.confirm, step4.cancel, 4);
	},
	'cancel' : function() {
		deviationAnswers.step1 = 0;
		openConfirmDialog(step2.message, step2.confirm, step2.cancel, 2);
	}
};

function decisionTree(swiper, step) {
	console.log('step', step);
	console.log('decisionTree');
	move_on = false;
	//reset accept variable to go to next step

	if (step === undefined) {
		step = step1;
	}

	openConfirmDialog(step.message, step.confirm, step.cancel, 1);

}

function openConfirmDialog(message, confirm, cancel, step) {
	var confirm_this;

	$("input[name='critical_point']").val('');
	$('#confirmDevPopup .ui-radio').show();
	if (step == 3 || step == 5 || step == 8) {
		$('#confirmDevPopup .ui-radio').hide();
		$('#deviation_yes').prop('checked', true);
	}

	$('#confirmDevPopup .alert-text').html(message);
	$('#confirmDevPopup').off("popupafteropen").on("popupafteropen", function(event, ui) {
		$('#confirmDevPopup-screen').remove();
		confirm_this = false;
		$('#confirmDevButton').off('click').on('click', function() {
			confirm_this = true;
			// $('#confirmDevPopup').popup("close");
		});

	});

	$('#confirmDevPopup').off("popupafterclose").on("popupafterclose", function(event, ui) {
		$('#confirmDevPopup').unbind("popupafteropen");
		$('#confirmDevButton').unbind("click");
		if (confirm_this !== undefined && !confirm_this) {
			return deviationTreeBackStep();
		} else if (confirm_this) {
			if ($('#deviation_yes').is(":checked")) {
				return confirm();
			} else {
				return cancel();
			}
		}
	});
	$('#confirmDevPopup').popup("open", {
		positionTo : 'window'
	});
	$('#confirmDevPopup').css({
		'height' : (parseInt($('body').height()) + 3 - 50) + 'px'
	});
	$('#confirmDevPopup').parent().css({
		'top' : 50,
		'left' : 0,
		'max-width' : '100%',
		'width' : '100%',
		'height' : (parseInt($('body').height()) + 3 - 50) + 'px',
		'overflow' : 'hidden',
		'position' : 'fixed'
	});
	$('.scrollTop').scrollTop(0);
	$('body').scrollTop(0);
	return true;
}

function goCreateDeviation(swiper) {
	$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
	confirm_action = true;
	createDeviation = true;
	universal_cango = false;
	nextSlide = true;
	continueHaccp(swiper);
}

function goNext(swiper) {
	universal_cango = false;
	nextSlide = true;
	createDeviation = false;
	$("input[name='critical_point']").val('');
	continueHaccp(swiper);
}

function goNextWithCriticalControl(swiper, message) {
	universal_cango = false;
	nextSlide = true;
	createDeviation = false;
	$("input[name='critical_point']").val(message);
	continueHaccp(swiper);
}

function deviationTreeBackStep() {
	console.log("deviationTreeBackStep");
	console.log(deviationAnswers);
	$("input[name='critical_point']").val('');
	if (!isEmpty(deviationAnswers)) {
		var prevStepKeys = Object.keys(deviationAnswers);
		var prevStep = prevStepKeys[prevStepKeys.length - 1];
		var prevAns = deviationAnswers[prevStep];
		console.log(prevStep, prevAns);
		var prevStepFunc = eval('{' + prevStep + '}');
		openConfirmDialog(prevStepFunc.message, prevStepFunc.confirm, prevStepFunc.cancel, 0);
		if (prevAns == 1) {
			$('#deviation_no').siblings('label').data('icon', 'radio-off').removeClass('ui-radio-on').addClass('ui-radio-off');
			$('#deviation_yes').siblings('label').data('icon', 'radio-on').removeClass('ui-radio-off').addClass('ui-radio-on');
			$('#deviation_yes').trigger('click');
		} else {
			$('#deviation_yes').siblings('label').data('icon', 'radio-off').removeClass('ui-radio-on').addClass('ui-radio-off');
			$('#deviation_no').siblings('label').data('icon', 'radio-on').removeClass('ui-radio-off').addClass('ui-radio-on');
			$('#deviation_no').trigger('click');
		}
		delete deviationAnswers[prevStep];
	} else {
		$('#deviation_no').siblings('label').data('icon', 'radio-off').removeClass('ui-radio-on').addClass('ui-radio-off');
		$('#deviation_yes').siblings('label').data('icon', 'radio-on').removeClass('ui-radio-off').addClass('ui-radio-on');
		$('#deviation_yes').trigger('click');
		mySwiper.swipePrev();
	}
}


$(window).on("orientationchange", function(event) {
	console.log('orientationchange');
	if ( typeof $sigdiv !== 'undefined') {
		$sigdiv.jSignature("reset");
	}
	$('#confirmDevPopup').parent().css({
		'top' : '0 !important',
		'left' : '0 !important',
		'max-width' : '100% !important',
		'width' : '100%  !important',
		'height' : (parseInt($('body').height()) + 3) + 'px  !important',
		'overflow' : 'hidden',
		'position' : 'fixed'
	});
	if (event.orientation == 'landscape') {
		$('#signature-status-message').hide();
		$('#confirmDevPopup .ui-content').css("margin-top", "15%");
	} else {
		$('#signature-status-message').show();
		$('#confirmDevPopup .ui-content').css("margin-top", "50%");
	}
	mySwiper.resizeFix();
	//    alert('orientation change');
});
