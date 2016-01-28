var settings = {
    //'apiDomain':        'http://haccpy11.bywmds.us/api/',
    'apiDomain':        'http://ikmatapp.no/api/',
    'apiPath':        'http://ikmatapp.no',
    // 'apiDomain':        'https://ik-mat.fsoft.com.vn/api/',
    // 'apiPath':        'https://ik-mat.fsoft.com.vn',
    'apiUploadPath':    'uploadPhotos',
	'testImage' : 'apple-touch-icon.png',
	'syncIntervals' : {// sync interval in ms (1000 ms = 1 second)
		'tasks' : 3 * 60 * 1000,
		'loadTime' : 3 * 1000, //if the image loads in more than 3 seconds...set offline
		'connectionTestInterval' : 1 * 60 * 1000,
		//'connectionTestInterval': 0.2 * 60 * 1000, //30 de secunde pt test
		'completed_tasks' : 60 * 60 * 2 * 1000
	},
	'requestTimeout' : 25000,
	'excludeOffline': ["haccp.html", "flowchart.html"],
	'version': "2.0.69",
	'rebuild': "2.0.68"
};

var performance = window.performance;
var logout_flag = false;
//if true, lazyquey stop in order to logout

var db = new db();

var from_page;
var dontDo;

var fromLandingPage = false;
var contactName = null;

jQuery.fn.indexTabForm = function() {
	var $f = $(this);
	$f.find('input').each(function() {
		$(this).on('keypress', function(e) {
			if (e.which == 13) {
				e.preventDefault();
				$f.find('input:eq(' + (parseInt($(':input').index(this)) + 1) + ')').focus().trigger('click');
				return false;
			}
		});
	});
};

realignSlideHeight = function(el) {
	if (mySwiper) {
		if (isNaN(mySwiper.activeIndex)) {
			var h = $(mySwiper.getSlide(0)).find('div:first').height();
		} else {
			if (mySwiper.activeIndex > mySwiper.slides.length) {
				var h = $(mySwiper.getSlide(0)).find('div:first').height();
			} else {
				var h = $(mySwiper.getSlide(mySwiper.activeIndex)).find('div:first').height();
			}
		}
		h = h + 100;
		$('#' + el).css('overflow-y', 'scroll');
		$('#' + el).css('overflow-x', 'hidden');
		$('#' + el).css('height', document.body.clientHeight - 80 + 'px');
		$('#' + el).css('-webkit-overflow-scrolling', 'touch');
		//$('div[data-role="page"]').css('height',document.body.clientHeight + 'px'); //asta era buna
		$('.swiper-wrapper .swiper-slide').css({
			'height' : h + 'px !important'
		});
		$('.swiper-slide').css({
			'overflow' : 'auto'
		});
		setSwiperMinHeight();
	}
};

resizePage = function(el) {
	var h = $('#' + el).find('form').height() + 200;
	$('#' + el).css('min-height', h + 'px');
};



function Page(what) {
	if (what != undefined) {
		this.currentPage = what;
		/*this.db = window.openDatabase("haccp", "1.0", "Haccp Database", 1000000);
		 this.db.transaction(populateDB, errorCB, successCB);*/
		this.settings = settings;
		this.db = false;
		this.defaultPage = 'tasks.html';
		//this.defaultPage = 'reports.html';
	}
	$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
	    var success = options.success;
	    options.success = function(data, textStatus, jqXHR) {
	        // override success handling
	        if(data && data.locked){
				lockedError($.t("error.suspended_account"));
			}else if(typeof(success) === "function") {
				return success.apply(this, [data, textStatus, jqXHR]);
			}
	    };
	    var error = options.error;
	    options.error = function(jqXHR, textStatus, errorThrown) {
	        // override error handling
	        if(typeof(error) === "function") return error.apply(this, [jqXHR, textStatus, errorThrown]);
	    };
	});
}

Page.prototype.reverseApiDate = function(date) {
	var tmp = date.split('-');
	return tmp[2] + '-' + tmp[1] + '-' + tmp[0];
};

Page.prototype.isReady = function() {
	$.i18n.init({
		lng : "en"
	});
	$(".language").i18n();

	$(document).unbind('backbutton');
	$(document).bind('backbutton', function(e) {
		if (from_page == 'index' || from_page == 'login') {
			navigator.app.exitApp();
		} else {
			// action on bind button
			//Page.redirect(from_page + '.html');
		}
	});
	var fn = window[this.currentPage + 'Init'];
	if ( typeof fn === 'function') {
		db.InitDB();
		fn();
		var afn = window[this.currentPage + 'Async'];
		if ( typeof afn === 'function') {
			afn();
		}
	} else {
		var currentPage = this.currentPage;
		var page_obj = this;
		$.getScript("assets/main/" + this.currentPage + '.js').done(function() {
			var fn = window[currentPage + 'Init'];
			if ( typeof fn === 'function') {
				db.InitDB();
				fn();
				var afn = window[currentPage + 'Async'];
				if ( typeof afn === 'function') {
					afn();
				}
			} else {
				//alert('Undefined method ' + currentPage);
				$('#alertPopup .alert-text').html('Undefined method ' + currentPage);
				$('#alertPopup').on("popupafterclose", function() {
					$('#alertPopup').unbind("popupafterclose");
				});
				$('#alertPopup').popup("open", {
					positionTo : 'window'
				});
			}
		}).fail(function() {
			//alert('Undefined method ' + currentPage);
			$('#alertPopup .alert-text').html('Undefined method ' + currentPage);
			$('#alertPopup').on("popupafterclose", function() {
				$('#alertPopup').unbind("popupafterclose");
			});
			$('#alertPopup').popup("open", {
				positionTo : 'window'
			});
		});
	}
};

Page.prototype.init = function(what) {
	if (this.currentPage != what) {
		this.currentPage = what;
		this.isReady();
	}
};

Page.prototype.redirect = function(where) {
	$.mobile.changePage(where, {
		transition : "slide"
	});
};

Page.prototype.get = function() {
	var hash,
	    t,
	    i,
	    k;
	hash = window.location.href;
	hash = hash.split('?');
	if (hash[1] != undefined) {
		t = (hash[1]).split('&');
		var o = [];
		for (i in t) {
			if ( typeof t[i] == 'string') {
				k = t[i].split('=');
				o[k[0]] = k[1];
			}
		}
		return o;
	}
	return {};
};


Page.prototype.apiCall = function(api_method, data, method, callback, parameters) {
	var cacheData = null;
	if (data.hasOwnProperty("token") && data.hasOwnProperty("report_number")) {
		cacheData = JSON.parse(localStorage.getItem(encodeURIComponent(data["token"] + data["report_number"])));
	}
	if ((api_method == 'reportTables' || (api_method === 'reports' && callback == 'documentsCall')) && isOffline()) {
		var fn = window[callback];
		if ( typeof fn === "function")
			fn.apply(window, [cacheData]);

	} else {
		if (isOffline()) {
			noInternetError($.t("error.no_internet_for_sync"));
		} else {
			var req = $.ajax({
				'type' : method.toUpperCase(),
				'url' : this.settings.apiDomain + api_method,
				'dataType' : 'jsonp',
				'success' : function(data) {
					var fn = window[callback];
					if ( typeof fn === "function") {
						if (parameters) {
							fn.apply(this, [data, parameters]);
						} else {
							fn.apply(this, [data]);
						}

					}
					if (api_method === 'reportTables' || (api_method === 'reports' && callback == 'documentsCall')) {
						var requestData = parseQuery(this.url);
						if (requestData.hasOwnProperty("token") && requestData.hasOwnProperty("report_number")) {
							localStorage.setItem(encodeURIComponent(requestData["token"] + requestData["report_number"]), JSON.stringify(data));
						}
					}
				},
				'data' : data,
				'timeout' : this.settings.requestTimeout
			});
			req.error(function(jqXHR, textStatus, errorThrown) {
				$('#alertPopup .alert-text').html($.t("error.unexpected"));

				$('#alertPopup').off("popupafterclose").on("popupafterclose", function() {
					$('.overflow-wrapper').addClass('overflow-wrapper-hide');
					location.reload();
					//todo uncomment that
				});
				$('#alertPopup').popup("open", {
					positionTo : 'window'
				});
			});
		}
	}
}; 

Page.prototype.selectImage = function (id, callbackFunction) {
	if (isNative()) {
		navigator.camera.getPicture(function(uri) {
			if (uri.substring(0, 21) == "content://com.android") {
				photo_split = uri.split("%3A");
				uri = "content://media/external/images/media/" + photo_split[1];
			}
			if(callbackFunction){
				callbackFunction(uri);
			}

		}, function(e) {
			console.log("Error getting picture: " + e);
		}, {
			quality : 50,
			destinationType : navigator.camera.DestinationType.FILE_URI,
			sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY,
			targetWidth: 1024
		});
	} else {
		var showPicture = $('#'+id);
		showPicture.onload = function(data) {
					console.log("showPicture", this);
					// window.URL.revokeObjectURL(this.src);
				};
		$("#take_picture").change(function(event) {
			var files = event.target.files,
			    file;
			if (files && files.length > 0) {
				file = files[0];

				var imgURL = window.URL.createObjectURL(file);
				if(callbackFunction){
					callbackFunction(imgURL);	
				}
				
			}
		});
		$("#take_picture").trigger("click", id);
	}

	realignSlideHeight('max-height-form');
};

Page.prototype.base64toBlob = function(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data.split(',')[1]);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
};

Page.prototype.uploadImage = function() {
	var args,
	    _params,
	    callbackFunction,
	    errorFunction;
	if (arguments.length > 0) {
		args = arguments[0];
		if (arguments.length > 1 && typeof arguments[1] == 'object') {
			_params = arguments[1];
			callbackFunction = arguments[2] || null;
			errorFunction = arguments[3] || null;
		} else {
			_params = null;
			callbackFunction = arguments[1] || null;
			errorFunction = arguments[2] || null;
		}
		var request = null;
		if ( typeof args === 'object' && args.imageURI && args.task_id) {
			if (args.data) {
				var blobCached = this.base64toBlob(args.data, "image/jpg");
				var blobUrl = URL.createObjectURL(blobCached);
				args.imageURI = blobUrl;
			}
			request = args;
		} else if ( typeof args === 'string' && args.length > 0) {
			request = {
				'imageURI' : args,
				'task_id' : $('.swiper-slide-active input[name="task_id"]').val()
			};
			if(_params && _params.task_id){
				request.task_id = _params.task_id;
			}
		}
		console.log("request", request);
		if(!request || (request.imageURI && request.imageURI.length <= 0)){
			if (callbackFunction) {
				callbackFunction();
			}
		}

		if (isOffline()) {
			cacheImage(request, callbackFunction);
			return;
		}

		if (request) {
			// Verify server has been entered
			var server = this.settings.apiDomain + this.settings.apiUploadPath;
			if (server) {
				// Specify transfer options
				if (isNative()) {
					var options = new FileUploadOptions();
					options.fileKey = "file";
					options.fileName = request.imageURI.substr(request.imageURI.lastIndexOf('/') + 1);
					options.mimeType = "image/jpeg";
					options.chunkedMode = false;

					var params = {};
					params.task_id = request.task_id;
					params.client = User.client;
					params.token = User.lastToken;

					options.params = params;
					if(_params){
						for(key in _params){
							options[key] = _params[key];
						}
					}

					// Transfer picture to server

					var ft = new FileTransfer();
					ft.upload(request.imageURI, server, function(r) {
						console.log("Upload successful: " + r.bytesSent + " bytes uploaded.");
						if (callbackFunction) {
							callbackFunction(r);
						}

					}, function(error) {
						console.log("Upload failed: Code = " + error.code);
						if (errorFunction) {
							errorFunction(error);
						}
					}, options);

				} else {
					var blob;
					var oReq = new XMLHttpRequest();
					oReq.open("GET", request.imageURI, true);
					oReq.responseType = "arraybuffer";
					oReq.onload = function(oEvent) {
						blob = new Blob([oReq.response], {
							type : "image/jpg"
						});
						var fd = new FormData();
						fd.append('fname', request.imageURI.substr(request.imageURI.lastIndexOf('/') + 1));
						fd.append('file', blob);
						fd.append('client', User.client);
						fd.append('token', User.lastToken);
						fd.append('task_id', request.task_id);
						if(_params){
							for(key in _params){
								fd.append(key, _params[key]);
							}
						}
						$.ajax({
							type : 'POST',
							url : server,
							data : fd,
							processData : false,
							contentType : false,
							crossDomain : true,
							success : function(data) {
								if (callbackFunction) {
									window.URL.revokeObjectURL(request.imageURI);
									callbackFunction(data);
								}
							},
							error : function(error) {
								if (errorFunction) {
									errorFunction(error);
								}
							}
						});
					};

					oReq.send();
				}

			}
		};
	}

}; 

function cacheImage(request, callback) {
	if (request && request.imageURI && request.task_id) {
		if (isNative()) {
			db.lazyQuery({
				'sql' : 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
				'data' : [['uploadPhotos', JSON.stringify(request), request.task_id, 'uploadDone']]
			}, 0, callback);
		} else {
			var blob;
			var oReq = new XMLHttpRequest();
			oReq.open("GET", request.imageURI, true);
			oReq.responseType = "arraybuffer";
			oReq.onload = function(oEvent) {
				blob = new Blob([oReq.response], {
					type : "image/jpg"
				});
				if (isOffline()) {
					var reader = new window.FileReader();
					reader.readAsDataURL(blob);
					reader.onloadend = function() {
						request.data = reader.result;
						db.lazyQuery({
							'sql' : 'INSERT INTO "sync_query"("api","data","extra","q_type") VALUES(?,?,?,?)',
							'data' : [['uploadPhotos', JSON.stringify(request), request.task_id, 'uploadDone']]
						}, 0, callback);
					};
				}
			};
			oReq.send();
		}
	}

}



function parseQuery(qstr) {
	if(qstr){
		var query = {};
		var a = qstr.substr(1).split('&');
		for (var i = 0; i < a.length; i++) {
			var b = a[i].split('=');
			query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
		}
		return query;
	}
	return "";
}

Page.prototype.formatTaskDate = function(date) {
	var d = new Array();

	d[0] = 'Søndag';
	d[1] = 'Mandag';
	d[2] = 'Tirsdag';
	d[3] = 'Onsdag';
	d[4] = 'Torsdag';
	d[5] = 'Fredag';
	d[6] = 'Lørdag';

	var m = new Array();

	m[0] = 'januar';
	m[1] = 'februar';
	m[2] = 'mars';
	m[3] = 'april';
	m[4] = 'mai';
	m[5] = 'juni';
	m[6] = 'juli';
	m[7] = 'august';
	m[8] = 'september';
	m[9] = 'oktober';
	m[10] = 'november';
	m[11] = 'desember';

	return d[date.getDay()] + ' ' + date.getDate() + '. ' + m[date.getMonth()];
};

// Page preloader start
var genImage;
var cImageTimeout = false;
var cWidth = 47;
var cHeight = 47;
var cSpeed = 9;
var cTotalFrames = 18;
var cFrameWidth = 47;

var s = 'assets/main/images/sprites.gif';
var fun = "Page._startAnimation()";

Page.prototype.showLoader = function() {
	clearTimeout(cImageTimeout);
	cImageTimeout = 0;
	genImage = new Image();
	genImage.onload = function() {
		cImageTimeout = setTimeout(fun, 0);
	};
	genImage.onerror = new Function('alert(\'Could not load the image\')');
	genImage.src = s;
};

Page.prototype._startAnimation = function() {
	document.getElementById('loaderImage').innerHTML = '<canvas id="canvas" width="' + cWidth + '" height="' + cHeight + '"><p>Your browser does not support the canvas element.</p></canvas>';

	//FPS = Math.round(100/(maxSpeed+2-speed));
	FPS = Math.round(100 / cSpeed);
	SECONDS_BETWEEN_FRAMES = 1 / FPS;
	g_GameObjectManager = null;
	g_run = genImage;

	g_run.width = cTotalFrames * cFrameWidth;
	genImage.onload = function() {
		cImageTimeout = setTimeout(fun, 0);
	};
	initCanvas();
};
// Page preloader end

function User() {
	this.sessionName = 'user_data';
	this.client = false;
	this.lastToken = false;
}

User.prototype.login = function(client, token) {
	this.client = client;
	this.lastToken = token;

	this.saveSession();
};

User.prototype.setToken = function(token) {
	this.lastToken = token;
};

User.prototype.saveSession = function() {
	localStorage.setItem(this.sessionName, JSON.stringify({
		'client' : this.client,
		'lastToken' : this.lastToken
	}));

	var d = db.getDbInstance();
	d.transaction(checkUserSessionS, db.dbErrorHandle);
};

function saveUserHandle(tx, results) {
	var sql = '';
	if (results.rows.length != 2) {
		// add action
		sql = 'INSERT INTO settings("type","value") VALUES("client","' + User.client + '")';
		tx.executeSql(sql, [], function() {
		}, db.dbErrorHandle);

		sql = 'INSERT INTO settings("type","value") VALUES("token","' + User.lastToken + '")';
		tx.executeSql(sql, [], function() {
			// Show message
			$('.sm-success').fadeIn(1000);
			$('.sm-failed').fadeOut(500);

			if (fromLandingPage)
				location.href = settings.apiPath + '/app/index.html';
			else
				Page.redirect(Page.defaultPage);
		}, db.dbErrorHandle);
	} else {
		// save action
		sql = 'UPDATE settings SET "value" = "' + User.client + '" WHERE "type" = "client"';
		tx.executeSql(sql, [], function() {
		}, db.dbErrorHandle);

		sql = 'UPDATE settings SET "value" = "' + User.lastToken + '" WHERE "type" = "token"';
		tx.executeSql(sql, [], function() {
			// Show message
			$('.sm-success').fadeIn(1000);
			$('.sm-failed').fadeOut(500);

			if (fromLandingPage)
				location.href = settings.apiPath + '/app/index.html';
			else
				Page.redirect(Page.defaultPage);
		}, db.dbErrorHandle);
	}
}

function checkUserSessionS(tx) {
	tx.executeSql('SELECT * FROM "settings" WHERE "type" IN ("token", "client")', [], saveUserHandle, db.dbErrorHandle);
}

User.prototype.isLogged = function() {
	if (!this.lastToken || !this.client) {
		return false;
	} else {
		return true;
	}
};

User.prototype.logout = function() {
	var request = {
		'client' : this.client,
		'token' : this.lastToken
	};
	if (isNative() && window.deviceToken) {
		request.devicetoken = window.deviceToken;
	}
	Page.apiCall('logout', request, 'get', 'logout');
};

function logout() {
	logout_flag = true;
	d = db.getDbInstance();

	d.transaction(db.dbDropTables, db.dbErrorHandle, function() {
		User.database = false;
		User.client = false;
		User.lastToken = false;
		if (isNative()) {
			window.location.reload();
		} else {
			window.location.href = settings.apiPath;
		}
	});
}

var User = new User();

function Form() {

}

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

Form.prototype.validate = function(html) {
	var $h = $(html);
	return $h.find('[data-validation]').matchValidateRules();
};

Form.prototype.generateValidation = function(rules) {
	if (!rules || rules == undefined || rules.length == undefined) {
		return '';
	} else {
		var r = 'data-validation="';
		for (var i = 0; i < rules.length; i++) {
			r += rules[i] + ' ';
		}
		r = r.slice(0, -1);
		r += '" ';
		return r;
	}
};

Form.prototype.getValues = function(html) {
	var data_send = {};
	var tmp;
	var t;
	var asd = {};
	$(html).find('input, select, textarea').each(function() {
		if ($(this).hasClass('multiple_fridges')) {
			if (data_send['fridge'] == undefined) {
				data_send['fridge'] = {};
			}
			tmp = $(this).attr('name');
			t = tmp.match(/(.*)?\[(.*?)\]/);
			if (data_send['fridge'][t[2]] == undefined) {
				data_send['fridge'][t[2]] = {}
				if (t[2].indexOf('_added') !== false) {
					data_send['fridge'][t[2]].updated = 'updated';
				} else {
					data_send['fridge'][t[2]].updated = 'new';
				}
				data_send['fridge'][t[2]].values = {};
				data_send['fridge'][t[2]].values.category = $(html).find('.multiple_fridges_cat').val();
				data_send['fridge'][t[2]].start_date = $(html).find('.multiple_fridges_start_date').val()
			}
			data_send['fridge'][t[2]].values[t[1]] = $(this).val();
		} else if ($(this).hasClass('multiple_dishwasher')) {
			if (data_send['dishwasher'] == undefined) {
				data_send['dishwasher'] = {};
			}
			tmp = $(this).attr('name');
			t = tmp.match(/(.*)?\[(.*?)\]/);
			if (data_send['dishwasher'][t[2]] == undefined) {
				data_send['dishwasher'][t[2]] = {}
				if (t[2].indexOf('_added') !== -1) {
					data_send['dishwasher'][t[2]].updated = 'updated';
				} else {
					data_send['dishwasher'][t[2]].updated = 'new';
				}
				data_send['dishwasher'][t[2]].values = {};
				data_send['dishwasher'][t[2]].start_date = $(html).find('.multiple_fridges_start_date').val()
			}
			data_send['dishwasher'][t[2]].values[t[1]] = $(this).val();
		} else {
			if ($(this).is('input') && ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio')) {
				if ($(this).is(':checked') && $(this).attr('type') == 'radio') {
					tmp = $(this).attr('name');
					if (tmp.indexOf('[') != -1) {
						t = tmp.match(/(.*)?\[(.*?)\]/);
						if (data_send[t[1]] == undefined) {
							data_send[t[1]] = {};
						}
						data_send[t[1]][t[2]] = $(this).val();
					} else {
						data_send[tmp] = $(this).val();
					}
				} else if ($(this).is(':checked')) {
					tmp = $(this).attr('name');
					if (tmp.indexOf('[') != -1) {
						t = tmp.match(/(.*)?\[(.*?)\]/);
						if (data_send[t[1]] == undefined) {
							data_send[t[1]] = [];
						}
						data_send[t[1]].push(t[2]);
					} else {
						data_send[tmp] = true;
					}
				}
			} else {
				tmp = $(this).attr('name') + '';
				if (tmp.indexOf('[') != -1) {
					t = tmp.match(/(.*)?\[(.*?)\]/);
					if (data_send[t[1]] == undefined) {
						data_send[t[1]] = [];
					}
					data_send[t[1]].push($(this).val());
				} else {
					data_send[tmp] = $(this).val();
				}
			}
		}
	});
	return data_send;
};

Form.prototype.inputText = function(name, label, placeholder, validation, name2, value2) {
	var html = '<label for="frm_label_' + md5(name + label) + '">' + label + '</label>';

	html += '<input name="' + name + '" value="" placeholder="' + placeholder + '" id="frm_label_' + md5(name + label) + '" ' + this.generateValidation(validation) + '/>';

	if (name2 != undefined && name2) {
		html += '<input type="hidden" name="' + name2 + '" value="' + value2 + '">';
	}

	return html;
};

Form.prototype.inputTextV = function(name, label, placeholder, validation, value) {
	var html = '<label for="frm_label_' + md5(name + label) + '">' + label + '</label>';

	html += '<input name="' + name + '" placeholder="' + placeholder + '" id="frm_label_' + md5(name + label) + '" value="' + value + '" ' + this.generateValidation(validation) + '/>';

	return html;
};

function multipleInputTextRemove(el) {
	$(el).parent().parent().remove();
}

function multipleInputTextRemoveC2(el) {
	$(el).parent().parent().parent().remove();
}

var k_s = 0;
function multipleInputText(el) {
	$el = $(el);
	var container = $el.parent().parent();
	var name = (container.find('.ui-block-a').find('input').attr('name'));
	var placeholder = container.find('.ui-block-a').find('input').attr('placeholder');
	var html = '';

	html += '<fieldset class="ui-grid-a">';
	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <input name="' + name + '"  type="text" value="" placeholder="' + placeholder + '"/>';
	html += '    </div>';
	html += '    <div class="ui-block-b" style="width:20%;">';
	html += '        <a href="#" data-role="button" onclick="multipleInputTextRemove(this);"><i class="fa fa-minus"></i></a>';
	html += '    </div>';
	html += '</fieldset>';

	$(html).insertAfter(container).trigger("create");
}

function multipleInputTextC(el) {
	$el = $(el);
	var container = $el.parent().parent();
	var name = (container.find('.ui-block-a').find('input').attr('name'));
	var placeholder = container.find('.ui-block-a').find('input').attr('placeholder');
	var html = '';
	var n = md5(new Date().getTime()) + '_added';

	html += '<fieldset class="ui-grid-a">';
	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <input name="name[' + n + ']" class="multiple_fridges" type="text" value="" placeholder="name"/>';
	html += '    </div>';
	html += '    <div class="ui-block-b" style="width:20%;">';
	html += '        <a href="#" data-role="button" onclick="multipleInputTextRemove(this);"><i class="fa fa-minus"></i></a>';
	html += '    </div>';

	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <label>Default Temperature</label>';
	html += '        <input name="default_temp[' + n + ']" class="multiple_fridges" value="" type="text" placeholder=""/>';
	html += '    </div>';

	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <label>Max Temperature</label>';
	html += '        <input name="max_temp[' + n + ']" class="multiple_fridges" value="" type="text" placeholder=""/>';
	html += '    </div>';

	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <label>Min Temperature</label>';
	html += '        <input name="min_temp[' + n + ']" class="multiple_fridges" value="" type="text" placeholder=""/>';
	html += '    </div>';

	html += '</fieldset>';

	$(html).insertAfter(container).trigger("create");
}

function multipleInputTextCD(el) {
	$el = $(el);
	var container = $el.parent().parent();
	var name = (container.find('.ui-block-a').find('input').attr('name'));
	var placeholder = container.find('.ui-block-a').find('input').attr('placeholder');
	var html = '';
	var n = md5(new Date().getTime()) + '_added';

	html += '<fieldset class="ui-grid-a">';
	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <input name="name[' + n + ']" class="multiple_dishwasher" type="text" value="" placeholder="name"/>';
	html += '    </div>';
	html += '    <div class="ui-block-b" style="width:20%;">';
	html += '        <a href="#" data-role="button" onclick="multipleInputTextRemove(this);"><i class="fa fa-minus"></i></a>';
	html += '    </div>';

	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <label>Wash Default Temperature</label>';
	html += '        <input name="wash_default_temp[' + n + ']" class="multiple_dishwasher" value="" type="text" placeholder=""/>';
	html += '    </div>';

	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <label>Wash Max Temperature</label>';
	html += '        <input name="wash_max_temp[' + n + ']" class="multiple_dishwasher" value="" type="text" placeholder=""/>';
	html += '    </div>';

	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <label>Wash Min Temperature</label>';
	html += '        <input name="wash_min_temp[' + n + ']" class="multiple_dishwasher" value="" type="text" placeholder=""/>';
	html += '    </div>';

	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <label>Rinse Default Temperature</label>';
	html += '        <input name="rinse_default_temp[' + n + ']" class="multiple_dishwasher" value="" type="text" placeholder=""/>';
	html += '    </div>';

	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <label>Rinse Max Temperature</label>';
	html += '        <input name="rinse_max_temp[' + n + ']" class="multiple_dishwasher" value="" type="text" placeholder=""/>';
	html += '    </div>';

	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <label>Rinse Min Temperature</label>';
	html += '        <input name="rinse_min_temp[' + n + ']" class="multiple_dishwasher" value="" type="text" placeholder=""/>';
	html += '    </div>';

	html += '</fieldset>';

	$(html).insertAfter(container).trigger("create");
}

Form.prototype.inputHidden = function(name, value) {
	return '<input type="hidden" name="' + name + '" value="' + value + '" />';
};

Form.prototype.multipleInputText = function(name, label, placeholder, validation) {
	var html = '';

	html += '<div class="ui-grid-solo">';
	html += '        <label>' + label + '</label>';
	html += '</div>';

	html += '<fieldset class="ui-grid-a">';
	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <input name="' + name + '[]" value="" type="text" placeholder="' + placeholder + '" ' + this.generateValidation(validation) + '/>';
	html += '    </div>';
	html += '    <div class="ui-block-b" style="width:20%;">';
	html += '        <a href="#" data-role="button" onclick="multipleInputText(this);"><i class="fa fa-plus"></i></a>';
	html += '    </div>';
	html += '</fieldset>';

	return html;
};

Form.prototype.multipleInputTextV = function(name, label, placeholder, validation, value) {
	var html = '';

	html += '<div class="ui-grid-solo">';
	html += '        <label>' + label + '</label>';
	html += '</div>';

	var f = true;
	for (var i in value) {
		if (value.hasOwnProperty(i)) {
			if (f) {
				html += '<fieldset class="ui-grid-a">';
				html += '    <div class="ui-block-a" style="width:80%;">';
				html += '        <input name="' + name + '[]" value="' + value[i] + '" type="text" placeholder="' + placeholder + '" ' + this.generateValidation(validation) + '/>';
				html += '    </div>';
				html += '    <div class="ui-block-b" style="width:20%;">';
				html += '        <a href="#" data-role="button" onclick="multipleInputText(this);"><i class="fa fa-plus"></i></a>';
				html += '    </div>';
				html += '</fieldset>';

				f = false;
			} else {
				html += '<fieldset class="ui-grid-a">';
				html += '    <div class="ui-block-a" style="width:80%;">';
				html += '        <input name="' + name + '"  type="text" value="' + value[i] + '" placeholder="' + placeholder + '"/>';
				html += '    </div>';
				html += '    <div class="ui-block-b" style="width:20%;">';
				html += '        <a href="#" data-role="button" onclick="multipleInputTextRemove(this);"><i class="fa fa-minus"></i></a>';
				html += '    </div>';
				html += '</fieldset>';
			}
		}
	}

	return html;
};

Form.prototype.multipleInputTextFridge = function(name, label, placeholder, validation, fields) {
	var html = '';

	html += '<div>'

	html += '<div class="ui-grid-solo">';
	html += '        <label>' + label + '</label>';
	html += '</div>';

	html += '<div class="ui-grid-a">';
	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <input name="name[]" value="" type="text" placeholder="" class="multiple_fridges"/>';
	html += '    </div>';
	html += '    <div class="ui-block-b" style="width:20%;">';
	html += '        <a href="#" data-role="button" onclick="multipleInputTextC2(this);"><i class="fa fa-plus"></i></a>';
	html += '    </div>';
	html += '</div>';

	html += '<div class="multiple_fridges_reformat_input">';
	html += '<legend>Temperature</legend>';
	html += '<div class="ui-grid-b">';
	html += '   <div class="ui-block-a">';
	html += '        <label>Default</label>';
	html += '        <input name="default_temp[]" class="multiple_fridges" value="" type="number" placeholder=""/>';
	html += '   </div>';

	html += '   <div class="ui-block-b">';
	html += '        <label>Max</label>';
	html += '        <input name="max_temp[]" class="multiple_fridges" value="" type="number" placeholder=""/>';
	html += '   </div>';

	html += '   <div class="ui-block-c">';
	html += '        <label>Min</label>';
	html += '        <input name="min_temp[]" class="multiple_fridges" value="" type="number" placeholder=""/>';
	html += '   </div>';
	html += '</div>';
	html += '</div>';

	html += '</div>';

	return html;
};

function multipleInputTextC3(el) {
	$el = $(el);
	var container = $el.parent().parent().parent();
	var html = '';
	var n = md5(new Date().getTime()) + '_added';

	html += '<div>'

	html += '<div class="ui-grid-a">';
	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <input name="name[' + n + ']" value="" type="text" placeholder="name" class="multiple_fridges"/>';
	html += '    </div>';
	html += '    <div class="ui-block-b" style="width:20%;">';
	html += '        <a href="#" data-role="button" onclick="multipleInputTextRemoveC2(this);"><i class="fa fa-minus"></i></a>';
	html += '    </div>';
	html += '</div>';

	html += '<div class="multiple_fridges_reformat_input">';
	html += '<legend>Wash Temperature</legend>';
	html += '<div class="ui-grid-b">';
	html += '   <div class="ui-block-a">';
	html += '        <label>Default</label>';
	html += '        <input name="wash_default_temp[' + n + ']" class="multiple_dishwasher" value="" type="number" placeholder=""/>';
	html += '   </div>';

	html += '   <div class="ui-block-b">';
	html += '        <label>Max</label>';
	html += '        <input name="wash_max_temp[' + n + ']" class="multiple_dishwasher" value="" type="number" placeholder=""/>';
	html += '   </div>';

	html += '   <div class="ui-block-c">';
	html += '        <label>Min</label>';
	html += '        <input name="wash_min_temp[' + n + ']" class="multiple_dishwasher" value="" type="number" placeholder=""/>';
	html += '   </div>';
	html += '</div>';
	html += '</div>';

	html += '<div class="multiple_fridges_reformat_input">';
	html += '<legend>Rinse Temperature Wash</legend>';
	html += '<div class="ui-grid-b">';
	html += '   <div class="ui-block-a">';
	html += '        <label>Default</label>';
	html += '        <input name="rinse_default_temp[' + n + ']" class="multiple_dishwasher" value="" type="number" placeholder=""/>';
	html += '   </div>';

	html += '   <div class="ui-block-b">';
	html += '        <label>Max</label>';
	html += '        <input name="rinse_max_temp[' + n + ']" class="multiple_dishwasher" value="" type="number" placeholder=""/>';
	html += '   </div>';

	html += '   <div class="ui-block-c">';
	html += '        <label>Min</label>';
	html += '        <input name="rinse_min_temp[' + n + ']" class="multiple_dishwasher" value="" type="number" placeholder=""/>';
	html += '   </div>';
	html += '</div>';
	html += '</div>';

	html += '</div>';

	$(html).insertAfter(container).trigger("create");
}

Form.prototype.multipleInputTextDishWasher = function(name, label, placeholder, validation, fields) {
	var n = md5(new Date().getTime()) + '_new';

	var html = '';

	html += '<div>'

	html += '<div class="ui-grid-solo">';
	html += '        <label>' + label + '</label>';
	html += '</div>';

	html += '<div class="ui-grid-a">';
	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <input name="name[' + n + ']" value="" type="text" placeholder="" class="multiple_dishwasher"/>';
	html += '    </div>';
	html += '    <div class="ui-block-b" style="width:20%;">';
	html += '        <a href="#" data-role="button" onclick="multipleInputTextC3(this);"><i class="fa fa-plus"></i></a>';
	html += '    </div>';
	html += '</div>';

	html += '<div class="multiple_fridges_reformat_input">';
	html += '<legend>Wash Temperature</legend>';
	html += '<div class="ui-grid-b">';
	html += '   <div class="ui-block-a">';
	html += '        <label>Default</label>';
	html += '        <input name="wash_default_temp[' + n + ']" class="multiple_dishwasher" value="" type="number" placeholder=""/>';
	html += '   </div>';

	html += '   <div class="ui-block-b">';
	html += '        <label>Max</label>';
	html += '        <input name="wash_max_temp[' + n + ']" class="multiple_dishwasher" value="" type="number" placeholder=""/>';
	html += '   </div>';

	html += '   <div class="ui-block-c">';
	html += '        <label>Min</label>';
	html += '        <input name="wash_min_temp[' + n + ']" class="multiple_dishwasher" value="" type="number" placeholder=""/>';
	html += '   </div>';
	html += '</div>';
	html += '</div>';

	html += '<div class="multiple_fridges_reformat_input">';
	html += '<legend>Rinse Temperature Wash</legend>';
	html += '<div class="ui-grid-b">';
	html += '   <div class="ui-block-a">';
	html += '        <label>Default</label>';
	html += '        <input name="rinse_default_temp[' + n + ']" class="multiple_dishwasher" value="" type="number" placeholder=""/>';
	html += '   </div>';

	html += '   <div class="ui-block-b">';
	html += '        <label>Max</label>';
	html += '        <input name="rinse_max_temp[' + n + ']" class="multiple_dishwasher" value="" type="number" placeholder=""/>';
	html += '   </div>';

	html += '   <div class="ui-block-c">';
	html += '        <label>Min</label>';
	html += '        <input name="rinse_min_temp[' + n + ']" class="multiple_dishwasher" value="" type="number" placeholder=""/>';
	html += '   </div>';
	html += '</div>';
	html += '</div>';

	html += '</div>';

	return html;
};

function multipleInputTextC2(el) {
	$el = $(el);
	var container = $el.parent().parent().parent();
	var name = (container.find('.ui-block-a').find('input').attr('name'));
	var placeholder = container.find('.ui-block-a').find('input').attr('placeholder');
	var html = '';
	var n = md5(new Date().getTime()) + '_added';

	html += '<div>'

	html += '<div class="ui-grid-a">';
	html += '    <div class="ui-block-a" style="width:80%;">';
	html += '        <input name="name[' + n + ']" value="" type="text" placeholder="name" class="multiple_fridges"/>';
	html += '    </div>';
	html += '    <div class="ui-block-b" style="width:20%;">';
	html += '        <a href="#" data-role="button" onclick="multipleInputTextRemoveC2(this);"><i class="fa fa-minus"></i></a>';
	html += '    </div>';
	html += '</div>';

	html += '<div class="multiple_fridges_reformat_input">';
	html += '<legend>Temperature</legend>';
	html += '<div class="ui-grid-b">';
	html += '   <div class="ui-block-a">';
	html += '        <label>Default</label>';
	html += '        <input name="default_temp[' + n + ']" class="multiple_fridges" value="" type="text" placeholder=""/>';
	html += '   </div>';

	html += '   <div class="ui-block-b">';
	html += '        <label>Max</label>';
	html += '        <input name="max_temp[' + n + ']" class="multiple_fridges" value="" type="text" placeholder=""/>';
	html += '   </div>';

	html += '   <div class="ui-block-c">';
	html += '        <label>Min</label>';
	html += '        <input name="min_temp[' + n + ']" class="multiple_fridges" value="" type="text" placeholder=""/>';
	html += '   </div>';
	html += '</div>';
	html += '</div>';

	html += '</div>';

	$(html).insertAfter(container).trigger("create");
}

Form.prototype.multipleInputTextVC = function(name, label, placeholder, validation, fields, values) {
	var html = '';

	html += '<div class="ui-grid-solo">';
	html += '        <label>' + label + '</label>';
	html += '</div>';

	var f = true;
	for (var i in values) {
		if (values.hasOwnProperty(i)) {
			if (f) {
				if (values[i] != undefined && values[i].fridge_id != undefined) {
					html += '<fieldset class="ui-grid-a">';
					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <input name="name[' + values[i].fridge_id + ']" value="' + values[i].name + '" type="text" placeholder="" class="multiple_fridges"/>';
					html += '    </div>';
					html += '    <div class="ui-block-b" style="width:20%;">';
					html += '        <a href="#" data-role="button" onclick="multipleInputTextC(this);"><i class="fa fa-plus"></i></a>';
					html += '    </div>';

					if (values[i].temperature.default_temp == null || values[i].temperature.default_temp == 'null') {
						values[i].temperature.default_temp = '';
					}

					if (values[i].temperature.max_temp == null || values[i].temperature.max_temp == 'null') {
						values[i].temperature.max_temp = '';
					}

					if (values[i].temperature.min_temp == null || values[i].temperature.min_temp == 'null') {
						values[i].temperature.min_temp = '';
					}

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Default Temperature</label>';
					html += '        <input name="default_temp[' + values[i].fridge_id + ']" class="multiple_fridges" value="' + values[i].temperature.default_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Max Temperature</label>';
					html += '        <input name="max_temp[' + values[i].fridge_id + ']" class="multiple_fridges" value="' + values[i].temperature.max_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Min Temperature</label>';
					html += '        <input name="min_temp[' + values[i].fridge_id + ']" class="multiple_fridges" value="' + values[i].temperature.min_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '</fieldset>';

					f = false;
				} else {
					html += '<fieldset class="ui-grid-a">';
					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <input name="name[]" value="" type="text" placeholder="" class="multiple_fridges"/>';
					html += '    </div>';
					html += '    <div class="ui-block-b" style="width:20%;">';
					html += '        <a href="#" data-role="button" onclick="multipleInputTextC(this);"><i class="fa fa-plus"></i></a>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Default Temperature</label>';
					html += '        <input name="default_temp[]" class="multiple_fridges" value="" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Max Temperature</label>';
					html += '        <input name="max_temp[]" class="multiple_fridges" value="" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Min Temperature</label>';
					html += '        <input name="min_temp[]" class="multiple_fridges" value="" type="text" placeholder=""/>';
					html += '    </div>';

					html += '</fieldset>';
					f = false;
				}
			} else {
				if (values[i] != undefined && values[i].fridge_id != undefined) {
					html += '<fieldset class="ui-grid-a">';
					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <input name="fridges[' + values[i].fridge_id + ']" class="multiple_fridges" type="text" value="' + fields[i] + '" placeholder=""/>';
					html += '    </div>';
					html += '    <div class="ui-block-b" style="width:20%;">';
					html += '        <a href="#" data-role="button" onclick="multipleInputTextRemove(this);"><i class="fa fa-minus"></i></a>';
					html += '    </div>';

					if (values[i].temperature.default_temp == null || values[i].temperature.default_temp == 'null') {
						values[i].temperature.default_temp = '';
					}

					if (values[i].temperature.max_temp == null || values[i].temperature.max_temp == 'null') {
						values[i].temperature.max_temp = '';
					}

					if (values[i].temperature.min_temp == null || values[i].temperature.min_temp == 'null') {
						values[i].temperature.min_temp = '';
					}

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Default Temperature</label>';
					html += '        <input name="fridges_default_temp[' + values[i].fridge_id + ']" class="multiple_fridges" value="' + values[i].temperature.default_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Max Temperature</label>';
					html += '        <input name="fridges_max_temp[' + values[i].fridge_id + ']" class="multiple_fridges" value="' + values[i].temperature.max_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Min Temperature</label>';
					html += '        <input name="fridges_min_temp[' + values[i].fridge_id + ']" class="multiple_fridges" value="' + values[i].temperature.min_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '</fieldset>';
				}
			}
		}
	}

	return html;
};

Form.prototype.multipleInputTextVD = function(name, label, placeholder, validation, fields, values) {
	var html = '';

	html += '<div class="ui-grid-solo">';
	html += '        <label>' + label + '</label>';
	html += '</div>';

	var f = true;
	for (var i in values) {
		if (values.hasOwnProperty(i)) {
			if (f) {
				if (values[i] != undefined && values[i].id != undefined) {
					html += '<fieldset class="ui-grid-a">';
					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <input name="name[' + values[i].id + ']" value="' + values[i].name + '" type="text" placeholder="" class="multiple_dishwasher"/>';
					html += '    </div>';
					html += '    <div class="ui-block-b" style="width:20%;">';
					html += '        <a href="#" data-role="button" onclick="multipleInputTextCD(this);"><i class="fa fa-plus"></i></a>';
					html += '    </div>';

					if (values[i].temperature.default_temp == null || values[i].temperature.default_temp == 'null') {
						values[i].temperature.default_temp = '';
					}

					if (values[i].temperature.max_temp == null || values[i].temperature.max_temp == 'null') {
						values[i].temperature.max_temp = '';
					}

					if (values[i].temperature.min_temp == null || values[i].temperature.min_temp == 'null') {
						values[i].temperature.min_temp = '';
					}

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Wash Default Temperature</label>';
					html += '        <input name="wash_default_temp[' + values[i].id + ']" class="multiple_dishwasher" value="' + values[i].temperature.default_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Wash Max Temperature</label>';
					html += '        <input name="wash_max_temp[' + values[i].id + ']" class="multiple_dishwasher" value="' + values[i].temperature.max_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Wash Min Temperature</label>';
					html += '        <input name="wash_min_temp[' + values[i].id + ']" class="multiple_dishwasher" value="' + values[i].temperature.min_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Rinse Default Temperature</label>';
					html += '        <input name="rinse_default_temp[' + values[i].id + ']" class="multiple_dishwasher" value="' + values[i].rinse.rinse_default_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Rinse Max Temperature</label>';
					html += '        <input name="rinse_max_temp[' + values[i].id + ']" class="multiple_dishwasher" value="' + values[i].rinse.rinse_max_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Rinse Min Temperature</label>';
					html += '        <input name="rinse_min_temp[' + values[i].id + ']" class="multiple_dishwasher" value="' + values[i].rinse.rinse_min_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '</fieldset>';
					/*html += '<fieldset class="ui-grid-a">';
					 html += '    <div class="ui-block-a" style="width:80%;">';
					 html += '        <input name="' + fields[i] + '[]" value="' + fields[i] + '" type="text" placeholder=""/>';
					 html += '    </div>';
					 html += '    <div class="ui-block-b" style="width:20%;">';
					 html += '        <a href="#" data-role="button" onclick="multipleInputText(this);"><i class="fa fa-plus"></i></a>';
					 html += '    </div>';
					 html += '</fieldset>';*/

					f = false;
				} else {
					html += '<fieldset class="ui-grid-a">';
					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <input name="name[]" value="" type="text" placeholder="" class="multiple_dishwasher"/>';
					html += '    </div>';
					html += '    <div class="ui-block-b" style="width:20%;">';
					html += '        <a href="#" data-role="button" onclick="multipleInputTextCD(this);"><i class="fa fa-plus"></i></a>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Wash Default Temperature</label>';
					html += '        <input name="wash_default_temp[]" class="multiple_dishwasher" value="" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Wash Max Temperature</label>';
					html += '        <input name="wash_max_temp[]" class="multiple_dishwasher" value="" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Wash Min Temperature</label>';
					html += '        <input name="wash_min_temp[]" class="multiple_dishwasher" value="" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Rinse Default Temperature</label>';
					html += '        <input name="rinse_default_temp[]" class="multiple_dishwasher" value="" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Rinse Max Temperature</label>';
					html += '        <input name="rinse_max_temp[]" class="multiple_dishwasher" value="" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Rinse Min Temperature</label>';
					html += '        <input name="rinse_min_temp[]" class="multiple_dishwasher" value="" type="text" placeholder=""/>';
					html += '    </div>';

					html += '</fieldset>';

					f = false;
				}
			} else {
				if (values[i] != undefined && values[i].id != undefined) {
					html += '<fieldset class="ui-grid-a">';
					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <input name="fridges[' + values[i].fridge_id + ']" class="multiple_dishwasher" type="text" value="' + fields[i] + '" placeholder=""/>';
					html += '    </div>';
					html += '    <div class="ui-block-b" style="width:20%;">';
					html += '        <a href="#" data-role="button" onclick="multipleInputTextRemove(this);"><i class="fa fa-minus"></i></a>';
					html += '    </div>';

					if (values[i].temperature.default_temp == null || values[i].temperature.default_temp == 'null') {
						values[i].temperature.default_temp = '';
					}

					if (values[i].temperature.max_temp == null || values[i].temperature.max_temp == 'null') {
						values[i].temperature.max_temp = '';
					}

					if (values[i].temperature.min_temp == null || values[i].temperature.min_temp == 'null') {
						values[i].temperature.min_temp = '';
					}

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Wash Default Temperature</label>';
					html += '        <input name="wash_default_temp[' + values[i].id + ']" class="multiple_dishwasher" value="' + values[i].temperature.default_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Wash Max Temperature</label>';
					html += '        <input name="wash_max_temp[' + values[i].id + ']" class="multiple_dishwasher" value="' + values[i].temperature.max_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Wash Min Temperature</label>';
					html += '        <input name="wash_min_temp[' + values[i].id + ']" class="multiple_dishwasher" value="' + values[i].temperature.min_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Rinse Default Temperature</label>';
					html += '        <input name="rinse_default_temp[' + values[i].id + ']" class="multiple_dishwasher" value="' + values[i].rinse.rinse_default_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Rinse Max Temperature</label>';
					html += '        <input name="rinse_max_temp[' + values[i].id + ']" class="multiple_dishwasher" value="' + values[i].rinse.rinse_max_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '    <div class="ui-block-a" style="width:80%;">';
					html += '        <label>Rinse Min Temperature</label>';
					html += '        <input name="rinse_min_temp[' + values[i].id + ']" class="multiple_dishwasher" value="' + values[i].rinse.rinse_min_temp + '" type="text" placeholder=""/>';
					html += '    </div>';

					html += '</fieldset>';
				}
			}
		}
	}

	return html;
};

Form.prototype.textarea = function(name, label, placeholder, validation, value) {
	if (label == undefined) {
		label = '';
	}
	if (placeholder == undefined) {
		placeholder = '';
	}
	var html = '<label for="frm_label_' + md5(name + label) + '">' + label + '</label>';

	html += '<textarea name="' + name + '" placeholder="' + placeholder + '" id="frm_label_' + md5(name + label) + '" ' + this.generateValidation(validation) + '>' + (value != undefined ? value : '') + '</textarea>';

	return html;
};

Form.prototype.selectBox = function(name, label, options, placeholder, validation) {

	var html = '<label for="' + md5(name + label) + '" class="select">' + label + '</label>';
	html += '<select name="' + name + '" id="' + md5(name + label) + '" ' + this.generateValidation(validation) + '>';
	html += '<option value="-1">' + placeholder + '</option>';

	for (var i in options) {
		if (options.hasOwnProperty(i)) {
			if ( typeof options[i] == 'object') {
				for (var j in options[i])
				break;
				html += '<option value="' + j + '">' + options[i][j] + '</option>';
			} else {
				html += '<option value="' + i + '">' + options[i] + '</option>';
			}
		}
	}

	html += '</select>';
	return html;
};

Form.prototype.fileBox = function(name, label) {
	haccp_image_id = 'image_' + md5(name + label);
	var html = '<div data-role="controlgroup">';
	if (!isNative()) {
		html += '<div class="hidden"><input type="file" id="take_picture" accept="image/*"></div>';
	}
	if (isNative()) {
		html += '<a href="#" onclick="takeHACCPPicture(\'image_' + md5(name + label) + '\');" data-role="button" data-theme="e"><i class="fa fa-camera pull-left"></i>' + $.t('pictures.take') + '</a>';
	}
	html += '<a href="#" onclick="selectHACCPPicture(\'image_' + md5(name + label) + '\');" data-role="button" data-theme="e"><i class="fa fa-files-o pull-left"></i>' + $.t('pictures.select') + '</a>';
	html += '</div>';

	html += '<img width="100%" height="auto" style="visibility:hidden;display:none;margin:0 auto;" id="image_' + md5(name + label) + '" src="" />';

	return html;
};

Form.prototype.signature = function(name, label) {
	var html = '<label>' + $.t("haccp.signature") + '</label><div class="ui-grid-a"><div class="ui-block-a"><input type="text" name="name" id="sign_name" placeholder=""/></div><div class="ui-block-b"><input type="submit" value="' + $.t("general.sign_button") + '" id="signature-trigger" data-position-to="window"/></div></div>';

	return html;
};

Form.prototype.checkboxList = function(name, label, value, checkboxes, name2) {

	var html = '<fieldset data-role="controlgroup">';
	html += '<input type="hidden" name="' + name + '" value="' + value + '" />';
	html += '<legend>' + label + '</legend>';

	for (var i in checkboxes) {
		if (checkboxes.hasOwnProperty(i)) {
			if (checkboxes[i].answer != undefined) {
				html += '<input name="' + name2 + '[' + i + ']" id="' + md5(name + i) + '" type="checkbox">';
				html += '<label for="' + md5(name + i) + '">' + checkboxes[i].answer.label + '</label>';
			}
		}
	}

	html += '</fieldset>';

	return html;
};

Form.prototype.checkboxListV = function(name, label, value, checkboxes, name2) {

	var html = '<fieldset data-role="controlgroup">';
	html += '<input type="hidden" name="' + name + '" value="' + value + '" />';
	html += '<legend>' + label + '</legend>';

	for (var i in checkboxes) {
		if (checkboxes.hasOwnProperty(i)) {
			if (checkboxes[i].answer != undefined) {
				html += '<input name="' + name2 + '[' + i + ']" id="' + md5(name + i) + '" type="checkbox"' + (checkboxes[i].answer.checked == 'checked' ? ' checked="checked"' : '') + '>';
				html += '<label for="' + md5(name + i) + '">' + checkboxes[i].answer.label + '</label>';
			}
		}
	}

	html += '</fieldset>';

	return html;
};

function showToggleDiv(el) {
	var $el = $(el);
	if ($el.val() == 'on') {
		$('.' + $el.attr('name')).show();
	} else {
		$('.' + $el.attr('name')).hide();
	}
}

Form.prototype.radioList = function(name, label, value, checkboxes, name2, useSwitch) {
	var custom = false;
	var html = '<fieldset data-role="controlgroup">';
	if (name2 == undefined) {
		custom = true;
	}
	if (!custom) {
		html += '<input type="hidden" name="' + name + '" value="' + value + '" />';
	}
	html += '<legend>' + label + '</legend>';

	if (useSwitch != undefined && useSwitch) {
		lid = md5(name + label + value + 'slide');

		html += '<select name="' + md5(name + label + value + 'slide') + '" data-role="slider" onchange="showToggleDiv(this);">';
		html += '<option value="off">No</option>';
		html += '<option value="on">Yes</option>';
		html += '</select>';

		html += '<div style="display:none;" class="' + md5(name + label + value + 'slide') + '">'
	}

	for (var i in checkboxes) {
		if (checkboxes.hasOwnProperty(i)) {
			if (!custom) {
				if (i == 5) {
					html += '<input name="' + name2 + '" id="' + md5(name + i) + '" type="radio" value="' + i + '" checked>';
				} else {
					html += '<input name="' + name2 + '" id="' + md5(name + i) + '" type="radio" value="' + i + '">';
				}
			} else {
				if (i == 5) {
					html += '<input name="' + name + '" id="' + md5(name + i) + '" type="radio" value="' + i + '" checked>';
				} else {
					html += '<input name="' + name + '" id="' + md5(name + i) + '" type="radio" value="' + i + '">';
				}
			}
			html += '<label for="' + md5(name + i) + '">' + checkboxes[i] + '</label>';
		}
	}

	if (useSwitch != undefined && useSwitch) {
		html += '</div>';
	}

	html += '</fieldset>';

	return html;
};

Form.prototype.radioListV = function(name, label, value, checkboxes, name2, useSwitch, values, asfridge) {
	var custom = false;
	var radio_value = false;
	var html = '<fieldset data-role="controlgroup">';
	if (name2 == undefined) {
		custom = true;
	}
	if (!custom) {
		if (asfridge) {
			html += '<input type="hidden" name="' + name + '" value="' + value + '" class="multiple_fridges_cat" />';
		} else {
			html += '<input type="hidden" name="' + name + '" value="' + value + '" />';
		}
	}
	html += '<legend>' + label + '</legend>';

	lid = md5(name + label + value + 'slide');
	if (values != undefined && typeof values == "object") {
		for (radio_value in values)
		break;
		lid_opn[lid] = values[radio_value];
		if (lid_opn[lid] != null && lid_opn[lid].frequency_id != undefined) {
			radio_value = lid_opn[lid].frequency_id;
		}
	}
	if (useSwitch != undefined && useSwitch) {

		html += '<select name="' + md5(name + label + value + 'slide') + '" data-role="slider" onchange="showToggleDiv(this);">';
		if (values != undefined && typeof values == "object") {
			html += '<option value="off">No</option>';
			html += '<option value="on" selected>Yes</option>';
		} else {
			html += '<option value="off" selected>No</option>';
			html += '<option value="on">Yes</option>';
		}

		html += '</select>';

		if (values != undefined && typeof values == "object") {
			html += '<div style="display:block;" class="' + md5(name + label + value + 'slide') + '">';
		} else {
			lid_opn[lid] = false;
			html += '<div style="display:none;" class="' + md5(name + label + value + 'slide') + '">';
		}
	}

	for (var i in checkboxes) {
		if (checkboxes.hasOwnProperty(i)) {
			if (!custom) {
				if (i == radio_value) {
					html += '<input name="' + name2 + '" id="' + md5(name + i) + '" type="radio" value="' + i + '" checked>';
				} else {
					if (radio_value === false || i == 5) {
						html += '<input name="' + name2 + '" id="' + md5(name + i) + '" type="radio" value="' + i + '" checked>';
					} else {
						html += '<input name="' + name2 + '" id="' + md5(name + i) + '" type="radio" value="' + i + '">';
					}
				}
			} else {
				if (i == radio_value) {
					html += '<input name="' + name + '" id="' + md5(name + i) + '" type="radio" value="' + i + '" checked>';
				} else {
					if (radio_value === false || i == 5) {
						html += '<input name="' + name + '" id="' + md5(name + i) + '" type="radio" value="' + i + '" checked>';
					} else {
						html += '<input name="' + name + '" id="' + md5(name + i) + '" type="radio" value="' + i + '">';
					}
				}
			}
			html += '<label for="' + md5(name + i) + '">' + checkboxes[i] + '</label>';
		}
	}

	if (useSwitch != undefined && useSwitch) {
		html += '</div>';
	}

	html += '</fieldset>';

	return html;
};

Form.prototype.radioListHACCP = function(name, label, checkboxes, r) {
	var color = {
		0 : '#6ca604',
		1 : '#ffa800',
		2 : '#cf2a27'
	};
	var html = '<fieldset data-role="controlgroup">';

	html += '<legend>' + label + '</legend>';

	for (var i in checkboxes) {
		if (checkboxes.hasOwnProperty(i)) {
			if (r !== false) {
				html += '<input name="' + name + '" type="radio" value="' + i + '" id="haccp_radio_' + name + '_' + r + '_' + i + '">';
				html += '<label for="haccp_radio_' + name + '_' + r + '_' + i + '"><i class="fa fa-square" style="color:' + color[i] + ';"></i> ' + checkboxes[i] + '</label>';
			} else {
				html += '<input name="' + name + '" id="' + md5(name + i) + '" type="radio" value="' + i + '">';
				html += '<label for="' + md5(name + i) + '"><i class="fa fa-square" style="color:' + color[i] + ';"></i> ' + checkboxes[i] + '</label>';
			}
		}
	}

	html += '</fieldset>';

	return html;
};

Form.prototype.submitHACCP = function() {
	return '<input type="submit" data-theme="d" value="' + $.t("general.save_button") + '"/>';
};

Form.prototype.submitButton = function(label) {
	if (label == undefined) {
		label = $.t("general.save_button");
	}
	return '<button data-theme="d">' + label + '</button>';
};

Form.prototype.inputDate = function(name, label, placeholder, haveSwitch) {
	var html = '';

	if (haveSwitch != undefined && haveSwitch) {
		html += '<div style="display:none;" class="' + lid + '">'
	}

	html += '<label for="frm_label_' + md5(label) + '">' + label + '</label>';

	html += '<input name="' + name + '" placeholder="' + placeholder + '" id="frm_label_' + md5(label) + '" type="date" />';

	if (haveSwitch != undefined && haveSwitch) {
		html += '</div>';
	}

	return html;
};

Form.prototype.inputDateV = function(name, label, placeholder, haveSwitch, values, usefridge) {
	var html = '';

	if (haveSwitch != undefined && haveSwitch) {
		if (lid_opn[lid] !== false) {
			html += '<div style="display:block;" class="' + lid + '">'
		} else {

			html += '<div style="display:none;" class="' + lid + '">'
		}
	} else {
		lid_opn = false;
	}

	html += '<label for="frm_label_' + md5(label) + '">' + label + '</label>';

	if (lid_opn !== false && lid_opn[lid] !== false) {
		if (lid_opn[lid] != null && lid_opn[lid].date != undefined) {
			var d = new Date(lid_opn[lid].date);
		} else if (lid_opn[lid] != null && lid_opn[lid].start_date.date != undefined) {
			var d = new Date(lid_opn[lid].start_date.date);
		} else {
			var d = new Date();
		}
		var month = d.getMonth();
		var day = d.getDate();
		if (month < 10) {
			month = '0' + (parseInt(d.getMonth()) + 1);
		}

		if (day < 10) {
			day = '0' + d.getDate();
		}

		var d_f = d.getFullYear() + '-' + month + '-' + day;
		if (usefridge) {
			html += '<input name="' + name + '" class="multiple_fridges_start_date" placeholder="' + placeholder + '" id="frm_label_' + md5(label) + '" type="date" value="' + d_f + '"/>';
		} else {
			html += '<input name="' + name + '" placeholder="' + placeholder + '" id="frm_label_' + md5(label) + '" type="date" value="' + d_f + '"/>';
		}
	} else {
		if (usefridge) {
			html += '<input name="' + name + '" class="multiple_fridges_start_date" placeholder="' + placeholder + '" id="frm_label_' + md5(label) + '" type="date" />';
		} else {
			html += '<input name="' + name + '" placeholder="' + placeholder + '" id="frm_label_' + md5(label) + '" type="date" />';
		}
	}

	if (haveSwitch != undefined && haveSwitch) {
		html += '</div>';
	}

	return html;
};

Form.prototype.multipleTextColor = function(name, label, colors) {
	var html = '<label>' + label + '</label>';

	var color = {
		'Red' : '#ff0000',
		'Green' : '#008000',
		'Blue' : '#0000ff',
		'Yellow' : '#ffff00',
		'White' : '#ffffff',
		'Pink' : '#FF1493',
		'Brown' : '#A52A2A'
	};

	for (var i in colors) {
		if (colors.hasOwnProperty(i)) {
			html += '<legend style="margin-top:10px;">' + colors[i].answer.label + '</legend>';
			for (var j in color) {
				if (color.hasOwnProperty(j)) {
					if (j == 'White') {
						html += '<input name="answer[' + i + ']" id="' + md5(i + j) + '" type="radio" value="' + color[j] + '" checked="checked">';
					} else {
						html += '<input name="answer[' + i + ']" id="' + md5(i + j) + '" type="radio" value="' + color[j] + '">';
					}
					html += '<label for="' + md5(i + j) + '"><i class="fa fa-square" style="color:' + color[j] + ';"></i> ' + j + '</label>';
				}
			}
		}
	}

	return html;
};

Form.prototype.multipleTextColorV = function(name, label, colors, values) {
	var html = '<label>' + label + '</label>';

	var color = {
		'Red' : '#ff0000',
		'Green' : '#008000',
		'Blue' : '#0000ff',
		'Yellow' : '#ffff00',
		'White' : '#ffffff',
		'Pink' : '#FF1493',
		'Brown' : '#A52A2A'
	};

	for (var i in colors) {
		if (colors.hasOwnProperty(i)) {
			html += '<legend style="margin-top:10px;">' + colors[i].answer.label + '</legend>';
			for (var j in color) {
				if (color.hasOwnProperty(j)) {
					if (color[j] == values[i].color) {
						html += '<input name="answer[' + i + ']" id="' + md5(i + j) + '" type="radio" value="' + color[j] + '" checked="checked">';
					} else {
						html += '<input name="answer[' + i + ']" id="' + md5(i + j) + '" type="radio" value="' + color[j] + '">';
					}
					html += '<label for="' + md5(i + j) + '"><i class="fa fa-square" style="color:' + color[j] + ';"></i> ' + j + '</label>';
				}
			}
		}
	}

	return html;
};

function toggleCustom10(el) {
	if ($(el).is(':checked')) {
		$('#custom_step10').show();
	} else {
		$('#custom_step10').hide();
	}
}

Form.prototype.customStep10 = function(name, label, measurement_question_id, frequency, haccp) {
	var html = '<label>' + label + '</label>';

	for (var i in haccp) {
		if (haccp.hasOwnProperty(i)) {
			if (i == 20) {
				html += '<input name="answers[' + i + ']" id="' + md5(name + i) + '" type="checkbox" value="' + i + '" onclick="toggleCustom10(this)">';
				html += '<label for="' + md5(name + i) + '">' + haccp[i] + '</label>';

				html += '<div id="custom_step10" style="display: none;">';
				html += '<label>How often will you make sushi</label>';

				for (var i in frequency) {
					if (frequency.hasOwnProperty(i)) {
						html += '<input name="frequency_id" id="' + md5(name + i + 'f') + '" type="radio" value="' + i + '">';
						html += '<label for="' + md5(name + i + 'f') + '">' + frequency[i] + '</label>';
					}
				}

				html += '<label for="frm_label_step10_date">' + $.t('general.start_date') + '</label>';

				html += '<input name="start_date" placeholder="Choose Date" id="frm_label_step10_date" type="date" />';

				html += '</div>';
			} else {
				html += '<input name="answers[' + i + ']" id="' + md5(name + i) + '" type="checkbox" value="' + i + '">';
				html += '<label for="' + md5(name + i) + '">' + haccp[i] + '</label>';
			}
		}
	}

	return html;
};

Form.prototype.customStep10V = function(name, label, measurement_question_id, frequency, haccp, values) {
	var html = '<label>' + label + '</label>';

	for (var i in haccp) {
		if (haccp.hasOwnProperty(i)) {
			if (i == 20) {
				if (values[i] != undefined) {
					html += '<input name="answers[' + i + ']" id="' + md5(name + i) + '" type="checkbox" value="' + i + '" onclick="toggleCustom10(this)" checked>';
					html += '<label for="' + md5(name + i) + '">' + haccp[i] + '</label>';
					html += '<div id="custom_step10" style="display: block;">';
				} else {
					html += '<input name="answers[' + i + ']" id="' + md5(name + i) + '" type="checkbox" value="' + i + '" onclick="toggleCustom10(this)">';
					html += '<label for="' + md5(name + i) + '">' + haccp[i] + '</label>';
					html += '<div id="custom_step10" style="display: none;">';
				}

				html += '<label>How often will you make sushi</label>';

				for (var i in frequency) {
					if (frequency.hasOwnProperty(i)) {
						html += '<input name="frequency_id" id="' + md5(name + i + 'f') + '" type="radio" value="' + i + '">';
						html += '<label for="' + md5(name + i + 'f') + '">' + frequency[i] + '</label>';
					}
				}

				html += '<label for="frm_label_step10_date">' + $.t('general.start_date') + '</label>';

				html += '<input name="start_date" placeholder="Choose Date" id="frm_label_step10_date" type="date" />';

				html += '</div>';
			} else {
				if (values[i] != undefined) {
					html += '<input name="answers[' + i + ']" id="' + md5(name + i) + '" type="checkbox" value="' + i + '" checked>';
				} else {
					html += '<input name="answers[' + i + ']" id="' + md5(name + i) + '" type="checkbox" value="' + i + '">';
				}
				html += '<label for="' + md5(name + i) + '">' + haccp[i] + '</label>';
			}
		}
	}

	return html;
};

Form.prototype.inputCancel = function(where) {
	var html = '<a data-role="button" data-theme="f" href="' + where + '" data-ajax="false">' + $.t('general.cancel_button') + '</a>';

	return html;
};

Form.prototype.slider = function(name, label, unit, min, max, val) {
	var html = '<label for="' + md5(label + name) + '">' + label + '</label>';

	html += '<input name="' + name + '" id="' + md5(label + name) + '" min="' + min + '" max="' + max + '" value="' + val + '" type="range">';

	return html;
};

function incClick(id, v) {
	var $e = $('#' + id);
	var a = parseInt($e.val()) + parseInt(v);
	if (a >= $e.data('min')) {
		$e.val(a);
	}
}

Form.prototype.clickIncrement = function(name, label, min, validation, value) {
	var html = '';

	html += '<legend>' + label + '</legend>';

	html += '<fieldset class="ui-grid-b">';
	html += '<div class="ui-block-a"><input name="' + name + '" type="text" value="' + (value != undefined ? value : min) + '" readonly="readonly" id="' + md5(name + label) + '" data-min="' + min + '"></div>';
	html += '<div class="ui-block-b"><button onclick="incClick(\'' + md5(name + label) + '\', \'1\');return false;"><i class="fa fa-plus"></i></button></div>';
	html += '<div class="ui-block-c"><button onclick="incClick(\'' + md5(name + label) + '\', \'-1\');return false;"><i class="fa fa-minus"></i></button></div>';
	html += '</fieldset>';

	return html;
};

var Form = new Form();

// beta testing playground

$(document).delegate('.ui-page', "pagebeforeshow", function(event, data) {
	from_page = data.prevPage.attr('id');
	if ($.mobile.activePage.attr('id') != undefined) {
		Page.init($.mobile.activePage.attr('id'));

		// add external files
		if ($.mobile.activePage.attr('id') == 'register_company' || $.mobile.activePage.attr('id') == 'tos') {
			$('#' + $.mobile.activePage.attr('id')).find('#global_header').load('_header_register.html', function() {
				$(this).find('h1').text($.t("page_title." + $.mobile.activePage.attr('id')));
				$('#' + $.mobile.activePage.attr('id')).trigger('pagecreate');
			});
		} else {
			$('#' + $.mobile.activePage.attr('id')).find('#global_header').load('_header.html', function() {
				$(this).find('h1').text($.t("page_title." + $.mobile.activePage.attr('id')));
				if ($('#' + $.mobile.activePage.attr('id')).data('head-buttons') == 'disable') {
					$(this).find('a').remove();
				}
				$('#' + $.mobile.activePage.attr('id')).trigger('pagecreate');
			});
		}

		// end add external files
	} else {
		//alert('boo');
	}
});

// panel load depending on user role
$(document).on("pagechange", function(event, data) {
	// add external files
	if (localStorage.getItem('role') == 'ROLE_EMPLOYEE') {
		var n = localStorage.getItem('user_name');
		if (n) {
			n = n.replace(/\+/g, ' ');
		} else {
			n = '';
		}
		$('#' + $.mobile.activePage.attr('id')).find('#menu_panel').load('_panel_employee.html', function() {
			bind_menuClick(this, n);
			$('#menu_panel').find('a[href^="' + data.toPage[0].id + '"]').addClass('active');
		});

	} else {
		var n = localStorage.getItem('user_name');
		if (n) {
			n = n.replace(/\+/g, ' ');
		} else {
			n = '';
		}
		$('#' + $.mobile.activePage.attr('id')).find('#menu_panel').load('_panel.html', function() {
			bind_menuClick(this, n);
			$('#menu_panel').find('a[href^="' + data.toPage[0].id + '"]').addClass('active');
		});
	}
	// end add external files
});

function openSignaturePopup() {
	window.scrollTo(0, 0);
	var sign_name = $('#sign_name').val();
	if (sign_name.replace(/\s/g, "") == "") {
		$('#sign_name').parent().parent().find('.validate_error').remove();
		$('#sign_name').parent().parent().append('<label class="validate_error">' + $.t('error.signature_name') + '</label>');
	} else {
		$('#sign_name').parent().parent().find('.validate_error').remove();
		$("#signature").html('');

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
		$sigdiv = $("#signature").jSignature();
		$sigdiv.jSignature("reset");

		/*align signature popup in middle of page*/
		var margin_top = ($('#signature_pop').height() - $("#signature").height() - 40 ) / 2;
		$('#signature-holder').css('margin-top', margin_top + 'px');
	}
}

function isEmpty(obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop))
			return false;
	}

	return true;
}

function bind_menuClick(t, n) {
	$(t).off("panelbeforeopen").on("panelbeforeopen", function(e) {
		if ($.mobile.activePage.attr('id') == 'haccp') {
			$('#confirmDevPopup').popup("close");
			mySwiper.swipePrev();
		}
		$('#swipebox-close').trigger("click");
	});

	$(t).find('ul').listview();
	$(".language").i18n();
	$("dl.jqm-nav a").off('click').on('click', function(e) {
		if(isOffline()){
			if(settings.excludeOffline.indexOf($(this).attr("href")) != -1){
				e.preventDefault();
		    	e.stopPropagation();
		    	noInternetError($.t("error.no_internet_for_sync"), null, $('span.language', this).text());
			}
		}
		
		if ($.mobile.activePage.attr('id') != 'register_edit' && $.mobile.activePage.attr('id') != 'haccp') {
			var swiper_slides = mySwiper.slides.length;
			for (var i = swiper_slides; i > 0; i--) {
				mySwiper.removeSlide(1);
			}
			_t = 'prev';
			mySwiper.swipeTo(0, 300, true);
			$('#menu_panel').panel("close");
			mySwiper.resizeFix();
		} else if ($.mobile.activePage.attr('id') == 'register_edit') {
			loadBackStep(0);
			_t = 'prev';
			mySwiper.swipeTo(0, 300, true);
			$('#menu_panel').panel("close");
			mySwiper.resizeFix();
		} else {
			if ($(this).attr('href') == "haccp.html") {
				e.preventDefault();
			}
			$('#menu_panel').panel("close");
			return;
		}
	});
	$(t).find('#panel_user_name').html(n);
	contactName = $(t).find('#contact_name');
	if (localStorage.getItem('contact_name') == null) {
		Page.apiCall('updateContactName', {
			'client' : User.client,
			'token' : User.lastToken
		}, 'get', 'updateContactName');
	} else {
		contactName.html(localStorage.getItem('contact_name'));
	}
	$(t).find('#app-version').html("IK-mat 2.0.10");
	displayOnline(isOffline());
}

function updateContactName(data) {
	if (data.contact_name) {
		localStorage.setItem('contact_name', data.contact_name);
		contactName.html(localStorage.getItem('contact_name'));
	}
}

function setSwiperMinHeight() {
	$('.swiper-slide-active').css('min-height', document.body.clientHeight - 80 + 'px');
}

var t0,
    t1;
var loadTime = 0;
var offline = false;
var lastSynced = 0;
function testInternetConnection() {
	if (loadTime == 0) {
		setInterval(function() {
			testConnection();
		}, this.settings.syncIntervals.connectionTestInterval);
	} else {
		console.log("not re test Connection");
	}
}

window.performance = (window.performance || {
	offset : Date.now(),
	now : function now() {
		return Date.now() - this.offset;
	}
});

function testConnection(callback) {
	if (navigator.onLine || (navigator.connection && navigator.connection.type != Connection.NONE)) {

		loadTime = 0;
		t0 = performance.now();
		//t0 = new Date().getTime();
		var img = new Image();
		img.src = this.settings.apiPath + '/' + this.settings.testImage + "?time=" + t0;
		var loadTime_comparision = this.settings.syncIntervals.loadTime;
		img.onload = function() {
			t1 = performance.now();
			//t1 = new Date().getTime();
			loadTime = t1 - t0;
			if (loadTime > loadTime_comparision) {
				offline = true;
			} else {
				offline = false;
				if (callback) {
					callback();
				}

			}
			displayOnline(offline || isOffline());
		};
		img.onerror = function(){
			offline = true;
			displayOnline(offline);
		};
		img = null;

	} else {
		offline = true;
		return false;
	}
}

function checkSync() {
	if (lastSynced == 0) {
		return true;
	}
	var sync_interval = performance.now() - lastSynced;
	if (sync_interval > this.settings.syncIntervals.tasks) {
		return true;
	} else {
		return false;
	}

}

function displayOnline(isOffline){
	if(isOffline){
		$("#app-online").removeClass("online");	
	}else{
		$("#app-online").addClass("online");
	}
}

function isOffline() {//check if application has internet connection
	// return true;
	if ((navigator.onLine || (navigator.connection && navigator.connection.type != Connection.NONE)) && offline == false) {
		return false;
	}
	return true;
}

function isNative() {
	return document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
}

function noInternetError(message, login, title) {
	if (login === undefined) {
		login = false;
	}

	$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	if(title){
		$('#alertPopup .page-name').html(title);
	}
	
	$('#alertPopup .alert-text').html(message);
	$('#alertPopup').off("popupafterclose").on("popupafterclose", function() {
		// if (login) {
			// //do nothing
		// } else {
			// Page.redirect('tasks.html');
		// }

	});
	$('#alertPopup').popup("open", {
		positionTo : 'window'
	});
	//setTimeout(function () {
	//    $('#alertPopup').popup( "open", {positionTo: 'window'})
	//}, 500);
}

function lockedError(message) {
	$('.overflow-wrapper').addClass('overflow-wrapper-hide');
	$('#alertPopup .page-name').html("Suspender");
	$('#alertPopup .alert-text').html(message || "locked");
	$('#alertPopup').off("popupafterclose").on("popupafterclose", function() {
		logout();
	});
	$('#alertPopup').popup("open", {
		positionTo : 'window'
	});
}

/*main sync query*/
function executeSyncQuery() {
	if (!isOffline()) {
		lastSynced = performance.now();

		d = db.getDbInstance("sync_query");
		d.query(function(doc, emit){
			if(doc.executed == 0){
				emit(doc);
			}
		},{}, function(err, results) {
			if(results){
				rows = results.total_rows;
				if (rows > 0) {
					_sync_data_rows = false;
					testConnection(sync_query);
				}
			}
				
		});
		// d.transaction(function(tx) {
			// tx.executeSql('SELECT * FROM "sync_query" WHERE "executed"=?', [0], function(tx, results) {
				// rows = results.rows.length;
				// if (rows > 0) {
					// _sync_data_rows = false;
					// testConnection(sync_query);
				// }
			// });
		// });
	}
}

function printPage() {

	var style = $('#page-wrap').find('style');
	if (style.length == 0) {
		$.get('assets/document/style.css', function(resp) {
			// resp now should contain your CSS file content.
			var css = '<style>' + resp + '</style>';
			$('#page-wrap').prepend(css);
			var page = document.getElementById('page-wrap');

			cordova.plugins.printer.print(page, {
				name : 'Document.html',
				landscape : true
			}, function() {
				//alert('printing finished or canceled')
			});
		});
	} else {
		var page = document.getElementById('page-wrap');
		cordova.plugins.printer.print(page, {
			name : 'Document.html',
			landscape : true
		}, function() {
			//alert('printing finished or canceled')
		});
	}
	return;
}


$(document).ajaxStart(function() {
	$('.swiper-slide').addClass('swiper-no-swiping');
	// Lock slide when ajax loading
	if ( typeof nextSlide != 'undefined') {
		nextSlide = false;
	}
	// Add a full size layer
	// var height = $(window).height();
	// var width = $(window).width();
	// if ( $('#loader-swapper').length == 0 ) {
	//     $('body').append( "<div class='loader-swapper' style='position:fixed;width:"+width+"px;height:"+height+"px;margin:0;background:transparent;z-index:1000;opacity:0.5;'></div>" );
	// }

	// $('.loader-swapper').on('tap taphold swipe click', function(e){
	//     // e.preventDefault();
	//     e.stopPropagation();
	//     alert('Data loading...! Please slow down operations!');
	// });
});

// // generic loader icon for ajax stop
$(document).ajaxStop(function() {
	$('.swiper-slide').removeClass('swiper-no-swiping');
	// Unlock slide when ajax loaded
	if ( typeof nextSlide != 'undefined') {
		nextSlide = true;
	}
	// Remove loading layer when ajax loaded
	// if ( $('.loader-swapper').length > 0 ) {
	//     $('.loader-swapper').remove();
	// }
});
