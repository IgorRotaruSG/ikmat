!function(a,b){var c=a.fn.datepicker;a.fn.datepicker=function(b){function d(){a(".ui-datepicker-header",e).addClass("ui-body-c ui-corner-top").removeClass("ui-corner-all"),a(".ui-datepicker-prev, .ui-datepicker-next",e).attr("href","#"),a(".ui-datepicker-prev",e).buttonMarkup({iconpos:"notext",icon:"arrow-l",shadow:!0,corners:!0}),a(".ui-datepicker-next",e).buttonMarkup({iconpos:"notext",icon:"arrow-r",shadow:!0,corners:!0}),a(".ui-datepicker-calendar th",e).addClass("ui-bar-c"),a(".ui-datepicker-calendar td",e).addClass("ui-body-c"),a(".ui-datepicker-calendar a",e).buttonMarkup({corners:!1,shadow:!1}),a(".ui-datepicker-calendar a.ui-state-active",e).addClass("ui-btn-active"),a(".ui-datepicker-calendar a.ui-state-highlight",e).addClass("ui-btn-up-e"),a(".ui-datepicker-calendar .ui-btn",e).each(function(){var b=a(this);b.html(b.find(".ui-btn-text").text())})}var e=this;return c.call(this,b),d(),a(e).click(d),this},a(".ui-page").live("pagecreate",function(){a("input[type='date']").each(function(){a(this).after(a("<div />").datepicker({altField:"#"+a(this).attr("id"),showOtherMonths:!0}))})})}(jQuery);