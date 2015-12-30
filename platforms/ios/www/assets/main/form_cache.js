function FormCache(){this.d=db.getDbInstance();this.templates={deviation:{title:"Avmeld avvik",form_fix_deviation:{deviation:function(a){return a.form_fix_deviation.deviation_description},initial_action:function(a){return a.form_fix_deviation.initial_action},deviation_date:{date:function(a){return a.form_fix_deviation.deviation_deadline},timezone_type:3,timezone:"Asia/Bangkok"},form:{responsible_fix_deviation:{type:"hidden",value:function(a){return a.form_fix_deviation.responsible_fix_deviation}},responsible_fix_deviation_id:{type:"hidden",value:function(a){return a.form_fix_deviation.employee_id}},correctional_measure:{label:"Korrigerende tiltak",type:"textarea",placeholder:"Beskriv hvilke korrigerende tiltak du har tatt for å rette avviket.",validation:["required","string"]},upload_photo:{label:"Ta eller last opp bilde",type:"file"},date_deviation_fix:{type:"date",label:"Dato for retting av avvik"}},deviation_photos:function(a){return a.form_fix_deviation.deviation_photos}},form_deviation:{task_id:{type:"hidden",value:""},deviation_description:{type:"textarea",label:"Avviksbeskrivelse",validation:["required","string"],value:""},initial_action:{type:"textarea",label:"Strakstiltak",validation:["required","string"]},upload_photo:{label:"Ta eller last opp bilde",type:"file"},employee_id:{type:"select",list:function(a){return a.form_fix_deviation.deviation_description},label:"Ansvarlig for tiltak",validation:["required","string"]},deviation_deadline:{type:"date",label:"Tidsfrist for tiltak",validation:["required","string"]},signature:{label:"Signatur",type:"signature",validation:["required","string"]}}}}}function executeForm(a,b){var c={};if("object"==typeof b)for(key in b)b.hasOwnProperty(key)&&("function"==typeof b[key]?c[key]=b[key](a):"object"==typeof b[key]?c[key]=executeForm(a,b[key]):c[key]=b[key]);return c}FormCache.prototype.getTemplate=function(a,b){b(this.templates[name])},FormCache.prototype.getPhotoFromDB=function(a,b){a&&this.d.transaction(function(c){c.executeSql('SELECT * FROM "sync_query" WHERE "extra"=? and "api"=?',[a.id,"uploadPhotos"],function(a,c){console.log(c);for(var d=[],e=0;e<c.rows.length;e++){var f=c.rows.item(e),g=JSON.parse(f.data),h=g.data||g.imageURI;d.push(h)}b(d)})})},FormCache.prototype.saveToTaskList=function(a,b,c){console.log("cache",b);var d=this.templates[a],e=this;this.getPhotoFromDB(b,function(f){b.form_fix_deviation&&(b.form_fix_deviation.deviation_photos=f);var g;b.form_deviation?(delete d.form_fix_deviation,g=$.extend(!0,d,b),console.log(g)):(delete d.form_deviation,g=executeForm(b,d)),console.log("formname",g),"deviation"==a&&e.insertTaskToDB(a,b.id,g,c)})},FormCache.prototype.insertTaskToDB=function(a,b,c,d){if(c){var e=new Date;this.d.transaction(function(f){var g=[];g=c.form_fix_deviation?[b,c.title,a,new Date(c.form_fix_deviation.deviation_date.date).getTime()>e.getTime(),JSON.stringify(c.form_fix_deviation.deviation_date),0,md5(JSON.stringify(c)),e.toISOString().substring(0,10),JSON.stringify(c)]:[b,c.title,a,!1,"",0,md5(JSON.stringify(c)),e.toISOString().substring(0,10),JSON.stringify(c)];var h='INSERT OR REPLACE INTO "tasks"("id","title","type", "overdue", "dueDate", "completed", "check", "date_start", "taskData") VALUES(?,?,?,?,?,?,?,?,?)';db.lazyQuery({sql:h,data:[g]},0,function(a){console.log("insert task",a),d(a,g)})})}};