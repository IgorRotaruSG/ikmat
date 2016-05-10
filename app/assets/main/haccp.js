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
var priviousSlide = false;
var createDeviation = false;
var deviationAnswers = {};
var onNextClick = false;
var haccp_total = 0;
var isStart = true;
var lazy_total = 3;
var isValid = false;
var oneClickDone;

var deletedObject = {};
var deletedObjectArray = [];
var prevAns;
var resetToDefault;

//navigator.connection.type = Connection.NONE;

function getHaccpCall(err, results) {
	if (!results || results.total_rows == 0) {
		if(!he_have_something){
			var data = {
				'client' : User.client,
				'token' : User.lastToken
			};
			console.log('112 haccp.js');
			Page.apiCall('haccp', data, 'post', 'haccp');
			return;
		}
		$('#haccp_list_no_results').text($.t('haccp.no_haccp_yet'));
		// $('.overflow-wrapper').addClass('overflow-wrapper-hide');
		$('[data-role="footer"]').hide();
		setTimeout(function() {
			Page.redirect('index.html');
		}, 3500);
	} else {
		if (mySwiper.slides.length == 1) {
			mySwiper.removeSlide(0);

			for (var index = 0; index <= results.total_rows; index++) {
				var html;
				if (index < results.total_rows) {
					html = '<div id="haccp_index_' + index + '"></div>';
					mySwiper.appendSlide(html, 'swiper-slide');
				} else {
					html = '<div id="haccp_index_' + index + '"  class="no_results" style="color:#00cde7;font-size:34px;"></div>';
					mySwiper.appendSlide(html, 'swiper-slide');
				}
			}
			mySwiper.reInit();
			mySwiper.resizeFix();
		}
		if(mySwiper.activeIndex == results.total_rows){
			console.log('test');
			$('#haccp_index_' + results.total_rows).html($.t('haccp.no_haccp') + '<br /><br />');
		}
		var response;
		var promises = [];
		for (var i = 0; i < results.rows.length; i++) {
			var index = i;
			(function(i) {
				promises[i] = new Promise(function(resolve, reject) {
					Page.apiCall('getSavedHaccp', {
						'client' : User.client,
						'token' : User.lastToken,
						'sub_id' : results.rows[i].id
					}, 'get', function(result) {
						if (result && result.success && result.data && results.rows[i].doc) {
							results.rows[i].doc.response = JSON.stringify(result.data);
						}
						resolve(true);
					});
				});
			})(index);

			Promise.all(promises).then(function(result) {
				if (result.length == results.rows.length) {
					for (var i = 0; i < results.rows.length; i++) {
						var content = getHaccpForm(results.rows[i].doc.content, results.rows[i].doc.id, results.rows[i].doc.cat, results.rows[i].doc.response);
						if (mySwiper.activeIndex <= 0) {
							$('#haccp_index_0').html(content);
						} else {
							console.log('call2 mySwiper.activeIndex', mySwiper.activeIndex);
							$('#haccp_index_' + parseInt(mySwiper.activeIndex - 1)).html('');
							$('#haccp_index_' + parseInt(mySwiper.activeIndex + 1)).html('');
							$('#haccp_index_' + parseInt(mySwiper.activeIndex)).html(content);
						}
						$(document).ready(function() {
							check_haccp();
							mySwiper.allowSwipeToNext = true;
							mySwiper.allowSwipeToPrev = true;
							$('.overflow-wrapper').addClass('overflow-wrapper-hide');
						});
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

						// $('#haccp_radio_possibility_' + results.rows[i].doc.id + '_' + response_possibility).trigger('click');
						// $('#haccp_radio_consequence_' + results.rows[i].doc.id + '_' + response_consequence).trigger('click');
					}
					$('#' + $.mobile.activePage.attr('id')).trigger('create');

				}

			});

		}

		//Replace by translated text
		var eTargets = $('*[data-id^="parameters.translate"]');
		$.each(eTargets, function (k, v){
			var tKey = $(v).attr('data-text');
			$(v).text($.t(tKey));
		});
	}

}

function getHaccpCallPrev(tx, results) {
	alert('getHaccpCallPrev');
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
		};
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
		mySwiper.swipeTo(mySwiper.activeIndex + 1, 0, false);
		check_haccp();
	}
}

function getHaccp() {
	if (get != undefined && get.continue != undefined) {
		db.getDbInstance('haccp_items').query('sort_index', {
			'include_docs' : true,
			'skip' : get.continue,
			'limit' : 1
		}, getHaccpCall);
	} else {
		db.getDbInstance('haccp_items').query('sort_index', {
			'include_docs' : true,
			'limit' : 1
		}, getHaccpCall);
	}
}

function getHaccpWithLimit() {
	db.getDbInstance('haccp_items').query('sort_index', {
		'include_docs' : true,
		'skip' : mySwiper.activeIndex,
		'limit' : 1
	}, getHaccpCall);
}

function getHaccpWithLimitPrev() {
	db.getDbInstance('haccp_items').query('sort_index', {
		'include_docs' : true,
		'skip' : mySwiper.activeIndex,
		'limit' : 1
	}, getHaccpCall);
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
		}
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
				$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
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
					// continueHaccp(swiper);
				}
				check_haccp();
			},

			onSlideNext : function(swiper) {
				swiper.allowSwipeToNext = false;
				_t = 'save';
				onNextClick = true;
				oneClickDone = false;
			},
			onSlidePrev : function(swiper) {
				_t = 'edit';
				if (onNextClick && !isValid) {
					return;
				}
				swiper.allowSwipeToPrev = false;
				getHaccpWithLimitPrev();
				onNextClick = false;
				oneClickDone = false;
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
					if (!oneClickDone) {
						oneClickDone = true;
						continueHaccp(swiper);
					}

				}
				swiper.resizeFix();
				var $n = $(swiper.getSlide(swiper.activeIndex));

				if ($n.find('div.no_results').length > 0) {
					$('#footer').hide();
				} else {
					$('#footer').show();
				}
				console.log('f_i:', f_i, '- haccp_total:', haccp_total);
				if (f_i == 0 || f_i == haccp_total || isStart) {
					setTimeout(function() {
						console.log('haccp init dismiss');
						$('.overflow-wrapper').addClass('overflow-wrapper-hide');
					}, 500);
				}
				if (onNextClick && !isValid) {
					isValid = true;
					$('.overflow-wrapper').addClass('overflow-wrapper-hide');
				}

				//Replace by translated text
				var eTargets = $('*[data-id^="parameters.translate"]');
				$.each(eTargets, function (k, v){
					var tKey = $(v).attr('data-text');
					$(v).text($.t(tKey));
				});
			}
		});

		mySwiper.reInit();
		mySwiper.resizeFix();

	} else {
		Page.redirect('login.html');
	}
}

function insertHaccpItem() {
	db.lazyQuery('haccp_items', castToListObject(["id", "cat", "content", "form", "response"], fq), function(results) {
		if (results) {
			db.getDbInstance('haccp_items').query('sort_index', {
				'include_docs' : true,
				'limit' : lazy_total
			}, getHaccpCall);
		}
	});
}

function haccp(data) {
	if (data.success) {
		he_have_something = true;
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
			$('.overflow-wrapper').addClass('overflow-wrapper-hide');
			$('.swiper-slide').css('min-height', 'inherit');
			$('#haccp_list_no_results').html($.t('error.no_haccps'));
			//-- hoadd1

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

	html += Form.radioListHACCP('possibility', label, [$.t("haccp.small_answer"), $.t("haccp.medium_answer"), $.t("haccp.big_answer")], id, response_possibility);
	html += '<div style="height:20px;"></div>';
	html += Form.radioListHACCP('consequence', $.t("haccp.consequence_question"), [$.t("haccp.small_answer_cons"), $.t("haccp.medium_answer_cons"), $.t("haccp.big_answer_cons")], id, response_consequence);
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
	if (data.success) {
		if (data.haccp_response) {
			if (data.haccp_response.deviation && data.haccp_response.task_id) {

				//mySwiper.swipePrev();

				var data = {
					'client' : User.client,
					'token' : User.lastToken,
					'task_id' : data.haccp_response.task_id
				};
				Page.apiCall('deviation', data, 'get', 'haccpDeviation_s');
			} else {
				getHaccpWithLimit();
				if (onNextClick) {

					// if (!isStart || (isStart && mySwiper.activeIndex == 2)) {
					// if (f_i == 0) {
					// f_i = parseInt(f_i) + lazy_total - 1;
					// isStart = true;
					// } else {
					// f_i = parseInt(f_i) + 1;
					// getHaccpWithLimit();
					// }
					// }
				}
			}
		} else {

			noInternetError($.t("error.no_internet_for_sync"));
		}
	} else {
		noInternetError($.t("error.no_internet_for_sync"));
	}
}

function showLocalDevPopup() {
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
	if (isOffline() && data.form_deviation) {
		//            var html = '<legend>Deviation registration form</legend>';
		html = HTML.formGenerate(data.form_deviation, 'Lagre');
		//generate deviation form
		console.log('no way it gets here');
		$('#form_haccp_deviation').html(html);
		var qresults = null;
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
					var task = qresults.rows.item(0).data;
					task = JSON.parse(task);
					var response = JSON.parse(task.response);
					response.deviation_data = form_values;
					response.deviation_data.signature = offline_signature;
					task.response = JSON.stringify(response);
					var new_task = JSON.stringify(task);
					db.lazyQuery('sync_query', [{
						'_id' : qresults.rows.item(0).id,
						'data' : new_task
					}]);
					$('#popupDeviation').popup('close');
				}
			}
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
			console.log('deviation s');
			$('.overflow-wrapper').addClass('overflow-wrapper-hide');
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
	$('input[type="radio"]').change(function() {
		if ($(this).attr("name") == 'possibility' || $(this).attr("name") == 'consequence') {
			var cons = parseInt($(mySwiper.getSlide(mySwiper.activeIndex)).find('input[name=consequence]:checked').val());
			var poss = parseInt($(mySwiper.getSlide(mySwiper.activeIndex)).find('input[name=possibility]:checked').val());
			cons = cons ? (cons + 2) : 2;
			poss = poss ? (4 - poss) : 4;
			$('.swiper-slide-active .haccp_color_table').find("i").remove();
			$('.swiper-slide-active .haccp_color_table tr:nth-child(' + poss + ') td:nth-child(' + cons + ')').html('<i class="fa fa-check" style="color:#000;"></i>');
		}
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
		var dd = {};
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
		isValid = true;
		for (i in dd) {
			if (dd.hasOwnProperty(i)) {
				if (i != 'subcategory' && i != 'category') {
					if (dd[i] == -1) {
						cango = false;
						isValid = false;
						$f.find('input[name="' + i + '"]').first().parent().parent().parent().find('p').remove();
						$f.find('input[name="' + i + '"]').first().parent().parent().parent().append($('<p style="color:red;">' + $.t("haccp.this_is_required") + '</p>'));
					} else {
						$f.find('input[name="' + i + '"]').first().parent().parent().parent().find('p').remove();
					}
				}
				if (i == 'subcategory') {
					last_id = $f.find('input[name="' + i + '"]').val();
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
			} else {
				var sum = parseInt(dd.possibility) + parseInt(dd.consequence);
				if (sum >= lazy_total) {
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
				}
			}
		} else {
			mySwiper.swipePrev();
		}
		console.log('continueHaccp line 908');
		// $('.overflow-wrapper').addClass('overflow-wrapper-hide');
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
	'message' : $.t('haccp.step8_msg'),
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
	'message' : $.t('haccp.step7_msg'),
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
	'message' : $.t('haccp.step6_msg'),
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
	'message' : $.t('haccp.step5_msg'),
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
	'message' : $.t('haccp.step4_msg'),
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
	'message' : $.t('haccp.step3_msg'),
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
	'message' : $.t('haccp.step2_msg'),
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
	'message' : $.t('haccp.step1_msg'),
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
	$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	move_on = false;
	//reset accept variable to go to next step

	if (step === undefined) {
		step = step1;
	}

	openConfirmDialog(step.message, step.confirm, step.cancel, 1);

}

function openConfirmDialog(message, confirm, cancel, step) {
	if (resetToDefault) {
		$('#deviation_yes').prop('checked', true);
		$('#deviation_no').siblings('label').data('icon', 'radio-off').removeClass('ui-radio-on').addClass('ui-radio-off');
		$('#deviation_yes').siblings('label').data('icon', 'radio-on').removeClass('ui-radio-off').addClass('ui-radio-on');
		resetToDefault = false;
	}

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
		console.log('popupafterclose');
		$('#confirmDevPopup').unbind("popupafteropen");
		$('#confirmDevButton').unbind("click");
		if (confirm_this !== undefined && !confirm_this) {
			return deviationTreeBackStep();
		} else if (confirm_this) {
			var currentCheckedRadio = $('#deviation_yes').is(":checked");

			// console.log("currentCheckedRadio xx: ", currentCheckedRadio);
			// console.log("deviationAnswers next:",deviationAnswers);
			// console.log("deletedObjectArray next:",deletedObjectArray);

			if (deletedObjectArray.length > 0) {
				var theFinalElement = deletedObjectArray[deletedObjectArray.length - 1].answer;

				// console.log("theFinalElement: ", theFinalElement);
				// console.log("currentCheckedRadio: ", currentCheckedRadio);

				if (((currentCheckedRadio) && (theFinalElement == 1)) || ((!currentCheckedRadio) && (theFinalElement == 0))) {

					if (deletedObjectArray.length > 1) {
						console.log('vienvt current step: ', step);
						return deviationTreeNextStep(step);
					}
				} else {

					deletedObjectArray = [];
					resetToDefault = true;
					//console.log('Reset deletedObjectArray')
				}
			}

			if ($('#deviation_yes').is(":checked")) {
				resetToDefault = false;
				return confirm();
			} else {
				resetToDefault = true;
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
	console.log('goCreateDeviation');
	confirm_action = true;
	createDeviation = true;
	universal_cango = false;
	nextSlide = true;
	continueHaccp(swiper);
}

function goNext(swiper) {
	console.log('goNext');
	universal_cango = false;
	nextSlide = true;
	createDeviation = false;
	$("input[name='critical_point']").val('');
	continueHaccp(swiper);
}

function goNextWithCriticalControl(swiper, message) {
	console.log('goNextWithCriticalControl');
	universal_cango = false;
	nextSlide = true;
	createDeviation = false;
	$("input[name='critical_point']").val(message);
	continueHaccp(swiper);
}

function deviationTreeBackStep() {
	console.log("deviationTreeBackStep deviationAnswers: ", deviationAnswers);
	$("input[name='critical_point']").val('');
	if (!isEmpty(deviationAnswers)) {
		var prevStepKeys = Object.keys(deviationAnswers);
		var prevStep = prevStepKeys[prevStepKeys.length - 1];
		prevAns = deviationAnswers[prevStep];
		console.log(prevStep, prevAns);

		deletedObject = {};
		deletedObject.step = prevStep;
		deletedObject.answer = prevAns;
		deletedObjectArray.push(deletedObject);

		// console.log('deviationTreeBackStep -- deletedObjectArray: ', deletedObjectArray);
		// console.log('deviationAnswers[prevStep]: ',deviationAnswers[prevStep]);

		var prevStepFunc = eval('{' + prevStep + '}');

		// console.log("vien prevStepFunc: ",prevStepFunc);
		// console.log("prevStep: ",prevStep);

		openConfirmDialog(prevStepFunc.message, prevStepFunc.confirm, prevStepFunc.cancel, prevStep);

		if (prevAns == 1) {
			$('#deviation_no').siblings('label').data('icon', 'radio-off').removeClass('ui-radio-on').addClass('ui-radio-off');
			$('#deviation_yes').siblings('label').data('icon', 'radio-on').removeClass('ui-radio-off').addClass('ui-radio-on');
			$('#deviation_yes').prop('checked', true);
		} else {
			$('#deviation_yes').siblings('label').data('icon', 'radio-off').removeClass('ui-radio-on').addClass('ui-radio-off');
			$('#deviation_no').siblings('label').data('icon', 'radio-on').removeClass('ui-radio-off').addClass('ui-radio-on');
			$('#deviation_no').prop('checked', true);
		}
		delete deviationAnswers[prevStep];
	} else {
		$('#deviation_no').siblings('label').data('icon', 'radio-off').removeClass('ui-radio-on').addClass('ui-radio-off');
		$('#deviation_yes').siblings('label').data('icon', 'radio-on').removeClass('ui-radio-off').addClass('ui-radio-on');
		$('#deviation_yes').prop('checked', true);
		mySwiper.swipePrev();
	}
}

function setDeviationAnswer(step) {
	console.log("setDeviationAnswer step: ", step);
	if (step == "step1") {
		if ($('#deviation_yes').is(":checked")) {
			//console.log("setDeviationAnswer step 2: ", step);
			deviationAnswers.step1 = 1;
		} else {
			//console.log("setDeviationAnswer step 2: ", step);
			deviationAnswers.step1 = 0;
		}
	} else if (step == "step2") {
		if ($('#deviation_yes').is(":checked")) {
			deviationAnswers.step2 = 1;
		} else {
			deviationAnswers.step2 = 0;
		}
	} else if (step == "step3") {
		if ($('#deviation_yes').is(":checked")) {
			deviationAnswers.step3 = 1;
		} else {
			deviationAnswers.step3 = 0;
		}
	} else if (step == "step4") {
		if ($('#deviation_yes').is(":checked")) {
			//console.log("setDeviationAnswer step 3: ", step);
			deviationAnswers.step4 = 1;
		} else {
			//console.log("setDeviationAnswer step 3: ", step);
			deviationAnswers.step4 = 0;
		}
	} else if (step == "step5") {
		if ($('#deviation_yes').is(":checked")) {
			deviationAnswers.step5 = 1;
		} else {
			deviationAnswers.step5 = 0;
		}
	} else if (step == "step6") {
		if ($('#deviation_yes').is(":checked")) {
			//console.log("setDeviationAnswer step 4: ", step);
			deviationAnswers.step6 = 1;
		} else {
			//console.log("setDeviationAnswer step 4: ", step);
			deviationAnswers.step6 = 0;
		}
	} else if (step == "step7") {
		if ($('#deviation_yes').is(":checked")) {
			deviationAnswers.step7 = 1;
		} else {
			deviationAnswers.step7 = 0;
		}
	} else if (step == "step8") {
		if ($('#deviation_yes').is(":checked")) {
			deviationAnswers.step8 = 1;
		} else {
			deviationAnswers.step8 = 0;
		}
	}
	;
}

function deviationTreeNextStep(step) {
	console.log("deviationTreeNextStep Array:");
	console.log(deletedObjectArray);

	$("input[name='critical_point']").val('');
	if (!isEmpty(deletedObjectArray)) {

		var nextStepObject = deletedObjectArray[deletedObjectArray.length - 1 - 1];
		if ((nextStepObject == undefined) && (deletedObjectArray.length == 1)) {
			deletedObjectArray = [];
			return;
		}
		//console.log ('nextStepObject:', nextStepObject);

		var nextStepName = nextStepObject.step;

		// console.log ('nextStepName:', nextStepName);
		// console.log ('nextStepName argument:', step);

		if (nextStepName == step) {
			console.log('== nextStepObject:', nextStepObject);
		}

		//get all key to an array keys
		var nextStepFunc = eval('{' + nextStepName + '}');
		//console.log("vienvt nextStepFunc: ", nextStepFunc);
		var nextAns = nextStepObject.answer;
		//console.log("deviationAnswers Array:", deviationAnswers);

		setDeviationAnswer(step);
		openConfirmDialog(nextStepFunc.message, nextStepFunc.confirm, nextStepFunc.cancel, nextStepName);

		if (nextAns == 1) {
			$('#deviation_no').siblings('label').data('icon', 'radio-off').removeClass('ui-radio-on').addClass('ui-radio-off');
			$('#deviation_yes').siblings('label').data('icon', 'radio-on').removeClass('ui-radio-off').addClass('ui-radio-on');
			$('#deviation_yes').prop('checked', true);
		} else {
			$('#deviation_yes').siblings('label').data('icon', 'radio-off').removeClass('ui-radio-on').addClass('ui-radio-off');
			$('#deviation_no').siblings('label').data('icon', 'radio-on').removeClass('ui-radio-off').addClass('ui-radio-on');
			$('#deviation_no').prop('checked', true);
		}
		deletedObjectArray.pop();
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
