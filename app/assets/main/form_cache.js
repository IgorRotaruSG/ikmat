function FormCache() {
	var that = this;
	this.templates = {
		"deviation" : {
			"title" : $.t('tasks.deviation_fix'),
			"form_fix_deviation" : {
				"deviation" : function(obj) {
					return obj.deviation_description;
				},
				"initial_action" : function(obj) {
					return obj.initial_action;
				},
				"deviation_date" : {
					"date" : function(obj) {
						return obj.deviation_deadline;
					},
					"timezone_type" : 3,
					"timezone" : "Asia\/Bangkok"
				},
				"form" : {
					"responsible_fix_deviation" : {
						"type" : "hidden",
						"value" : function(obj) {
							for (var i = 0; i < obj.formData.employee_id.list.length; i++) {
								if (obj.formData.employee_id.list[i][obj.employee_id]) {
									return obj.formData.employee_id.list[i][obj.employee_id];
								}
							}
							return "";
						}
					},
					"responsible_fix_deviation_id" : {
						"type" : "hidden",
						"value" : function(obj) {
							return obj.employee_id;
						}
					},
					"correctional_measure" : {
						"label" : $.t('form_cache.correctional_measure_label'),
						"type" : "textarea",
						"placeholder" : $.t('form_cache.correctional_measure_placeholder'),
						"validation" : ["required", "string"],
						"value" : ""
					},
					"upload_photo" : {
						"label" : $.t('form_cache.upload_photo_label'),
						"type" : "file"
					},
					"date_deviation_fix" : {
						"type" : "date",
						"label" : $.t('form_cache.date_deviation_fix')
					}
				},
				"deviation_photos" : function(obj) {
					return obj.deviation_photos;
				}
			},
			"form_deviation" : {
				"task_id" : {
					"type" : "hidden",
					"value" : ""
				},
				"deviation_description" : {
					"type" : "textarea",
					"label" : $.t('form_cache.deviation_description'),
					"validation" : ["required", "string"],
					"value" : ""
				},
				"initial_action" : {
					"type" : "textarea",
					"label" : $.t('form_cache.initial_action'),
					"validation" : ["required", "string"]
				},
				"upload_photo" : {
					"label" : $.t('form_cache.upload_photo_label'),
					"type" : "file"
				},
				"employee_id" : {
					"type" : "select",
					"list" : function(obj) {
						return obj.deviation_description;
					},
					"label" : $.t('form_cache.employee_id_label'),
					"validation" : ["required", "string"]
				},
				"deviation_deadline" : {
					"type" : "date",
					"label" : $.t('form_cache.deviation_deadline_label'),
					"validation" : ["required", "string"]
				},
				"signature" : {
					"label" : $.t('form_cache.signature_label'),
					"type" : "signature",
					"validation" : ["required", "string"]
				}
			}

		},
		"maintenance" : {
			"title" : $.t('form_cache.maintenance_title'),
			"form_fix_deviation" : {
				"deviation" : function(obj) {
					return obj.deviation_description;
				},
				"initial_action" : function(obj) {
					return obj.initial_action;
				},
				"deviation_date" : {
					"date" : function(obj) {
						return obj.deviation_deadline;
					},
					"timezone_type" : 3,
					"timezone" : "Asia\/Bangkok"
				},
				"form" : {
					"responsible_fix_deviation" : {
						"type" : "hidden",
						"value" : function(obj) {
							for (var i = 0; i < obj.formData.employee_id.list.length; i++) {
								if (obj.formData.employee_id.list[i][obj.employee_id]) {
									return obj.formData.employee_id.list[i][obj.employee_id];
								}
							}
							return "";
						}
					},
					"responsible_fix_deviation_id" : {
						"type" : "hidden",
						"value" : function(obj) {
							return obj.employee_id;
						}
					},
					"correctional_measure" : {
						"label" : $.t('form_cache.correctional_measure_label'),
						"type" : "textarea",
						"placeholder" : $.t('form_cache.deviation_correctional_measure_placeholder'),
						"validation" : ["required", "string"],
						"value" : ""
					},
					"upload_photo" : {
						"label" : $.t('form_cache.upload_photo_label'),
						"type" : "file"
					},
					"date_deviation_fix" : {
						"type" : "date",
						"label" : $.t('form_cache.date_deviation_fix')
					}
				},
				"deviation_photos" : function(obj) {
					return obj.deviation_photos;
				}
			}

		},
		'food_poision' : {
			"title" : $.t('page_title.food_poison'),
			"form_fix_deviation" : {
				"Symptomer" : function(obj) {
					var result = "";
					for (var i = 0; i < obj.symptoms.length; i++) {
						result = result + obj.formData.symptoms.list[(i + 1)].label;
						if (i < obj.symptoms.length - 1) {
							result = result + " ";
						}
					}
					return result;
				},
				"Tid og dato for symptomer" : function(obj) {
					return obj.symptomsDateTime;
				},
				"Hvor lenge har symptomene vart" : function(obj) {
					return obj.symptom_days + ' ' + $.t('general.days') + ', ' + obj.symptom_hours + ' ' + $.t('report_html.report13_text8');
				},
				"Tid og dato for tilberedning av maten" : function(obj) {
					return obj.makingFoodDateTime;
				},
				"Hvem deltok i m\u00e5ltidet" : function(obj) {
					return obj.makingFoodTotalGuests + ' ' + $.t('form_cache.food_poision_total_visiter') + ', ' + obj.makingFoodSickGuests + ' ' + $.t('form_cache.food_poision_sick_guests');
				},
				"Hvilken mat ble laget" : function(obj) {
					return obj.makingFoodWhatFood;
				},
				"Mat spist tidligere denne dagen" : function(obj) {
					return obj.makingFoodEarlierEaten;
				},
				"Har gjesten kontaktet lege?" : function(obj) {
					return obj.guestTalkedDoctor ? $.t('booleans.yes') : $.t('booleans.no');
				},
				"Ingredienser" : function(obj) {
					return obj.ingredients;
				},
				"Nedkj\u00f8lt?" : function(obj) {
					return obj.cooledDown ? $.t('booleans.yes') : $.t('booleans.no');
				},
				"Oppvarmet igjen?" : function(obj) {
					return obj.reheated ? $.t('booleans.yes') : $.t('booleans.no');
				},
				"Holdt varmt?" : function(obj) {
					return obj.keptWarm ? $.t('booleans.yes') : $.t('booleans.no');
				},
				"Er det rester igjen for analyse?" : function(obj) {
					return obj.restLeftAnalysis ? $.t('booleans.yes') : $.t('booleans.no');
				},
				"Umiddelbare tiltak" : function(obj) {
					return obj.immediateMeasures;
				},
				"Annen informasjon" : function(obj) {
					return obj.otherComplaints;
				},
				"Kompensasjon til gjesten" : function(obj) {
					return obj.guestCompensation;
				},
				"form" : {
					"type" : {
						"type" : "hidden",
						"value" : "food_poison_fix"
					},
					"task_id" : {
						"type" : "hidden",
						"value" : ""
					},
					"responsible_fix_deviation" : {
						"type" : "hidden",
						"value" : function(obj) {
							for (var i = 0; i < obj.formData.employee_id.list.length; i++) {
								if (obj.formData.employee_id.list[i][obj.employee_id]) {
									return obj.formData.employee_id.list[i][obj.employee_id];
								}
							}
							return "";
						}
					},
					"responsible_fix_deviation_id" : {
						"type" : "hidden",
						"value" : function(obj) {
							return obj.employee_id;
						}
					},
					"correctionalMeasures" : {
						"type" : "textarea",
						"label" : $.t('form_cache.correctional_measure_label'),
						"validation" : ["string"]
					},
					"signature" : {
						"label" : $.t('form_cache.deviation_deadline_label'),
						"type" : "signature",
						"validation" : ["required", "string"]
					},
					"date_deviation_fix" : {
						"type" : "date",
						"label" : $.t('form_cache.date_deviation_fix'),
						"value" : function(obj) {
							return {
								"date" : new Date().toISOString().substring(0, 10),
								"timezone_type" : 3,
								"timezone" : "Asia\/Bangkok"
							};
						},
						"placeholder" : $.t('form_cache.date_deviation_fix')
					}
				}
			}
		}

	};
}

FormCache.prototype.getTemplate = function(request, callback) {
	callback(this.templates[name]);
};

FormCache.prototype.getPhotoFromDB = function(data, callback) {
	if (data) {
		db.getDbInstance('sync_query').query(function(doc, emit){
			if(doc.extra == data.id && doc.api == 'uploadPhotos'){
				emit(doc._id, doc.data);
			}
		}, function(error, results) {
			var photos = [];
			for (var i = 0; i < results.rows.length; i++) {
				var row = JSON.parse(results.rows[i].value);
				var image = row.data || row.imageURI;
				photos.push(image);
			}
			callback(photos);
		});
	}
};

FormCache.prototype.saveToTaskList = function(formname, data, callback) {
	var template = this.templates[formname];
	var that = this;
	this.getPhotoFromDB(data, function(photos) {
		if (data.form_fix_deviation) {
			data.form_fix_deviation.deviation_photos = photos;
		}
		db.getDbInstance('form_item').query(function(doc, emit){
			if(doc.type == formname){
				emit(doc._id, doc.form);
			}
		}, function(error, results) {
			console.log('error', error, results);
			if(error){
				callback(false);
				return;
			}
			var form;
			if (data.form_deviation) {
				delete template.form_fix_deviation;
				form = $.extend(true, template, data);
			} else {
				delete template.form_deviation;
				data.form_fix_deviation.formData = JSON.parse(results.rows[0].value);
				form = executeForm(data.form_fix_deviation, template);
			}
			if (formname == 'deviation' || formname == 'maintenance') {
				that.insertTaskToDB(formname, data.id, form, callback);
			};
		});

	});

};

FormCache.prototype.generateFoodPoisonTask = function(formname, data, callback) {
	var template = this.templates[formname];
	var that = this;
	db.getDbInstance('form_item').query(function(doc, emit){
			if(doc.type == formname){
				emit(doc._id, doc.form);
			}
	}, function(error, results) {
		if(error){
			callback(false);
			return;
		}
		if (data) {
			data.formData = JSON.parse(results.rows[0].value);
			form = executeForm(data, template);
			that.insertTaskToDB(formname, data.id, form, callback);
		}
	});

};

function executeForm(data, template) {
	var response = {};
	if ( typeof template == 'object') {
		for (key in template) {
			if (template.hasOwnProperty(key)) {
				if ( typeof template[key] == 'function') {
					response[key] = template[key](data);
				} else if ( typeof template[key] == 'object') {
					response[key] = executeForm(data, template[key]);
				} else {
					response[key] = template[key];
				}
			}
		}
	}
	return response;
}

FormCache.prototype.insertTaskToDB = function(formname, task_id, formtpl, callback) {
	if (formtpl) {
		var startDate = new Date();
		var db_data = [];
		if (formtpl.form_fix_deviation) {
			var dateStr = "";
			if (formtpl.form_fix_deviation.deviation_date) {
				dateStr = formtpl.form_fix_deviation.deviation_date.date;
			} else if (formtpl.form_fix_deviation.date_deviation_fix) {
				dateStr = formtpl.form_fix_deviation.date_deviation_fix.date;
			}
			db_data = [task_id, formtpl.title, formname, new Date(dateStr).getTime() > startDate.getTime(), JSON.stringify(dateStr), 0, md5(JSON.stringify(formtpl)), startDate.toISOString().substring(0, 10), JSON.stringify(formtpl)];
		} else {
			db_data = [task_id, formtpl.title, formname, false, "", 0, md5(JSON.stringify(formtpl)), startDate.toISOString().substring(0, 10), JSON.stringify(formtpl)];
		}
		db.lazyQuery('tasks', castToListObject(["id","title","type", "overdue", "dueDate", "completed", "check", "date_start", "taskData"], [db_data]), callback, db_data);
	}
};

