function FormCache() {
	this.d = db.getDbInstance();
	this.templates = {
		"deviation" : {
			"title": "Avmeld avvik",
			"form_fix_deviation" : {
				"deviation" : function(obj){
					return obj.results.deviation_description;
				},
				"initial_action" :  function(obj){
					return obj.results.initial_action;
				},
				"deviation_date" : {
					"date" : function(obj){
						return obj.results.deviation_deadline;
					},
					"timezone_type" : 3,
					"timezone" : "Asia\/Bangkok"
				},
				"form" : {
					"responsible_fix_deviation" : {
						"type" : "hidden",
						"value" : function(obj){
							return localStorage.getItem("contact_name");
						}
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
	data.results = JSON.parse(data.results);
	var template = this.templates[formname];
	var form = executeForm(data, template);
	console.log("formtpl", form);
	if(formname == 'deviation') {
		this.insertTaskToDB(formname, data.id, form, callback);
	};
	
};

function executeForm(data, template){
	var response = {};
	if(typeof template == 'object'){
		for(key in template){
			if(typeof template[key] == 'function'){
				console.log("key", key);
				response[key] = template[key](data);
			}else if(typeof template[key] == 'object'){
				response[key] = executeForm(data, template[key]);
			}else{
				response[key] = template[key];
			}
		}
	}
	return response;
}

FormCache.prototype.insertTaskToDB = function (formname, task_id, formtpl, callback){
	if(formtpl){
		var startDate = new Date();
		this.d.transaction(function(tx) {
			var db_data = [
			  task_id,
			  formtpl.title,
			  formname,
			  new Date(formtpl.form_fix_deviation.deviation_date.date).getTime() > startDate.getTime(),
			  JSON.stringify(formtpl.form_fix_deviation.deviation_date),
			  0,
			  md5(JSON.stringify(formtpl)),
			  startDate.toISOString().substring(0, 10),
			  JSON.stringify(formtpl)
          	];
            var q = 'INSERT OR REPLACE INTO "tasks"("id","title","type", "overdue", "dueDate", "completed", "check", "date_start", "taskData") VALUES(?,?,?,?,?,?,?,?,?)';
            db.lazyQuery({
                'sql': q,
                'data': [db_data],
            },0, function(data){
            	console.log("insert task", data);
            	callback(data);
            });
		});
	}
};
