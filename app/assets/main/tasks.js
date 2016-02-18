var getIds = [];
var currentTime = false;
var settings_type = 'uncompletedTaskUpdated';
var mySwiper;
var _h_content = 0;
var _t;
var last_data_received = false;
var offline_signature;

var emptytaskdata = [];

var last_update = new Date();

var res;
var updated = 0;
var isReload;

var confirm_action = false;

var tasks_page = 1;
//load more tasks
var per_page = 20;
//pagination limit
//navigator.connection.type = Connection.NONE;

var devId = 0;
//for deviation completed

function getTasksCall(err, results) {
	bindLoadMoreFunction();
	if (!results && isOffline()) {
		$('#alertPopup .alert-text').html($.t("error.no_internet_for_sync"));
		$('#alertPopup').popup("open", {
			positionTo : 'window'
		});

		tasks_page--;
		if (tasks_page == 0) {
			//$('#load_more_tasks').parent().hide();
			$('#load_more_tasks').parent().find('.ui-btn-text').html($.t("error.no_tasks"));
		} else {
			//$('#load_more_tasks').parent().find('.ui-btn-text').html($.t("error.no_more_tasks"));
			$('#load_more_tasks').parent().hide();
		}
	} else if (!isOffline()) {
		$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
		var data = {
			'client' : User.client,
			'token' : User.lastToken,
			'last_update' : last_update.getTime()
		};
		res = results;
		Page.apiCall('getTasksUpdated', data, 'get', 'updateTasks');

		//get formlist of user, preparing for formlist in offline mode
		Page.apiCall('getFormList', data, 'get', 'getFormsList');

		//get reportlist of user, preparing for reportlist in offline mode
		Page.apiCall('getReportList', data, 'get', 'getReportsList');
	} else if (results && results.rows.length > 0) {
		getTasksFromLocal(results);
	} else {
		$('#load_more_tasks').parent().hide();
		checkTasksList();
	}
}

function getFormsList(data) {
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
		var db_data = [];
		// For insert to local db

		for (var i = 0; i < tuples.length; i++) {
			var key = tuples[i][0];
			var value = tuples[i][1];

			if (key != 'maintenance' || key != 'food_poision' || (key != 999 && key != 1000)) {
				db_data.push([key, value, value]);
			}
		}

		/* INSERT SECTION */
		if (db_data.length > 0) {
			db.lazyQuery('forms', castToListObject(["type","label","alias"], db_data));
		}
	}
}

function getReportsList(data) {
	if (data.success) {
		var f = data.reports_list;
		var tuples = [];
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

		if (tuples.length > 0) {
			db.lazyQuery('reports', castToListObject(["id","name"], tuples));
		}
	}
}

function updateTasks(data) {
	if (data.success) {
		last_update = new Date(data.currentTime.date);
	} else if (data.error != '') {
		User.logout();
	}
	if ((data.success && data.tasks_nr > 0 ) || (data.success && updated == 0 )) {//todo not sure about that
		last_update = new Date((data.currentTime.date));
		updated = 1;
		var data = {
			'client' : User.client,
			'token' : User.lastToken
		};
		//console.log('getTasksUncompleted 69');
		Page.apiCall('getTasksUncompleted', data, 'get', 'getTasksUncompleted');

	} else {
		getTasksFromLocal(res);
	}
}

function getTasks() {
	var offset = (tasks_page - 1 ) * per_page;
	db.getDbInstance('tasks').query('tasks_uncompleted', {
		'include_docs' : true,
		'skip' : offset,
		'limit' : per_page
	}, getTasksCall);
}

function tasksInit() {
	tasks_page = 1;
	testInternetConnection();

	if (User.isLogged()) {
		db.createView('tasks', 'tasks_uncompleted', function(doc){
			if(!doc.completed){
				emit(JSON.parse(doc.dueDate).date);
			}
		});
		executeSyncQuery();
		mySwiper = new Swiper('.swiper-container-task', {
			calculateHeight : true,
			releaseFormElements : true,
			preventLinks : true,
			simulateTouch : true,
			keyboardControl : false,
			noSwiping : true,
			noSwipingClass : 'ui-slider',
			//mousewheelControl:      true,// TODO: remove mousewheel support on production
			onInit : function() {
				//setSwiperMinHeight();
			},
			onSlideNext : function(swiper) {
				_t = 'next';
			},

			onSlidePrev : function(swiper) {
				_t = 'prev';
			},

			onSlideChangeEnd : function(swiper) {
				$('html, body').animate({
					scrollTop : 0
				}, 500);
				//                mySwiper.resizeFix();
				if (parseInt(swiper.activeIndex) == parseInt(swiper.previousIndex)) {
					swiper.previousIndex--;
				}
				if (_h_content == 0) {
					_h_content = $(window).height() - $.mobile.activePage.children('[data-role="header"]').height() - 35;
				}
				realignSlideHeight('max-height-task');
				if (_t == 'prev') {
					swiper.removeSlide(parseInt(swiper.activeIndex) + 1);
				}
				setSwiperMinHeight();

				if ($.mobile.activePage.attr('id') == 'tasks') {
					if (swiper.activeIndex == 0) {
						$('h1.ui-title').html($.t('nav.tasks'));
						$('#form_back_btn i').addClass('hided');
					}
				}

			}
		});
		getTasks();
		// var d = db.getDbInstance();
		// d.transaction(getTasks, db.dbErrorHandle);
	} else {
		Page.redirect('login.html');
	}
}

function getTaskData(data) {
	if (data.success && data.form) {
		if (!isOffline()) {
			db.lazyQuery('tasks', [{
				'_id' : document.task_id,
				'taskData' : JSON.stringify(data)
			}]);
		}

		last_data_received = data.form;
		var html = '<div style="padding:10px;"><form id="form_task_save">';
		if (data.form.label != undefined && data.form.label.value != undefined) {
			html += '<legend class="legend_task">' + data.form.label.value + '</legend>';
		}
		html += HTML.formGenerate(data.form, $.t("general.save_button"));
		html += '</form></div>';

		mySwiper.appendSlide(html, 'swiper-slide');

		$('#' + $.mobile.activePage.attr('id')).trigger('create');

		$('.ui-slider-handle').on('click', function() {
			return false;
		});

		$('#form_task_save').on('submit', function(e) {
			isReload = true;
			e.preventDefault();

			var dd = HTML.getFormValues($(this).parent());
			var go = HTML.validate($(this));
			var dev_data = {};
			if (go) {
				var dev_data = {
					'client' : User.client,
					'token' : User.lastToken,
					'results' : JSON.stringify(dd)
				};

				var deviation = false;

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
					if (isOffline()) {
						$('#confirmPopup .alert-text').html($.t('general.deviation_offline_accept_message'));
					} else {
						$('#confirmPopup .alert-text').html($.t('general.deviation_accept_message'));
					}
					$('#confirmPopup').on("popupafteropen", function(event, ui) {
						$('#confirmButton').off('click').on('click', function() {
							confirm_action = true;
						});
					});
					$('#confirmPopup').off("popupafterclose").on("popupafterclose", function(event, ui) {
						//var a = false;
						$('#confirmButton').unbind("click");
						if (confirm_action) {
							confirm_action = false;
							if (!isOffline()) {
								Page.apiCall('formDeviationStart', dev_data, 'get', 'getDeviation');
								db.lazyQuery('tasks', [{
									'_id' : String(document.task_id),
									'completed' : true
								}]);
							} else {
								
								db.lazyQuery('sync_query', [{
									'api' : 'formDeviationStart',
									'data' : JSON.stringify(dev_data),
									'extra' : 0,
									'q_type' : 'formDeviationStart'
								}], function(data) {
									if (data) {
										db.lazyQuery('tasks', [{
											'_id' : String(devId),
											'completed' : true
										}], function(results) {
											if(results && results.length > 0){
												var insertId = results[0].id;
												db.lazyQuery('tasks', [{
													'_id' : String(document.task_id),
													'completed' : true
												}]);
												taskGeneration('deviation', {
													id : insertId,
													form_deviation : {
														task_id : {
															value : JSON.parse(dev_data.results).task_id
														},
														deviation_description : {
															value : dd.temperature + " grader rapportert på " + data.form.label.value
														}
													}
												}, function(response) {
													deviationDoneTask({
														form_deviation : response.form_deviation,
														id : insertId
													});
												});
											}
											

										});
									}
								}); 

							}
						}
					});
					$('#confirmPopup').popup("open", {
						positionTo : 'window'
					});

				} else {
					if (!isOffline()) {
						Page.apiCall('formDeviationStart', dev_data, 'get', 'redirectToTasks');
						db.lazyQuery('tasks', [{
							'_id' : String(document.task_id),
							'completed' : true
						}]);
					} else {
						
						db.lazyQuery('tasks', [{
							'_id' : String(document.task_id),
							'completed' : true
						}]);
						db.lazyQuery('sync_query', [{
							'api' : 'formDeviationStart',
							'data' : JSON.stringify(dev_data),
							'extra' : document.task_id,
							'q_type' : 'task_saved'
						}], 'redirectToTasks');
					}
				}
			}

			return false;
		});

		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		mySwiper.swipeTo(1, 300, true);
		mySwiper.resizeFix();
		realignSlideHeight('max-height-task');
	} else {
		console.warn('it seems that we have a problem');
	}
}

function taskGeneration(type, dataBuild, callback) {
	db.getDbInstance('form_item').get(type, function(result) {
		if (isOffline() && result && result.form) {
			var data;
			switch(type) {
			case "deviation":
			case "maintenance":
				var d = {};
				$.extend(d, {
					success : true,
					form_deviation : JSON.parse(result.form)
				});

				if (dataBuild) {
					$.extend(true, d, dataBuild);
					if (dataBuild.id) {
						document.task_id = dataBuild.id;
					}
				}
				data = d;
				getDeviationForm(data);
				break;
			}
			closeButtonDisplay(callback, data);
		} else {
			noInternetError($.t("error.no_internet_for_sync"));
		}
	});
}

function deviationDoneTask(data) {
	taskDeviationSave(data.id);
	var formcache = new FormCache();
	formcache.saveToTaskList('deviation', data, function() {
		Page.redirect('tasks.html');
		getTasks();
	});
}

function redirectToTasks() {
	tasks_page = 1;
	//reset the page counter so it starts from the begining

	mySwiper.swipeTo(0, 300, true);
	mySwiper.removeSlide(parseInt(mySwiper.activeIndex) + 1);
	mySwiper.reInit();
	realignSlideHeight('max-height-task');
	if (isReload) {
		$('#taskList').empty();
		getTasks();
	}
	isReload = false;

}

function getDeviation(data) {
	$('.overflow-wrapper').removeClass('overflow-wrapper-hide');

	var data_send = {
		'client' : User.client,
		'token' : User.lastToken,
		'task_id' : data.form_deviation.last_task_inserted
	};

	Page.apiCall('deviation', data_send, 'get', 'getDeviationForm');
}

var sss_temp = null;

function getDeviationForm(data, devStep) {
	if (devStep === undefined) {
		devStep = false;
	}
	// TODO: custom title for deviation
	var html = '<div style="padding:10px;"><form id="form_deviation_save">';
	html += HTML.formGenerate(data.form_deviation, $.t("general.save_button"), 'dev');
	//    html += '</form></div>';
	html += '</form>' + '<div data-role="popup" data-history="false" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">' + '<div id="signature-holder">' + '<div id="signature" data-role="none"></div>' + '</div>' + '<button id="deviation-signature-close">' + $.t("general.sign_button") + '</button>' + '</div>' + '</div>';

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

		$(document).off('click', '#deviation-signature-close').on('click', '#deviation-signature-close', function() {
			$('#signature_pop').popup('close');
			$('#sign_name').attr('disabled', true);
			$('#signature-trigger').attr('disabled', true);
			$('#signature-trigger').val('Signed').button('refresh');
		});

		return false;
	});

	$('#form_deviation_save').on('submit', function(e) {
		isReload = true;
		e.preventDefault();
		var go = HTML.validate($(this));
		if (go) {
			$('#form_back_btn i').addClass('hided');
			$('h1.ui-title').html($.t('nav.tasks'));
			$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
			var dd = HTML.getFormValues($(this).parent());
			if (!isOffline()) {
				var data = {
					'client' : User.client,
					'token' : User.lastToken,
					'task_id' : sss_temp,
					'form' : JSON.stringify(dd)
				};
				db.lazyQuery('tasks', [{
					'_id' : String(sss_temp),
					'completed' : true
				}]);
				Page.apiCall('deviation', data, 'get', 'taskDeviationSave');
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
				
				db.lazyQuery('sync_query', [{
					'api' : api,
					'data' : JSON.stringify(offline_data),
					'extra' : document.task_id,
					'q_type' : 'taskDeviationSave'
				}], function(results) {
					if (results && results.length > 0) {
						var insertId = results[0].id;
						if (document.task_id > 0) {
							insertId = document.task_id;
						}
						if ($.isNumeric(insertId)) {
							$('input[name="task_id"]').val(insertId);
						}
						deviationDoneTask({
							form_fix_deviation : dd,
							id : insertId
						});
					}
				}); 
			}
		}

		return false;
	});

	closeButtonDisplay();
	$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	if (devStep === false) {
		mySwiper.swipeTo(2, 300, true);
	} else {
		mySwiper.swipeTo(1, 300, true);
	}
	//mySwiper.resizeFix();
	//realignSlideHeight('max-height-task');
}

function documentSignature(data) {
	$('#sign_name').attr('disabled', true);
	$('#signature-trigger').attr('disabled', true);
	$('#signature-trigger').val(data.current_time.date).button('refresh');
}

function taskDeviationSave(data) {
	$('#taskList').empty();
	tasks_page = 1;
	// reset page
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
			
			db.lazyQuery('sync_query', [{
				'api' : 'documentSignature',
				'data' : JSON.stringify(data1),
				'extra' : data,
				'q_type' : 'documentSignature'
			}]); 
		}
	}
	uploadHACCPPicture({
		task_id : data
	});
	mySwiper.swipeTo(0, 300, false);
	mySwiper.removeSlide(1);
	mySwiper.removeSlide(1);
	mySwiper.resizeFix();
	realignSlideHeight('max-height-task');
	$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	redirectToTasks();
}

function selectHACCPPicture(id) {
	Page.selectImage(id, function(uri) {
		$('#' + id).css({
			'visibility' : 'visible',
			'display' : 'block'
		}).attr('src', uri);
	});
};

function uploadHACCPPicture(obj) {
	// Get URI of picture to upload
	var $img = $('#' + haccp_image_id);
	var imageURI = $img.attr('src');
	var params = obj || {};
	Page.uploadImage(imageURI, params, function(data) {
		$img.css({
			'visibility' : 'hidden',
			'display' : 'none'
		}).attr('src', '');
	});
}

function getTasksUncompleted(data) {
	$('#load_more_tasks').attr('disabled', 'disabled');
	$('#load_more_tasks').parent().find('.ui-btn-text').html($.t("general.loading"));
	//disable LoadMore button until tastdata gets updated
	if (data.success) {
		if (data.tasks) {
			var add = [];
			var date = new Date();

			var add_data = '';
			var db_data = [];
			var tasksNr = 0;
			for (var i in data.tasks) {
				date = new Date(i);

				var divider_exists = $('#taskList').find("li[data-id='" + i + "'][data-role='list-divider']");
				if (divider_exists.length == 0) {
					add.push({
						'id' : i,
						'data' : Page.formatTaskDate(date),
						'extra' : 'data-role="list-divider"'
					});
				}

				var arr = Object.keys(data.tasks[i]).map(function(k) {
					return data.tasks[i][k];
				});

				arr.sort(function(a, b) {
					a = a.taskName;
					b = b.taskName;
					return a < b ? -1 : (a > b ? 1 : 0);
				});

				for (var j = 0; j < arr.length; j++) {
					var isExist = $('#taskList').find("a[data-id='" + arr[j].id + "']")[0];

					if (isExist) {
						continue;
					}
					tasksNr++;
					getIds.push(arr[j].id);
					db_data.push([arr[j].id, arr[j].taskName, arr[j].type, arr[j].overdue, JSON.stringify(arr[j].dueDate), 0, md5(JSON.stringify(arr[j])), i, arr[j].taskData]);
					if (arr[j].type == 'deviation') {
						add_data = '<a href="#" data-id="' + arr[j].id + '" class="generate_deviation_fix">' + arr[j].taskName + '</a>';
					} else if (arr[j].type == 'maintenance') {
						add_data = '<a href="maintenance.html?id=' + arr[j].id + '" data-id="' + arr[j].id + '"  data-transition="slide"><i class="fa fa-key"></i> ' + arr[j].taskName + '</a>';
					} else if (arr[j].type == 'food_poision') {
						add_data = '<a href="food_poison.html?id=' + arr[j].id + '" data-id="' + arr[j].id + '" data-transition="slide"><i class="fa fa-flask"></i> ' + arr[j].taskName + '</a>';
					} else {
						add_data = '<a href="#" data-id="' + arr[j].id + '" class="generate_task_form">' + arr[j].taskName + '</a>';
					}

					if (arr[j].overdue && arr[j].type == 'deviation') {
						add.push({
							'id' : i,
							'data' : add_data,
							'extra' : 'class="li-overdue-red" data-icon="false"'
						});
					} else {
						add.push({
							'id' : i,
							'data' : add_data,
							'extra' : 'data-icon="false"'
						});
					}
				}
			}
			if (tasks_page == 1) {
				db.clearCollection('tasks');
			}
			//db.execute('DELETE FROM "tasks"');
;			db.lazyQuery('tasks', castToListObject(["id", "title", "type", "overdue", "dueDate", "completed", "check", "date_start", "taskData"], db_data));

			checkTaskData();
			//$('#taskList').html('');

			db.getDbInstance("settings").allDocs({
				keys:['register_edit', 'haccp', 'role'],
				include_docs: true
			}, function(error, results) {
				console.log('error', error, results);
				var register_edit = true,
				    haccp = true,
				    role = '';
				if (results && results.rows.length > 0) {
					for (var i = 0; i < results.rows.length; i++) {
						if (results.rows[i].key == 'register_edit' && results.rows[i].doc.value)
							register_edit = false;
						if (results.rows[i].key == 'haccp' && results.rows[i].doc.value)
							haccp = false;
						if (results.rows[i].key == 'role')
							role = results.rows[i].doc.value;
					}
				}

				if (tasks_page == 1) {
					if ((register_edit || haccp) && role != 'ROLE_EMPLOYEE') {
						add.push({
							'id' : 9999,
							'data' : $.t('tasks.registration_steps'),
							'extra' : 'data-role="list-divider"'
						});
					}

					if (register_edit && role != 'ROLE_EMPLOYEE') {
						add.push({
							'id' : 9998,
							'data' : '<a href="register_edit.html" data-transition="slide">' + $.t('tasks.complete_profile') + '</a>',
							'extra' : 'data-icon="false"'
						});
					}
					if (haccp && role != 'ROLE_EMPLOYEE') {
						add.push({
							'id' : 9997,
							'data' : '<a href="haccp.html" data-transition="slide">' + $.t('tasks.complete_haccp') + '</a>',
							'extra' : 'data-icon="false"'
						});
					}
				}
				// moved all the login here
				_append('#taskList', add);

				mySwiper.reInit();
				mySwiper.resizeFix();
				realignSlideHeight('max-height-task');
				$('.overflow-wrapper').addClass('overflow-wrapper-hide');

				bindOpenTask();

				mySwiper.reInit();
				mySwiper.resizeFix();
			});
			
			if (tasksNr < per_page) {
				$('#load_more_tasks').attr('disabled', true);
				$('#load_more_tasks').parent().hide();
			} else {
				if (data.tasks_total_nr <= per_page) {
					$('#load_more_tasks').attr('disabled', true);
					$('#load_more_tasks').parent().hide();
				} else {
					$('#load_more_tasks').removeAttr('disabled');
					$('#load_more_tasks').parent().show();
					$('#load_more_tasks').parent().find('.ui-btn-text').html($.t("general.load_more"));
				}
			}
		} else {
			var date = new Date();
			var add = [];
			db.getDbInstance("settings").allDocs({
				keys:['register_edit', 'haccp', 'role'],
				include_docs: true
			}, function(error, results) {
				var register_edit = true,
				    haccp = true,
				    role = '';
				if (results && results.rows.length > 0) {
					for (var i = 0; i < results.rows.length; i++) {
						if (results.rows[i].key == 'register_edit' && results.rows[i].doc.value)
							register_edit = false;
						if (results.rows[i].key == 'haccp' && results.rows[i].doc.value)
							haccp = false;
						if (results.rows[i].key == 'role')
							role = results.rows[i].doc.value;
					}
				}

				if (tasks_page == 1) {
					db.execute('DELETE FROM "tasks"');
					//truncate TASKS table
					if ((register_edit || haccp) && role != 'ROLE_EMPLOYEE') {
						add.push({
							'id' : 9999,
							'data' : $.t('tasks.registration_steps'),
							'extra' : 'data-role="list-divider"'
						});
					} else {
						//$('#taskList').parent().html('<div class="no_results">' + $.t('error.no_tasks') + '</div>');
						//$('.overflow-wrapper').addClass('overflow-wrapper-hide');
						$('#load_more_tasks').attr('disabled', 'disabled');
						//$('#load_more_tasks').parent().find('.ui-btn-text').html($.t("error.no_more_tasks"));
						$('#load_more_tasks').parent().hide();
					}

					if (register_edit && role != 'ROLE_EMPLOYEE') {
						add.push({
							'id' : 9998,
							'data' : '<a href="register_edit.html" data-transition="slide">' + $.t('tasks.complete_profile') + '</a>',
							'extra' : 'data-icon="false"'
						});
					}
					if (haccp && role != 'ROLE_EMPLOYEE') {
						add.push({
							'id' : 9997,
							'data' : '<a href="haccp.html" data-transition="slide">' + $.t('tasks.complete_haccp') + '</a>',
							'extra' : 'data-icon="false"'
						});
					}
				}
				_append('#taskList', add);
				mySwiper.reInit();
				mySwiper.resizeFix();
				realignSlideHeight('max-height-task');
				$('.overflow-wrapper').addClass('overflow-wrapper-hide');
			});
		}
		mySwiper.resizeFix();
		realignSlideHeight('max-height-task');
		// checkTasksList();
	}
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
	realignSlideHeight('max-height-task');
};

var emptytask = 0;
function findTaskData() {
	for (var i = 0; i < emptytaskdata.length; i++) {
		var data = {
			'client' : User.client,
			'token' : User.lastToken,
			'task_id' : emptytaskdata[i]
		};
		Page.apiCall('getTask', data, 'get', 'updateTaskData', emptytaskdata[i]);
	}
}

function updateTaskData(data, task_id) {
	delete emptytaskdata.splice(emptytaskdata.indexOf(task_id), 1);
	if (data.success) {
		if (!isOffline()) {
			db.bulkDocs('tasks', [{
				_id : data.form.task_id.value,
				taskData : JSON.stringify(data)
			}], function() {
				if (emptytaskdata.length == 0) {
					$('#load_more_tasks').removeAttr('disabled');
					$('#load_more_tasks').parent().show();
					$('#load_more_tasks').parent().find('.ui-btn-text').html($.t("general.load_more"));
				}
			});
		}
	}
}

function getTasksFromLocal(results) {
	var data = [];
	var groups = [];
	var c;
	var add_data;

	$('#load_more_tasks').removeAttr('disabled');
	$('#load_more_tasks').parent().show();
	$('#load_more_tasks').parent().find('.ui-btn-text').html($.t("general.load_more"));

	if (!results) {
		//$('#taskList').parent().html('<div class="no_results">' + $.t('error.no_tasks') + '</div>');
		//$('#load_more_tasks').removeAttr('disabled');
		//$('#load_more_tasks').parent().find('.ui-btn-text').html($.t("general.load_more"));
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		$('#load_more_tasks').parent().hide();
		checkTasksList();
		return;
	} else if (results.total_rows <= per_page && isOffline()) {
		$('#load_more_tasks').attr('disabled', true);
		//$('#load_more_tasks').parent().find('.ui-btn-text').html($.t("error.no_more_tasks"));
		$('#load_more_tasks').parent().hide();
	}

	for (var i = 0; i < results.rows.length; i++) {
		var isExist = $('#taskList').find("a[data-id='" + results.rows[i].doc.id + "']")[0];
		if (isExist) {
			continue;
		}
		if (!in_array(results.rows[i].doc.date_start, groups)) {

			var divider_exists = $('#taskList').find("li[data-id='" + results.rows[i].doc.date_start + "'][data-role='list-divider']");
			if (divider_exists.length == 0) {
				data.push({
					'id' : results.rows[i].doc.date_start,
					'data' : Page.formatTaskDate( date = new Date(results.rows[i].doc.date_start)),
					'extra' : 'data-role="list-divider"'
				});
			}

			groups.push(results.rows[i].doc.date_start);
		}

		// todo: alter this
		if (results.rows[i].doc.type == 'deviation') {
			//add_data = '<a href="haccp_deviation_fix.html?id=' + results.rows[i].doc.id + '" data-transition="slide" style="color: #ff0000;"><i class="fa fa-warning"></i> ' + results.rows[i].doc.title + '</a>';
			//add_data = '<a href="haccp_deviation_fix.html?id=' + results.rows[i].doc.id + '" data-transition="slide">' + results.rows[i].doc.title + '</a>'
			add_data = '<a href="#" data-id="' + results.rows[i].doc.id + '" class="generate_deviation_fix">' + results.rows[i].doc.title + '</a>';
		} else if (results.rows[i].doc.type == 'maintenance') {
			add_data = '<a href="maintenance.html?id=' + results.rows[i].doc.id + '" data-id="' + results.rows[i].doc.id + '" data-transition="slide"><i class="fa fa-key"></i> ' + results.rows[i].doc.title + '</a>';
		} else if (results.rows[i].doc.type == 'food_poision') {
			add_data = '<a href="food_poison.html?id=' + results.rows[i].doc.id + '" data-id="' + results.rows[i].doc.id + '"  data-transition="slide"><i class="fa fa-flask"></i>' + results.rows[i].doc.title + '</a>';
		} else {
			add_data = '<a href="#" data-id="' + results.rows[i].doc.id + '" class="generate_task_form">' + results.rows[i].doc.title + '</a>';
		}

		if (results.rows[i].doc.overdue && results.rows[i].doc.type == 'deviation') {
			data.push({
				'id' : results.rows[i].doc.date_start,
				'data' : add_data,
				'extra' : 'class="li-overdue-red"'
			});
		} else {
			data.push({
				'id' : results.rows[i].doc.date_start,
				'data' : add_data
			});
		}
	}
	_append('#taskList', data);

	mySwiper.reInit();
	mySwiper.resizeFix();
	realignSlideHeight('max-height-task');

	bindOpenTask();

	$('.overflow-wrapper').addClass('overflow-wrapper-hide');
}

function bindLoadMoreFunction() {
	$('#load_more_tasks').off("click").on("click", function() {
		if ($(this).is(':disabled') == false) {
			$(this).attr('disabled', 'disabled');
			$('#load_more_tasks').parent().find('.ui-btn-text').html($.t("general.loading"));
			tasks_page++;
			if (isOffline()) {
				getTasks();
			} else {
				var data = {
					'client' : User.client,
					'token' : User.lastToken,
					'page' : tasks_page
				};
				Page.apiCall('getTasksUncompleted', data, 'get', 'getTasksUncompleted');
			}
		}
	});
}

function checkTaskData() {
	//get task data for the taks that does not have any
	db.getDbInstance('tasks').query(function(doc, emit) {
		if (!doc.taskData || doc.taskData == '' || doc.taskData == 'undefined') {
			emit(doc);
		}
	}, function(error, results) {
		if (results && results.rows.length > 0 && !isOffline()) {
			for (var i = 0; i < results.rows.length; i++) {
				emptytaskdata.push(results.rows[i].id);
			}
			findTaskData();
		}
	});
}

function checkTasksList() {
	setTimeout(function() {
		var content = $('#taskList').html();
		if (content == "") {
			$('#taskList').parent().html('<div class="no_results" style="width: ' + ($(window).width() - 80) + 'px">' + $.t('error.no_tasks') + '</div>');
		}
	}, 2000);
	return true;
}

/********* START HACCP DEVIATION **********/

function haccpDeviationFix(data) {
	if (data.form_fix_deviation) {//FIX deviation
		var taskId = devId;
		//var d = new Date(data.form_fix_deviation.deviation_date.date);
		var d = new Date(data.form_fix_deviation.deviation_date.date.replace(' ', 'T'));

		var html = '<div style="padding:10px;">' + '<h3>' + $.t('tasks.deviation_fix') + '</h3>';
		html += '<form id="form_haccp_deviation_fix">';

		if (data.form_fix_deviation.deviation_photos !== undefined && (data.form_fix_deviation.deviation_photos).length > 0) {
			var p = [];
			if ( typeof data.form_fix_deviation.deviation_photos == 'string') {
				p = $.parseJSON(data.form_fix_deviation.deviation_photos);
			} else {
				p = data.form_fix_deviation.deviation_photos;
			}
			for (var i in p) {
				if (p.hasOwnProperty(i)) {
					html += '<img width="100%" height="auto" style="margin:0 auto;" src="' + p[i] + '" />';
				}
			}
		}

		html += '<fieldset data-role="controlgroup">' + $.t("haccp_deviation_fix.deviation") + ': ' + data.form_fix_deviation.deviation.replace(/\+/g, ' ') + '</fieldset>';

		html += '<fieldset data-role="controlgroup">' + $.t("haccp_deviation_fix.initial_action") + ': ' + data.form_fix_deviation.initial_action.replace(/\+/g, ' ') + '</fieldset>';

		html += '<fieldset data-role="controlgroup">' + $.t("haccp_deviation_fix.deviation_date") + ': ' + d.getDate() + '.' + (parseInt(d.getMonth()) + 1) + '.' + d.getFullYear() + '</fieldset>';

		html += '<fieldset data-role="controlgroup">' + $.t("haccp_deviation_fix.responsible") + ': ' + (data.form_fix_deviation.form.responsible_fix_deviation.value + '').replace(/\+/g, ' ') + '</fieldset>';

		html += '<hr />';

		data.form_fix_deviation.form['signature'] = {
			'type' : 'signature',
			'label' : 'Signature'
		};

		html += HTML.formGenerate(data.form_fix_deviation.form, $.t("general.save_button"));
		html += '<div data-role="popup" data-history="false" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">' + '<div id="signature-holder">' + '<div id="signature" data-role="none"></div>' + '</div>' + '<button id="deviation-signature-close">' + $.t("general.sign_button") + '</button>' + '</div>';
		html += '</form>' + '</div>';
		mySwiper.appendSlide(html, 'swiper-slide');
		$('#' + $.mobile.activePage.attr('id')).trigger('create');

		$('.ui-slider-handle').on('click', function() {
			return false;
		});
		mySwiper.swipeTo(1, 300, true);
		mySwiper.resizeFix();
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		realignSlideHeight('max-height-task');

		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		$('#signature-reset').on('click', function(e) {
			e.preventDefault();

			$('input[name="signature"]').val('user name');

			return false;
		});
		$('#signature-trigger').off('click').on('click', function(e) {
			e.preventDefault();

			openSignaturePopup();

			$(document).off('click', '#deviation-signature-close').on('click', '#deviation-signature-close', function() {
				$('#signature_pop').popup('close');
				$('#sign_name').attr('disabled', true);
				$('#signature-trigger').attr('disabled', true);
				$('#signature-trigger').val('Signed').button('refresh');
			});

			return false;
		});

		$('#form_haccp_deviation_fix').off('submit').on('submit', function(e) {
			isReload = true;
			e.preventDefault();

			var go = HTML.validate($(this).parent());

			if (go) {
				var dd = Form.getValues($(this));

				if (!isOffline()) {

					var data = {
						'client' : User.client,
						'token' : User.lastToken,
						'task_id' : devId,
						'form' : JSON.stringify(dd)
					};

					Page.apiCall('deviation', data, 'get', 'taskDeviationSave');

					db.lazyQuery('tasks',[{
						'_id': String(devId),
						'completed': true
					}]);
				} else {
					var data_off = {
						'client' : User.client,
						'token' : User.lastToken,
						'task_id' : document.task_id,
						'form' : JSON.stringify(dd)
					};
					db.lazyQuery('sync_query', [{
						"api": "deviation",
						"data": JSON.stringify(data_off),
						"extra": devId,
						"q_type": 'deviation_saved'
					}], function(data) {
						if (data) {
							db.lazyQuery('tasks',[{
								'_id': String(devId),
								'completed': true
							}], function() {
								taskDeviationSave(devId);
							});
						}
					});
				}

			}
			return false;
		});
	} else if (data.form_deviation) {//create deviation
		getDeviationForm(data, true);
	}
	/*{
	 console.log('deviation first form');
	 var task_id = data.form_deviation.task_id.value;
	 //console.log('task_id',devId);return;
	 Page.redirect('haccp_deviation.html?id='+task_id);
	 }*/
}

function haccpDeviationFixSave(data) {
	//Page.redirect('tasks.html');
	redirectToTasks();
}

/********* END HACCP DEVIATION **********/

function closeButtonDisplay(callback, params) {
	$('#form_back_btn i').removeClass('hided');
	$('#form_back_btn').on('click', function(e) {
		if (callback) {
			callback.apply(this, [params]);
		}
		redirectToTasks();

	});
}

function bindOpenTask() {

	$('.generate_task_form').off('click').on('click', function(e) {
		closeButtonDisplay();
		$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
		e.preventDefault();
		$('h1.ui-title').html($(this).html());
		document.task_id = $(this).data('id');

		if (!isOffline()) {
			var data = {
				'client' : User.client,
				'token' : User.lastToken,
				'task_id' : document.task_id
			};
			Page.apiCall('getTask', data, 'get', 'getTaskData');
		} else {
			db.getDbInstance('tasks').get(String(document.task_id), function(err, doc) {
				if (doc && doc.taskData) {
					getTaskData(JSON.parse(doc.taskData));
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
		}
	});

	$('.generate_deviation_fix').off('click').on('click', function(e) {
		closeButtonDisplay();
		$('.overflow-wrapper').removeClass('overflow-wrapper-hide');
		e.preventDefault();
		$('h1.ui-title').html($(this).html());
		devId = $(this).data('id');

		var data = {
			'client' : User.client,
			'token' : User.lastToken,
			'task_id' : devId
		};
		if (!isOffline()) {
			Page.apiCall('deviation', data, 'get', 'haccpDeviationFix');
		} else {
			db.getDbInstance('tasks').get(String(devId), function(err, doc) {
				if (doc && doc.taskData) {
					haccpDeviationFix(JSON.parse(doc.taskData));
				} else {
					setTimeout(function() {
						noInternetError($.t("error.no_internet_for_sync"));
					}, 1500);
					return;
				}
			});

		}

	});
}
