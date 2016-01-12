var mySwiper;
var _h_content = 0;
var _t;
var last_data_received;
var offline_signature;
var lazydatasend = [];
var canRedirectAfterPoisonParam = false;
var mapForm = {
	"cooling_food" : 9,
	"food_warm" : 10,
	"received_stock" : 11,
	"food_being_prepared" : 12,
	"fridge" : 13,
	"vegetable_fridge" : 14,
	"sushi_fridge" : 15,
	"cooler" : 16,
	"sushi_cooler" : 17,
	"dishwasher" : 18,
};

//navigator.connection.type = Connection.NONE;
var formcache = new FormCache();
function getFormsCall(tx, results) {
	console.log("getFormsCall", results);
	if (results.rows.length == 0 && isOffline()) {
		$('#no_results_forms').text($.t('forms.no_forms_connection'));
	}
	// else if (results.rows.length == 0  && navigator.connection.type != Connection.NONE) {

	else if (results.rows.length > 0 && isOffline()) {
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		var data = [];
		var label,
		    tmp,
		    link,
		    alias,
		    skip = 0;

		for (var i = 0; i < results.rows.length; i++) {
			(function(i, results) {
				var datatype = ((results.rows.item(i).type == 999) ? 'employee' : (results.rows.item(i).type == 1000 ? 'supplier' : results.rows.item(i).type));
				console.log(i, datatype);
				checkForm(datatype, function(isOn) {
					if (isOn) {
						try {
							tmp = JSON.parse(results.rows.item(i).label);
							alias = tmp.alias;
							link = '<a href="#" data-type="' + datatype + '" class="form_generator_link">' + tmp.alias + '</a>';
						} catch (err) {
							link = '<a href="#" data-type="' + datatype + '" class="form_generator_link">' + results.rows.item(i).label + '</a>';
							alias = results.rows.item(i).label;
						}
						data.push({
							'alias' : alias,
							'id' : i,
							'data' : link
						});
					} else {
						skip++;
					}
					if ((data.length + skip) == results.rows.length) {
						console.log("gen form");
						$('#forms_list').html('');
						_appendAndSortByAlias('#forms_list', data);
						bind_form_click_handler();
						bind_form2_click_handler();
					}
				});
			})(i, results);
		}
		$('#no_results_forms').hide();

	} else {
		console.log('if connection is live');
		//$('#no_results_forms').text($.t('forms.no_forms_yet'));

		var data = {
			'client' : User.client,
			'token' : User.lastToken
		};
		Page.apiCall('formDeviationStart', data, 'get', 'formDeviationStart');
	}

	mySwiper.reInit();
	mySwiper.resizeFix();
}

function getForms(tx) {
	tx.executeSql('SELECT * FROM "forms" WHERE alias<>""', [], getFormsCall);
}

function formsInit() {
	//    console.log('forms init');
	if (User.isLogged()) {
		executeSyncQuery();
		var d = db.getDbInstance();
		d.transaction(getForms, db.dbErrorHandle);
		console.log('forms.js 73 swiper init');
		mySwiper = new Swiper('.swiper-container-form', {
			calculateHeight : true,
			releaseFormElements : true,
			preventLinks : false,
			simulateTouch : false,
			noSwiping : true,
			noSwipingClass : 'ui-slider',
			//pagination: '.pagination',
			onInit : function() {
				if (mySwiper.slides.length == 1) {
					$('#footer').remove();
					$('#form_back_btn i').addClass('hided');
				}
				setSwiperMinHeight();
			},
			onSlideNext : function(swiper) {
				_t = 'next';
			},

			onSlidePrev : function(swiper) {
				_t = 'prev';
			},
			onSlideChangeStart : function(swiper) {

			},
			onSlideChangeEnd : function(swiper) {

				var poison = $(document).find('.form2_save');
				HTML.validate($('body'), 'ex');

				if (poison.length > 0) {
					if (_t == 'next') {
						$('.overflow-wrapper').removeClass('overflow-wrapper-hide');

						var go = Form.validate(swiper.getSlide(swiper.previousIndex));
						if (go) {
							var data_send = Form.getValues(swiper.getSlide(swiper.previousIndex));
							var data = {
								'client' : User.client,
								'token' : User.lastToken,
								'results' : JSON.stringify(data_send)
							};
							canRedirectAfterPoisonParam = true;
							console.log("data_send", data_send);
							if (!isOffline()) {
								Page.apiCall('foodPoison', data, 'get', 'foodPoisonDone');
							} else {
								lazydatasend.push(data_send);
								$('.overflow-wrapper').addClass('overflow-wrapper-hide');
							}
						} else {
							canRedirectAfterPoisonParam = false;
							swiper.swipePrev();
							$('.overflow-wrapper').addClass('overflow-wrapper-hide');

						}
					} else {
						if (_t == 'prev') {
							if (swiper.activeIndex == 0) {
								var swiper_slides = swiper.slides.length;
								for (var i = swiper_slides; i > 0; i--) {
									swiper.removeSlide(parseInt(i));
									//                                    alert(i);
									$("div[data-role='navbar']").remove();
								}
							}
						}
					}
				} else {
					if (_t == 'prev') {
						swiper.removeSlide(parseInt(swiper.activeIndex) + 1);
					}
				}
				if (mySwiper.slides.length == 1) {
					$('#footer').remove();
					$('#form_back_btn i').addClass('hided');
				}

				$('html, body').animate({
					scrollTop : 0
				}, 500);
				mySwiper.resizeFix();

				if (parseInt(swiper.activeIndex) == parseInt(swiper.previousIndex)) {
					swiper.previousIndex--;
				}

				var redirectAfterPoison = $('.swiper-slide-active').find('.no_results');
				if (redirectAfterPoison.length > 0 && canRedirectAfterPoisonParam) {
					canRedirectAfterPoisonParam = false;
					console.log('Is this real life?');
					if (lazydatasend != [] && isOffline()) {
						var data_send2 = Form.getValues(swiper.getSlide(swiper.previousIndex));
						lazydatasend.push(data_send2);
						var newlazy = {};
						newlazy['results'] = {};
						for ( i = 0; i < lazydatasend.length; i++) {
							for (var prop in lazydatasend[i] ) {
								// important check that this is objects own property
								// not from prototype prop inherited
								if (lazydatasend[i].hasOwnProperty(prop)) {
									if (prop == 'task_id') {
										newlazy[prop] = lazydatasend[i][prop];
										newlazy['results'][prop] = lazydatasend[i][prop];
									} else {
										newlazy['results'][prop] = lazydatasend[i][prop];
									}
								}
							}
						}
						newlazy['results'] = JSON.stringify(newlazy.results);
						console.log("newlazy", newlazy);
						db.lazyQuery({
							'sql' : 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
							'data' : [['foodPoison', JSON.stringify(newlazy), 0, 'foodPoison']]
						}, 0, function(insertId) {
							newlazy['results'] = JSON.parse(newlazy.results);
							newlazy.results.id = insertId;
							formcache.generateFoodPoisonTask('food_poision', newlazy['results'], function() {
								newlazy = {};
								Page.redirect('index.html');
							});
						});
					} else {
						setTimeout(function() {
							Page.redirect('index.html');
						}, 1000);
					}

				}
			}
		});

	} else {
		Page.redirect('login.html');
	}
}

function checkForm(type, callback) {
	if (!mapForm[type]) {
		if (callback) {
			callback(true);
		}
		return;
	}
	var d = db.getDbInstance();
	d.transaction(function(tx) {
		tx.executeSql('SELECT * FROM "sync_query" WHERE "extra"=? ORDER BY id DESC LIMIT 1', [mapForm[type]], function(tx, results) {
			// console.log("results.rows", results.rows);
			if (results.rows.length > 0) {
				var data = JSON.parse(results.rows.item(0).data);

				if (data.parameters) {
					data.parameters = JSON.parse(data.parameters);
					for (key in data.parameters) {
						if (data.parameters.hasOwnProperty(key) && data.parameters[key] == "off") {
							if (callback) {
								callback(false);
							}
							return;
						}
					}
				}
				if (callback) {
					callback(true);
				}
			} else {
				if (callback) {
					callback(true);
				}
				return;
			}
		});
	});
}

function toObject(arr) {
	var rv = {};
	for (var i = 0; i < arr.length; ++i)
		rv[arr[i][0]] = arr[i][1];
	return rv;
}

function sortObject(o) {
	var sorted = {},
	    key,
	    a = [];

	for (key in o) {
		if (o.hasOwnProperty(key)) {
			a.push(o[key]);
		}
	}

	a.sort();

	for ( key = 0; key < a.length; key++) {
		var keyName = getKeyByValue(o, a[key]);
		console.log(keyName);
		console.log(a[key]);
		sorted[keyName] = a[key];
	}
	return sorted;
}

function getKeyByValue(obj, value) {
	for (var prop in obj ) {
		if (obj.hasOwnProperty(prop)) {
			if (obj[prop] == value) {
				return prop;
			}
		}
	}
}

function formDeviationStart(data) {
	if (data.success) {
		var f = data.form_list;
		/* SORT SECTION */
		var tuples = [];
		if (localStorage.getItem('role') != 'ROLE_EMPLOYEE') {
			tuples = [[999, $.t('nav.employee')], [1000, $.t('nav.supplier')]];
		}

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
		var data = [];
		// For show
		var db_data = [];
		// For insert to local db

		for (var i = 0; i < tuples.length; i++) {
			var key = tuples[i][0];
			var value = tuples[i][1];
			if (key != 999 && key != 1000) {
				data.push({
					'alias' : value,
					'id' : 100 - i,
					'data' : '<a href="#" data-type="' + key + '" class="form_generator_link"> ' + value + '</a>'
				});
			}
			if (key == 999) {
				data.push({
					'alias' : $.t('nav.employee'),
					'id' : 999,
					'data' : '<a href="#" data-type="employee" class="form_generator_link"><i ></i> ' + $.t('nav.employee') + '</a>'
				});
			}
			if (key == 1000) {
				data.push({
					'alias' : $.t('nav.supplier'),
					'id' : 1000,
					'data' : '<a href="#" data-type="supplier" class="form_generator_link"><i ></i> ' + $.t('nav.supplier') + '</a>'
				});
			}

			if (key != 'maintenance' || key != 'food_poision' || (key != 999 && key != 1000)) {
				db_data.push([key, value, value]);
			}
		}

		/* INSERT SECTION */
		db.lazyQuery({
			'sql' : 'INSERT OR REPLACE INTO "forms" ("type","label","alias") VALUES(?,?,?)',
			'data' : db_data
		}, 0);
		/* SHOW SECTION */
		$('#forms_list').html('');
		_appendAndSortByAlias('#forms_list', data);
		bind_form_click_handler();
		$('#no_results_forms').hide();
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	}
	realignSlideHeight('max-height-form');
}

function formGeneration(type, dataBuild, callback) {
	var d = db.getDbInstance();
	d.transaction(function(tx) {
		tx.executeSql('SELECT * FROM "form_item" WHERE "type"=?', [type], function(tx, results) {
			console.log("results", results);
			//                if (results.rows.length == 0 && navigator.connection.type != Connection.NONE) {
			if (!isOffline()) {
				console.log('885 connection live');
				//                if (navigator.connection.type != Connection.NONE) {
				switch(type) {
				case 'maintenance':
					var data = {
						'client' : User.client,
						'token' : User.lastToken,
						'results' : ''
					};
					console.log('730');
					Page.apiCall('maintenance', data, 'get', 'formItemData');
					break;
				case 'food_poision':
					var data = {
						'client' : User.client,
						'token' : User.lastToken,
						'results' : ''
					};
					console.log(data);
					console.log('am trimis call aici');
					Page.apiCall('foodPoison', data, 'get', 'formItemData');
					break;
				case 'employee':
					var data = {
						'client' : User.client,
						'token' : User.lastToken
					};
					console.log('am trimis call employee aici');
					Page.apiCall('registerEmployee', data, 'get', 'registerEmployee');
					break;
				case 'supplier':
					var data = {
						'client' : User.client,
						'token' : User.lastToken
					};

					Page.apiCall('registerSupplier', data, 'get', 'registerSupplier');
					console.log('add supplier');
					break;
				case 'deviation':
					console.log('deviation 851');
					var data = {
						'client' : User.client,
						'token' : User.lastToken,
						'results' : ''
					};
					console.log('857');
					console.log(data);
					Page.apiCall('deviationForm', data, 'get', 'formItemData');
					break;
				default:
					console.log('744');
					var data = {
						'client' : User.client,
						'token' : User.lastToken,
						'category' : type
					};
					Page.apiCall('formDeviationStart', data, 'get', 'formItemData');
					break;
				}
				showCloseButton(callback);
			} else if (isOffline() && results.rows.length > 0) {
				var data;
				switch(type) {
				case "dishwasher":
				case "fridge":
				case "vegetable_fridge":
				case "cooler":
				case "sushi_fridge":
				case "sushi_cooler":
				case "cooling_food":
				case "food_warm":
				case "food_being_prepared":
				case "received_stock":
					var obj = {
						success : true,
						form_list_question : []
					};
					for (var i = 0; i < results.rows.length; i++) {
						var d = {
							form : JSON.parse(results.rows.item(i).form),
							info : {
								label : results.rows.item(i).label,
								id : results.rows.item(i).id
							}
						};
						obj.form_list_question.push(d);
					}
					data = obj;
					formItemData(data);
					break;
				case "deviation":
				case "maintenance":
					var d = {};
					$.extend(d, {
						success : true,
						form_list_question : {
							form : {
								form_deviation : JSON.parse(results.rows.item(0).form)
							},
							info : {
								label : results.rows.item(0).label,
								type : type
							}
						}

					});

					if (dataBuild) {
						$.extend(true, d, dataBuild);
						if (dataBuild.id) {
							document.task_id = dataBuild.id;
						}
					}
					data = d;
					formItemData(data);
					break;
				case 'employee':
					var d = {};
					$.extend(d, {
						success : true,
						form_register_employee : JSON.parse(results.rows.item(0).form)
					});
					registerEmployee(d);
					break;
				case 'supplier':
					var d = {};
					$.extend(d, {
						success : true,
						form_register_supplier : JSON.parse(results.rows.item(0).form)
					});
					registerSupplier(d);
					break;
				default:
					var d = {};
					$.extend(d, {
						success : true,
						form_list_question : {
							form : JSON.parse(results.rows.item(0).form),
							info : {
								label : results.rows.item(0).label,
								type : type
							}
						}

					});
					data = d;
					console.log("data", data);
					formItemData(data);
					break;
				}

				showCloseButton(callback, data);
			} else {
				noInternetError($.t("error.no_internet_for_sync"));
			}
		});
	});
}

function formItemData(data) {
	console.log('forms.js  formItemData 200');
	if (data.success) {
		var f = data.form_list_question;
		if (f.info != undefined) {
			var d = f;

			last_data_received = d.form;
			var formId = 'form2_save' + '_' + f.info.type + '_' + mySwiper.activeIndex || 0;

			var html = '<div style="padding:10px;"><form id="' + formId + '">';

			if (f.info.label != undefined) {
				html += '<legend class="legend_task">' + f.info.label + '</legend>';
			}

			console.log('216 forms.js');
			switch(f.info.type) {
			/* If maintenance, add signature form*/
			case 'maintenance':
			case 'deviation':
				html += HTML.formGenerate(last_data_received.form_deviation, $.t("general.save_button"), '+1 month');

				html += '</form>' + '<div data-role="popup" id="signature_pop"  data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">' + '<div id="signature-holder">' + '<div id="signature" data-role="none"></div>' + '</div>' + '<button id="deviation-signature-close">' + $.t("general.sign_button") + '</button>' + '</div>' + '</div>';
				$(document).on('click', '#signature-reset', function(e) {
					e.preventDefault();

					$('input[name="signature"]').val('user name');

					return false;
				});

				$(document).off('click', '#signature-trigger').on('click', '#signature-trigger', function(e) {
					e.preventDefault();
					openSignaturePopup();

					$(document).off('click', '#deviation-signature-close').on('click', '#deviation-signature-close', function() {
						$('#signature_pop').popup('close');
						/* Save maintenance for now */
						$('#sign_name').attr('disabled', true);
						$('#signature-trigger').attr('disabled', true);
						$('#signature-trigger').val('Signed').button('refresh');
					});

					return false;
				});
				break;

			case 'food_poision':
				/* Step 1*/
				html = '<div style="padding:10px;"><form class="form2_save">';
				html += '<legend class="legend_task">' + f.info.label + '</legend>';
				var step = {
					'task_id' : last_data_received.task_id,
					'guestName' : last_data_received.guestName,
					'guestAddress' : last_data_received.guestAddress,
					'guestPhone' : last_data_received.guestPhone
				};
				var form = HTML.formGenerate(step, '');
				html += form;
				html += '</form></div>';
				mySwiper.appendSlide(html, 'swiper-slide');
				//                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
				/* Step 2*/
				html = '<div style="padding:10px;"><form class="form2_save">';
				html += '<legend class="legend_task">' + f.info.label + '</legend>';
				step = {
					'task_id' : last_data_received.task_id,
					'symptoms' : last_data_received.symptoms,
					'symptomsDateTime' : last_data_received.symptomsDateTime,
					'symptom_days' : last_data_received.symptom_days,
					'symptom_hours' : last_data_received.symptom_hours
				};
				form = HTML.formGenerate(step, '');
				html += form;
				html += '</form></div>';
				mySwiper.appendSlide(html, 'swiper-slide');
				//                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
				/* Step 3*/
				html = '<div style="padding:10px;"><form class="form2_save">';
				html += '<legend class="legend_task">' + f.info.label + '</legend>';
				step = {
					'task_id' : last_data_received.task_id,
					'makingFoodDateTime' : last_data_received.makingFoodDateTime,
					'makingFoodTotalGuests' : last_data_received.makingFoodTotalGuests,
					'makingFoodSickGuests' : last_data_received.makingFoodSickGuests,
					'makingFoodWhatFood' : last_data_received.makingFoodWhatFood,
					'makingFoodEarlierEaten' : last_data_received.makingFoodEarlierEaten,
					'guestTalkedDoctor' : last_data_received.guestTalkedDoctor
				};
				form = HTML.formGenerate(step, '');
				html += form;
				html += '</form></div>';
				mySwiper.appendSlide(html, 'swiper-slide');
				//                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
				/* Step 4*/
				html = '<div style="padding:10px;"><form class="form2_save">';
				html += '<legend class="legend_task">' + f.info.label + '</legend>';
				step = {
					'task_id' : last_data_received.task_id,
					'ingredients' : last_data_received.ingredients,
					'cooledDown' : last_data_received.cooledDown,
					'reheated' : last_data_received.reheated,
					'keptWarm' : last_data_received.keptWarm,
					'restLeftAnalysis' : last_data_received.restLeftAnalysis
				};
				form = HTML.formGenerate(step, '');
				html += form;
				html += '</form></div>';
				mySwiper.appendSlide(html, 'swiper-slide');
				//                                $('#' + $.mobile.activePage.attr('id')).trigger('create');
				/* Step 5*/
				html = '<div style="padding:10px;"><form class="form2_save">';
				html += '<legend class="legend_task">' + f.info.label + '</legend>';
				step = {
					'task_id' : last_data_received.task_id,
					'immediateMeasures' : last_data_received.immediateMeasures,
					'otherComplaints' : last_data_received.otherComplaints,
					'guestCompensation' : last_data_received.guestCompensation,
					'employee_id' : last_data_received.employee_id,
					'deviation_deadline' : last_data_received.deviation_deadline,
					//                        'signature': last_data_received.signature,
					//                        'correctionalMeasures': last_data_received.correctionalMeasures
				};
				form = HTML.formGenerate(step, '');
				html += form;
				html += '</form></div>' + '<div data-role="popup" id="signature_pop"  data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">' + '<div id="signature-holder">' + '<div id="signature" data-role="none"></div>' + '</div>' + '<button id="deviation-signature-close">' + $.t("general.sign_button") + '</button>' + '</div>' + '</div>';
				var footer = '<div id="footer" data-role="footer" data-position="fixed" data-tap-toggle="false" data-theme="none" style="border:0 !important;">' + '<div data-role="navbar"><ul>' + '<li><a href="#" onclick="mySwiper.swipePrev();" data-theme="e" class="must-be-big"><i class="fa fa-angle-left fa-2x pull-left" style="color: #4c7600;"></i> Forrige</a></li>' + '<li><a href="#" onclick="mySwiper.swipeNext();" data-theme="e" class="must-be-big">Neste <i class="fa fa-angle-right fa-2x pull-right" style="color: #4c7600;"></i></a></li>' + '</ul></div></div>';
				$(footer).insertBefore('#forms #menu_panel');
				mySwiper.appendSlide(html, 'swiper-slide');
				/* Last step for redirect*/
				html = '<div class="no_results" style="color:#00cde7;font-size:34px;">' + $.t('register.food_poison_success') + '</div>';
				mySwiper.appendSlide(html, 'swiper-slide');
				$('#' + $.mobile.activePage.attr('id')).trigger('create');
				//                    fixFooterPosition();
				break;
			default:
				html += HTML.formGenerate(last_data_received, $.t("general.save_button"));
				html += '</form></div>';
				break;
			}

			if (d.type != 'food_poison') {
				mySwiper.appendSlide(html, 'swiper-slide');
				$('#' + $.mobile.activePage.attr('id')).trigger('create');
			}
			mySwiper.swipeTo(mySwiper.activeIndex + 1, 300, true);
			$('.overflow-wrapper').addClass('overflow-wrapper-hide');

			$('#' + formId).on('submit', function(e) {
				console.log('hei macarena');
				e.preventDefault();

				var dd = HTML.getFormValues($(this).parent());
				var go = HTML.validate($(this));

				if (go) {
					var deviation = false;

					var data = {
						'client' : User.client,
						'token' : User.lastToken,
						'results' : JSON.stringify(dd)
					};
					if (f.info.type == 'maintenance' || f.info.type == 'deviation') {
						var api = f.info.type;
						if (f.info.type == 'deviation') {
							api = "deviationForm";
						}
						if (!isOffline()) {
							Page.apiCall(api, data, 'get', 'maintenanceDoneForm');
						} else {
							var offline_data = {
								'client' : User.client,
								'token' : User.lastToken
							};
							if (document.task_id > 0) {
								offline_data.form = JSON.stringify(dd);
							} else {
								offline_data.results = JSON.stringify(dd);
							}
							var $img = $('#' + haccp_image_id);
							var imageURI = $img.attr('src');
							if (imageURI) {
								offline_data.imageURI = imageURI;
							}
							if (document.task_id > 0) {
								api = 'deviation';
							}
							db.lazyQuery({
								'sql' : 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
								'data' : [[api, JSON.stringify(offline_data), document.task_id, 'maintenanceDoneForm']]
							}, 0, function(insertId) {
								if (document.task_id > 0) {
									insertId = document.task_id;
								}
								if ($.isNumeric(insertId)) {
									console.log("data");
									$('input[name="task_id"]').val(insertId);
								}
								uploadHACCPPictureForms(function() {
									deviationDoneForm({
										form_fix_deviation : dd,
										id : insertId
									}, f.info.type);
								}, function() {
									deviationDoneForm({
										form_fix_deviation : dd,
										id : insertId
									}, f.info.type);
								});
							});
						}

					} else {
						for (var i in dd) {
							if (dd.hasOwnProperty(i)) {
								if (last_data_received[i].deviation != undefined) {
									switch (last_data_received[i].type) {
									case 'slider':
										if (dd[i] < last_data_received[i].deviation.min || dd[i] > last_data_received[i].deviation.max) {
											deviation = true;
										}
										break;
									case 'default':
										break;
									}
								}
							}
						}

						if (deviation) {
							//alert('deviation');
							console.log('deviation');
							//var a = confirm($.t('general.deviation_accept_message'));
							$('#confirmPopup .alert-text').html($.t('general.deviation_accept_message'));
							$('#confirmPopup').on("popupafteropen", function(event, ui) {
								$('#confirmButton').off('click').on('click', function() {
									console.log('aici avem prima chestie');
									console.log(data);
									if (!isOffline()) {
										Page.apiCall('formDeviationStart', data, 'get', 'form2_save_dev');
									} else {
										console.log('else if offline', dd);
										var offline_data = {
											'client' : User.client,
											'token' : User.lastToken,
											'results' : JSON.stringify(dd),
											'category' : d.type
										};

										console.log("offline_data", offline_data);
										db.lazyQuery({
											'sql' : 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
											'data' : [['formDeviationStart', JSON.stringify(offline_data), 0, 'formDeviationStart']]
										}, 0, function(insertId) {
											formGeneration('deviation', {
												id : insertId,
												form_list_question : {
													form : {
														form_deviation : {
															deviation_description : {
																value : dd.temperature + " grader rapportert på " + results.rows.item(0).label
															}
														}
													}
												}
											}, function(response) {
												console.log("back response", response);
												deviationDoneForm({
													form_deviation : response.form_list_question.form.form_deviation,
													id : insertId
												});
											});

										});
									}
								});
							});
							$('#confirmPopup').on("popupafterclose", function(event, ui) {
								//var a = false;
								$('#confirmButton').unbind("click");
							});
							$('#confirmPopup').popup("open", {
								positionTo : 'window'
							});
						} else {
							console.log('Form saved successfully. 1302');
							if (!isOffline()) {
								Page.apiCall('formDeviationStart', data, 'get', 'redirect_to_forms');
							} else {
								var offline_data = {
									'client' : User.client,
									'token' : User.lastToken,
									'results' : JSON.stringify(dd),
									'category' : d.type
								};
								db.lazyQuery({
									'sql' : 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
									'data' : [['formDeviationStart', JSON.stringify(offline_data), 0, 'formDeviationStart']]
								}, 0);
								redirect_to_forms();

							}

						}
					}
				}

				return false;
			});
			// mySwiper.resizeFix();
			mySwiper.swipeTo(mySwiper.activeIndex + 1, 300, true);
			console.log("mySwiper.activeIndex", mySwiper.activeIndex);
		} else {
			console.log('forms.js 482', f);
			//            alert('forms.js 482');
			var data = [];
			var db_data = [];
			var html = '<div style="padding:10px;"><ul data-role="listview" data-inset="true" data-divider-theme="b">';
			for (var i in f) {
				if (f.hasOwnProperty(i)) {
					html += '<li><a href="#" data-id="' + f[i].info.id + '" data-type="' + f[i].form.type.value + '" class="form_generator_link2"><i class="fa fa-edit"></i> ' + f[i].info.label + '</a></li>';
					db_data.push([f[i].info.id, f[i].info.label, JSON.stringify(f[i].form), document.form_cat]);
				}
			}

			html += '</ul></div>';
			//            console.log('final to insert');
			//            console.log(db_data);
			console.log('forms.js 505', db_data);
			if (!isOffline()) {
				var q = 'INSERT OR REPLACE INTO "form_item" ("id", "label", "form", "type") VALUES(?,?,?,?)';
				db.lazyQuery({
					'sql' : 'INSERT OR REPLACE INTO "form_item"("id", "label", "form", "type") VALUES(?,?,?,?)',
					'data' : db_data
				}, 0);
			}
			mySwiper.appendSlide(html, 'swiper-slide');
			bind_form2_click_handler();

			$('.overflow-wrapper').addClass('overflow-wrapper-hide');

			$('#' + $.mobile.activePage.attr('id')).trigger('create');
			mySwiper.swipeTo(mySwiper.activeIndex + 1, 300, true);
		}
	} else {
		console.log('wrooong');
	}
}

function maintenance(data) {
	console.log('maintenance');
	console.log('data');
	console.log(data);
	if (data.form_deviation) {
		var html = '<form id="form_maintenance">';
		html += HTML.formGenerate(data.form_deviation, $.t("general.save_button"));
		html += '</form>' + '<div data-role="popup" id="signature_pop"  data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">' + '<div id="signature-holder">' + '<div id="signature" data-role="none"></div>' + '</div>' + '<button id="deviation-signature-close">' + $.t("general.sign_button") + '</button>' + '</div>' + '</div>';
		mySwiper.appendSlide(html, 'swiper-slide');

		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		mySwiper.swipeTo(mySwiper.activeIndex + 1, 300, true);
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		//        $('#form_maintenance').html(html);
		$('#signature-trigger').off('click').on('click', function(e) {
			e.preventDefault();
			openSignaturePopup();

			//$('#deviation-signature-close').off('click').on('click',function(){
			$(document).off('click', '#deviation-signature-close').on('click', '#deviation-signature-close', function() {
				$('#signature_pop').popup('close');
				var data = {
					'client' : User.client,
					'token' : User.lastToken,
					'signature' : JSON.stringify({
						"name" : $('#sign_name').val(),
						"svg" : $sigdiv.jSignature("getData", "svgbase64")[1],
						"parameter" : "task",
						"task_id" : sss_temp
					})
				};
				//console.log(JSON.stringify(data));

				console.log('documentSignature forms.js 592');
				//                Page.apiCall('documentSignature', data, 'get', 'documentSignature');
				Page.apiCall('documentSignature', data, 'post', 'documentSignature');
			});

			return false;
		});

		$('#form_maintenance').on('submit', function(e) {
			e.preventDefault();

			var go = HTML.validate($(this));

			if (go) {
				$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
				var dd = HTML.getFormValues($(this).parent());

				var data = {
					'client' : User.client,
					'token' : User.lastToken,
					'results' : JSON.stringify(dd)
				};

				Page.apiCall('maintenance', data, 'get', 'maintenanceDoneForm');
			}

			return false;
		});
		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	}
	if (data.form_fix_deviation) {
		var d = new Date(data.form_fix_deviation.deviation_date.date);

		var html = '<h3>Deviation form fix</h3>';

		if (data.form_fix_deviation.deviation_photos != undefined && (data.form_fix_deviation.deviation_photos).length > 0) {
			var p = $.parseJSON(data.form_fix_deviation.deviation_photos);
			console.log(p);
			for (var i in p) {
				if (p.hasOwnProperty(i)) {
					html += '<img width="100%" height="auto" style="margin:0 auto;" src="' + p[i] + '" />';
				}
			}
		}

		html += '<fieldset data-role="controlgroup">Deviation. ' + data.form_fix_deviation.deviation.replace(/\+/g, ' ') + '</div>';

		html += '<fieldset data-role="controlgroup">Initial action. ' + data.form_fix_deviation.initial_action.replace(/\+/g, ' ') + '</div>';

		html += '<fieldset data-role="controlgroup">Deviation date (from system): ' + d.getDate() + '.' + (parseInt(d.getMonth()) + 1) + '.' + d.getFullYear() + '</div>';

		html += '<fieldset data-role="controlgroup">Responsible for fixing deviation: ' + data.form_fix_deviation.form.responsible_fix_deviation.value + '</div>';

		html += '<hr />';

		html += HTML.formGenerate(data.form_fix_deviation.form, $.t("general.save_button"));

		$('#form_maintenance').html(html).off('submit').on('submit', function(e) {
			e.preventDefault();

			var go = Form.validate($(this));

			if (go) {
				$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
				var dd = Form.getValues($(this));

				var data = {
					'client' : User.client,
					'token' : User.lastToken,
					'task_id' : get.id,
					'results' : JSON.stringify(dd)
				};

				Page.apiCall('maintenance', data, 'get', 'maintenanceDoneForm');

			}

			return false;
		});
		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	}
}

function maintenanceDoneForm(data, callback) {
	//console.info('maintenanceDone',data);
	if ($.isNumeric(data)) {
		$('input[name="task_id"]').val(data);
	}
	maintenanceSignDone(data);
	uploadHACCPPictureForms(function() {
		Page.redirect('tasks.html');
		if (callback) {
			callback();
		}
	});

}

function foodPoisonDone(data) {
	console.log('foodPoisonDone');
	$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	if ($.isNumeric(data)) {
		$('input[name="task_id"]').val(data);
	}
}

function maintenanceSignDone(data) {
	if ($.isNumeric(data)) {
		$('input[name="task_id"]').val(data);
	}
	if ( typeof $sigdiv != 'undefined') {
		var data1 = {
			'client' : User.client,
			'token' : User.lastToken,
			'signature' : JSON.stringify({
				"name" : $('#sign_name').val(),
				"svg" : $sigdiv.jSignature("getData", "svgbase64")[1],
				"parameter" : "task",
				"task_id" : data
			})
		};
		if (!isOffline()) {
			Page.apiCall('documentSignature', data1, 'get', 'documentSignature');
		} else {
			db.lazyQuery({
				'sql' : 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
				'data' : [['documentSignature', JSON.stringify(data1), data, 'documentSignature']]
			}, 0);
		}
	}
}

function showCloseButton(callback, params) {
	if ($('#form_back_btn i').hasClass('hided')) {
		$('#form_back_btn i').removeClass('hided');
	}
	$('#form_back_btn').on('click', function(e) {
		if (callback) {
			callback.apply(this, [params]);
		}
		$("[href='forms.html']").click();
	});
}

function bind_form_click_handler() {
	$('.form_generator_link').off('click').on('click', function(e) {
		$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
		document.form_cat = $(this).data('type');
		formGeneration(document.form_cat);
	});
}

function deviationDoneForm(data, type) {
	maintenanceSignDone(data.id);
	if(!type){
		type = "deviation";
	}
	console.log("deviationDoneForm", data, type);
	formcache.saveToTaskList(type, data, function() {
		console.log("saveToTaskList", data);
		$("[href='forms.html']").click();
	});
}

function bind_form2_click_handler() {
	$('.form_generator_link2').off('click').on('click', function(e) {
		$('.overflow-wrapper').removeClass('overflow-wrapper-hide');

		var id = $(this).data('id');
		var type = $(this).data('type');
		var d = db.getDbInstance();
		console.log(id);
		var formId = 'bind_form2' + '_' + type + '_' + mySwiper.activeIndex || 0;
		d.transaction(function(tx) {
			tx.executeSql('SELECT * FROM "form_item" WHERE "id"=?', [id], function(tx, results) {
				if (results.rows.length > 0) {
					//              if (results.rows.length == 0) {
					console.log('forms.js form_item rows > 0');
					var d = $.extend({}, results.rows.item(0));

					last_data_received = JSON.parse(d.form);

					var html = '<div style="padding:10px;"><form id="' + formId + '">';
					html += '<legend style="font-weight: bold;margin-bottom:20px;">' + results.rows.item(0).label + '</legend>';
					html += HTML.formGenerate(last_data_received, $.t("general.save_button"));

					html += '</form></div>';

					mySwiper.appendSlide(html, 'swiper-slide');

					$('#' + $.mobile.activePage.attr('id')).trigger('create');
					mySwiper.swipeTo(mySwiper.activeIndex + 1, 300, true);
					$('.overflow-wrapper').addClass('overflow-wrapper-hide');

					$('#' + formId).on('submit', function(e) {
						e.preventDefault();

						var dd = HTML.getFormValues($(this).parent());
						console.log("dd", dd);
						var go = HTML.validate($(this));
						if (go) {
							var deviation = false;

							var data = {
								'client' : User.client,
								'token' : User.lastToken,
								'results' : JSON.stringify(dd)
							};

							for (var i in dd) {
								if (dd.hasOwnProperty(i)) {
									if (last_data_received[i].deviation != undefined) {
										switch (last_data_received[i].type) {
										case 'slider':
											if (dd[i] < last_data_received[i].deviation.min || dd[i] > last_data_received[i].deviation.max) {
												deviation = true;
											}
											break;
										case 'default':
											//alert('deviation not defined: ' + last_data_received[i].type);
											break;
										}
									}
								}
							}

							if (deviation) {
								//alert('deviation');
								console.log('deviation');
								//var a = confirm($.t('general.deviation_accept_message'));
								$('#confirmPopup .alert-text').html($.t('general.deviation_accept_message'));
								$('#confirmPopup').on("popupafteropen", function(event, ui) {
									$('#confirmButton').off('click').on('click', function() {
										console.log('aici avem prima chestie');
										console.log(data);
										if (!isOffline()) {
											Page.apiCall('formDeviationStart', data, 'get', 'form2_save_dev');
										} else {
											console.log('else if offline', dd);
											var offline_data = {
												'client' : User.client,
												'token' : User.lastToken,
												'results' : JSON.stringify(dd),
												'category' : d.type
											};

											console.log("offline_data", offline_data);
											db.lazyQuery({
												'sql' : 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
												'data' : [['formDeviationStart', JSON.stringify(offline_data), 0, 'formDeviationStart']]
											}, 0, function(insertId) {
												formGeneration('deviation', {
													id : insertId,
													form_list_question : {
														form : {
															form_deviation : {
																deviation_description : {
																	value : dd.temperature + " grader rapportert på " + results.rows.item(0).label
																}
															}
														}
													}
												}, function(response) {
													console.log("back response", response);
													deviationDoneForm({
														form_deviation : response.form_list_question.form.form_deviation,
														id : insertId
													});
												});

											});
										}
									});
								});
								$('#confirmPopup').on("popupafterclose", function(event, ui) {
									//var a = false;
									$('#confirmButton').unbind("click");
								});
								$('#confirmPopup').popup("open", {
									positionTo : 'window'
								});
							} else {
								console.log('Form saved successfully. 1302');
								if (!isOffline()) {
									Page.apiCall('formDeviationStart', data, 'get', 'redirect_to_forms');
								} else {
									var offline_data = {
										'client' : User.client,
										'token' : User.lastToken,
										'results' : JSON.stringify(dd),
										'category' : d.type
									};
									db.lazyQuery({
										'sql' : 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
										'data' : [['formDeviationStart', JSON.stringify(offline_data), 0, 'formDeviationStart']]
									}, 0);
									redirect_to_forms();

								}

							}
						}
						console.log('forms.js 1101');
						return false;
					});
				} else {
					console.log('forms.js form_item rows == 0');
					console.log('forms.js 1105');
					console.log('heeeeey id = ', id);
					tx.executeSql('SELECT * FROM "forms" WHERE "type"=?', [type], function(tx, results) {
						if (results.rows.length > 0) {
							var data = {
								'client' : User.client,
								'token' : User.lastToken,
								'category' : results.rows.item(0).type
							};

							document.form_cat = results.rows.item(0).type;
							console.log('data:', data);
							console.log(results.rows.item(0));

							Page.apiCall('formDeviationStart', data, 'get', 'formCond3');
						} else {
							$('#alertPopup .alert-text').html('Operation unavailable');
							$('#alertPopup').on("popupafterclose", function() {
								$('#alertPopup').unbind("popupafterclose");
								$('.overflow-wrapper').addClass('overflow-wrapper-hide');
							});
							$('#alertPopup').popup("open", {
								positionTo : 'window'
							});
						}

					});
				}
			});
		});
		realignSlideHeight('max-height-form');
	});
}

function formCond3(data) {
	console.log(data);
	console.log('forms.js 1128');
	//    var q = 'INSERT OR REPLACE INTO "form_item"("id", "label", "form", "type") VALUES(?,?,?,?)';
	if (data.form_list_question instanceof Array) {
		for (var d in data.form_list_question ) {
			if (data.form_list_question.hasOwnProperty(d)) {
				console.log('d itera = ', d);
				console.log(data.form_list_question[d]);
				//                return;
				db.lazyQuery({
					'sql' : 'INSERT OR REPLACE INTO "form_item"("id", "label", "form", "type") VALUES(?,?,?,?)',
					'data' : [[data.form_list_question[d].info.id, data.form_list_question[d].info.label, JSON.stringify(data.form_list_question[d].form), document.form_cat]]
				}, 0);
			}
		}
	} else {
		db.lazyQuery({
			'sql' : 'INSERT OR REPLACE INTO "form_item"("id", "label", "form", "type") VALUES(?,?,?,?)',
			'data' : [[data.form_list_question.info.id, data.form_list_question.info.label, JSON.stringify(data.form_list_question.form), document.form_cat]]
		}, 0);
	}

}

function redirect_to_forms() {
	mySwiper.swipeTo(0, 300, true);
	mySwiper.removeSlide(1);
	mySwiper.removeSlide(1);
	mySwiper.reInit();
	mySwiper.resizeFix();
	realignSlideHeight('max-height-form');
	var d = db.getDbInstance();
	d.transaction(getForms, db.dbErrorHandle);
}

function form2_save_dev(data) {
	console.log('aici avem a treia chestia');
	console.log(data);

	$('.overflow-wrapper').removeClass('overflow-wrapper-hide');

	var data_send = {
		'client' : User.client,
		'token' : User.lastToken,
		'task_id' : data.form_deviation.last_task_inserted
	};

	console.log('aici avem a doua chestie');
	console.log(data_send);

	Page.apiCall('deviation', data_send, 'get', 'form2_save_dev_start');
}

function form2_save_dev_start(data) {

	console.log('aici avem a patra chestie');
	console.log(data);

	var html = '<div style="padding:10px;"><form id="form_deviation_save">';
	html += HTML.formGenerate(data.form_deviation, $.t("general.save_button"));
	html += '</form>' + '<div data-role="popup" id="signature_pop"   data-history="false" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">' + '<div id="signature-holder">' + '<div id="signature" data-role="none"></div>' + '</div>' + '<button id="deviation-signature-close">' + $.t("general.save_button") + '</button>' + '</div>' + '</div>';

	sss_temp = data.form_deviation.task_id.value;

	mySwiper.appendSlide(html, 'swiper-slide');
	$('#' + $.mobile.activePage.attr('id')).trigger('create');

	$('#signature-reset').on('click', function(e) {
		e.preventDefault();

		$('input[name="signature"]').val('user name');

		return false;
	});

	$('#signature-trigger').off('click').on('click', function(e) {
		e.preventDefault();
		openSignaturePopup();

		//$('#deviation-signature-close').off('click').on('click',function(){
		$(document).off('click', '#deviation-signature-close').on('click', '#deviation-signature-close', function() {
			$('#signature_pop').popup('close');
			console.log("deviation-signature-close8");
			var data = {
				'client' : User.client,
				'token' : User.lastToken,
				'signature' : JSON.stringify({
					"name" : $('#sign_name').val(),
					"svg" : $sigdiv.jSignature("getData", "svgbase64")[1],
					"parameter" : "task",
					"task_id" : sss_temp
				})
			};
			//console.log(JSON.stringify(data));
			console.log('forms.js 1256 document sign');
			Page.apiCall('documentSignature', data, 'get', 'documentSignature');
			//            Page.apiCall('documentSignature', data, 'post', 'documentSignature');
		});

		return false;
	});

	$('#form_deviation_save').on('submit', function(e) {
		e.preventDefault();
		console.log('da submit');
		var go = Form.validate($(this));

		if (go) {
			$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
			showCloseButton();

			var dd = HTML.getFormValues($(this).parent());
			var data = {
				'client' : User.client,
				'token' : User.lastToken,
				'task_id' : sss_temp,
				'form' : JSON.stringify(dd)
			};

			console.log('dev save:');
			console.log(data);

			Page.apiCall('deviation', data, 'get', 'form2_save_dev_start_save');

			uploadHACCPPictureForms();
		}

		return false;
	});
	showCloseButton();
	$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	mySwiper.swipeTo(2, 300, true);
	mySwiper.swipeTo(3, 300, true);
}

function documentSignature(data) {
	//   console.log('document signature:');
	if ($.isNumeric(data)) {
		$('input[name="task_id"]').val(data);
	}
	$('#sign_name').attr('disabled', true);
	$('#signature-trigger').attr('disabled', true);
	$('#signature-trigger').val(data.current_time.date).button('refresh');
}

//$(document).on('focus', 'input, textarea', function () {
//    $('div[data-role="footer"]').hide();
//});
//
//$(document).on('blur', 'input, textarea', function() {
//    setTimeout(function() {
//        window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
//        $('div[data-role="footer"]').show();
//    }, 10);
//});

$(window).on("orientationchange", function(event) {

	$sigdiv.jSignature("reset");
	$('.ui-popup-container').css({
		'top' : 0,
		'left' : 0,
		'max-width' : '100%',
		'width' : '100%',
		'height' : parseInt($('body').height()) + 'px',
		'overflow' : 'hidden',
		'position' : 'fixed'
	});
	setTimeout(function() {
		$('#signature_pop-popup').css({
			'top' : 0,
			'left' : 0,
			'max-width' : '100%',
			'width' : '100%',
			'height' : parseInt($('body').height()) + 'px'
		});
		console.log('asd');
	}, 500);
});

function form2_save_dev_start_save() {
	console.log('am ajuns pe save');
	var d = db.getDbInstance();
	d.transaction(getForms, db.dbErrorHandle);

	mySwiper.swipeTo(0, 300, false);
	mySwiper.removeSlide(1);
	mySwiper.removeSlide(1);
	mySwiper.removeSlide(1);
	$('.overflow-wrapper').addClass('overflow-wrapper-hide');
}

function takeHACCPPicture(id) {

	navigator.camera.getPicture(function(uri) {

		$('#' + id).css({
			'visibility' : 'visible',
			'display' : 'block'
		}).attr('src', uri);
	}, function(e) {
		console.log("Error getting picture: " + e);
	}, {
		quality : 50,
		destinationType : navigator.camera.DestinationType.FILE_URI
	});
};

/*function selectHACCPPicture(id) {
 navigator.camera.getPicture(
 function(uri) {
 if ( uri.substring(0,21) == "content://com.android") {
 photo_split = uri.split("%3A");
 uri ="content://media/external/images/media/"+photo_split[1];
 }
 $('#'+id).css({'visibility': 'visible', 'display': 'block'}).attr('src', uri);
 //            $('.ui-popup-container').css({
 //                'top': 0,
 //                'left': 0,
 //                'max-width': '100%',
 //                'width': '100%',
 //                'height': parseInt($('body').height()) + 'px',
 //                'overflow': 'hidden',
 //                'position': 'fixed'
 //            });
 //            $('#popupDeviation').css('height', '100%');
 },
 function(e) {
 console.log("Error getting picture: " + e);
 },
 { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY});
 realignSlideHeight('max-height-task');
 };*/

function selectHACCPPicture(id) {
	console.log("select picture");
	Page.selectImage(id, function(uri) {
		console.log("select uri", uri);
		$('#' + id).css({
			'visibility' : 'visible',
			'display' : 'block'
		}).attr('src', uri);
	});
};

function uploadHACCPPictureForms(success, error) {
	var $img = $('#' + haccp_image_id);
	var imageURI = $img.attr('src');
	console.log("upload image");
	Page.uploadImage(imageURI, function(data) {
		$img.css({
			'visibility' : 'hidden',
			'display' : 'none'
		}).attr('src', '');
		if (success) {
			success();
		}
	}, error);
}

/* Add employee section*/
function registerEmployee(data) {
	if (data.success) {
		var html = '';

		html = '<form id="registerEmployeeForm">';
		html += HTML.formGenerate(data.form_register_employee, $.t('nav.employee'));
		html += '<input type="hidden" name="edit" value="false">';
		html += '</form>';

		mySwiper.appendSlide(html, 'swiper-slide');
		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		mySwiper.swipeTo(mySwiper.activeIndex + 1, 300, true);

		$('.overflow-wrapper').addClass('overflow-wrapper-hide');

		$('#registerEmployeeForm').submit(function(e) {
			e.preventDefault();

			var cango = HTML.validate($(this));

			if (cango) {
				var v = HTML.getFormValues($(this).parent());

				var data = {
					'client' : User.client,
					'token' : User.lastToken,
					'data' : JSON.stringify(v)
				};

				//console.log(JSON.stringify(data));

				$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
				$('#form_back_btn i').addClass('hided');
				if (!isOffline()) {
					Page.apiCall('registerEmployee', data, 'post', 'registerEmployeeSucess');
				} else {
					db.lazyQuery({
						'sql' : 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
						'data' : [['registerEmployee', JSON.stringify(data), 0, 'registerEmployeeSucess']]
					}, 0);
				}

			}

			return false;
		});
	}
}

function registerEmployeeSucess(data) {
	//    console.log(data);
	if (data.registration_steps != undefined && data.registration_steps.error != undefined) {
		//alert($.t('error.duplicate_employee'));
		//$('.overflow-wrapper').addClass('overflow-wrapper-hide');

		$('#alertPopup .alert-text').html($.t('error.duplicate_employee'));
		$('#alertPopup').on("popupafterclose", function() {
			$('#alertPopup').unbind("popupafterclose");
			$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		});
		$('#alertPopup').popup("open", {
			positionTo : 'window'
		});
	} else {
		$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
		//        employeeInit();
		mySwiper.swipeTo(0, 300, false);
		mySwiper.removeSlide(1);
	}
	$('.overflow-wrapper').addClass('overflow-wrapper-hide');
}

/* Add supplier section */
function registerSupplier(data) {
	if (data.success) {
		var html = '';
		html = '<form id="registerSupplierForm">';
		html += HTML.formGenerate(data.form_register_supplier, $.t('nav.supplier'));
		html += '<input type="hidden" name="edit" value="false">';
		html += '</form';
		//        $('#supplier_container').html(html);
		//        $('#' + $.mobile.activePage.attr('id')).trigger('create');
		mySwiper.appendSlide(html, 'swiper-slide');
		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		mySwiper.swipeTo(mySwiper.activeIndex + 1, 300, true);

		$('.overflow-wrapper').addClass('overflow-wrapper-hide');

		$('#registerSupplierForm').submit(function(e) {
			e.preventDefault();

			var cango = HTML.validate($(this));

			if (cango) {
				var v = HTML.getFormValues($(this).parent());

				var data = {
					'client' : User.client,
					'token' : User.lastToken,
					'parameters' : JSON.stringify(v)
				};

				//console.log(JSON.stringify(data));

				$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
				if (!isOffline()) {
					Page.apiCall('registerSupplier', data, 'post', 'registerSupplierSuccess');
				} else {
					db.lazyQuery({
						'sql' : 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
						'data' : [['registerSupplier', JSON.stringify(data), 0, 'registerSupplierSuccess']]
					}, 0, function(data) {
						registerSupplierSuccess(data);
					});
				}
			}

			return false;
		});
	}
}

function registerSupplierSuccess(data) {
	if (data.registration_steps != undefined && data.registration_steps.error != undefined) {
		console.log($.t('error.duplicate_employee'));
		//        $('.overflow-wrapper').addClass('overflow-wrapper-hide');
	} else {
		console.log($.t('success.added_supplier'));
		$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
		//        supplierInit();
	}
	mySwiper.swipeTo(0, 300, false);
	mySwiper.removeSlide(1);
	$('.overflow-wrapper').addClass('overflow-wrapper-hide');
}
