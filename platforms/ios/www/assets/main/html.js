function HTML(){}function signMe(a){var b=localStorage.getItem("user_name");b=(b+"").replace(/\+/g," "),$("#"+a).val(b)}function onChangeSelectBox(a){$("#"+a).parent().find(".ui-btn-text").first().html($("#"+a+" option:selected").text())}function textEndEdit(a){var b=document.getElementsByClassName("validate_error");0==b.length&&$(".ui-btn-active").removeClass("ui-btn-active")}function preformRegisterSaveDBCheck(a,b){0==b.rows.length?a.executeSql('INSERT INTO "registration" ("step","data") VALUES (?,?)',[db_temp_data.step,JSON.stringify(db_temp_data.data)],function(){},db.dbErrorHandle):a.executeSql('UPDATE "registration" SET "data" =? WHERE "step" =?',[JSON.stringify(db_temp_data.data),db_temp_data.step],function(){},db.dbErrorHandle)}function preformRegisterSaveDB(a){a.executeSql('SELECT * FROM "registration" WHERE "step" = "'+db_temp_data.step+'"',[],preformRegisterSaveDBCheck,db.dbErrorHandle)}function validateEmail(a){var b=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return b.test(a)}function parseSvg(a){a.val(),new DOMParser;document.getElementById($(this).attr("id")).appendChild(dom.documentElement)}var db_temp_data={},haccp_image_id="";HTML.prototype.generateValidation=function(a){if(a&&void 0!=a&&void 0!=a.length){for(var b='data-validation="',c=0;c<a.length;c++)b+=a[c]+" ";return b=b.slice(0,-1),b+='" '}return""},HTML.prototype.formGenerate=function(a,b,c){void 0==c&&(c=!1);var d="",e=!1;for(var f in a)if(a.hasOwnProperty(f))switch(a[f].type){case"text":case"number":case"email":if("phone"==f)d+=this.phoneText([a.prefix.list,a[f].type],["prefix",f],[a.prefix.label,a[f].label],[a.prefix.placeholder,a[f].placeholder],[a.prefix.validation,a[f].validation],[a.prefix.value,a[f].value]);else{if(e=!1,a[f].validation)for(j=0;j<a[f].validation.length;j++){"required"==a[f].validation[j]&&(e=!0);break}d+=e?this.inputText(a[f].type,f,a[f].label+'<i class="requiredicon"> *</i>',a[f].placeholder,a[f].validation,a[f].value):this.inputText(a[f].type,f,a[f].label,a[f].placeholder,a[f].validation,a[f].value)}break;case"textarea":for(e=!1,j=0;j<a[f].validation.length;j++){"required"==a[f].validation[j]&&(e=!0);break}d+=e?this.textareaField(f,a[f].label+'<i class="requiredicon"> *</i>',a[f].placeholder,a[f].validation,a[f].value):this.textareaField(f,a[f].label,a[f].placeholder,a[f].validation,a[f].value);break;case"text_clicker":d+=this.textClicker(f,a[f].label,a[f]["default"],a[f].value);break;case"multiple_text":for(e=!1,j=0;j<a[f].validation.length;j++){"required"==a[f].validation[j]&&(e=!0);break}d+=e?this.multipleInput(f,a[f].label+'<i class="requiredicon"> *</i>',a[f].placeholder,a[f].validation,a[f].value):this.multipleInput(f,a[f].label,a[f].placeholder,a[f].validation,a[f].value);break;case"checkbox_list":d+=this.checkboxList(f,a[f].label,a[f].list);break;case"checkbox_list_labelfree":d+=this.checkboxListLabelFree(f,a[f].label,a[f].list);break;case"hidden":d+=this.inputHidden(f,a[f].value);break;case"multiple_color":d+=this.multipleColor(f,a[f].label,a[f].list);break;case"radio_list":d+=this.radioList(f,a[f].label,a[f].list,a[f].value,a[f].validation);break;case"date":d+=this.inputDate(f,a[f].label,a[f].placeholder,a[f].value,c);break;case"multiple_text_fridges":d+=this.inputFridge(f,a[f].label,a[f].placeholder,a[f].fields,a[f].value);break;case"multiple_text_dishwasher":d+=this.inputDishWasher(f,a[f].label,a[f].placeholder,a[f].fields,a[f].value);break;case"slider":d+=this.sliderInput(f,a[f].label,a[f].unit,a[f].interval.min,a[f].interval.max,a[f].deviation,a[f].value);break;case"select":"prefix"!=f&&(d+=this.selectBox(f,a[f].label,a[f].list,a[f].placeholder,a[f].validation,a[f].value));break;case"signature":d+=this.signature(f,a[f].label);break;case"file":d+=this.fileBox(f,a[f].label);break;case"checkboxFlowchartList":d+=this.checkboxFlowchartList(f,a[f].label,a[f].list);break;default:noInternetError($.t("error.unexpected"))}return void 0!=b&&""!=b&&(d+='<input type="submit" value="'+b+'" data-theme="d" />'),d},HTML.prototype.fileBox=function(a,b){haccp_image_id="image_"+md5(a+b);var c='<div data-role="controlgroup">';return!isNative(),isNative()?(c+='<a href="#" onclick="takeHACCPPicture(\'image_'+md5(a+b)+'\');" data-role="button" data-theme="e"><i class="fa fa-camera pull-left"></i>'+$.t("pictures.take")+"</a>",c+='<a href="#" onclick="selectHACCPPicture(\'image_'+md5(a+b)+'\');" data-role="button" data-theme="e"><i class="fa fa-file pull-left"></i>'+$.t("pictures.select")+"</a>"):(c+='<a href="#" onclick="selectHACCPPicture(\'image_'+md5(a+b)+'\');" data-role="button" class="border" data-theme="e"><i class="fa fa-file pull-left"></i>'+$.t("pictures.select")+"</a>",c+='<div class="hidden"><input type="file" id="take_picture" accept="image/*"></div>'),c+="</div>",c+='<img width="100%" height="auto" style="visibility:hidden;display:none;margin:0 auto;" id="image_'+md5(a+b)+'" src="" />'},HTML.prototype.signature=function(a,b){var c="<label>"+$.t("haccp.signature")+'</label><div class="ui-grid-a"><div class="ui-block-a"><input type="text" name="name" id="sign_name" placeholder="" class="ui-input-text ui-body-a"/></div><div class="ui-block-b"><input type="button" value="'+$.t("general.sign_button")+'" id="signature-trigger" data-position-to="window" /></div></div>';return c},HTML.prototype.selectBox=function(a,b,c,d,e,f){void 0==f&&(f="");var g='<label for="'+md5(a+b)+'" class="select">'+b+"</label>";g+='<select name="'+a+'" id="'+md5(a+b)+'" '+this.generateValidation(e)+" onchange=\"onChangeSelectBox('"+md5(a+b)+"')\">",void 0!=d&&""!=d&&(g+='<option value="-1">'+d+"</option>");for(var h in c)if(c.hasOwnProperty(h))if("object"==typeof c[h]){for(var i in c[h])break;var j="";i==f&&(j='selected="selected"'),g+='<option value="'+i+'" '+j+">"+c[h][i]+"</option>"}else{var j="";h==f&&(j='selected="selected"'),g+='<option value="'+h+'" '+j+">"+c[h]+"</option>"}return g+="</select>"},HTML.prototype.sliderInput=function(a,b,c,d,e,f,g){(void 0==g||"number"!=typeof g)&&(g=void 0!=f?f.ideal_min:0);var h='<label for="'+md5(b+a)+'">'+b;return void 0!=f&&(h+=" (<small>min:"+f.ideal_min+"/max:"+f.ideal_max+"</small>)"),h+="</label>",h+='<input name="'+a+'" id="'+md5(b+a)+'" min="'+d+'" max="'+e+'" value="'+g+'" type="range">'},HTML.prototype.formGenerateWill=function(a){var b="",c=md5((new Date).getTime()+"_form"),d=!1,e=$.extend({},a);for(var f in e)if("radio_list"==e[f].type){(null==e.frequency_id.value||"null"==e.frequency_id.value)&&(d=!0),console.log(e[f]),(""==e[f].label_tmp||null==e[f].label_tmp)&&(e[f].label_tmp=e[f].label),b+=HTML.formSwitch(e[f].label_tmp,c,d),e[f].label="Hvor ofte "+e[f].label_tmp.toLowerCase(),b+=d?'<div class="hide" id="'+c+'">':'<div id="'+c+'">',b+=this.formGenerate(e),b+="</div>";break}return b},HTML.prototype.formGenerateColors=function(a){""==a.answer.label&&(a.answer.label=a.answer.label_tmp);var b="",c=md5((new Date).getTime()+"_form_color"),d=a.answer.label,e=!0,f=a.answer.list;a.answer.label_tmp=a.answer.label,a.answer.label="";for(var g in f)if(f.hasOwnProperty(g)&&""!=f[g].value&&void 0!==f[g].value){e=!1;break}return b+=HTML.formSwitch(d,c,e),b+=e?'<div class="hide colorwill" id="'+c+'">':'<div class="colorwill" id="'+c+'">',b+=this.formGenerate(a),b+="</div>"},HTML.prototype.formSwitchChange=function(a){var b=$(a);"on"==b.val()?$("#"+b.attr("name")).removeClass("hide"):($("#"+b.attr("name")).addClass("hide"),$("#"+b.attr("name")).find('input[type="radio"]').each(function(){$(this).removeAttr("checked").checkboxradio("refresh")}),$("#"+b.attr("name")).find('input[name="frequency_id"]').attr("checked",!1).checkboxradio("refresh"),$("#"+b.attr("name")).find('input[type="date"]').val(""),$("#"+b.attr("name")).find('input[type="radio"][value="#ffffff"]').each(function(){$(this).attr("checked",!0).checkboxradio("refresh")}))},HTML.prototype.formSwitch=function(a,b,c){var d="<label>"+a+"</label>";return d+='<label for="'+md5(a+b)+'">'+$.t("booleans.yes")+"</label>",d+='<input type="radio" name="'+b+'" value="on" onchange="HTML.formSwitchChange(this);" id="'+md5(a+b)+'" '+(c?"":"checked")+" />",d+='<label for="'+md5(a)+'">'+$.t("booleans.no")+"</label>",d+='<input type="radio" name="'+b+'" value="off" onchange="HTML.formSwitchChange(this);" id="'+md5(a)+'" '+(c?"checked":"")+"/>"},HTML.prototype.inputDishWasherAdd=function(a,b){b=$.parseJSON(b.replace(/-s-/g,'"')),$el=$(a);var c=$el.parent().parent(),d=c.find(".ui-block-a").find("input").attr("name"),e=(c.find(".ui-block-a").find("input").attr("placeholder"),""),f=d.match(/(.*)?\[(.*?)\]\[(.*?)\]/),g=md5((new Date).getTime())+"_added",h=0,i=!0,j={0:"a",1:"b",2:"c"},k=$el.closest("form"),l=k.find('input[name="start_date"]').val();""!=l&&(l=new Date(l));var m=new Date;if(m>l){var n=m.getDate()<10?"0"+m.getDate():m.getDate(),o=m.getMonth()<9?"0"+(m.getMonth()+1):m.getMonth()+1,p=m.getFullYear()+"-"+o+"-"+n;k.find('input[name="start_date"]').val(p)}h=0,i=!0,e+="<div>";for(var q in b)b.hasOwnProperty(q)&&(i?(tmp={},tmp[f[1]+"["+q+"]["+g+"]"]=b[q],tmp[f[1]+"["+q+"]["+g+"]"].value="",tmp[f[1]+"["+q+"]["+g+"]"].placeholder=b[q].label_c,e+='<div class="ui-grid-a">',e+='    <div class="ui-block-a" style="width:80%;">',e+=HTML.formGenerate(tmp),e+="    </div>",e+='    <div class="ui-block-b" style="width:20%;">',e+='<a href="#" data-role="button" onclick="HTML.inputFridgeDel(this);"><i class="fa fa-minus"></i></a>',e+="    </div>",e+="</div>",e+='<div class="multiple_fridges_reformat_input">',e+='<div class="ui-grid-b">',i=!1):(tmp={},tmp[f[1]+"["+q+"]["+g+"]"]=b[q],tmp[f[1]+"["+q+"]["+g+"]"].value="",e+='   <div class="ui-block-'+j[h]+'">',e+=HTML.formGenerate(tmp),e+="   </div>",h++,3==h&&(e+="</div>",e+='<div class="multiple_fridges_reformat_input">',e+="<legend>Rinse Temperature</legend>",e+='<div class="ui-grid-b">',h=0)));e+="</div>",e+="</div>",e+="</div>",$(c.parent()).append(e).trigger("create")},HTML.prototype.inputDishWasher=function(a,b,c,d,e){var f,g=!0,h=!0,i=!0,j={0:"a",1:"b",2:"c"},k=0,l="<div>";if(l+='<div class="ui-grid-solo">',l+="        <label>"+b+"</label>",l+="</div>",void 0==e||"object"!=typeof e||0==e.length){var m=md5((new Date).getTime())+"_added";e={},e[m]={};for(var n in d)e[m][n]=""}for(var n in e)if(e.hasOwnProperty(n)){k=0,g=!0,l+="<div>";for(var o in d)d.hasOwnProperty(o)&&(e[n][o]=(e[n][o]+"").replace(/\+/g," "),g?(f={},f[a+"["+o+"]["+n+"]"]=d[o],f[a+"["+o+"]["+n+"]"].value=e[n][o],f[a+"["+o+"]["+n+"]"].label_c=d[o].label,f[a+"["+o+"]["+n+"]"].label="",l+='<div class="ui-grid-a">',l+='    <div class="ui-block-a" style="width:80%;">',l+=HTML.formGenerate(f),l+="    </div>",l+='    <div class="ui-block-b" style="width:20%;">',h?(l+='<a href="#" data-role="button" onclick="HTML.inputDishWasherAdd(this, \''+JSON.stringify(d).replace(/"/g,"-s-")+'\');"><i class="fa fa-plus"></i></a>',h=!1):l+='<a href="#" data-role="button" onclick="HTML.inputFridgeDel(this);"><i class="fa fa-minus"></i></a>',l+="    </div>",l+="</div>",l+='<div class="multiple_fridges_reformat_input">',l+='<div class="ui-grid-b">',g=!1):(f={},f[a+"["+o+"]["+n+"]"]=d[o],f[a+"["+o+"]["+n+"]"].value=e[n][o],l+='   <div class="ui-block-'+j[k]+'">',l+=HTML.formGenerate(f),l+="   </div>",k++,3==k&&i&&(l+="</div>",l+='<div class="multiple_fridges_reformat_input">',l+="<legend>Rinse Temperature</legend>",l+='<div class="ui-grid-b">',i=!1,k=0)));l+="</div>",l+="</div>",l+="</div>"}return l+="</div>"},HTML.prototype.inputFridgeDel=function(a){$(a).parent().parent().parent().remove()},HTML.prototype.inputFridgeAdd=function(a,b){b=$.parseJSON(b.replace(/-s-/g,'"')),$el=$(a);var c=$el.parent().parent(),d=c.find(".ui-block-a").find("input").attr("name"),e=(c.find(".ui-block-a").find("input").attr("placeholder"),""),f=d.match(/(.*)?\[(.*?)\]\[(.*?)\]/),g=md5((new Date).getTime())+"_added",h=0,i=!0,j={0:"a",1:"b",2:"c"},k=$el.closest("form"),l=k.find('input[name="start_date"]').val();""!=l&&(l=new Date(l));var m=new Date;if(m>l){var n=m.getDate()<10?"0"+m.getDate():m.getDate(),o=m.getMonth()<9?"0"+(m.getMonth()+1):m.getMonth()+1,p=m.getFullYear()+"-"+o+"-"+n;k.find('input[name="start_date"]').val(p)}e+="<div>";for(var q in b)b.hasOwnProperty(q)&&(i?(tmp={},tmp[f[1]+"["+q+"]["+g+"]"]=b[q],tmp[f[1]+"["+q+"]["+g+"]"].value="",tmp[f[1]+"["+q+"]["+g+"]"].placeholder=b[q].label_c,e+='<div class="ui-grid-a">',e+='    <div class="ui-block-a" style="width:80%;">',e+=HTML.formGenerate(tmp),e+="    </div>",e+='    <div class="ui-block-b" style="width:20%;">',e+='<a href="#" data-role="button" onclick="HTML.inputFridgeDel(this);"><i class="fa fa-minus"></i></a>',e+="    </div>",e+="</div>",e+='<div class="multiple_fridges_reformat_input">',e+='<div class="ui-grid-b">',i=!1):(tmp={},tmp[f[1]+"["+q+"]["+g+"]"]=b[q],tmp[f[1]+"["+q+"]["+g+"]"].value="",e+='   <div class="ui-block-'+j[h]+'">',e+=HTML.formGenerate(tmp),e+="   </div>",h++));e+="</div>",e+="</div>",e+="</div>",$(c.parent()).append(e).trigger("create")},HTML.prototype.inputFridge=function(a,b,c,d,e){var f,g=!0,h=!0,i={0:"a",1:"b",2:"c"},j=0,k="<div>";if(k+='<div class="ui-grid-solo">',""!=b&&(k+="<label>"+b+"</label>"),k+="</div>",void 0==e||"object"!=typeof e||0==e.length){var l=md5((new Date).getTime())+"_added";e={},e[l]={};for(var m in d)e[l][m]=""}for(var m in e)if(e.hasOwnProperty(m)){j=0,g=!0,k+="<div>";for(var n in d)d.hasOwnProperty(n)&&(e[m][n]=(e[m][n]+"").replace(/\+/g," "),g?(f={},f[a+"["+n+"]["+m+"]"]=d[n],f[a+"["+n+"]["+m+"]"].value=e[m][n],f[a+"["+n+"]["+m+"]"].label_c=d[n].label,f[a+"["+n+"]["+m+"]"].label="",k+='<div class="ui-grid-a">',k+='    <div class="ui-block-a" style="width:80%;">',k+=HTML.formGenerate(f),k+="    </div>",k+='    <div class="ui-block-b" style="width:20%;">',h?(k+='<a href="#" data-role="button" onclick="HTML.inputFridgeAdd(this, \''+JSON.stringify(d).replace(/"/g,"-s-")+'\');"><i class="fa fa-plus"></i></a>',h=!1):k+='<a href="#" data-role="button" onclick="HTML.inputFridgeDel(this);"><i class="fa fa-minus"></i></a>',k+="    </div>",k+="</div>",k+='<div class="multiple_fridges_reformat_input">',k+='<div class="ui-grid-b">',g=!1):(f={},f[a+"["+n+"]["+m+"]"]=d[n],f[a+"["+n+"]["+m+"]"].value=e[m][n],k+='   <div class="ui-block-'+i[j]+'">',k+=HTML.formGenerate(f),k+="   </div>",j++));k+="</div>",k+="</div>",k+="</div>"}return k+="</div>"},HTML.prototype.inputDate=function(a,b,c,d,e,f){var g,h="",i="";if(void 0==c&&(c=""),null==d||isEmpty(d))if(void 0!=e&&e){var j=new Date,k=j.getMonth();if(11==k){k=0;var l=j.getFullYear()+1;g=new Date(l,k,j.getDate())}else k++,g=new Date(j.getFullYear(),k,j.getDate())}else g=new Date;else g=new Date(d);var m=g.getMonth(),n=g.getDate();if(m=9>m?"0"+(parseInt(g.getMonth())+1):parseInt(g.getMonth())+1,10>n&&(n="0"+g.getDate()),i=g.getFullYear()+"-"+m+"-"+n,""!=b&&(h+='<label for="frm_label_'+md5(a+b)+'">'+b+"</label>"),"NaN-NaN-NaN"==i){var o=new Date,p=o.getDate(),q=o.getMonth()+1,r=o.getFullYear();10>p&&(p="0"+p),10>q&&(q="0"+q),i=r+"-"+q+"-"+p}return h+='<input name="'+a+'" placeholder="'+c+'" id="frm_label_'+md5(a+b)+'" type="date" value="'+i+'" '+this.generateValidation(f)+" />"},HTML.prototype.radioList=function(a,b,c,d,e){void 0==b&&(b="");var f="<label>"+b+"</label>";for(var g in c)c.hasOwnProperty(g)&&(f+='<input name="'+a+'" id="'+md5(a+g)+'" type="radio" value="'+g+'"'+this.generateValidation(e),f+=null!=d&&d==g?' checked="checked" />':"/>",f+='<label for="'+md5(a+g)+'">'+c[g]+"</label>");return f},HTML.prototype.multipleColor=function(a,b,c){var d='<hr class="no-lateral-border"/>';d+="<label>"+b+"</label>";var e={};e[$.t("colors.red")]="#ff0000",e[$.t("colors.green")]="#008000",e[$.t("colors.blue")]="#0000ff",e[$.t("colors.white")]="#ffffff",e[$.t("colors.pink")]="#FF1493",e[$.t("colors.brown")]="#A52A2A",e[$.t("colors.yellow")]="#ffff00";for(var f in c)if(c.hasOwnProperty(f)){d+='<label style="margin-top:10px;">'+c[f].label+"</label>";for(var g in e)e.hasOwnProperty(g)&&(d+='<input name="'+a+"["+f+']" id="'+md5(f+g)+'" type="radio" value="'+e[g]+'"',d+=null!=c[f].value&&c[f].value.toUpperCase()==e[g].toUpperCase()?' checked="checked" />':"/>",d+='<label for="'+md5(f+g)+'"><i class="fa fa-square" style="color:'+e[g]+';"></i> '+g+"</label>")}return d},HTML.prototype.inputHidden=function(a,b){return'<input type="hidden" name="'+a+'" value="'+b+'" />'},HTML.prototype.showCheckboxChild=function(a,b){$(a).is(":checked")?$("#"+b).removeClass("hide"):$("#"+b).addClass("hide")},HTML.prototype.checkboxList=function(a,b,c){if(""==b)var d='<hr class="no-lateral-border" />';else var d="<label>"+b+"</label>";for(var e in c)if(c.hasOwnProperty(e)){if(d+='<input name="'+a+"["+e+']" id="'+md5(a+e)+'" type="checkbox" value="'+e+'"',(c[e].checked||"true"==c[e].checked)&&(d+=' checked="checked"'),void 0!=c[e].condition){var f=md5((new Date).getTime()+"name");switch(c[e].condition){case"if_checked":d+=" onclick=\"HTML.showCheckboxChild(this, '"+f+"')\""}}d+=" />",d+='<label for="'+md5(a+e)+'">'+c[e].label+"</label>",void 0!=c[e].condition&&void 0!=c[e].extra&&(d+='<div id="'+f+'" style="margin:10px 20px;"',void 0!=c[e].checked&&c[e].checked&&"false"!=c[e].checked||(d+='class="hide">'),d+=HTML.formGenerate(c[e].extra),d+="</div>")}return d},HTML.prototype.checkboxFlowchartList=function(a,b,c){if(""==b)var d='<hr class="no-lateral-border" />';else var d='<div class="ui-grid-solo"><label>'+b+"</label></div>";for(var e in c)if(c.hasOwnProperty(e)){if(d+='<div class="ui-checkbox-off ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-a"><input class="flowchart-checkbox" name="'+a+"["+e+']" id="'+md5(a+e)+'" type="checkbox" value="'+e+'"',(c[e].checked||"true"==c[e].checked)&&(d+=' checked="checked"'),void 0!=c[e].condition){var f=md5((new Date).getTime()+"name");switch(c[e].condition){case"if_checked":d+=" onclick=\"HTML.showCheckboxChild(this, '"+f+"')\""}}d+=" />",d+='<label class="flowchart-label" for="'+md5(a+e)+'"></label>',d+='<span class="ui-btn-inner flowchart-viewimg" onclick="javascript:HTML.showFlowchartImg(\''+c[e].imgPath+'\')"><span class="ui-btn-text">'+c[e].label+'</span><span class="ui-icon ui-icon-checkbox-on ui-icon-shadow">&nbsp;</span></span>',d+='</div><div class="clearboth"></div>',void 0!=c[e].condition&&void 0!=c[e].extra&&(d+='<div id="'+f+'" style="margin:10px 20px;"',void 0!=c[e].checked&&c[e].checked&&"false"!=c[e].checked||(d+='class="hide">'),d+=HTML.formGenerate(c[e].extra),d+="</div>")}return d},HTML.prototype.showFlowchartImg=function(a){html='<a id="backToFlowchartList" onclick="HTML.backToFlowchartList();" ><span class="ui-btn-inner"><span class="ui-btn-text"><i class="fa fa-close"></i></span></span></a>',html+="<img class='flowchart-img' style='max-height: "+mySwiper.height+"px; max-width: "+mySwiper.width+"px' src='"+settings.apiPath+a+"' />",mySwiper.disableKeyboardControl(),mySwiper.insertSlideAfter(mySwiper.activeIndex,html,"swiper-slide"),mySwiper.swipeTo(mySwiper.activeIndex+1,0,!1),mySwiper.reInit(),$("#footer").hide()},HTML.prototype.backToFlowchartList=function(a){mySwiper.enableKeyboardControl(),mySwiper.swipeTo(mySwiper.activeIndex-1,0,!1),mySwiper.removeSlide(parseInt(mySwiper.activeIndex)+1),mySwiper.reInit(),$("#footer").show()},HTML.prototype.checkboxListLabelFree=function(a,b,c){if(""==b)var d='<hr class="no-lateral-border" />';else var d="<label>"+b+"</label>";var d='<label><a href="#tos" id="tos">Ved å registrere deg  bekrefter du å ha lest og akseptert brukervilkårene.</a></label>';return d},HTML.prototype.multipleInputDel=function(a){$(a).parent().parent().remove()},HTML.prototype.multipleInputAdd=function(a){$el=$(a);var b=$el.parent().parent(),c=b.find(".ui-block-a").find("input").attr("name"),d=b.find(".ui-block-a").find("input").attr("placeholder"),e="",f=c.match(/(.*)?\[(.*?)\]/),g=md5((new Date).getTime())+"_added";e+='<fieldset class="ui-grid-a new-added">',e+='    <div class="ui-block-a" style="width:80%;">',e+='        <input name="'+f[1]+"["+g+']"  type="text" data-validation="string" value="" placeholder="'+d+'"/>',e+="    </div>",e+='    <div class="ui-block-b" style="width:20%;">',e+='        <a href="#" data-role="button" onclick="HTML.multipleInputDel(this);"><i class="fa fa-minus"></i></a>',e+="    </div>",e+="</fieldset>",$(b.parent()).append(e).trigger("create"),$(".new-added:last input").focus()},HTML.prototype.multipleInput=function(a,b,c,d,e){var f="<div>",g=!0;if(f+='<div class="ui-grid-solo">',void 0!=b&&(f+="<label>"+b+"</label>"),f+="</div>",void 0==e||"object"!=typeof e||0==e.length){var h=md5((new Date).getTime())+"_added";e={},e[h]=""}for(var i in e)e.hasOwnProperty(i)&&(e[i]=e[i].replace(/\+/g," "),f+='<fieldset class="ui-grid-a">',f+='    <div class="ui-block-a" style="width:80%;">',f+='        <input tabindex="-1" name="'+a+"["+i+']" value="'+e[i]+'" type="text" placeholder="'+c+'"',f+=this.generateValidation(d)+"/>",f+="    </div>",f+='    <div class="ui-block-b" style="width:20%;">',g?(f+='        <a tabindex="-1" href="#" data-role="button" onclick="HTML.multipleInputAdd(this);"><i class="fa fa-plus"></i></a>',g=!1):f+='        <a tabindex="-1" href="#" data-role="button" onclick="HTML.multipleInputDel(this);"><i class="fa fa-minus"></i></a>',f+="    </div>",f+="</fieldset>");return f+="</div>"},HTML.prototype.incClick=function(a,b){var c=$("#"+a),d=parseInt(c.val());isNaN(d)&&(d=0);var e=d+parseInt(b);e>=c.data("min")&&c.val(e)},HTML.prototype.textClicker=function(a,b,c,d){console.log("textClicker"),console.log(a,b,c,d);var e="";return e+="<label>"+b+"</label>",e+='<fieldset class="ui-grid-b">',e+='<div class="ui-block-a"><input tabindex="-1" name="'+a+'" type="tel" value="'+(void 0!=d?d:c)+'"  id="'+md5(a+b)+'" data-min="0"></div>',e+='<div class="ui-block-b"><button tabindex="-1" onclick="HTML.incClick(\''+md5(a+b)+"', '1');return false;\"><i class=\"fa fa-plus\"></i></button></div>",e+='<div class="ui-block-c"><button tabindex="-1" onclick="HTML.incClick(\''+md5(a+b)+"', '-1');return false;\"><i class=\"fa fa-minus\"></i></button></div>",e+="</fieldset>"},HTML.prototype.textareaField=function(a,b,c,d,e){void 0!=e&&(e=e.replace(/\+/g," ")),void 0==b&&(b=""),void 0==c&&(c="");var f='<label for="frm_label_'+md5(a+b)+'">'+b+"</label>";return f+='<textarea tabindex="-1" name="'+a+'" placeholder="'+c+'" id="frm_label_'+md5(a+b)+'" onblur="textEndEdit()"'+this.generateValidation(d)+">"+(void 0!=e?e:"")+"</textarea>"},HTML.prototype.inputText=function(a,b,c,d,e,f){if(void 0==f&&(f=""),"email"!=b&&(f=f.replace(/\+/g," ")),void 0==d&&(d=""),void 0==c){c="";var g=""}else if(""!=c)var g='<label for="frm_label_'+md5(b+c)+'">'+c+"</label>";else var g="";return"number"==a&&(a="tel"),g+='<input tabindex="-1" type="'+a+'" name="'+b+'" value="'+f+'" placeholder="'+d+'" id="frm_label_'+md5(b+c)+'" '+this.generateValidation(e)+"/>"},HTML.prototype.phoneText=function(a,b,c,d,e,f){var g='<div class="ui-grid-a"><div class="ui-block-a" style="width:40%; margin-left: 0;">';return g+=this.selectBox(b[0],c[0]+'<i class="requiredicon"> *</i>',a[0],d[0],e[0],f[0]),g+='</div><div class="ui-block-b" style="width:60%">',g+=this.inputText("tel",b[1],' <i style="color: #fff;"> *</i>',d[1],e[1],f[1]),g+="</div>",g+="</div>"},HTML.prototype.getFormValues=function(a){var b,c,d,e=$(a).find("form").serialize(),f={},g=[];g=e.split("&");for(var h=0;h<g.length;h++)g[h]=decodeURIComponent(g[h]),c=g[h].split("="),c[1]=decodeURIComponent(c[1]),-1!=c[0].indexOf("[")?-1!=c[0].indexOf("fridge")||-1!=c[0].indexOf("dishwasher")?(d=c[0].match(/(.*)?\[(.*?)\]\[(.*?)\]/),void 0==f[d[1]]&&(f[d[1]]={}),void 0==f[d[1]][d[3]]&&(f[d[1]][d[3]]={}),f[d[1]][d[3]][d[2]]=c[1]):(b=c[0].match(/(.*)?\[(.*?)\]/),void 0==f[b[1]]&&(f[b[1]]={}),f[b[1]][b[2]]=c[1]):f[c[0]]=c[1];return f},HTML.prototype.getStepData=function(a,b,c){var d,e,f=jQuery.extend({},b);if(1==a)e=f.registration_steps.form1,d="form1";else if(2==a)e=f.registration_steps.form1_1,d="form1_1";else for(var g in f.registration_steps)if(f.registration_steps.hasOwnProperty(g)&&"aux"!=g){e=f.registration_steps[g],d=g;break}for(var h in e)switch(e[h].type){case"text":case"number":case"email":case"textarea":case"text_clicker":case"multiple_text":case"hidden":case"select":case"radio_list":case"date":case"multiple_text_fridges":case"checkboxFlowchartList":case"multiple_text_dishwasher":e[h].value=c[h];break;case"checkbox_list":for(var i in c[h])c[h].hasOwnProperty(i)&&e[h].list[c[h][i]]&&(e[h].list[c[h][i]].checked=!0);break;case"multiple_color":for(var i in c[h])c[h].hasOwnProperty(i)&&(e[h].list[i].value=c[h][i]);break;default:noInternetError($.t("error.unexpected"))}f.registration_steps={},f.registration_steps[d]=e,this.preformRegisterSave(a,f)},HTML.prototype.preformRegisterSave=function(a,b){db_temp_data={step:a,data:b};var c=db.getDbInstance();c.transaction(preformRegisterSaveDB,c.dbErrorHandle)},jQuery.fn.extend({matchValidateRules:function(a){var b,c,d,e=!0,f=!0,g=!1,h=!1,i=!1,j=!1;return this.each(function(){for(b=$(this).data("validation").split(" "),f=!0,c=0;c<b.length;c++)switch(b[c]){case"required":$(this).is("select")?-1==$(this).val()&&(f=!1,$(this).off("change").on("change",function(){$(this).matchValidateRules()})):0==$(this).val().trim().length&&(f=!1,$(this).off("change keyup").on("change keyup",function(){$(this).matchValidateRules()}));break;case"number":parseInt($(this).val())!=$(this).val()?(f=!1,h=!0):"phone"==$(this).attr("name")&&($(this).val().length<5?(f=!1,h=!0):(f=!0,h=!1));break;case"string":if("string"!=typeof $(this).val()&&(f=!1),"city"==$(this).attr("name")){var k=/^[A-Z a-z 0-9 ÆØÅ æøå &*)(+.,_-]*$/,l=$(this).val();console.log(l),k.test(l)||(i=!0,f=!1)}if(-1!=$(this).attr("name").indexOf("fridges[name]")){var l=$(this).val().toLowerCase(),m=$(this).attr("id");$("input[type=text]").each(function(){0!=m.localeCompare($(this).attr("id"))&&0==$(this).val().toLowerCase().localeCompare(l)&&(j=!0,f=!1)})}if(-1!=$(this).attr("name").indexOf("internal_audit_participant")){var l=$(this).val().toLowerCase(),n=$(this).attr("name"),o=$(":input");o.each(function(){var a=$(this).attr("name");"undefined"!=typeof a&&a!==!1&&-1!=$(this).attr("name").indexOf("internal_audit_participant")&&(console.log($(this).attr("name"),$(this).val()),0!=n.localeCompare($(this).attr("name"))&&0==$(this).val().toLowerCase().localeCompare(l)&&(j=!0,f=!1))})}break;case"email":validateEmail($(this).val())||(f=!1,g=!0);break;case"required_group_fridge":if("radio"==$(this).attr("type")){var p=$(this).closest("form"),q=p.find("input").first(),r=p.find('input[name="'+$(this).attr("name")+'"]'),s=r.index($(this));1==s&&q.val().length>0&&(r.is(":checked")||(f=!1))}else{var t=$(this).attr("name").match(/(.*)?\[(.*?)\]\[(.*?)\]/),u=$('input[name="'+t[1]+"[name]["+t[3]+']"]');u.val().length>0&&0==$(this).val().length&&(f=!1,$(this).off("change keyup").on("change keyup",function(){$(this).matchValidateRules()}))}}"undefined"==typeof a?($("#"+$(this).attr("id")+"_validate").remove(),f||(e=!1,g?(g=!1,d=$.t("error.validation_email")):h?(h=!1,d=$.t("error.validation_number")):i?(i=!1,d=$.t("Spesialtegn og siffer kan ikke skrives i dette feltet")):j?(j=!1,d=$.t("Dette navnet er allerede i bruk. Alle navn må være unike.")):d=$.t("error.validation"),$(this).is("select")?$('<label id="'+$(this).attr("id")+'_validate" class="validate_error">'+d+"</label>").insertAfter($(this).parent().parent()):$(this).is("input")?"radio"==$(this).attr("type")?$('<label id="'+$(this).attr("id")+'_validate" class="validate_error">'+d+"</label>").insertAfter(r.last().parent()):$('<label id="'+$(this).attr("id")+'_validate" class="validate_error">'+d+"</label>").insertAfter($(this).parent()):$(this).is("textarea")?$('<label id="'+$(this).attr("id")+'_validate" class="validate_error">'+d+"</label>").insertAfter($(this)):$(this).css("border","1px solid red;"))):(e=!1,$(this).off("change").on("change keyup",function(){$(this).matchValidateRules()}))}),console.log("Valid:",e),e}}),HTML.prototype.validate=function(a,b){var c=$(a);return c.find("[data-validation]").matchValidateRules(b)};var HTML=new HTML;