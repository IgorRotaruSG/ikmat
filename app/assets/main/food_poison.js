var get;
function food_poisonInit() {
	get = Page.get();
	var data = {
		'client' : User.client,
		'token' : User.lastToken
	};

	if (get.id != undefined) {
		data['task_id'] = get.id;
	}
	if (!isOffline()) {
		Page.apiCall('foodPoison', data, 'get', 'foodPoison');
	} else {
		db.getDbInstance('tasks').get(String(data['task_id']), function(err, results) {
			// console.log("results.rows", results.rows);
			if (results && !results.completed) {
				var data = JSON.parse(results.taskData);
				foodPoison(data);
			}
		});
	}

	$("#food_content").height(document.body.clientHeight - 100);
}

function foodPoison(data) {
	console.info(data);
	if (data.form_fix_deviation) {
		// var d = new Date(data.form_fix_deviation.form.deviation_date_fix.date);

		var html = '<h3>' + $.t('tasks.poison_fix') + '</h3>';

		var p = data.form_fix_deviation;
		for (var i in p) {
			if (p.hasOwnProperty(i) && i != 'form') {
				if (p[i] != null) {
					html += '<fieldset data-role="controlgroup">' + i + ': ' + p[i].replace(/\+/g, ' ') + '</fieldset>';
				}
			}
		}

		html += '<hr />';
		html += HTML.formGenerate(data.form_fix_deviation.form, $.t("general.save_button"));

		html += '<div data-role="popup" data-history="false" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">' + '<div id="signature-holder">' + '<div id="signature" data-role="none"></div>' + '</div>' + '<button id="deviation-signature-close">' + $.t("general.sign_button") + '</button>' + '</div>' + '</div>';

		$('#form_food_poison').html(html).off('submit').on('submit', function(e) {
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
				if (!isOffline()) {
					Page.apiCall('foodPoison', data, 'get', 'maintenanceDone');
				} else {
					db.lazyQuery('sync_query', [{
						'api' : 'foodPoison',
						'data' : JSON.stringify(data),
						'extra' : get.id,
						'q_type' : 'maintenanceDone'
					}], function(result) {
						if(result && result.rows[0]._id){
							var insertId = result.rows[0]._id;
							checkTaskId(get.id, function(isExist) {
								if (!isExist) {
									insertId = get.id;
								}
								if ($.isNumeric(insertId)) {
									$('input[name="task_id"]').val(insertId);
								}
								maintenanceDone(insertId);
							}); 	
						}
					});
				}
			}
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
		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		$('#form_back_btn i').removeClass('hided');
	} else {
		alert('incomplete');
	}
}

function checkTaskId(task_id, callback) {
	if (!callback) {
		return false;
	}
	d = db.getDbInstance();
	db.getDbInstance('sync_query').get(String(task_id), function(err, results) {
		// console.log("results.rows", results.rows);
		if (results && results.executed) {
			callback(true);
		}else{
			callback(false);
		}
	});
}


$(document).on('click', '#form_back_btn', function(e) {
	e.preventDefault();
	$("[href='tasks.html']").click();
});

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
	}, 500);
});

function documentSignature(data) {
	$('#sign_name').attr('disabled', true);
	$('#signature-trigger').attr('disabled', true);
	$('#signature-trigger').val(data.current_time.date).button('refresh');
}

function maintenanceDone(data) {
	if ($.isNumeric(get.id)) {
		$('input[name="task_id"]').val(get.id);
	}
	if ( typeof $sigdiv != 'undefined') {
		var data1 = {
			'client' : User.client,
			'token' : User.lastToken,
			'signature' : JSON.stringify({
				"name" : $('#sign_name').val(),
				"svg" : $sigdiv.jSignature("getData", "svgbase64")[1],
				"parameter" : "task",
				"task_id" : get.id
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
	db.lazyQuery('tasks', [{
		'_id' : String(get.id),
		'completed' : true
	}], function() {
		Page.redirect('tasks.html');
	});
}