!function(){function a(a){for(var b,c,d,e=a.css("color"),f=a[0],g=!1;f&&!d&&!g;){try{b=$(f).css("background-color")}catch(h){b="transparent"}"transparent"!==b&&"rgba(0, 0, 0, 0)"!==b&&(d=b),g=f.body,f=f.parentNode}var i,j=/rgb[a]*\((\d+),\s*(\d+),\s*(\d+)/,k=/#([AaBbCcDdEeFf\d]{2})([AaBbCcDdEeFf\d]{2})([AaBbCcDdEeFf\d]{2})/;b=c,b=e.match(j),b?i={r:parseInt(b[1],10),g:parseInt(b[2],10),b:parseInt(b[3],10)}:(b=e.match(k),b&&(i={r:parseInt(b[1],16),g:parseInt(b[2],16),b:parseInt(b[3],16)}));var l;d?(b=c,b=d.match(j),b?l={r:parseInt(b[1],10),g:parseInt(b[2],10),b:parseInt(b[3],10)}:(b=d.match(k),b&&(l={r:parseInt(b[1],16),g:parseInt(b[2],16),b:parseInt(b[3],16)}))):l=i&&Math.max.apply(null,[i.r,i.g,i.b])>127?{r:0,g:0,b:0}:{r:255,g:255,b:255};var m,n,o,p=function(a){return"rgb("+[a.r,a.g,a.b].join(", ")+")"};if(i&&l){var q=Math.max.apply(null,[i.r,i.g,i.b]);n=Math.max.apply(null,[l.r,l.g,l.b]),o=Math.round(n+-1*(n-q)*.75),m={r:o,g:o,b:o}}else if(i){n=Math.max.apply(null,[i.r,i.g,i.b]);var r=1;n>127&&(r=-1),o=Math.round(n+96*r),m={r:o,g:o,b:o}}else m={r:191,g:191,b:191};return{color:e,"background-color":l?p(l):d,"decor-color":p(m)}}function b(a,b){this.x=a,this.y=b,this.reverse=function(){return new this.constructor(-1*this.x,-1*this.y)},this._length=null,this.getLength=function(){return this._length||(this._length=Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))),this._length};var c=function(a){return Math.round(a/Math.abs(a))};this.resizeTo=function(a){if(0===this.x&&0===this.y)this._length=0;else if(0===this.x)this._length=a,this.y=a*c(this.y);else if(0===this.y)this._length=a,this.x=a*c(this.x);else{var b=Math.abs(this.y/this.x),d=Math.sqrt(Math.pow(a,2)/(1+Math.pow(b,2))),e=b*d;this._length=a,this.x=d*c(this.x),this.y=e*c(this.y)}return this},this.angleTo=function(a){var b=this.getLength()*a.getLength();return 0===b?0:Math.acos(Math.min(Math.max((this.x*a.x+this.y*a.y)/b,-1),1))/Math.PI}}function c(a,c){this.x=a,this.y=c,this.getVectorToCoordinates=function(a,c){return new b(a-this.x,c-this.y)},this.getVectorFromCoordinates=function(a,b){return this.getVectorToCoordinates(a,b).reverse()},this.getVectorToPoint=function(a){return new b(a.x-this.x,a.y-this.y)},this.getVectorFromPoint=function(a){return this.getVectorToPoint(a).reverse()}}function d(a,b,c,d,e){if(this.data=a,this.context=b,a.length)for(var f,g,h=a.length,i=0;h>i;i++){f=a[i],g=f.x.length,c.call(b,f);for(var j=1;g>j;j++)d.call(b,f,j);e.call(b,f)}this.changed=function(){},this.startStrokeFn=c,this.addToStrokeFn=d,this.endStrokeFn=e,this.inStroke=!1,this._lastPoint=null,this._stroke=null,this.startStroke=function(a){if(a&&"number"==typeof a.x&&"number"==typeof a.y){this._stroke={x:[a.x],y:[a.y]},this.data.push(this._stroke),this._lastPoint=a,this.inStroke=!0;var b=this._stroke,c=this.startStrokeFn,d=this.context;return setTimeout(function(){c.call(d,b)},3),a}return null},this.addToStroke=function(a){if(this.inStroke&&"number"==typeof a.x&&"number"==typeof a.y&&Math.abs(a.x-this._lastPoint.x)+Math.abs(a.y-this._lastPoint.y)>4){var b=this._stroke.x.length;this._stroke.x.push(a.x),this._stroke.y.push(a.y),this._lastPoint=a;var c=this._stroke,d=this.addToStrokeFn,e=this.context;return setTimeout(function(){d.call(e,c,b)},3),a}return null},this.endStroke=function(){var a=this.inStroke;if(this.inStroke=!1,this._lastPoint=null,a){var b=this._stroke,c=this.endStrokeFn,d=this.context,e=this.changed;return setTimeout(function(){c.call(d,b),e.call(d)},3),!0}return null}}function e(a,b,c,d){"use strict";("ratio"===b||"%"===b.split("")[b.length-1])&&(this.eventTokens[c+".parentresized"]=d.subscribe(c+".parentresized",function(b,e,f){return function(){var g=e.width();if(g!==f){for(var h in b)b.hasOwnProperty(h)&&(d.unsubscribe(b[h]),delete b[h]);var i=a.settings;a.$parent.children().remove();for(var h in a)a.hasOwnProperty(h)&&delete a[h];i.data=function(a,b){var c,d,e,f,g,h,i=[];for(d=0,e=a.length;e>d;d++){for(h=a[d],c={x:[],y:[]},f=0,g=h.x.length;g>f;f++)c.x.push(h.x[f]*b),c.y.push(h.y[f]*b);i.push(c)}return i}(i.data,1*g/f),e[c](i)}}}(this.eventTokens,this.$parent,this.$parent.width(),1*this.canvas.width/this.canvas.height)))}function f(b,d,f){var g=this.$parent=$(b),k=this.eventTokens={},l=(this.events=new j(this),$.fn[h]("globalEvents")),m={width:"ratio",height:"ratio",sizeRatio:4,color:"#000","background-color":"#fff","decor-color":"#eee",lineWidth:0,minFatFingerCompensation:-10,showUndoButton:!1,data:[]};$.extend(m,a(g)),d&&$.extend(m,d),this.settings=m;for(var n in f)f.hasOwnProperty(n)&&f[n].call(this,n);this.events.publish(h+".initializing"),this.$controlbarUpper=function(){var a="padding:0 !important;margin:0 !important;width: 100% !important; height: 0 !important;margin-top:-1em !important;margin-bottom:1em !important;";return $('<div style="'+a+'"></div>').appendTo(g)}(),this.isCanvasEmulator=!1;var o=this.canvas=this.initializeCanvas(m),p=$(o);this.$controlbarLower=function(){var a="padding:0 !important;margin:0 !important;width: 100% !important; height: 0 !important;margin-top:-1.5em !important;margin-bottom:1.5em !important;";return $('<div style="'+a+'"></div>').appendTo(g)}(),this.canvasContext=o.getContext("2d"),p.data(h+".this",this),m.lineWidth=function(a,b){return a?a:Math.max(Math.round(b/400),2)}(m.lineWidth,o.width),this.lineCurveThreshold=3*m.lineWidth,m.cssclass&&""!=$.trim(m.cssclass)&&p.addClass(m.cssclass),this.fatFingerCompensation=0;var q=function(a){var b,d,e=function(){var c=$(a.canvas).offset();b=-1*c.left,d=-1*c.top},f=function(e){var f=e.changedTouches&&e.changedTouches.length>0?e.changedTouches[0]:e;return new c(Math.round(f.pageX+b),Math.round(f.pageY+d)+a.fatFingerCompensation)},g=new i(750,function(){a.dataEngine.endStroke()});return this.drawEndHandler=function(b){try{b.preventDefault()}catch(c){}g.clear(),a.dataEngine.endStroke()},this.drawStartHandler=function(b){b.preventDefault(),e(),a.dataEngine.startStroke(f(b)),g.kick()},this.drawMoveHandler=function(b){b.preventDefault(),a.dataEngine.inStroke&&(a.dataEngine.addToStroke(f(b)),g.kick())},this}.call({},this);return function(a,b,c){var d,e=this.canvas,f=$(e);this.isCanvasEmulator?(f.bind("mousemove."+h,c),f.bind("mouseup."+h,a),f.bind("mousedown."+h,b)):(e.ontouchstart=function(f){e.onmousedown=d,e.onmouseup=d,e.onmousemove=d,this.fatFingerCompensation=m.minFatFingerCompensation&&-3*m.lineWidth>m.minFatFingerCompensation?-3*m.lineWidth:m.minFatFingerCompensation,b(f),e.ontouchend=a,e.ontouchstart=b,e.ontouchmove=c},e.onmousedown=function(f){e.ontouchstart=d,e.ontouchend=d,e.ontouchmove=d,b(f),e.onmousedown=b,e.onmouseup=a,e.onmousemove=c})}.call(this,q.drawEndHandler,q.drawStartHandler,q.drawMoveHandler),k[h+".windowmouseup"]=l.subscribe(h+".windowmouseup",q.drawEndHandler),this.events.publish(h+".attachingEventHandlers"),e.call(this,this,m.width.toString(10),h,l),this.resetCanvas(m.data),this.events.publish(h+".initialized"),this}function g(a){if(a.getContext)return!1;var b=a.ownerDocument.parentWindow,c=b.FlashCanvas?a.ownerDocument.parentWindow.FlashCanvas:"undefined"==typeof FlashCanvas?void 0:FlashCanvas;if(c){a=c.initElement(a);var d=1;if(b&&b.screen&&b.screen.deviceXDPI&&b.screen.logicalXDPI&&(d=1*b.screen.deviceXDPI/b.screen.logicalXDPI),1!==d)try{$(a).children("object").get(0).resize(Math.ceil(a.width*d),Math.ceil(a.height*d)),a.getContext("2d").scale(d,d)}catch(e){}return!0}throw new Error("Canvas element does not support 2d context. jSignature cannot proceed.")}var h="jSignature",i=function(a,b){var c;return this.kick=function(){clearTimeout(c),c=setTimeout(b,a)},this.clear=function(){clearTimeout(c)},this},j=function(a){"use strict";this.topics={},this.context=a?a:this,this.publish=function(a){if(this.topics[a]){var b,c,d,e,f=this.topics[a],g=Array.prototype.slice.call(arguments,1),h=[];for(c=0,d=f.length;d>c;c++)e=f[c],b=e[0],e[1]&&(e[0]=function(){},h.push(c)),b.apply(this.context,g);for(c=0,d=h.length;d>c;c++)f.splice(h[c],1)}},this.subscribe=function(a,b,c){return this.topics[a]?this.topics[a].push([b,c]):this.topics[a]=[[b,c]],{topic:a,callback:b}},this.unsubscribe=function(a){if(this.topics[a.topic])for(var b=this.topics[a.topic],c=0,d=b.length;d>c;c++)b[c][0]===a.callback&&b.splice(c,1)}},k=function(a,b,c,d){var e=a.fillStyle;a.fillStyle=a.strokeStyle,a.fillRect(b+d/-2,c+d/-2,d,d),a.fillStyle=e},l=function(a,b,c,d,e){a.beginPath(),a.moveTo(b,c),a.lineTo(d,e),a.stroke()},m=function(a,b,c,d,e,f,g,h,i){a.beginPath(),a.moveTo(b,c),a.bezierCurveTo(f,g,h,i,d,e),a.stroke()},n=function(a){k(this.canvasContext,a.x[0],a.y[0],this.settings.lineWidth)},o=function(a,d){var e=new c(a.x[d-1],a.y[d-1]),f=new c(a.x[d],a.y[d]),g=e.getVectorToPoint(f);if(d>1){var h,i=new c(a.x[d-2],a.y[d-2]),j=i.getVectorToPoint(e);if(j.getLength()>this.lineCurveThreshold){h=d>2?new c(a.x[d-3],a.y[d-3]).getVectorToPoint(i):new b(0,0);var k=.05,n=.35*j.getLength(),o=j.angleTo(h.reverse()),p=g.angleTo(j.reverse()),q=new b(h.x+j.x,h.y+j.y).resizeTo(Math.max(k,o)*n),r=new b(j.x+g.x,j.y+g.y).reverse().resizeTo(Math.max(k,p)*n);m(this.canvasContext,i.x,i.y,e.x,e.y,i.x+q.x,i.y+q.y,e.x+r.x,e.y+r.y)}}g.getLength()<=this.lineCurveThreshold&&l(this.canvasContext,e.x,e.y,f.x,f.y)},p=function(a){var d=a.x.length-1;if(d>0){var e,f=new c(a.x[d],a.y[d]),g=new c(a.x[d-1],a.y[d-1]),h=g.getVectorToPoint(f);if(h.getLength()>this.lineCurveThreshold)if(d>1){e=new c(a.x[d-2],a.y[d-2]).getVectorToPoint(g);var i=new b(e.x+h.x,e.y+h.y).resizeTo(h.getLength()/2);m(this.canvasContext,g.x,g.y,f.x,f.y,g.x+i.x,g.y+i.y,f.x,f.y)}else l(this.canvasContext,g.x,g.y,f.x,f.y)}};f.prototype.resetCanvas=function(a){var b=this.canvas,c=this.settings,e=this.canvasContext,f=this.isCanvasEmulator,g=b.width,i=b.height;e.clearRect(0,0,g+30,i+30),e.shadowColor=e.fillStyle=c["background-color"],f&&e.fillRect(0,0,g+30,i+30),e.lineWidth=Math.ceil(parseInt(c.lineWidth,10)),e.lineCap=e.lineJoin="round",e.strokeStyle=c["decor-color"],e.shadowOffsetX=0,e.shadowOffsetY=0;var j=Math.round(i/5);l(e,1.5*j,i-j,g-1.5*j,i-j),e.strokeStyle=c.color,f||(e.shadowColor=e.strokeStyle,e.shadowOffsetX=.5*e.lineWidth,e.shadowOffsetY=e.lineWidth*-.6,e.shadowBlur=0),a||(a=[]);var k=this.dataEngine=new d(a,this,n,o,p);return c.data=a,$(b).data(h+".data",a).data(h+".settings",c),k.changed=function(a,b,c){"use strict";return function(){b.publish(c+".change"),a.trigger("change")}}(this.$parent,this.events,h),k.changed(),!0},f.prototype.initializeCanvas=function(a){var b=document.createElement("canvas"),c=$(b);return a.width===a.height&&"ratio"===a.height&&(a.width="100%"),c.css("margin",0).css("padding",0).css("border","none").css("height","ratio"!==a.height&&a.height?a.height.toString(10):1).css("width","ratio"!==a.width&&a.width?a.width.toString(10):1),c.appendTo(this.$parent),"ratio"===a.height?c.css("height",Math.round(c.width()/a.sizeRatio)):"ratio"===a.width&&c.css("width",Math.round(c.height()*a.sizeRatio)),c.addClass(h),b.width=c.width(),b.height=c.height(),this.isCanvasEmulator=g(b),b.onselectstart=function(a){return a&&a.preventDefault&&a.preventDefault(),a&&a.stopPropagation&&a.stopPropagation(),!1},b};var q=function(a){function b(a,b){"use strict";var c=new Image,d=this;c.onload=function(){d.getContext("2d").drawImage(c,0,0,c.width<d.width?c.width:d.width,c.height<d.height?c.height:d.height)},c.src="data:"+b+","+a}function c(a){return this.find("canvas."+h).add(this.filter("canvas."+h)).data(h+".this").resetCanvas(a),this}function d(a,b){var c;if(b!==c||"string"!=typeof a||"data:"!==a.substr(0,5)||(b=a.slice(5).split(",")[0],a=a.slice(6+b.length),b!==a)){var d=this.find("canvas."+h).add(this.filter("canvas."+h));if(!k.hasOwnProperty(b))throw new Error(h+" is unable to find import plugin with for format '"+String(b)+"'");return 0!==d.length&&k[b].call(d[0],a,b,function(a){return function(){return a.resetCanvas.apply(a,arguments)}}(d.data(h+".this"))),this}}var e=new j;!function(a,b,c,d){"use strict";var e,f=function(){a.publish(b+".parentresized")};c(d).bind("resize."+b,function(){e&&clearTimeout(e),e=setTimeout(f,500)}).bind("mouseup."+b,function(){a.publish(b+".windowmouseup")})}(e,h,$,a);var g={},i={"default":function(){return this.toDataURL()},"native":function(a){return a},image:function(){var a=this.toDataURL();if("string"==typeof a&&a.length>4&&"data:"===a.slice(0,5)&&-1!==a.indexOf(",")){var b=a.indexOf(",");return[a.slice(5,b),a.substr(b+1)]}return[]}},k={"native":function(a,b,c){c(a)},image:b,"image/png;base64":b,"image/jpeg;base64":b,"image/jpg;base64":b},l=function(a){var b=!1;for(a=a.parentNode;a&&!b;)b=a.body,a=a.parentNode;return!b},m={"export":i,"import":k,instance:g},n={init:function(a){return this.each(function(){l(this)||new f(this,a,g)})},getSettings:function(){return this.find("canvas."+h).add(this.filter("canvas."+h)).data(h+".this").settings},clear:c,reset:c,addPlugin:function(a,b,c){return m.hasOwnProperty(a)&&(m[a][b]=c),this},listPlugins:function(a){var b=[];if(m.hasOwnProperty(a)){var c=m[a];for(var d in c)c.hasOwnProperty(d)&&b.push(d)}return b},getData:function(a){var b,c=this.find("canvas."+h).add(this.filter("canvas."+h));return a===b&&(a="default"),0!==c.length&&i.hasOwnProperty(a)?i[a].call(c.get(0),c.data(h+".data")):void 0},importData:d,setData:d,globalEvents:function(){return e},events:function(){return this.find("canvas."+h).add(this.filter("canvas."+h)).data(h+".this").events}};$.fn[h]=function(a){"use strict";return a&&"object"!=typeof a?"string"==typeof a&&n[a]?n[a].apply(this,Array.prototype.slice.call(arguments,1)):void $.error("Method "+String(a)+" does not exist on jQuery."+h):n.init.apply(this,arguments)}};q(window)}();