var db_temp_data = {};
var haccp_image_id = '';

function HTML() {
}

HTML.prototype.generateValidation = function(rules) {
    if (!rules || rules == undefined || rules.length == undefined) {
        return '';
    } else {
        var r = 'data-validation="';
        for (var i=0;i<rules.length;i++) {
            r += rules[i] + ' ';
        }
        r = r.slice(0, -1);
        r += '" ';
        return r;
    }
};

HTML.prototype.formGenerate = function(form_data, s, d) {
    if (d == undefined) {
        d = false;
    }

    var html = '';
    var isRequired = false;


    for (var i in form_data) {
        if (form_data.hasOwnProperty(i)) {
            switch (form_data[i].type) {
                case 'text':
                case 'number':
                case 'email':
                    /* Logic exception that appeared after initial specs and
                    we needed to add an exception so the phone number will also list a country prefix dropdown
                    */
                    if (i == 'phone') {
                        html += this.phoneText(
                            [form_data['prefix'].list,form_data[i].type],
                            ['prefix',i],
                            [form_data['prefix'].label,form_data[i].label],
                            [form_data['prefix'].placeholder,form_data[i].placeholder],
                            [form_data['prefix'].validation,form_data[i].validation],
                            [form_data['prefix'].value,form_data[i].value]
                        );

                    }else{
                        isRequired = false;
                        if(form_data[i].validation) {
                            for (j=0;j<form_data[i].validation.length;j++) {
                                if(form_data[i].validation[j] == "required")
                                    isRequired = true;
                                break;
                            }
                        }
                        if(isRequired){
                            html += this.inputText(form_data[i].type, i, form_data[i].label + "<i class=\"requiredicon\"> *</i>", form_data[i].placeholder, form_data[i].validation, form_data[i].value);
                        } else {
                             html += this.inputText(form_data[i].type, i,form_data[i].label, form_data[i].placeholder, form_data[i].validation, form_data[i].value);
                        }
                    }
                    break;
                case 'textarea':
                    isRequired = false;

                    for (j=0;j<form_data[i].validation.length;j++) {
                        if(form_data[i].validation[j] == "required")
                            isRequired = true;
                            break;
                    }
                    if (isRequired) {
                                            html += this.textareaField(i, form_data[i].label + "<i class=\"requiredicon\"> *</i>", form_data[i].placeholder, form_data[i].validation, form_data[i].value);
                    } else {
                                            html += this.textareaField(i, form_data[i].label, form_data[i].placeholder, form_data[i].validation, form_data[i].value);
                    }
                    break;
                case 'text_clicker':
                    html += this.textClicker(i, form_data[i].label, form_data[i].default, form_data[i].value);
                    break;
                case 'multiple_text':
 					isRequired = false;

                    for (j=0;j<form_data[i].validation.length;j++) {
                        if(form_data[i].validation[j] == "required")
                            isRequired = true;
                        break;
                    }
                    if(isRequired) {
                         html += this.multipleInput(i, form_data[i].label + "<i class=\"requiredicon\"> *</i>", form_data[i].placeholder, form_data[i].validation, form_data[i].value);
                    }else {
                      html += this.multipleInput(i, form_data[i].label,form_data[i].placeholder, form_data[i].validation, form_data[i].value);
                    }
                    break;
                case 'checkbox_list':
                    html += this.checkboxList(i, form_data[i].label, form_data[i].list);
                    break;
                case 'checkbox_list_labelfree':
                    html += this.checkboxListLabelFree(i, form_data[i].label, form_data[i].list);
                    break;
                case 'hidden':
                    html += this.inputHidden(i, form_data[i].value);
                    break;
                case 'multiple_color':
                    html += this.multipleColor(i, form_data[i].label, form_data[i].list);
                    break;
                case 'radio_list':
                    html += this.radioList(i, form_data[i].label, form_data[i].list, form_data[i].value, form_data[i].validation);
                    break;
                case 'date':
                    html += this.inputDate(i, form_data[i].label, form_data[i].placeholder, form_data[i].value, d);
                    break;
                case 'multiple_text_fridges':
                    html += this.inputFridge(i, form_data[i].label, form_data[i].placeholder, form_data[i].fields, form_data[i].value);
                    break;
                case 'multiple_text_dishwasher':
                    html += this.inputDishWasher(i, form_data[i].label, form_data[i].placeholder, form_data[i].fields, form_data[i].value);
                    break;
                case 'slider':
                    html += this.sliderInput(i, form_data[i].label, form_data[i].unit, form_data[i].interval.min, form_data[i].interval.max, form_data[i].deviation, form_data[i].value);
                    //html += this.sliderInput(i, form_data[i].label, form_data[i].unit, form_data[i].interval.min, form_data[i].interval.max, form_data[i].deviation, form_data[i].value, form_data[i].interval.ideal_min, form_data[i].interval.ideal_max, form_data[i].interval.interval_min, form_data[i].interval.interval_max;
                    break;
                case 'select':
                    /* Logic exception that appeared after initial specs and
                     we needed to add an exception so the prefix dropdown not to be listed twice
                     */
                    if(i!= 'prefix'){
                        html += this.selectBox(i, form_data[i].label, form_data[i].list, form_data[i].placeholder, form_data[i].validation,form_data[i].value);
                    }
                    break;
                case 'signature':
                    html += this.signature(i, form_data[i].label);
                    break;
                case 'file':
                    html += this.fileBox(i, form_data[i].label);
                    break;
                case 'checkboxFlowchartList':
                    html += this.checkboxFlowchartList(i, form_data[i].label, form_data[i].list);
                    break;
                default:
                    noInternetError($.t("error.unexpected"));
                    break;
            }
        }
    }
    if (s != undefined && s != '') {
        html += '<input type="submit" value="' + s + '" data-theme="d" />';
    }
    return html;
};

HTML.prototype.fileBox = function(name, label) {
    haccp_image_id = 'image_' + md5(name+label);
    var html = '<div data-role="controlgroup">';
    if(!isNative()){

    }
    if(isNative()){
    	html += '<a href="#" onclick="takeHACCPPicture(\'image_' + md5(name+label) + '\');" data-role="button" data-theme="e"><i class="fa fa-camera pull-left"></i>' + $.t('pictures.take') + '</a>';
    	html += '<a href="#" onclick="selectHACCPPicture(\'image_' + md5(name+label) + '\');" data-role="button" data-theme="e"><i class="fa fa-file pull-left"></i>' + $.t('pictures.select') + '</a>';
    }else{
    	html += '<a href="#" onclick="selectHACCPPicture(\'image_' + md5(name+label) + '\');" data-role="button" class="border" data-theme="e"><i class="fa fa-file pull-left"></i>' + $.t('pictures.select') + '</a>';
   html += '<div class="hidden"><input type="file" id="take_picture" accept="image/*"></div>';
    }

    html += '</div>';

    html += '<img width="100%" height="auto" style="visibility:hidden;display:none;margin:0 auto;" id="image_' + md5(name+label) + '" src="" />';

    return html;
};

function signMe(where) {
    var sig = localStorage.getItem('user_name');

    sig = (sig + '').replace(/\+/g,' ');

    $('#' + where).val(sig);
}

HTML.prototype.signature = function(name, label) {
    /*var id = md5(new Date().getTime());
    var html = '<legend style="margin-bottom: 10px;">' + label + '</legend>';

    html += '<input type="text" name="' + name + '" value="" disabled="disabled" id="' + id + '">';

    html += '<button onclick="signMe(\'' + id + '\');return false;" data-theme="a">Sign</button>';

    return html;*/

    var html = '<label>'+ $.t("haccp.signature") +'</label>' +
        '<div class="ui-grid-a">' +
            '<div class="ui-block-a">' +
                '<input type="text" name="name" id="sign_name" placeholder="" class="ui-input-text ui-body-a"/>' +
            '</div>' +
            '<div class="ui-block-b">' +
                '<input type="button" value="'+ $.t('general.sign_button') +'" id="signature-trigger" data-position-to="window" />' +
            '</div>' +
        '</div>';

    return html;
};

function onChangeSelectBox(id) {
    $('#' + id).parent().find('.ui-btn-text').first().html($('#' + id + ' option:selected').text());
}

HTML.prototype.selectBox = function(name, label, options, placeholder, validation,value) {
    if (value == undefined) {
        value = '';
    }
    var html = '<label for="' + md5(name+label) + '" class="select">' + label+ '</label>';
    html += '<select name="' + name + '" id="' + md5(name+label) + '" ' + this.generateValidation(validation) + ' onchange="onChangeSelectBox(\'' + md5(name+label) + '\')">';
    if (placeholder != undefined && placeholder != '') {
        html += '<option value="-1">' + placeholder + '</option>';
    }
    for (var i in options) {
    //for (var i = 0, length = options.length; i < length; i++) {
        if (options.hasOwnProperty(i)) {
            if (typeof options[i] == 'object') {
                for (var j in options[i]) break;
                var selected = '';
                if (j == value){ selected = 'selected="selected"';}
                html += '<option value="' + j + '" '+ selected +'>' + options[i][j] + '</option>';
            } else {
                var selected = '';
                if (i == value){ selected = 'selected="selected"';}
                html += '<option value="' + i + '" '+ selected + '>' + options[i] + '</option>';
            }
        }
    }

    html += '</select>';
    return html;
};

HTML.prototype.sliderInput = function(name, label, unit, interval_min, interval_max, dev, val) {
    if (val == undefined || typeof val != "number") {
        if (dev != undefined) {
            val = dev.ideal_min;
        } else {
            val = 0;
        }
    }
    var html = '<label for="' + md5(label+name) + '">' + label;

    if (dev != undefined) {
        html += ' (<small>min:' + dev.ideal_min + '/max:' + dev.ideal_max + '</small>)';
    }

    html += '</label>';
//alert(val);
    html += '<input name="' + name + '" id="' + md5(label+name) + '" min="' + interval_min + '" max="' + interval_max + '" value="' + val + '" type="range">';

    return html;
};

HTML.prototype.formGenerateWill = function(form) {
    var html = '';
    var id = md5(new Date().getTime() + '_form');
    var as = false;
    var form_data = $.extend({},form);

    for (var i in form_data) {
        if (form_data[i].type == 'radio_list') {
            if (form_data.frequency_id.value == null || form_data.frequency_id.value == 'null') {
                as = true
            }
            console.log(form_data[i]);
            if(form_data[i].label_tmp == '' || form_data[i].label_tmp == null)
                form_data[i].label_tmp = form_data[i].label;
            html += HTML.formSwitch(form_data[i].label_tmp, id, as);
            form_data[i].label = 'Hvor ofte ' + form_data[i].label_tmp.toLowerCase();
            if (as) {
                html += '<div class="hide" id="' + id + '">';
            } else {
                html += '<div id="' + id + '">';
            }
            html += this.formGenerate(form_data);
            html += '</div>';
            break;
        }
    }

    return html;
};

HTML.prototype.formGenerateColors = function(form) {
    if (form.answer.label == '') {
        form.answer.label = form.answer.label_tmp;
    }
    var html = '';
    var id = md5(new Date().getTime() + '_form_color');
    var label = form.answer.label;
    var as = true;
    var s = form.answer.list;

    form.answer.label_tmp = form.answer.label;
    form.answer.label = '';

    for (var i in s) {
        if (s.hasOwnProperty(i)) {
            if (s[i].value != '' && s[i].value !== undefined) {
                as = false;
                break;
            }
        }
    }
    html += HTML.formSwitch(label, id, as);
    if (as) {
        html += '<div class="hide colorwill" id="' + id + '">';
    } else {
        html += '<div class="colorwill" id="' + id + '">';
    }

    html += this.formGenerate(form);
    html += '</div>';

    return html;
};

HTML.prototype.formSwitchChange = function(el) {
    var $el = $(el);
    if ($el.val() == 'on') {
        $('#' + $el.attr('name')).removeClass('hide');
    } else {
        $('#' + $el.attr('name')).addClass('hide');
        $('#' + $el.attr('name')).find('input[type="radio"]').each(function(){
            $(this).removeAttr('checked').checkboxradio("refresh");
        });
        $('#' + $el.attr('name')).find('input[name="frequency_id"]').attr('checked', false).checkboxradio("refresh");
        $('#' + $el.attr('name')).find('input[type="date"]').val('');
        $('#' + $el.attr('name')).find('input[type="radio"][value="#ffffff"]').each(function(){
            $(this).attr('checked',true).checkboxradio("refresh");
        });
    }
    //realignSlideHeight('max-height-involved');
};

HTML.prototype.formSwitch = function(label, id, hide) {
    var html = '<label>' + label + '</label>';
    html += '<label for="' + md5(label + id) + '">' + $.t('booleans.yes') + '</label>';
    html += '<input type="radio" name="'+ id +'" value="on" onchange="HTML.formSwitchChange(this);" id="'+ md5(label + id) +'" '+(!hide ? 'checked' : '')+' />';

    html += '<label for="' + md5(label) + '">' + $.t('booleans.no') + '</label>';
    html += '<input type="radio" name="'+ id +'" value="off" onchange="HTML.formSwitchChange(this);" id="'+ md5(label) +'" '+ (hide ? 'checked' : '') +'/>';

    return html;
};

HTML.prototype.inputDishWasherAdd = function(el, fields) {
    fields = $.parseJSON(fields.replace(/-s-/g, '"'));
    $el = $(el);
    var container = $el.parent().parent();
    var name = (container.find('.ui-block-a').find('input').attr('name'));
    var placeholder = container.find('.ui-block-a').find('input').attr('placeholder');
    var html = '';
    var t = name.match(/(.*)?\[(.*?)\]\[(.*?)\]/);
    var i = md5(new Date().getTime()) + '_added';

    var inc = 0;
    var ff = true;
    var blocks = {
        0: 'a',
        1: 'b',
        2: 'c'
    };

    var parent_form = $el.closest('form');
    var start_date = parent_form.find('input[name="start_date"]').val();
    if ( start_date != '' ) {
        start_date = new Date(start_date);
    }
    var now = new Date();
    if ( start_date < now ) {
        var day = now.getDate() < 10 ? '0'+now.getDate() : now.getDate();
        var month = now.getMonth() < 9 ? '0'+ ( now.getMonth() + 1)  : now.getMonth() + 1;
        var new_val = now.getFullYear() + '-' +month + '-' + day;
        parent_form.find('input[name="start_date"]').val(new_val);
    }

    inc = 0;
    ff = true;
    html += '<div>';
    for (var j in fields) {
        if (fields.hasOwnProperty(j)) {

            if (ff) {
                tmp = {};
                tmp[t[1] + '[' + j + '][' + i + ']'] = fields[j];
                tmp[t[1] + '[' + j + '][' + i + ']'].value = '';
                tmp[t[1] + '[' + j + '][' + i + ']'].placeholder = fields[j].label_c;

                html += '<div class="ui-grid-a">';
                html += '    <div class="ui-block-a" style="width:80%;">';

                html += HTML.formGenerate(tmp);

                html += '    </div>';
                html += '    <div class="ui-block-b" style="width:20%;">';

                html += '<a href="#" data-role="button" onclick="HTML.inputFridgeDel(this);"><i class="fa fa-minus"></i></a>';

                html += '    </div>';
                html += '</div>';

                html += '<div class="multiple_fridges_reformat_input">';
                html += '<div class="ui-grid-b">';
                ff = false;
            } else {
                tmp = {};
                tmp[t[1] + '[' + j + '][' + i + ']'] = fields[j];
                tmp[t[1] + '[' + j + '][' + i + ']'].value = '';

                html += '   <div class="ui-block-' + blocks[inc] + '">';

                html += HTML.formGenerate(tmp);

                html += '   </div>';
                inc++;
                if (inc == 3) {
                    html += '</div>';
                    html += '<div class="multiple_fridges_reformat_input">';
                    html += '<legend>Rinse Temperature</legend>';
                    html += '<div class="ui-grid-b">';
                    inc = 0;
                }
            }

        }
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $(container.parent()).append(html).trigger("create");
    //realignSlideHeight('max-height-involved');
};

HTML.prototype.inputDishWasher = function(name, label, placeholder, fields, value) {
    var ff = true;
    var ffr = true;
    var dffr = true;
    var tmp;
    var blocks = {
        0: 'a',
        1: 'b',
        2: 'c'
    };
    var inc = 0;
    var html = '<div>'

    html += '<div class="ui-grid-solo">';
    html += '        <label>' + label + '</label>';
    html += '</div>';


    if (value == undefined || typeof value != 'object' || value.length == 0) {
        var n = md5(new Date().getTime()) + '_added'
        value = {};
        value[n] = {};
        for (var i in fields) {
            value[n][i] = '';
        }
    }

    for (var i in value) {
        if (value.hasOwnProperty(i)) {
            inc = 0;
            ff = true;
            html += '<div>';
            for (var j in fields) {
                if (fields.hasOwnProperty(j)) {
                    value[i][j] = (value[i][j]+"").replace(/\+/g,' ');
                    if (ff) {
                        tmp = {};
                        tmp[name + '[' + j + '][' + i + ']'] = fields[j];
                        tmp[name + '[' + j + '][' + i + ']'].value = value[i][j];
                        tmp[name + '[' + j + '][' + i + ']'].label_c = fields[j].label;
                        tmp[name + '[' + j + '][' + i + ']'].label = '';

                        html += '<div class="ui-grid-a">';
                        html += '    <div class="ui-block-a" style="width:80%;">';

                        html += HTML.formGenerate(tmp);

                        html += '    </div>';
                        html += '    <div class="ui-block-b" style="width:20%;">';

                        if (ffr) {
                            html += '<a href="#" data-role="button" onclick="HTML.inputDishWasherAdd(this, \'' + (JSON.stringify(fields)).replace(/"/g, '-s-') + '\');"><i class="fa fa-plus"></i></a>';
                            ffr = false;
                        } else {
                            html += '<a href="#" data-role="button" onclick="HTML.inputFridgeDel(this);"><i class="fa fa-minus"></i></a>';
                        }

                        html += '    </div>';
                        html += '</div>';

                        html += '<div class="multiple_fridges_reformat_input">';
                        html += '<div class="ui-grid-b">';
                        ff = false;
                    } else {
                        tmp = {};
                        tmp[name + '[' + j + '][' + i + ']'] = fields[j];
                        tmp[name + '[' + j + '][' + i + ']'].value = value[i][j];

                        html += '   <div class="ui-block-' + blocks[inc] + '">';

                        html += HTML.formGenerate(tmp);

                        html += '   </div>';
                        inc++;
                        if (inc == 3 && dffr) {
                            html += '</div>';
                            html += '<div class="multiple_fridges_reformat_input">';
                            html += '<legend>Rinse Temperature</legend>';
                            html += '<div class="ui-grid-b">';
                            dffr = false;
                            inc = 0;
                        }
                    }

                }
            }
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
    }

    html += '</div>';

    return html;
};

HTML.prototype.inputFridgeDel = function(el) {
    $(el).parent().parent().parent().remove();
    //realignSlideHeight('max-height-involved');
};

HTML.prototype.inputFridgeAdd = function(el, fields) {
    fields = $.parseJSON(fields.replace(/-s-/g, '"'));
    $el = $(el);
    var container = $el.parent().parent();
    var name = (container.find('.ui-block-a').find('input').attr('name'));
    var placeholder = container.find('.ui-block-a').find('input').attr('placeholder');
    var html = '';
    var t = name.match(/(.*)?\[(.*?)\]\[(.*?)\]/);
    var i = md5(new Date().getTime()) + '_added';

    var inc = 0;
    var ff = true;
    var blocks = {
        0: 'a',
        1: 'b',
        2: 'c'
    };

    var parent_form = $el.closest('form');
    var start_date = parent_form.find('input[name="start_date"]').val();
    if ( start_date != '' ) {
        start_date = new Date(start_date);
    }
    var now = new Date();
    if ( start_date < now ) {
        var day = now.getDate() < 10 ? '0'+now.getDate() : now.getDate();
        var month = now.getMonth() < 9 ? '0'+ ( now.getMonth() + 1)  : now.getMonth() + 1;
        var new_val = now.getFullYear() + '-' +month + '-' + day;
        parent_form.find('input[name="start_date"]').val(new_val);
    }

    html += '<div>';
    for (var j in fields) {
        if (fields.hasOwnProperty(j)) {

            if (ff) {
                tmp = {};
                tmp[t[1] + '[' + j + '][' + i + ']'] = fields[j];
                tmp[t[1] + '[' + j + '][' + i + ']'].value = '';
                tmp[t[1] + '[' + j + '][' + i + ']'].placeholder = fields[j].label_c;

                html += '<div class="ui-grid-a">';
                html += '    <div class="ui-block-a" style="width:80%;">';

                html += HTML.formGenerate(tmp);

                html += '    </div>';
                html += '    <div class="ui-block-b" style="width:20%;">';

                html += '<a href="#" data-role="button" onclick="HTML.inputFridgeDel(this);"><i class="fa fa-minus"></i></a>';

                html += '    </div>';
                html += '</div>';

                html += '<div class="multiple_fridges_reformat_input">';
                html += '<div class="ui-grid-b">';
                ff = false;
            } else {
                tmp = {};
                tmp[t[1] + '[' + j + '][' + i + ']'] = fields[j];
                tmp[t[1] + '[' + j + '][' + i + ']'].value = '';

                html += '   <div class="ui-block-' + blocks[inc] + '">';

                html += HTML.formGenerate(tmp);

                html += '   </div>';
                inc++;
            }

        }
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $(container.parent()).append(html).trigger("create");
};

HTML.prototype.inputFridge = function(name, label, placeholder, fields, value) {
    var ff = true;
    var ffr = true;
    var tmp;
    var blocks = {
        0: 'a',
        1: 'b',
        2: 'c'
    };
    var inc = 0;
    var html = '<div>'

    html += '<div class="ui-grid-solo">';
    if ( label != '' ) {
        html += '<label>' + label + '</label>';
    }
    html += '</div>';

    if (value == undefined || typeof value != 'object' || value.length == 0) {
        var n = md5(new Date().getTime()) + '_added'
        value = {};
        value[n] = {};
        for (var i in fields) {
            value[n][i] = '';
        }
    }

    for (var i in value) {
        if (value.hasOwnProperty(i)) {
            inc = 0;
            ff = true;
            html += '<div>';
            for (var j in fields) {
                if (fields.hasOwnProperty(j)) {

                    value[i][j] = (value[i][j]+"").replace(/\+/g,' ');
                    if (ff) {
                        tmp = {};
                        tmp[name + '[' + j + '][' + i + ']'] = fields[j];
                        tmp[name + '[' + j + '][' + i + ']'].value = value[i][j];
                        tmp[name + '[' + j + '][' + i + ']'].label_c = fields[j].label;
                        tmp[name + '[' + j + '][' + i + ']'].label = '';

                        html += '<div class="ui-grid-a">';
                        html += '    <div class="ui-block-a" style="width:80%;">';

                        html += HTML.formGenerate(tmp);

                        html += '    </div>';
                        html += '    <div class="ui-block-b" style="width:20%;">';

                        if (ffr) {
                            html += '<a href="#" data-role="button" onclick="HTML.inputFridgeAdd(this, \'' + (JSON.stringify(fields)).replace(/"/g, '-s-') + '\');"><i class="fa fa-plus"></i></a>';
                            ffr = false;
                        } else {
                            html += '<a href="#" data-role="button" onclick="HTML.inputFridgeDel(this);"><i class="fa fa-minus"></i></a>';
                        }

                        html += '    </div>';
                        html += '</div>';

                        html += '<div class="multiple_fridges_reformat_input">';
                        html += '<div class="ui-grid-b">';
                        ff = false;
                    } else {
                        tmp = {};
                        tmp[name + '[' + j + '][' + i + ']'] = fields[j];
                        tmp[name + '[' + j + '][' + i + ']'].value = value[i][j];

                        html += '   <div class="ui-block-' + blocks[inc] + '">';

                        html += HTML.formGenerate(tmp);

                        html += '   </div>';
                        inc++;
                    }

                }
            }
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
    }

    html += '</div>';


    return html;
};

HTML.prototype.inputDate = function(name, label, placeholder, value, dv, validation) {
    var html = '';
    var v = '',d;
    if (placeholder == undefined) {
        placeholder = '';
    }
    if (value != null && !isEmpty(value) ) {
        d = new Date(value);
    } else {
        if (dv != undefined && dv) {
            var t = new Date();
            var td = t.getMonth();
            if (td == 11) {
                td = 0;
                var new_year = t.getFullYear() + 1;
                d = new Date(new_year, td, t.getDate());
            } else {
                td++;
                d = new Date(t.getFullYear(), td, t.getDate());
            }
        } else {
            d = new Date();
        }
    }
    var month = d.getMonth();
    var day = d.getDate();

    if (month < 9) {
        month = '0' + (parseInt(d.getMonth()) + 1);
    } else {
        month = parseInt(d.getMonth()) + 1;
    }

    if (day < 10) {
        day = '0' + d.getDate();
    }

    v =  d.getFullYear() + '-' + month  + '-' + day ;
    if ( label != '' ) {
        html += '<label for="frm_label_' + md5(name+label) + '">' + label + '</label>';
    }

 	if(v == "NaN-NaN-NaN") {
 		    var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();
			if(dd<10) {
				dd = '0' + dd
			}
			if(mm<10){
				mm = '0' + mm
			}
			v = yyyy+'-'+mm+'-'+ dd;
 	}

    html += '<input name="' + name + '" placeholder="' + placeholder + '" id="frm_label_' + md5(name+label) + '" type="date" value="' + v + '" ' + this.generateValidation(validation) + ' />';

    return html;
};

HTML.prototype.radioList = function(name, label, list, value, validation) {

    if (label == undefined) {
        label = '';
    } else {
    }
    var html = '<label>' + label + '</label>';
    for (var i in list) {

        if (list.hasOwnProperty(i)) {
            html += '<input name="' + name + '" id="' + md5(name+i) + '" type="radio" value="' + i + '"' + this.generateValidation(validation);
            if (value != null && value == i) {
                html += ' checked="checked" />';
            } else {
                html += '/>';
            }
            html += '<label for="' + md5(name+i) + '">' + list[i] + '</label>';
        }

    }

    return html;
};

HTML.prototype.multipleColor = function(name, label, list) {
    var html = '<hr class="no-lateral-border"/>';
    html += '<label>' + label + '</label>';

    var color = {};
    color[$.t('colors.red')] = '#ff0000';
    color[$.t('colors.green')] = '#008000';
    color[$.t('colors.blue')] = '#0000ff';
    color[$.t('colors.white')] = '#ffffff';
    color[$.t('colors.pink')] = '#FF1493';
    color[$.t('colors.brown')] = '#A52A2A';
    color[$.t('colors.yellow')] = '#ffff00';

    for (var i in list) {
        if (list.hasOwnProperty(i)) {
            html += '<label style="margin-top:10px;">' + list[i].label + '</label>';
            for (var j in color) {
                if (color.hasOwnProperty(j)) {
                    html += '<input name="' + name + '[' + i + ']" id="' + md5(i+j) + '" type="radio" value="' + color[j] + '"';
                    if ((list[i].value != null && (list[i].value).toUpperCase() == color[j].toUpperCase())) {
                        html += ' checked="checked" />';
                    } else {
                        html += '/>';
                    }
                    html += '<label for="' + md5(i+j) + '"><i class="fa fa-square" style="color:'+ color[j] +';"></i> ' + j + '</label>';
                }
            }
        }
    }

    return html;
};

HTML.prototype.inputHidden = function (name, value) {
    return '<input type="hidden" name="' + name + '" value="' + value + '" />';
};

HTML.prototype.showCheckboxChild = function(el, id) {
    if ($(el).is(':checked')) {
        $('#' + id).removeClass('hide');
    } else {
        $('#' + id).addClass('hide');
    }
    //realignSlideHeight('max-height-involved');
};

HTML.prototype.checkboxList = function(name, label, list) {

    if ( label == '' ) {
        var html = '<hr class="no-lateral-border" />';
    } else {
        var html = '<label>' + label + '</label>';
    }
    for (var i in list) {
        if (list.hasOwnProperty(i)) {
            html += '<input name="' + name + '[' + i + ']" id="' + md5(name+i) + '" type="checkbox" value="' + i + '"';
            if (list[i].checked || list[i].checked == 'true') {
                html += ' checked="checked"';
            }
            if (list[i].condition != undefined) {
                var id = md5(new Date().getTime() + 'name');
                switch(list[i].condition) {
                    case 'if_checked':
                        html += ' onclick="HTML.showCheckboxChild(this, \'' + id + '\')"';
                        break;
                }
            }

            html += ' />';
            html += '<label for="' + md5(name+i) + '">' + list[i].label + '</label>';
            // custom checkbox - predefined list in list
            if (list[i].condition != undefined && list[i].extra != undefined) {
                html += '<div id="' + id + '" style="margin:10px 20px;"';
                if (list[i].checked == undefined || !list[i].checked || list[i].checked == 'false') {
                    html += 'class="hide">';
                }
                html += HTML.formGenerate(list[i].extra);
                html += '</div>';
            }
        }
    }

    return html;
};

HTML.prototype.checkboxFlowchartList = function(name, label, list) {

    if ( label == '' ) {
        var html = '<hr class="no-lateral-border" />';
    } else {
        var html = '<div class="ui-grid-solo"><label>' + label + '</label></div>';
    }
    for (var i in list) {
        if (list.hasOwnProperty(i)) {
            html += '<div class="ui-checkbox-off ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-btn-up-a"><input class="flowchart-checkbox" name="' + name + '[' + i + ']" id="' + md5(name+i) + '" type="checkbox" value="' + i + '"';
            if (list[i].checked || list[i].checked == 'true') {
                html += ' checked="checked"';
            }
            if (list[i].condition != undefined) {
                var id = md5(new Date().getTime() + 'name');
                switch(list[i].condition) {
                    case 'if_checked':
                        html += ' onclick="HTML.showCheckboxChild(this, \'' + id + '\')"';
                        break;
                }
            }

            html += ' />';
            html += '<label class="flowchart-label" for="' + md5(name+i) + '"></label>';
            html += '<span class="ui-btn-inner flowchart-viewimg" onclick="javascript:HTML.showFlowchartImg(\'' +list[i].imgPath+'\')"><span class="ui-btn-text">' + list[i].label + '</span><span class="ui-icon ui-icon-checkbox-on ui-icon-shadow">&nbsp;</span></span>';
            html += '</div><div class="clearboth"></div>';
            // custom checkbox - predefined list in list
            if (list[i].condition != undefined && list[i].extra != undefined) {
                html += '<div id="' + id + '" style="margin:10px 20px;"';
                if (list[i].checked == undefined || !list[i].checked || list[i].checked == 'false') {
                    html += 'class="hide">';
                }
                html += HTML.formGenerate(list[i].extra);
                html += '</div>';
            }
        }
    }

    return html;
};

HTML.prototype.showFlowchartImg = function(imgPath) {
    html = '<a id="backToFlowchartList" onclick="HTML.backToFlowchartList();" ><span class="ui-btn-inner"><span class="ui-btn-text"><i class="fa fa-close"></i></span></span></a>';
    html += "<img class='flowchart-img' style='max-height: " + mySwiper.height +"px; max-width: " + mySwiper.width +"px' src='" + settings.apiPath + imgPath + "' />";
    mySwiper.disableKeyboardControl();
    mySwiper.insertSlideAfter(mySwiper.activeIndex, html, 'swiper-slide');
    mySwiper.swipeTo( mySwiper.activeIndex + 1 , 0, false );
    mySwiper.reInit();
    $('#footer').hide();
};

HTML.prototype.backToFlowchartList = function(imgPath) {
    mySwiper.enableKeyboardControl();
    mySwiper.swipeTo( mySwiper.activeIndex - 1, 0, false );
    mySwiper.removeSlide(parseInt(mySwiper.activeIndex) + 1);
    mySwiper.reInit();
    $('#footer').show();
};

HTML.prototype.checkboxListLabelFree = function(name, label, list) {
    if ( label == '' ) {
        var html = '<hr class="no-lateral-border" />';
    } else {
        var html = '<label>' + label + '</label>';
    }
    //var html = '<legend><a href="#" id="tos">Ved å registrere deg  bekrefter du å ha lest og akseptert brukervilkårene.</a></legend>';
    var html = '<label><a href="#tos" id="tos">Ved å registrere deg  bekrefter du å ha lest og akseptert brukervilkårene.</a></label>';
    return html;
};

HTML.prototype.multipleInputDel = function(el) {
    $(el).parent().parent().remove();
    //realignSlideHeight('max-height-involved');
};

HTML.prototype.multipleInputAdd = function(el) {
    $el = $(el);
    var container = $el.parent().parent();
    var name = (container.find('.ui-block-a').find('input').attr('name'));
    var placeholder = container.find('.ui-block-a').find('input').attr('placeholder');
    var html = '';
    var t = name.match(/(.*)?\[(.*?)\]/);
    var n = md5(new Date().getTime()) + '_added';

    html += '<fieldset class="ui-grid-a new-added">';
    html += '    <div class="ui-block-a" style="width:80%;">';
    html += '        <input name="' + t[1] + '[' + n + ']"  type="text" data-validation="string" value="" placeholder="' + placeholder + '"/>';
    html += '    </div>';
    html += '    <div class="ui-block-b" style="width:20%;">';
    html += '        <a href="#" data-role="button" onclick="HTML.multipleInputDel(this);"><i class="fa fa-minus"></i></a>';
    html += '    </div>';
    html += '</fieldset>';

    $(container.parent()).append(html).trigger("create");
    //realignSlideHeight('max-height-involved');
    $('.new-added:last input').focus();
};

HTML.prototype.multipleInput = function(name, label, placeholder, validation, value) {
    var html = '<div>';
    var p = true;

    html += '<div class="ui-grid-solo">';
    if ( label != undefined ) {
        html += '<label>' + label + '</label>';
    }
    html += '</div>';

    if (value == undefined || typeof value != 'object' || value.length == 0) {
        var n = md5(new Date().getTime()) + '_added'
        value = {};
        value[n] = '';
    }

    for (var i in value) {
        if (value.hasOwnProperty(i)) {
            value[i] = value[i].replace(/\+/g,' ');
            html += '<fieldset class="ui-grid-a">';
            html += '    <div class="ui-block-a" style="width:80%;">';
            html += '        <input tabindex="-1" name="' + name + '[' + i + ']" ' +
                'value="' + value[i] + '" ' +
                'type="text" ' +
                'placeholder="' + placeholder + '"';
//            if (p) {
                html += this.generateValidation(validation) + '/>';
//            } else {
//                html += '/>';
//            }
            html += '    </div>';
            html += '    <div class="ui-block-b" style="width:20%;">';
            if (p) {
                html += '        <a tabindex="-1" href="#" data-role="button" onclick="HTML.multipleInputAdd(this);"><i class="fa fa-plus"></i></a>';
                p = false;
            } else {
                html += '        <a tabindex="-1" href="#" data-role="button" onclick="HTML.multipleInputDel(this);"><i class="fa fa-minus"></i></a>';
            }

            html += '    </div>';
            html += '</fieldset>';
        }
    }

    html += '</div>';

    return html;
};

HTML.prototype.incClick = function (id, v) {
    var $e = $('#'+id);
    var eValue = parseInt($e.val());
    if(isNaN(eValue)){eValue = 0}
    var a = eValue + parseInt(v);
    if (a >= $e.data('min')) {
        $e.val(a);
    }
};

HTML.prototype.textClicker = function(name, label, default_val, value) {
   console.log("textClicker");console.log(name, label, default_val, value);
    var html = '';

    html += '<label>' + label + '</label>';

    html += '<fieldset class="ui-grid-b">';
    html += '<div class="ui-block-a"><input tabindex="-1" name="' + name + '" type="tel" value="' + (value != undefined ? value : default_val) + '"  id="' + md5(name+label) + '" data-min="0"></div>';
    html += '<div class="ui-block-b"><button tabindex="-1" onclick="HTML.incClick(\'' + md5(name+label) + '\', \'1\');return false;"><i class="fa fa-plus"></i></button></div>';
    html += '<div class="ui-block-c"><button tabindex="-1" onclick="HTML.incClick(\'' + md5(name+label) + '\', \'-1\');return false;"><i class="fa fa-minus"></i></button></div>';
    html += '</fieldset>';

    return html;
};

HTML.prototype.textareaField = function(name, label, placeholder, validation, value) {
    if (value != undefined) {
        value = value.replace(/\+/g,' ');
    }
    if (label == undefined) {
        label = '';
    }
    if (placeholder == undefined) {
        placeholder = '';
    }

    var html = '<label for="frm_label_' + md5(name+label) + '">' + label + '</label>';

    html += '<textarea tabindex="-1" name="' + name + '" ' +
        'placeholder="' + placeholder + '" ' +
        'id="frm_label_' + md5(name+label) + '" ' + 'onblur="textEndEdit()"'  +
        this.generateValidation(validation) + '>' +
        (value != undefined ? value : '') +
        '</textarea>';

    return html;
};

function textEndEdit(e) {
    var validErr = document.getElementsByClassName('validate_error');
    if(validErr.length == 0) {
     $(".ui-btn-active").removeClass("ui-btn-active"); }
}

HTML.prototype.inputText = function(type, name, label, placeholder, validation, value) {

    if (value == undefined) {
        value = '';
    }
    if(name != 'email'){
        value = value.replace(/\+/g,' ');
    }
    if (placeholder == undefined) {
        placeholder = '';
    }

    if (label == undefined ) {
        label = '';
        var html = '';
    } else if ( label != '' ) {
         var html = '<label for="frm_label_' + md5(name+label) + '">' + label + '</label>';
    } else {
        var html = '';
    }
    if(type == 'number') {type ='tel'};


    html += '<input tabindex="-1" type="' + type + '" ' +
        'name="' + name + '" ' +
        'value="' + value + '" ' +
        'placeholder="' + placeholder + '" ' +
        'id="frm_label_' + md5(name+label) + '" ' +
        this.generateValidation(validation) + '/>';

    return html;
};

HTML.prototype.phoneText = function(type, name, label, placeholder, validation, value) {

    var html = '<div class="ui-grid-a"><div class="ui-block-a" style="width:40%; margin-left: 0;">';
    html += this.selectBox( name[0], label[0]+"<i class=\"requiredicon\"> *</i>",type[0] , placeholder[0], validation[0], value[0]);
    html += '</div><div class="ui-block-b" style="width:60%">';
    html += this.inputText("tel", name[1], " "+"<i style=\"color: #fff;\"> *</i>", placeholder[1], validation[1], value[1]);
    html += '</div>';
    html += '</div>';

    return html;
};

/*HTML.prototype.validate = function(data) {
    return true;
};*/

HTML.prototype.getFormValues = function(data) {
    var $f = $(data).find('form').serialize(),
        data_send = {},
        tmp = [],
        tttmp, ttmp, p, ind;


    tmp = $f.split('&');
    for (var i=0;i<tmp.length;i++) {
        tmp[i] = decodeURIComponent(tmp[i]);
        ttmp = tmp[i].split('=');
        ttmp[1] = decodeURIComponent(ttmp[1]);

        if (ttmp[0].indexOf('[') != -1) {
            if (ttmp[0].indexOf('fridge') != -1 || ttmp[0].indexOf('dishwasher') != -1) {
                //fridges[name][1]
                ind = ttmp[0].match(/(.*)?\[(.*?)\]\[(.*?)\]/);
                if (data_send[ind[1]] == undefined) {
                    data_send[ind[1]] = {};
                }
                if (data_send[ind[1]][ind[3]] == undefined) {
                    data_send[ind[1]][ind[3]] = {};
                }
                data_send[ind[1]][ind[3]][ind[2]] = ttmp[1]
            } else {
                tttmp = ttmp[0].match(/(.*)?\[(.*?)\]/);
                if (data_send[tttmp[1]] == undefined) {
                    data_send[tttmp[1]] = {};
                }
                data_send[tttmp[1]][tttmp[2]] = ttmp[1];
            }
        } else {
            /*if (ttmp[1] == null || ttmp[1] == "null") {
                ttmp[1] = $(data).find('form').find('input[name="' + ttmp[0] + '"]').val();
            }*/
            data_send[ttmp[0]] = ttmp[1];
        }
    }

    return data_send;
};

HTML.prototype.getStepData = function(step, data, data_save) {
    var form, form_data;

    var data2 = jQuery.extend({},data);

    if (step == 1) {
        form_data = data2.registration_steps.form1;
        form = 'form1';
    } else if (step == 2) {
        form_data = data2.registration_steps.form1_1;
        form = 'form1_1';
    } else {
        for (var k in data2.registration_steps) {
            if (data2.registration_steps.hasOwnProperty(k) && k != 'aux') {
                form_data = data2.registration_steps[k];
                form = k;
                break;
            }
        }
    }

    for (var i in form_data) {
        switch (form_data[i].type) {
            case 'text':
            case 'number':
            case 'email':
            case 'textarea':
            case 'text_clicker':
            case 'multiple_text':
            case 'hidden':
            case 'select':
            case 'radio_list':
            case 'date':
            case 'multiple_text_fridges':
            case 'checkboxFlowchartList':
            case 'multiple_text_dishwasher':
                form_data[i].value = data_save[i];
                break;
            case 'checkbox_list':
                for (var j in data_save[i]) {
                    if ((data_save[i]).hasOwnProperty(j)) {
                        form_data[i].list[data_save[i][j]].checked = true;
                    }
                }
                break;
            case 'multiple_color':
                for (var j in data_save[i]) {
                    if ((data_save[i]).hasOwnProperty(j)) {
                        form_data[i].list[j].value = data_save[i][j];
                    }
                }
                break;
            default:
                noInternetError($.t("error.unexpected"));
                break;
        }
    }

    data2.registration_steps = {};
    data2.registration_steps[form] = form_data;

    this.preformRegisterSave(step, data2);
};

function preformRegisterSaveDBCheck(tx, results) {
    if (results.rows.length == 0) {
        tx.executeSql('INSERT INTO "registration" ("step","data") VALUES (?,?)', [db_temp_data.step,JSON.stringify(db_temp_data.data)], function(){}, db.dbErrorHandle);
    } else {
        tx.executeSql('UPDATE "registration" SET "data" =? WHERE "step" =?', [JSON.stringify(db_temp_data.data),db_temp_data.step], function(){}, db.dbErrorHandle);
    }
};

function preformRegisterSaveDB(tx) {
    tx.executeSql('SELECT * FROM "registration" WHERE "step" = "' + db_temp_data.step + '"', [], preformRegisterSaveDBCheck, db.dbErrorHandle);
}

HTML.prototype.preformRegisterSave = function(step, data) {
    db_temp_data = {
        'step': step,
        'data': data
    };
    var d = db.getDbInstance();
    d.transaction(preformRegisterSaveDB, d.dbErrorHandle);
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

jQuery.fn.extend({
    matchValidateRules: function(ex) {
        var valid = true;
        var stepValid = true;
        var r,i;
        var errorEmail = false;
        var errorNumber = false;
        var errorChar = false;
        var errorName = false;
        var err;

        this.each(function() {
            r = ($(this).data('validation')).split(' ');
            stepValid = true;
            for (i=0;i<r.length;i++) {
                switch (r[i]) {
                    case 'required':
                        if ($(this).is("select")) {
                            if ($(this).val() == -1) {
                                stepValid = false;
                                $(this).off('change').on('change',function(){
                                    $(this).matchValidateRules();
                                });
                            }
                        } else {
                            if ($(this).val().trim().length == 0) {
                                stepValid = false;
                                $(this).off('change keyup').on('change keyup',function(){
                                    $(this).matchValidateRules();
                                });
                            }
                        }
                        break;
                    case 'number':
                        if (parseInt($(this).val()) != $(this).val()) {
                            stepValid = false;
                            errorNumber = true;
                        } else {
                            if ($(this).attr('name') == 'phone') {
                                if ($(this).val().length < 5) {
                                    stepValid = false;
                                    errorNumber = true;
                                } else {
                                    stepValid = true;
                                    errorNumber = false;
                                }
                            }
                        }
                        break;
                    case 'string':
                        if (typeof $(this).val() != 'string') {
                            stepValid = false;
                        }
                        if ($(this).attr('name') == 'city') {
                        var nameReg = /^[A-Z a-z 0-9 ÆØÅ æøå &*)(+.,_-]*$/;
                        var value=  $(this).val();
                        console.log(value);
                        if (!nameReg.test(value)) {
                            errorChar = true;
                            stepValid = false;
                            }
                        }

                        if($(this).attr('name').indexOf("fridges[name]") != -1 ){
                            var value=  $(this).val().toLowerCase();
                            var id = $(this).attr('id');

                            $('input[type=text]').each(function(){
                               if(id.localeCompare($(this).attr('id')) != 0) {
                                    if($(this).val().toLowerCase().localeCompare(value) == 0) {
                                                   errorName = true;
                                                   stepValid = false;
                                    }
                            }
                         });
                        }
                        if($(this).attr('name').indexOf("internal_audit_participant") != -1 ){
                            var value=  $(this).val().toLowerCase();
                            var nameId = $(this).attr('name');
                            var $c = $( ":input" );

                            $c.each(function(){
                                var attr = $(this).attr('name');

                                    if (typeof attr !== typeof undefined && attr !== false) {
                                    // ...
                                    if($(this).attr('name').indexOf("internal_audit_participant") != -1 ) {
                                    console.log($(this).attr('name'),$(this).val());

                                    if(nameId.localeCompare($(this).attr('name')) != 0) {
                                            if($(this).val().toLowerCase().localeCompare(value) == 0) {
                                                        errorName = true;
                                                        stepValid = false;
                                                    }
                                                }

                                             }
                                        }
                            });

                    }

                        break;
                    case 'email':
                        if (!validateEmail($(this).val())) {
                            stepValid = false;
                            errorEmail = true;
                        }
                        break;
                    case 'required_group_fridge':
                        if ($(this).attr('type') == 'radio') {
                            var $rgff = $(this).closest('form');
                            var $rgfa = $rgff.find('input').first();
                            var $rgfg = $rgff.find('input[name="' + $(this).attr('name') + '"]');

                            var $rgfi = $rgfg.index($(this));
                            if ($rgfi == 1 && $rgfa.val().length > 0) {
                                if (!$rgfg.is(':checked')) {
                                    stepValid = false;
                                }
                            }
                        } else {
                            var tmp = ($(this).attr('name')).match(/(.*)?\[(.*?)\]\[(.*?)\]/);
                            var chk_item = $('input[name="' + tmp[1] + '[name][' + tmp[3] + ']"]');
                            if (chk_item.val().length > 0 && $(this).val().length == 0) {
                                stepValid = false;
                                $(this).off('change keyup').on('change keyup',function(){
                                    $(this).matchValidateRules();
                                });
                            }
                        }
                        break;
                }
            }
            if (typeof ex === "undefined") {
                $('#' + $(this).attr('id') + '_validate').remove();
                if (!stepValid) {
                    valid = false;
                    if (errorEmail) {
                        errorEmail = false;
                        err = $.t("error.validation_email");
                    } else if (errorNumber) {
                        errorNumber = false;
                        err = $.t("error.validation_number");
                    } else if (errorChar) {
                      errorChar = false;
                      err = $.t("Spesialtegn og siffer kan ikke skrives i dette feltet");
                    } else if (errorName) {
                      errorName = false;
                      err = $.t("Dette navnet er allerede i bruk. Alle navn må være unike.");
                    } else {
                      err = $.t("error.validation");
                    }
                    if ($(this).is("select")) {
                        $('<label id="' + $(this).attr('id') + '_validate" class="validate_error">' + err + '</label>').insertAfter($(this).parent().parent());
                    }
                    else if ($(this).is("input")) {
                        if ($(this).attr('type') == 'radio') {
                            $('<label id="' + $(this).attr('id') + '_validate" class="validate_error">' + err + '</label>').insertAfter($rgfg.last().parent());
                        } else {
                            $('<label id="' + $(this).attr('id') + '_validate" class="validate_error">' + err + '</label>').insertAfter($(this).parent());
                        }
                    }
                    else if ($(this).is("textarea")) {
                        $('<label id="' + $(this).attr('id') + '_validate" class="validate_error">' + err + '</label>').insertAfter($(this));
                    } else {
                        $(this).css('border', '1px solid red;');
                    }
                }
            } else {
            	valid = false;
            	$(this).off('change').on('change keyup',function(){
                                    $(this).matchValidateRules();
                });
            }
        });
        console.log("Valid:",valid);
        return valid;
    }
});

HTML.prototype.validate = function(html,ex) {
    var $h = $(html);
    return $h.find('[data-validation]').matchValidateRules(ex);
};


var HTML = new HTML();

function parseSvg(el) {
    var svgStr = el.val();
    var parser = new DOMParser();
    document.getElementById($(this).attr('id')).appendChild(dom.documentElement);
}

