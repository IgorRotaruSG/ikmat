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

	Page.apiCall('maintenance', data, 'get', 'maintenance');
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

				Page.apiCall('documentSignature', data, 'get', 'documentSignature');
				//                Page.apiCall('documentSignature', data, 'post', 'documentSignature');
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

				Page.apiCall('maintenance', data, 'get', 'maintenanceDone');
				uploadMaintenancePicture();

			}

			return false;
		});
		$('#' + $.mobile.activePage.attr('id')).trigger('create');
		$('.overflow-wrapper').addClass('overflow-wrapper-hide');
		$('#form_back_btn i').removeClass('hided');

	}
}


$(document).on('click', '#form_back_btn', function(e) {
	e.preventDefault();
	$("[href='tasks.html']").click();
});

function documentSignature(data) {
	console.log('signature:');
	console.log(data);
	$('#sign_name').attr('disabled', true);
	$('#signature-trigger').attr('disabled', true);
	$('#signature-trigger').val(data.current_time.date).button('refresh');
}

function maintenanceDone(data) {
	db.lazyQuery({
		'sql' : 'UPDATE "tasks" SET "completed"=? WHERE "id"=?',
		'data' : [['1', get.id]]
	}, 0);
	Page.redirect('tasks.html');
}

function uploadMaintenancePicture() {

	// Get URI of picture to upload
	var $img = $('#' + haccp_image_id);
	var imageURI = $img.attr('src');
	if (imageURI) {
		$img.css({
			'visibility' : 'hidden',
			'display' : 'none'
		}).attr('src', '');
		// Verify server has been entered
		server = Page.settings.apiDomain + Page.settings.apiUploadPath;
		if (server) {

			// Specify transfer options
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
			options.mimeType = "image/jpeg";
			options.chunkedMode = false;

			var params = {};
			params.task_id = get.id;
			params.client = User.client;
			params.token = User.lastToken;

			params.role = 'fixed';

			options.params = params;

			// Transfer picture to server
			var ft = new FileTransfer();
			ft.upload(imageURI, server, function(r) {
				console.log("Upload successful: " + r.bytesSent + " bytes uploaded.");
			}, function(error) {
				console.log("Upload failed: Code = " + error.code);
			}, options);
		}
	}
}