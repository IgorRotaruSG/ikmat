function FormCache() {
	this.db = db.getDbInstance();
	this.templates = {
		"deviation" : {
			"form_fix_deviation" : {
				"deviation" : function(obj){
					return obj.results.initial_action;
				},
				"initial_action" : "Test",
				"deviation_date" : function(obj){
					return {
						"date" : obj.results.deviation_deadline,
						"timezone_type" : 3,
						"timezone" : "Asia\/Bangkok"
					};
				},
				"form" : {
					"responsible_fix_deviation" : {
						"type" : "hidden",
						"value" : "Nguyen Thao"
					},
					"responsible_fix_deviation_id" : {
						"type" : "hidden",
						"value" : function(obj){
							return obj.results.employee_id;
						}
					},
					"correctional_measure" : {
						"label" : "Korrigerende tiltak",
						"type" : "textarea",
						"placeholder" : "Beskriv hvilke korrigerende tiltak du har tatt for \u00e5 rette avviket.",
						"validation" : ["required", "string"]
					},
					"upload_photo" : {
						"label" : "Ta eller last opp bilde",
						"type" : "file"
					},
					"date_deviation_fix" : {
						"type" : "date",
						"label" : "Dato for retting av avvik"
					}
				},
				"deviation_photos" : function(obj){
					return "\u0022\u0022";
				}
			}
		}

	};
}


FormCache.prototype.getTemplate = function(request, callback) {
	callback(this.templates[name]);
};

FormCache.prototype.saveToTaskList = function(formname, data, callback) {
	console.log("cache", data);
	var template = this.templates[formname];
	var form = executeForm(data, template);
	console.log("form", form);
	callback(this.templates[name]);
};

function executeForm(data, template){
	var response = {};
	console.log("template", template);
	if(typeof template == 'object'){
		for(key in template){
			console.log("key:", key, template[key]);
			if(typeof template[key] == 'function'){
				response[key] = template[key](data);
				console.log("response", response);
			}else if(typeof template[key] == 'object'){
				response[key] = executeForm(data, template[key]);
			}else{
				response[key] = template[key];
			}
			console.log("response", response);
		}
	}
	return response;
}

function insertTaskToDB(object){
	if(object){
		this.d.transaction(function(tx) {
			tx.executeSql('SELECT "id","taskData" FROM "tasks" WHERE "type" != ? AND "type" != ? AND ( "taskData" IS NULL OR "taskData" = ?) ', ['maintenance','food_poision','undefined'], function (tx, results) {
            if (results.rows.length > 0 && !isOffline() ) {
                for (var i = 0; i < results.rows.length; i++) {
                    if ( results.rows.item(i).taskData === null || results.rows.item(i).taskData === '' || results.rows.item(i).taskData === 'undefined' ) {
                        emptytaskdata.push(results.rows.item(i).id);
                    }
                }
                findTaskData();
            } else {
                //$('#load_more_tasks').removeAttr('disabled');
                //$('#load_more_tasks').parent().find('.ui-btn-text').html($.t("general.load_more"));
            }
        });
		});
	}
}
