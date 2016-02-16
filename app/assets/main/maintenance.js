var get;
function maintenanceInit() {
	get = Page.get();

	var data = {
		'client' : User.client,
		'token' : User.lastToken
	};

	if (get.id != undefined) {
		data['task_id'] = get.id;
	}

	if (!isOffline()) {
		Page.apiCall('maintenance', data, 'get', 'maintenance');
	} else {
		db.getDbInstance('tasks').get(data['task_id'], function(error, results) {
			if (results && !results.completed) {
				var data = JSON.parse(results.taskData);
				maintenance(data);
			}
		});
	}
}

function maintenance(data) {
	if (data.form_deviation) {
		var html = HTML.formGenerate(data.form_deviation, $.t("general.save_button"));
		console.log(data);
		html += '<div data-role="popup" data-history="false" id="signature_pop" data-overlay-theme="d" data-theme="a" style="padding:20px;border: 0;" data-corners="false" data-tolerance="15,15">' + '<div id="signature-holder">' + '<div id="signature" data-role="none"></div>' + '</div>' + '<button id="deviation-signature-close">' + $.t("general.sign_button") + '</button>' + '</div>' + '</div>';
		$('#form_maintenance').html(html);
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

				Page.apiCall('maintenance', data, 'get', 'maintenanceDone');
			}

			return false;
		});
		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	}
	if (data.form_fix_deviation) {
		//console.log(data.form_fix_deviation.deviation_date.date);
		//var d = new Date(data.form_fix_deviation.deviation_date.date);
		var d = new Date(data.form_fix_deviation.deviation_date.date.replace(' ', 'T'));

		var html = '<h3>' + $.t('tasks.maintenance_fix') + '</h3>';

		if (data.form_fix_deviation.deviation_photos != undefined && (data.form_fix_deviation.deviation_photos).length > 0) {
			var p = $.parseJSON(data.form_fix_deviation.deviation_photos);
			console.log(p);
			for (var i in p) {
				if (p.hasOwnProperty(i)) {
					html += '<img width="100%" height="auto" style="margin:0 auto;" src="' + p[i] + '" />';
				}
			}
		}

		html += '<fieldset data-role="controlgroup">' + $.t("general.maintenance_need") + ' : ' + data.form_fix_deviation.deviation.replace(/\+/g, ' ') + '</div>';

		html += '<fieldset data-role="controlgroup">' + $.t("general.planned_measures") + ' : ' + data.form_fix_deviation.initial_action.replace(/\+/g, ' ') + '</div>';

		html += '<fieldset data-role="controlgroup">' + $.t("general.maintenance_date") + ' : ' + d.getDate() + '.' + (parseInt(d.getMonth()) + 1) + '.' + d.getFullYear() + '</div>';

		html += '<fieldset data-role="controlgroup">' + $.t("general.maintenance_responsible") + ' : ' + data.form_fix_deviation.form.responsible_fix_deviation.value + '</div>';

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
				console.log("submit");
				if (!isOffline()) {
					Page.apiCall('maintenance', data, 'get', 'maintenanceDone');
				} else {
					
					db.lazyQuery('sync_query', [{
						'api' : 'maintenance',
						'data' : JSON.stringify(data),
						'extra' : get.id,
						'q_type' : 'maintenanceDone'
					}], function(result) {
						if(result && result.rows.length > 0){
							var insertId = result.rows[0].id;
						}
						if ($.isNumeric(insertId)) {
							$('input[name="task_id"]').val(get.id);
						}
						maintenanceDone(get.id);
					}); 
				}
			}

			return false;
		});
		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		$('#form_back_btn i').removeClass('hided');

	}
	realignSlideHeight('max-height-task');
}


$(document).on('click', '#form_back_btn', function(e) {
	e.preventDefault();
	$("[href='tasks.html']").click();
});

function documentSignature(data) {
	$('#sign_name').attr('disabled', true);
	$('#signature-trigger').attr('disabled', true);
	$('#signature-trigger').val(data.current_time.date).button('refresh');
}

function checkTaskId(task_id, callback) {
	if (!callback) {
		return false;
	}
	db.getDbInstance('sync_query').get(task_id, function(tx, results) {
		if (results && results.executed) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

function maintenanceDone(data) {
	if ($.isNumeric(get.id)) {
		$('input[name="task_id"]').val(get.id);
	}
	// if (typeof $sigdiv != 'undefined') {
	// console.log("$sigdiv", $sigdiv);
	// var data1 = {
	// 'client' : User.client,
	// 'token' : User.lastToken,
	// 'signature' : JSON.stringify({
	// "name" : $('#sign_name').val(),
	// "svg" : $sigdiv.jSignature("getData", "svgbase64")[1],
	// "parameter" : "task",
	// "task_id" : get.id
	// })
	// };
	// if (!isOffline()) {
	// Page.apiCall('documentSignature', data1, 'get', 'documentSignature');
	// } else {
	// db.lazyQuery({
	// 'sql' : 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
	// 'data' : [['documentSignature', JSON.stringify(data1), data, 'documentSignature']]
	// }, 0);
	// }
	// }

	uploadMaintenancePicture();
	db.lazyQuery('tasks', [{
		'_id' : String(get.id),
		'completed' : true
	}], function() {
		console.log("update");
		Page.redirect('tasks.html');
	});

function uploadMaintenancePicture() {

	// Get URI of picture to upload
	var $img = $('#' + haccp_image_id);
	var imageURI = $img.attr('src');

	if (imageURI) {
		Page.uploadImage(imageURI, {
			"role" : "fixed"
		}, function(data) {
			$img.css({
				'visibility' : 'hidden',
				'display' : 'none'
			}).attr('src', '');
		});
	}
}