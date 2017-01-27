!function(a,b,c){function d(a,b,c){for(var d=[],e=0;e<a.length;e++){var f=a[e];if(f){var g=tinycolor(f),h=g.toHsl().l<.5?"sp-thumb-el sp-thumb-dark":"sp-thumb-el sp-thumb-light";h+=tinycolor.equals(b,f)?" sp-thumb-active":"";var i=q?"background-color:"+g.toRgbString():"filter:"+g.toFilter();d.push('<span title="'+g.toRgbString()+'" data-color="'+g.toRgbString()+'" class="'+h+'"><span class="sp-thumb-inner" style="'+i+';" /></span>')}else{var j="sp-clear-display";d.push('<span title="No Color Selected" data-color="" style="background-color:transparent;" class="'+j+'"></span>')}}return"<div class='sp-cf "+c+"'>"+d.join("")+"</div>"}function e(){for(var a=0;a<o.length;a++)o[a]&&o[a].hide()}function f(a,c){var d=b.extend({},n,a);return d.callbacks={move:k(d.move,c),change:k(d.change,c),show:k(d.show,c),hide:k(d.hide,c),beforeShow:k(d.beforeShow,c)},d}function g(g,i){function k(){R.showPaletteOnly&&(R.showPalette=!0),sa.toggleClass("sp-flat",S),sa.toggleClass("sp-input-disabled",!R.showInput),sa.toggleClass("sp-alpha-enabled",R.showAlpha),sa.toggleClass("sp-clear-enabled",Sa),sa.toggleClass("sp-buttons-disabled",!R.showButtons),sa.toggleClass("sp-palette-disabled",!R.showPalette),sa.toggleClass("sp-palette-only",R.showPaletteOnly),sa.toggleClass("sp-initial-disabled",!R.showInitial),sa.addClass(R.className),M()}function n(){function c(a){return a.data&&a.data.ignore?(F(b(this).data("color")),I()):(F(b(this).data("color")),L(!0),I(),D()),!1}if(p&&sa.find("*:not(input)").attr("unselectable","on"),k(),Ia&&qa.after(Ja).hide(),Sa||Ea.hide(),S)qa.after(sa).hide();else{var d="parent"===R.appendTo?qa.parent():b(R.appendTo);1!==d.length&&(d=b("body")),d.append(sa)}if(U&&a.localStorage){try{var e=a.localStorage[U].split(",#");e.length>1&&(delete a.localStorage[U],b.each(e,function(a,b){u(b)}))}catch(a){}try{la=a.localStorage[U].split(";")}catch(a){}}Ka.bind("click.spectrum touchstart.spectrum",function(a){ra||B(),a.stopPropagation(),b(a.target).is("input")||a.preventDefault()}),(qa.is(":disabled")||R.disabled===!0)&&Q(),sa.click(j),Aa.change(A),Aa.bind("paste",function(){setTimeout(A,1)}),Aa.keydown(function(a){13==a.keyCode&&A()}),Da.text(R.cancelText),Da.bind("click.spectrum",function(a){a.stopPropagation(),a.preventDefault(),D("cancel")}),Ea.bind("click.spectrum",function(a){a.stopPropagation(),a.preventDefault(),Ra=!0,I(),S&&L(!0)}),Fa.text(R.chooseText),Fa.bind("click.spectrum",function(a){a.stopPropagation(),a.preventDefault(),H()&&(L(!0),D())}),l(ya,function(a,b,c){ia=a/ca,Ra=!1,c.shiftKey&&(ia=Math.round(10*ia)/10),I()}),l(va,function(a,b){fa=parseFloat(b/aa),Ra=!1,I()},y,z),l(ta,function(a,b,c){if(c.shiftKey){if(!oa){var d=ga*Z,e=$-ha*$,f=Math.abs(a-d)>Math.abs(b-e);oa=f?"x":"y"}}else oa=null;var g=!oa||"x"===oa,h=!oa||"y"===oa;g&&(ga=parseFloat(a/Z)),h&&(ha=parseFloat(($-b)/$)),Ra=!1,I()},y,z),Ma?(F(Ma),J(),Pa=Oa||tinycolor(Ma).format,u(Ma)):J(),S&&C();var f=p?"mousedown.spectrum":"click.spectrum touchstart.spectrum";Ba.delegate(".sp-thumb-el",f,c),Ca.delegate(".sp-thumb-el:nth-child(1)",f,{ignore:!0},c)}function u(c){if(T){var d=tinycolor(c).toRgbString();if(b.inArray(d,la)===-1)for(la.push(d);la.length>ma;)la.shift();if(U&&a.localStorage)try{a.localStorage[U]=la.join(";")}catch(a){}}}function v(){var a,b=[],c=la,d={};if(R.showPalette){for(var e=0;e<ka.length;e++)for(var f=0;f<ka[e].length;f++)a=tinycolor(ka[e][f]).toRgbString(),d[a]=!0;for(e=0;e<c.length;e++)a=tinycolor(c[e]).toRgbString(),d.hasOwnProperty(a)||(b.push(c[e]),d[a]=!0)}return b.reverse().slice(0,R.maxSelectionSize)}function w(){var a=G(),c=b.map(ka,function(b,c){return d(b,a,"sp-palette-row sp-palette-row-"+c)});la&&c.push(d(v(),a,"sp-palette-row sp-palette-row-selection")),Ba.html(c.join(""))}function x(){if(R.showInitial){var a=Na,b=G();Ca.html(d([a,b],b,"sp-palette-row-initial"))}}function y(){($<=0||Z<=0||aa<=0)&&M(),sa.addClass(na),oa=null}function z(){sa.removeClass(na)}function A(){var a=Aa.val();if(null!==a&&""!==a||!Sa){var b=tinycolor(a);b.ok?F(b):Aa.addClass("sp-validation-error")}else F(null)}function B(){Y?D():C()}function C(){var c=b.Event("beforeShow.spectrum");return Y?void M():(qa.trigger(c,[G()]),void(W.beforeShow(G())===!1||c.isDefaultPrevented()||(e(),Y=!0,b(pa).bind("click.spectrum",D),b(a).bind("resize.spectrum",X),Ja.addClass("sp-active"),sa.removeClass("sp-hidden"),R.showPalette&&w(),M(),J(),Na=G(),x(),W.show(Na),qa.trigger("show.spectrum",[Na]))))}function D(c){if((!c||"click"!=c.type||2!=c.button)&&Y&&!S){Y=!1,b(pa).unbind("click.spectrum",D),b(a).unbind("resize.spectrum",X),Ja.removeClass("sp-active"),sa.addClass("sp-hidden");var d=!tinycolor.equals(G(),Na);d&&(Qa&&"cancel"!==c?L(!0):E()),W.hide(G()),qa.trigger("hide.spectrum",[G()])}}function E(){F(Na,!0)}function F(a,b){if(!tinycolor.equals(a,G())){var c;if(!a&&Sa)Ra=!0;else{Ra=!1,c=tinycolor(a);var d=c.toHsv();fa=d.h%360/360,ga=d.s,ha=d.v,ia=d.a}J(),c&&c.ok&&!b&&(Pa=Oa||c.format)}}function G(a){return a=a||{},Sa&&Ra?null:tinycolor.fromRatio({h:fa,s:ga,v:ha,a:Math.round(100*ia)/100},{format:a.format||Pa})}function H(){return!Aa.hasClass("sp-validation-error")}function I(){J(),W.move(G()),qa.trigger("move.spectrum",[G()])}function J(){Aa.removeClass("sp-validation-error"),K();var a=tinycolor.fromRatio({h:fa,s:1,v:1});ta.css("background-color",a.toHexString());var b=Pa;ia<1&&("hex"!==b&&"hex3"!==b&&"hex6"!==b&&"name"!==b||(b="rgb"));var c=G({format:b}),d="";if(La.removeClass("sp-clear-display"),La.css("background-color","transparent"),!c&&Sa)La.addClass("sp-clear-display");else{var e=c.toHexString(),f=c.toRgbString();if(q||1===c.alpha?La.css("background-color",f):(La.css("background-color","transparent"),La.css("filter",c.toFilter())),R.showAlpha){var g=c.toRgb();g.a=0;var h=tinycolor(g).toRgbString(),i="linear-gradient(left, "+h+", "+e+")";p?xa.css("filter",tinycolor(h).toFilter({gradientType:1},e)):(xa.css("background","-webkit-"+i),xa.css("background","-moz-"+i),xa.css("background","-ms-"+i),xa.css("background",i))}d=c.toString(b)}R.showInput&&Aa.val(d),R.showPalette&&w(),x()}function K(){var a=ga,b=ha;if(Sa&&Ra)za.hide(),wa.hide(),ua.hide();else{za.show(),wa.show(),ua.show();var c=a*Z,d=$-b*$;c=Math.max(-_,Math.min(Z-_,c-_)),d=Math.max(-_,Math.min($-_,d-_)),ua.css({top:d,left:c});var e=ia*ca;za.css({left:e-da/2});var f=fa*aa;wa.css({top:f-ea})}}function L(a){var b=G(),c="",d=!tinycolor.equals(b,Na);b&&(c=b.toString(Pa),u(b)),Ga&&qa.val(c),Na=b,a&&d&&(W.change(b),qa.trigger("change",[b]))}function M(){Z=ta.width(),$=ta.height(),_=ua.height(),ba=va.width(),aa=va.height(),ea=wa.height(),ca=ya.width(),da=za.width(),S||(sa.css("position","absolute"),sa.offset(h(sa,Ka))),K()}function N(){qa.show(),Ka.unbind("click.spectrum touchstart.spectrum"),sa.remove(),Ja.remove(),o[Ta.id]=null}function O(a,d){return a===c?b.extend({},R):d===c?R[a]:(R[a]=d,void k())}function P(){ra=!1,qa.attr("disabled",!1),Ka.removeClass("sp-disabled")}function Q(){D(),ra=!0,qa.attr("disabled",!0),Ka.addClass("sp-disabled")}var R=f(i,g),S=R.flat,T=R.showSelectionPalette,U=R.localStorageKey,V=R.theme,W=R.callbacks,X=m(M,10),Y=!1,Z=0,$=0,_=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=1,ja=R.palette.slice(0),ka=b.isArray(ja[0])?ja:[ja],la=R.selectionPalette.slice(0),ma=R.maxSelectionSize,na="sp-dragging",oa=null,pa=g.ownerDocument,qa=(pa.body,b(g)),ra=!1,sa=b(t,pa).addClass(V),ta=sa.find(".sp-color"),ua=sa.find(".sp-dragger"),va=sa.find(".sp-hue"),wa=sa.find(".sp-slider"),xa=sa.find(".sp-alpha-inner"),ya=sa.find(".sp-alpha"),za=sa.find(".sp-alpha-handle"),Aa=sa.find(".sp-input"),Ba=sa.find(".sp-palette"),Ca=sa.find(".sp-initial"),Da=sa.find(".sp-cancel"),Ea=sa.find(".sp-clear"),Fa=sa.find(".sp-choose"),Ga=qa.is("input"),Ha=Ga&&r&&"color"===qa.attr("type"),Ia=Ga&&!S,Ja=Ia?b(s).addClass(V).addClass(R.className):b([]),Ka=Ia?Ja:qa,La=Ja.find(".sp-preview-inner"),Ma=R.color||Ga&&qa.val(),Na=!1,Oa=R.preferredFormat,Pa=Oa,Qa=!R.showButtons||R.clickoutFiresChange,Ra=!Ma,Sa=R.allowEmpty&&!Ha;n();var Ta={show:C,hide:D,toggle:B,reflow:M,option:O,enable:P,disable:Q,set:function(a){F(a),L()},get:G,destroy:N,container:sa};return Ta.id=o.push(Ta)-1,Ta}function h(a,c){var d=0,e=a.outerWidth(),f=a.outerHeight(),g=c.outerHeight(),h=a[0].ownerDocument,i=h.documentElement,j=i.clientWidth+b(h).scrollLeft(),k=i.clientHeight+b(h).scrollTop(),l=c.offset();return l.top+=g,l.left-=Math.min(l.left,l.left+e>j&&j>e?Math.abs(l.left+e-j):0),l.top-=Math.min(l.top,l.top+f>k&&k>f?Math.abs(f+g-d):d),l}function i(){}function j(a){a.stopPropagation()}function k(a,b){var c=Array.prototype.slice,d=c.call(arguments,2);return function(){return a.apply(b,d.concat(c.call(arguments)))}}function l(c,d,e,f){function g(a){a.stopPropagation&&a.stopPropagation(),a.preventDefault&&a.preventDefault(),a.returnValue=!1}function h(a){if(l){if(p&&document.documentMode<9&&!a.button)return j();var b=a.originalEvent.touches,e=b?b[0].pageX:a.pageX,f=b?b[0].pageY:a.pageY,h=Math.max(0,Math.min(e-m.left,o)),i=Math.max(0,Math.min(f-m.top,n));q&&g(a),d.apply(c,[h,i,a])}}function i(a){var d=a.which?3==a.which:2==a.button;a.originalEvent.touches;d||l||e.apply(c,arguments)!==!1&&(l=!0,n=b(c).height(),o=b(c).width(),m=b(c).offset(),b(k).bind(r),b(k.body).addClass("sp-dragging"),q||h(a),g(a))}function j(){l&&(b(k).unbind(r),b(k.body).removeClass("sp-dragging"),f.apply(c,arguments)),l=!1}d=d||function(){},e=e||function(){},f=f||function(){};var k=c.ownerDocument||document,l=!1,m={},n=0,o=0,q="ontouchstart"in a,r={};r.selectstart=g,r.dragstart=g,r["touchmove mousemove"]=h,r["touchend mouseup"]=j,b(c).bind("touchstart mousedown",i)}function m(a,b,c){var d;return function(){var e=this,f=arguments,g=function(){d=null,a.apply(e,f)};c&&clearTimeout(d),!c&&d||(d=setTimeout(g,b))}}var n={beforeShow:i,move:i,change:i,show:i,hide:i,color:!1,flat:!1,showInput:!1,allowEmpty:!1,showButtons:!0,clickoutFiresChange:!1,showInitial:!1,showPalette:!1,showPaletteOnly:!1,showSelectionPalette:!0,localStorageKey:!1,appendTo:"body",maxSelectionSize:7,cancelText:"cancel",chooseText:"choose",preferredFormat:!1,className:"",showAlpha:!1,theme:"sp-light",palette:["fff","000"],selectionPalette:[],disabled:!1},o=[],p=!!/msie/i.exec(a.navigator.userAgent),q=function(){function a(a,b){return!!~(""+a).indexOf(b)}var b=document.createElement("div"),c=b.style;return c.cssText="background-color:rgba(0,0,0,.5)",a(c.backgroundColor,"rgba")||a(c.backgroundColor,"hsla")}(),r=function(){var a=b("<input type='color' value='!' />")[0];return"color"===a.type&&"!"!==a.value}(),s=["<div class='sp-replacer'>","<div class='sp-preview'><div class='sp-preview-inner'></div></div>","<div class='sp-dd'>&#9660;</div>","</div>"].join(""),t=function(){var a="";if(p)for(var b=1;b<=6;b++)a+="<div class='sp-"+b+"'></div>";return["<div class='sp-container sp-hidden'>","<div class='sp-palette-container'>","<div class='sp-palette sp-thumb sp-cf'></div>","</div>","<div class='sp-picker-container'>","<div class='sp-top sp-cf'>","<div class='sp-fill'></div>","<div class='sp-top-inner'>","<div class='sp-color'>","<div class='sp-sat'>","<div class='sp-val'>","<div class='sp-dragger'></div>","</div>","</div>","</div>","<div class='sp-clear sp-clear-display' title='Clear Color Selection'>","</div>","<div class='sp-hue'>","<div class='sp-slider'></div>",a,"</div>","</div>","<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>","</div>","<div class='sp-input-container sp-cf'>","<input class='sp-input' type='text' spellcheck='false'  />","</div>","<div class='sp-initial sp-thumb sp-cf'></div>","<div class='sp-button-container sp-cf'>","<a class='sp-cancel' href='#'></a>","<button class='sp-choose'></button>","</div>","</div>","</div>"].join("")}(),u="spectrum.id";b.fn.spectrum=function(a,c){if("string"==typeof a){var d=this,e=Array.prototype.slice.call(arguments,1);return this.each(function(){var c=o[b(this).data(u)];if(c){var f=c[a];if(!f)throw new Error("Spectrum: no such method: '"+a+"'");"get"==a?d=c.get():"container"==a?d=c.container:"option"==a?d=c.option.apply(c,e):"destroy"==a?(c.destroy(),b(this).removeData(u)):f.apply(c,e)}}),d}return this.spectrum("destroy").each(function(){var c=g(this,a);b(this).data(u,c.id)})},b.fn.spectrum.load=!0,b.fn.spectrum.loadOpts={},b.fn.spectrum.draggable=l,b.fn.spectrum.defaults=n,b.spectrum={},b.spectrum.localization={},b.spectrum.palettes={},b.fn.spectrum.processNativeColorInputs=function(){r||b("input[type=color]").spectrum({preferredFormat:"hex6"})},function(){function b(a,d){if(a=a?a:"",d=d||{},"object"==typeof a&&a.hasOwnProperty("_tc_id"))return a;var f=c(a),h=f.r,j=f.g,m=f.b,n=f.a,o=x(100*n)/100,p=d.format||f.format;return h<1&&(h=x(h)),j<1&&(j=x(j)),m<1&&(m=x(m)),{ok:f.ok,format:p,_tc_id:v++,alpha:n,getAlpha:function(){return n},setAlpha:function(a){n=k(a),o=x(100*n)/100},toHsv:function(){var a=g(h,j,m);return{h:360*a.h,s:a.s,v:a.v,a:n}},toHsvString:function(){var a=g(h,j,m),b=x(360*a.h),c=x(100*a.s),d=x(100*a.v);return 1==n?"hsv("+b+", "+c+"%, "+d+"%)":"hsva("+b+", "+c+"%, "+d+"%, "+o+")"},toHsl:function(){var a=e(h,j,m);return{h:360*a.h,s:a.s,l:a.l,a:n}},toHslString:function(){var a=e(h,j,m),b=x(360*a.h),c=x(100*a.s),d=x(100*a.l);return 1==n?"hsl("+b+", "+c+"%, "+d+"%)":"hsla("+b+", "+c+"%, "+d+"%, "+o+")"},toHex:function(a){return i(h,j,m,a)},toHexString:function(a){return"#"+i(h,j,m,a)},toRgb:function(){return{r:x(h),g:x(j),b:x(m),a:n}},toRgbString:function(){return 1==n?"rgb("+x(h)+", "+x(j)+", "+x(m)+")":"rgba("+x(h)+", "+x(j)+", "+x(m)+", "+o+")"},toPercentageRgb:function(){return{r:x(100*l(h,255))+"%",g:x(100*l(j,255))+"%",b:x(100*l(m,255))+"%",a:n}},toPercentageRgbString:function(){return 1==n?"rgb("+x(100*l(h,255))+"%, "+x(100*l(j,255))+"%, "+x(100*l(m,255))+"%)":"rgba("+x(100*l(h,255))+"%, "+x(100*l(j,255))+"%, "+x(100*l(m,255))+"%, "+o+")"},toName:function(){return 0===n?"transparent":C[i(h,j,m,!0)]||!1},toFilter:function(a){var c=i(h,j,m),e=c,f=Math.round(255*parseFloat(n)).toString(16),g=f,k=d&&d.gradientType?"GradientType = 1, ":"";if(a){var l=b(a);e=l.toHex(),g=Math.round(255*parseFloat(l.alpha)).toString(16)}return"progid:DXImageTransform.Microsoft.gradient("+k+"startColorstr=#"+q(f)+c+",endColorstr=#"+q(g)+e+")"},toString:function(a){var b=!!a;a=a||this.format;var c=!1,d=!b&&n<1&&n>0,e=d&&("hex"===a||"hex6"===a||"hex3"===a||"name"===a);return"rgb"===a&&(c=this.toRgbString()),"prgb"===a&&(c=this.toPercentageRgbString()),"hex"!==a&&"hex6"!==a||(c=this.toHexString()),"hex3"===a&&(c=this.toHexString(!0)),"name"===a&&(c=this.toName()),"hsl"===a&&(c=this.toHslString()),"hsv"===a&&(c=this.toHsvString()),e?this.toRgbString():c||this.toHexString()}}}function c(a){var b={r:0,g:0,b:0},c=1,e=!1,g=!1;return"string"==typeof a&&(a=s(a)),"object"==typeof a&&(a.hasOwnProperty("r")&&a.hasOwnProperty("g")&&a.hasOwnProperty("b")?(b=d(a.r,a.g,a.b),e=!0,g="%"===String(a.r).substr(-1)?"prgb":"rgb"):a.hasOwnProperty("h")&&a.hasOwnProperty("s")&&a.hasOwnProperty("v")?(a.s=r(a.s),a.v=r(a.v),b=h(a.h,a.s,a.v),e=!0,g="hsv"):a.hasOwnProperty("h")&&a.hasOwnProperty("s")&&a.hasOwnProperty("l")&&(a.s=r(a.s),a.l=r(a.l),b=f(a.h,a.s,a.l),e=!0,g="hsl"),a.hasOwnProperty("a")&&(c=a.a)),c=k(c),{ok:e,format:a.format||g,r:y(255,z(b.r,0)),g:y(255,z(b.g,0)),b:y(255,z(b.b,0)),a:c}}function d(a,b,c){return{r:255*l(a,255),g:255*l(b,255),b:255*l(c,255)}}function e(a,b,c){a=l(a,255),b=l(b,255),c=l(c,255);var d,e,f=z(a,b,c),g=y(a,b,c),h=(f+g)/2;if(f==g)d=e=0;else{var i=f-g;switch(e=h>.5?i/(2-f-g):i/(f+g),f){case a:d=(b-c)/i+(b<c?6:0);break;case b:d=(c-a)/i+2;break;case c:d=(a-b)/i+4}d/=6}return{h:d,s:e,l:h}}function f(a,b,c){function d(a,b,c){return c<0&&(c+=1),c>1&&(c-=1),c<1/6?a+6*(b-a)*c:c<.5?b:c<2/3?a+(b-a)*(2/3-c)*6:a}var e,f,g;if(a=l(a,360),b=l(b,100),c=l(c,100),0===b)e=f=g=c;else{var h=c<.5?c*(1+b):c+b-c*b,i=2*c-h;e=d(i,h,a+1/3),f=d(i,h,a),g=d(i,h,a-1/3)}return{r:255*e,g:255*f,b:255*g}}function g(a,b,c){a=l(a,255),b=l(b,255),c=l(c,255);var d,e,f=z(a,b,c),g=y(a,b,c),h=f,i=f-g;if(e=0===f?0:i/f,f==g)d=0;else{switch(f){case a:d=(b-c)/i+(b<c?6:0);break;case b:d=(c-a)/i+2;break;case c:d=(a-b)/i+4}d/=6}return{h:d,s:e,v:h}}function h(a,b,c){a=6*l(a,360),b=l(b,100),c=l(c,100);var d=w.floor(a),e=a-d,f=c*(1-b),g=c*(1-e*b),h=c*(1-(1-e)*b),i=d%6,j=[c,g,f,f,h,c][i],k=[h,c,c,g,f,f][i],m=[f,f,h,c,c,g][i];return{r:255*j,g:255*k,b:255*m}}function i(a,b,c,d){var e=[q(x(a).toString(16)),q(x(b).toString(16)),q(x(c).toString(16))];return d&&e[0].charAt(0)==e[0].charAt(1)&&e[1].charAt(0)==e[1].charAt(1)&&e[2].charAt(0)==e[2].charAt(1)?e[0].charAt(0)+e[1].charAt(0)+e[2].charAt(0):e.join("")}function j(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[a[c]]=c);return b}function k(a){return a=parseFloat(a),(isNaN(a)||a<0||a>1)&&(a=1),a}function l(a,b){o(a)&&(a="100%");var c=p(a);return a=y(b,z(0,parseFloat(a))),c&&(a=parseInt(a*b,10)/100),w.abs(a-b)<1e-6?1:a%b/parseFloat(b)}function m(a){return y(1,z(0,a))}function n(a){return parseInt(a,16)}function o(a){return"string"==typeof a&&a.indexOf(".")!=-1&&1===parseFloat(a)}function p(a){return"string"==typeof a&&a.indexOf("%")!=-1}function q(a){return 1==a.length?"0"+a:""+a}function r(a){return a<=1&&(a=100*a+"%"),a}function s(a){a=a.replace(t,"").replace(u,"").toLowerCase();var b=!1;if(B[a])a=B[a],b=!0;else if("transparent"==a)return{r:0,g:0,b:0,a:0,format:"name"};var c;return(c=D.rgb.exec(a))?{r:c[1],g:c[2],b:c[3]}:(c=D.rgba.exec(a))?{r:c[1],g:c[2],b:c[3],a:c[4]}:(c=D.hsl.exec(a))?{h:c[1],s:c[2],l:c[3]}:(c=D.hsla.exec(a))?{h:c[1],s:c[2],l:c[3],a:c[4]}:(c=D.hsv.exec(a))?{h:c[1],s:c[2],v:c[3]}:(c=D.hex6.exec(a))?{r:n(c[1]),g:n(c[2]),b:n(c[3]),format:b?"name":"hex"}:!!(c=D.hex3.exec(a))&&{r:n(c[1]+""+c[1]),g:n(c[2]+""+c[2]),b:n(c[3]+""+c[3]),format:b?"name":"hex"}}var t=/^[\s,#]+/,u=/\s+$/,v=0,w=Math,x=w.round,y=w.min,z=w.max,A=w.random;b.fromRatio=function(a,c){if("object"==typeof a){var d={};for(var e in a)a.hasOwnProperty(e)&&("a"===e?d[e]=a[e]:d[e]=r(a[e]));a=d}return b(a,c)},b.equals=function(a,c){return!(!a||!c)&&b(a).toRgbString()==b(c).toRgbString()},b.random=function(){return b.fromRatio({r:A(),g:A(),b:A()})},b.desaturate=function(a,c){c=0===c?0:c||10;var d=b(a).toHsl();return d.s-=c/100,d.s=m(d.s),b(d)},b.saturate=function(a,c){c=0===c?0:c||10;var d=b(a).toHsl();return d.s+=c/100,d.s=m(d.s),b(d)},b.greyscale=function(a){return b.desaturate(a,100)},b.lighten=function(a,c){c=0===c?0:c||10;var d=b(a).toHsl();return d.l+=c/100,d.l=m(d.l),b(d)},b.darken=function(a,c){c=0===c?0:c||10;var d=b(a).toHsl();return d.l-=c/100,d.l=m(d.l),b(d)},b.complement=function(a){var c=b(a).toHsl();return c.h=(c.h+180)%360,b(c)},b.triad=function(a){var c=b(a).toHsl(),d=c.h;return[b(a),b({h:(d+120)%360,s:c.s,l:c.l}),b({h:(d+240)%360,s:c.s,l:c.l})]},b.tetrad=function(a){var c=b(a).toHsl(),d=c.h;return[b(a),b({h:(d+90)%360,s:c.s,l:c.l}),b({h:(d+180)%360,s:c.s,l:c.l}),b({h:(d+270)%360,s:c.s,l:c.l})]},b.splitcomplement=function(a){var c=b(a).toHsl(),d=c.h;return[b(a),b({h:(d+72)%360,s:c.s,l:c.l}),b({h:(d+216)%360,s:c.s,l:c.l})]},b.analogous=function(a,c,d){c=c||6,d=d||30;var e=b(a).toHsl(),f=360/d,g=[b(a)];for(e.h=(e.h-(f*c>>1)+720)%360;--c;)e.h=(e.h+f)%360,g.push(b(e));return g},b.monochromatic=function(a,c){c=c||6;for(var d=b(a).toHsv(),e=d.h,f=d.s,g=d.v,h=[],i=1/c;c--;)h.push(b({h:e,s:f,v:g})),g=(g+i)%1;return h},b.readability=function(a,c){var d=b(a).toRgb(),e=b(c).toRgb(),f=(299*d.r+587*d.g+114*d.b)/1e3,g=(299*e.r+587*e.g+114*e.b)/1e3,h=Math.max(d.r,e.r)-Math.min(d.r,e.r)+Math.max(d.g,e.g)-Math.min(d.g,e.g)+Math.max(d.b,e.b)-Math.min(d.b,e.b);return{brightness:Math.abs(f-g),color:h}},b.readable=function(a,c){var d=b.readability(a,c);return d.brightness>125&&d.color>500},b.mostReadable=function(a,c){for(var d=null,e=0,f=!1,g=0;g<c.length;g++){var h=b.readability(a,c[g]),i=h.brightness>125&&h.color>500,j=3*(h.brightness/125)+h.color/500;(i&&!f||i&&f&&j>e||!i&&!f&&j>e)&&(f=i,e=j,d=b(c[g]))}return d};var B=b.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},C=b.hexNames=j(B),D=function(){var a="[-\\+]?\\d+%?",b="[-\\+]?\\d*\\.\\d+%?",c="(?:"+b+")|(?:"+a+")",d="[\\s|\\(]+("+c+")[,|\\s]+("+c+")[,|\\s]+("+c+")\\s*\\)?",e="[\\s|\\(]+("+c+")[,|\\s]+("+c+")[,|\\s]+("+c+")[,|\\s]+("+c+")\\s*\\)?";return{rgb:new RegExp("rgb"+d),rgba:new RegExp("rgba"+e),hsl:new RegExp("hsl"+d),hsla:new RegExp("hsla"+e),hsv:new RegExp("hsv"+d),hex3:/^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();a.tinycolor=b}(),b(function(){b.fn.spectrum.load&&b.fn.spectrum.processNativeColorInputs()})}(window,jQuery);