!function(){function t(t){for(var n,e,i,r=t.css("color"),s=t[0],a=!1;s&&!i&&!a;){try{n=$(s).css("background-color")}catch(o){n="transparent"}"transparent"!==n&&"rgba(0, 0, 0, 0)"!==n&&(i=n),a=s.body,s=s.parentNode}var h,c=/rgb[a]*\((\d+),\s*(\d+),\s*(\d+)/,u=/#([AaBbCcDdEeFf\d]{2})([AaBbCcDdEeFf\d]{2})([AaBbCcDdEeFf\d]{2})/;n=e,n=r.match(c),n?h={r:parseInt(n[1],10),g:parseInt(n[2],10),b:parseInt(n[3],10)}:(n=r.match(u),n&&(h={r:parseInt(n[1],16),g:parseInt(n[2],16),b:parseInt(n[3],16)}));var l;i?(n=e,n=i.match(c),n?l={r:parseInt(n[1],10),g:parseInt(n[2],10),b:parseInt(n[3],10)}:(n=i.match(u),n&&(l={r:parseInt(n[1],16),g:parseInt(n[2],16),b:parseInt(n[3],16)}))):l=h&&Math.max.apply(null,[h.r,h.g,h.b])>127?{r:0,g:0,b:0}:{r:255,g:255,b:255};var d,g,f,p=function(t){return"rgb("+[t.r,t.g,t.b].join(", ")+")"};if(h&&l){var v=Math.max.apply(null,[h.r,h.g,h.b]);g=Math.max.apply(null,[l.r,l.g,l.b]),f=Math.round(g+-1*(g-v)*.75),d={r:f,g:f,b:f}}else if(h){g=Math.max.apply(null,[h.r,h.g,h.b]);var m=1;g>127&&(m=-1),f=Math.round(g+96*m),d={r:f,g:f,b:f}}else d={r:191,g:191,b:191};return{color:r,"background-color":l?p(l):i,"decor-color":p(d)}}function n(t,n){this.x=t,this.y=n,this.reverse=function(){return new this.constructor(-1*this.x,-1*this.y)},this._length=null,this.getLength=function(){return this._length||(this._length=Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))),this._length};var e=function(t){return Math.round(t/Math.abs(t))};this.resizeTo=function(t){if(0===this.x&&0===this.y)this._length=0;else if(0===this.x)this._length=t,this.y=t*e(this.y);else if(0===this.y)this._length=t,this.x=t*e(this.x);else{var n=Math.abs(this.y/this.x),i=Math.sqrt(Math.pow(t,2)/(1+Math.pow(n,2))),r=n*i;this._length=t,this.x=i*e(this.x),this.y=r*e(this.y)}return this},this.angleTo=function(t){var n=this.getLength()*t.getLength();return 0===n?0:Math.acos(Math.min(Math.max((this.x*t.x+this.y*t.y)/n,-1),1))/Math.PI}}function e(t,e){this.x=t,this.y=e,this.getVectorToCoordinates=function(t,e){return new n(t-this.x,e-this.y)},this.getVectorFromCoordinates=function(t,n){return this.getVectorToCoordinates(t,n).reverse()},this.getVectorToPoint=function(t){return new n(t.x-this.x,t.y-this.y)},this.getVectorFromPoint=function(t){return this.getVectorToPoint(t).reverse()}}function i(t,n,e,i,r){if(this.data=t,this.context=n,t.length)for(var s,a,o=t.length,h=0;o>h;h++){s=t[h],a=s.x.length,e.call(n,s);for(var c=1;a>c;c++)i.call(n,s,c);r.call(n,s)}this.changed=function(){},this.startStrokeFn=e,this.addToStrokeFn=i,this.endStrokeFn=r,this.inStroke=!1,this._lastPoint=null,this._stroke=null,this.startStroke=function(t){if(t&&"number"==typeof t.x&&"number"==typeof t.y){this._stroke={x:[t.x],y:[t.y]},this.data.push(this._stroke),this._lastPoint=t,this.inStroke=!0;var n=this._stroke,e=this.startStrokeFn,i=this.context;return setTimeout(function(){e.call(i,n)},3),t}return null},this.addToStroke=function(t){if(this.inStroke&&"number"==typeof t.x&&"number"==typeof t.y&&Math.abs(t.x-this._lastPoint.x)+Math.abs(t.y-this._lastPoint.y)>4){var n=this._stroke.x.length;this._stroke.x.push(t.x),this._stroke.y.push(t.y),this._lastPoint=t;var e=this._stroke,i=this.addToStrokeFn,r=this.context;return setTimeout(function(){i.call(r,e,n)},3),t}return null},this.endStroke=function(){var t=this.inStroke;if(this.inStroke=!1,this._lastPoint=null,t){var n=this._stroke,e=this.endStrokeFn,i=this.context,r=this.changed;return setTimeout(function(){e.call(i,n),r.call(i)},3),!0}return null}}function r(t,n,e,i){"use strict";("ratio"===n||"%"===n.split("")[n.length-1])&&(this.eventTokens[e+".parentresized"]=i.subscribe(e+".parentresized",function(n,r,s){return function(){var a=r.width();if(a!==s){for(var o in n)n.hasOwnProperty(o)&&(i.unsubscribe(n[o]),delete n[o]);var h=t.settings;t.$parent.children().remove();for(var o in t)t.hasOwnProperty(o)&&delete t[o];h.data=function(t,n){var e,i,r,s,a,o,h=[];for(i=0,r=t.length;r>i;i++){for(o=t[i],e={x:[],y:[]},s=0,a=o.x.length;a>s;s++)e.x.push(o.x[s]*n),e.y.push(o.y[s]*n);h.push(e)}return h}(h.data,1*a/s),r[e](h)}}}(this.eventTokens,this.$parent,this.$parent.width(),1*this.canvas.width/this.canvas.height)))}function s(n,i,s){var a=this.$parent=$(n),u=this.eventTokens={},l=(this.events=new c(this),$.fn[o]("globalEvents")),d={width:"ratio",height:"ratio",sizeRatio:4,color:"#000","background-color":"#fff","decor-color":"#eee",lineWidth:0,minFatFingerCompensation:-10,showUndoButton:!1,data:[]};$.extend(d,t(a)),i&&$.extend(d,i),this.settings=d;for(var g in s)s.hasOwnProperty(g)&&s[g].call(this,g);this.events.publish(o+".initializing"),this.$controlbarUpper=function(){var t="padding:0 !important;margin:0 !important;width: 100% !important; height: 0 !important;margin-top:-1em !important;margin-bottom:1em !important;";return $('<div style="'+t+'"></div>').appendTo(a)}(),this.isCanvasEmulator=!1;var f=this.canvas=this.initializeCanvas(d),p=$(f);this.$controlbarLower=function(){var t="padding:0 !important;margin:0 !important;width: 100% !important; height: 0 !important;margin-top:-1.5em !important;margin-bottom:1.5em !important;";return $('<div style="'+t+'"></div>').appendTo(a)}(),this.canvasContext=f.getContext("2d"),p.data(o+".this",this),d.lineWidth=function(t,n){return t?t:Math.max(Math.round(n/400),2)}(d.lineWidth,f.width),this.lineCurveThreshold=3*d.lineWidth,d.cssclass&&""!=$.trim(d.cssclass)&&p.addClass(d.cssclass),this.fatFingerCompensation=0;var v=function(t){var n,i,r=function(){var e=$(t.canvas).offset();n=-1*e.left,i=-1*e.top},s=function(r){var s=r.changedTouches&&r.changedTouches.length>0?r.changedTouches[0]:r;return new e(Math.round(s.pageX+n),Math.round(s.pageY+i)+t.fatFingerCompensation)},a=new h(750,function(){t.dataEngine.endStroke()});return this.drawEndHandler=function(n){try{n.preventDefault()}catch(e){}a.clear(),t.dataEngine.endStroke()},this.drawStartHandler=function(n){n.preventDefault(),r(),t.dataEngine.startStroke(s(n)),a.kick()},this.drawMoveHandler=function(n){n.preventDefault(),t.dataEngine.inStroke&&(t.dataEngine.addToStroke(s(n)),a.kick())},this}.call({},this);return function(t,n,e){var i,r=this.canvas,s=$(r);this.isCanvasEmulator?(s.bind("mousemove."+o,e),s.bind("mouseup."+o,t),s.bind("mousedown."+o,n)):(r.ontouchstart=function(s){r.onmousedown=i,r.onmouseup=i,r.onmousemove=i,this.fatFingerCompensation=d.minFatFingerCompensation&&-3*d.lineWidth>d.minFatFingerCompensation?-3*d.lineWidth:d.minFatFingerCompensation,n(s),r.ontouchend=t,r.ontouchstart=n,r.ontouchmove=e},r.onmousedown=function(s){r.ontouchstart=i,r.ontouchend=i,r.ontouchmove=i,n(s),r.onmousedown=n,r.onmouseup=t,r.onmousemove=e})}.call(this,v.drawEndHandler,v.drawStartHandler,v.drawMoveHandler),u[o+".windowmouseup"]=l.subscribe(o+".windowmouseup",v.drawEndHandler),this.events.publish(o+".attachingEventHandlers"),r.call(this,this,d.width.toString(10),o,l),this.resetCanvas(d.data),this.events.publish(o+".initialized"),this}function a(t){if(t.getContext)return!1;var n=t.ownerDocument.parentWindow,e=n.FlashCanvas?t.ownerDocument.parentWindow.FlashCanvas:"undefined"==typeof FlashCanvas?void 0:FlashCanvas;if(e){t=e.initElement(t);var i=1;if(n&&n.screen&&n.screen.deviceXDPI&&n.screen.logicalXDPI&&(i=1*n.screen.deviceXDPI/n.screen.logicalXDPI),1!==i)try{$(t).children("object").get(0).resize(Math.ceil(t.width*i),Math.ceil(t.height*i)),t.getContext("2d").scale(i,i)}catch(r){}return!0}throw new Error("Canvas element does not support 2d context. jSignature cannot proceed.")}var o="jSignature",h=function(t,n){var e;return this.kick=function(){clearTimeout(e),e=setTimeout(n,t)},this.clear=function(){clearTimeout(e)},this},c=function(t){"use strict";this.topics={},this.context=t?t:this,this.publish=function(t){if(this.topics[t]){var n,e,i,r,s=this.topics[t],a=Array.prototype.slice.call(arguments,1),o=[];for(e=0,i=s.length;i>e;e++)r=s[e],n=r[0],r[1]&&(r[0]=function(){},o.push(e)),n.apply(this.context,a);for(e=0,i=o.length;i>e;e++)s.splice(o[e],1)}},this.subscribe=function(t,n,e){return this.topics[t]?this.topics[t].push([n,e]):this.topics[t]=[[n,e]],{topic:t,callback:n}},this.unsubscribe=function(t){if(this.topics[t.topic])for(var n=this.topics[t.topic],e=0,i=n.length;i>e;e++)n[e][0]===t.callback&&n.splice(e,1)}},u=function(t,n,e,i){var r=t.fillStyle;t.fillStyle=t.strokeStyle,t.fillRect(n+i/-2,e+i/-2,i,i),t.fillStyle=r},l=function(t,n,e,i,r){t.beginPath(),t.moveTo(n,e),t.lineTo(i,r),t.stroke()},d=function(t,n,e,i,r,s,a,o,h){t.beginPath(),t.moveTo(n,e),t.bezierCurveTo(s,a,o,h,i,r),t.stroke()},g=function(t){u(this.canvasContext,t.x[0],t.y[0],this.settings.lineWidth)},f=function(t,i){var r=new e(t.x[i-1],t.y[i-1]),s=new e(t.x[i],t.y[i]),a=r.getVectorToPoint(s);if(i>1){var o,h=new e(t.x[i-2],t.y[i-2]),c=h.getVectorToPoint(r);if(c.getLength()>this.lineCurveThreshold){o=i>2?new e(t.x[i-3],t.y[i-3]).getVectorToPoint(h):new n(0,0);var u=.05,g=.35*c.getLength(),f=c.angleTo(o.reverse()),p=a.angleTo(c.reverse()),v=new n(o.x+c.x,o.y+c.y).resizeTo(Math.max(u,f)*g),m=new n(c.x+a.x,c.y+a.y).reverse().resizeTo(Math.max(u,p)*g);d(this.canvasContext,h.x,h.y,r.x,r.y,h.x+v.x,h.y+v.y,r.x+m.x,r.y+m.y)}}a.getLength()<=this.lineCurveThreshold&&l(this.canvasContext,r.x,r.y,s.x,s.y)},p=function(t){var i=t.x.length-1;if(i>0){var r,s=new e(t.x[i],t.y[i]),a=new e(t.x[i-1],t.y[i-1]),o=a.getVectorToPoint(s);if(o.getLength()>this.lineCurveThreshold)if(i>1){r=new e(t.x[i-2],t.y[i-2]).getVectorToPoint(a);var h=new n(r.x+o.x,r.y+o.y).resizeTo(o.getLength()/2);d(this.canvasContext,a.x,a.y,s.x,s.y,a.x+h.x,a.y+h.y,s.x,s.y)}else l(this.canvasContext,a.x,a.y,s.x,s.y)}};s.prototype.resetCanvas=function(t){var n=this.canvas,e=this.settings,r=this.canvasContext,s=this.isCanvasEmulator,a=n.width,h=n.height;r.clearRect(0,0,a+30,h+30),r.shadowColor=r.fillStyle=e["background-color"],s&&r.fillRect(0,0,a+30,h+30),r.lineWidth=Math.ceil(parseInt(e.lineWidth,10)),r.lineCap=r.lineJoin="round",r.strokeStyle=e["decor-color"],r.shadowOffsetX=0,r.shadowOffsetY=0;var c=Math.round(h/5);l(r,1.5*c,h-c,a-1.5*c,h-c),r.strokeStyle=e.color,s||(r.shadowColor=r.strokeStyle,r.shadowOffsetX=.5*r.lineWidth,r.shadowOffsetY=r.lineWidth*-.6,r.shadowBlur=0),t||(t=[]);var u=this.dataEngine=new i(t,this,g,f,p);return e.data=t,$(n).data(o+".data",t).data(o+".settings",e),u.changed=function(t,n,e){"use strict";return function(){n.publish(e+".change"),t.trigger("change")}}(this.$parent,this.events,o),u.changed(),!0},s.prototype.initializeCanvas=function(t){var n=document.createElement("canvas"),e=$(n);return t.width===t.height&&"ratio"===t.height&&(t.width="100%"),e.css("margin",0).css("padding",0).css("border","none").css("height","ratio"!==t.height&&t.height?t.height.toString(10):1).css("width","ratio"!==t.width&&t.width?t.width.toString(10):1),e.appendTo(this.$parent),"ratio"===t.height?e.css("height",Math.round(e.width()/t.sizeRatio)):"ratio"===t.width&&e.css("width",Math.round(e.height()*t.sizeRatio)),e.addClass(o),n.width=e.width(),n.height=e.height(),this.isCanvasEmulator=a(n),n.onselectstart=function(t){return t&&t.preventDefault&&t.preventDefault(),t&&t.stopPropagation&&t.stopPropagation(),!1},n};var v=function(t){function n(t,n){"use strict";var e=new Image,i=this;e.onload=function(){i.getContext("2d").drawImage(e,0,0,e.width<i.width?e.width:i.width,e.height<i.height?e.height:i.height)},e.src="data:"+n+","+t}function e(t){return this.find("canvas."+o).add(this.filter("canvas."+o)).data(o+".this").resetCanvas(t),this}function i(t,n){var e;if(n!==e||"string"!=typeof t||"data:"!==t.substr(0,5)||(n=t.slice(5).split(",")[0],t=t.slice(6+n.length),n!==t)){var i=this.find("canvas."+o).add(this.filter("canvas."+o));if(!u.hasOwnProperty(n))throw new Error(o+" is unable to find import plugin with for format '"+String(n)+"'");return 0!==i.length&&u[n].call(i[0],t,n,function(t){return function(){return t.resetCanvas.apply(t,arguments)}}(i.data(o+".this"))),this}}var r=new c;!function(t,n,e,i){"use strict";var r,s=function(){t.publish(n+".parentresized")};e(i).bind("resize."+n,function(){r&&clearTimeout(r),r=setTimeout(s,500)}).bind("mouseup."+n,function(){t.publish(n+".windowmouseup")})}(r,o,$,t);var a={},h={"default":function(){return this.toDataURL()},"native":function(t){return t},image:function(){var t=this.toDataURL();if("string"==typeof t&&t.length>4&&"data:"===t.slice(0,5)&&-1!==t.indexOf(",")){var n=t.indexOf(",");return[t.slice(5,n),t.substr(n+1)]}return[]}},u={"native":function(t,n,e){e(t)},image:n,"image/png;base64":n,"image/jpeg;base64":n,"image/jpg;base64":n},l=function(t){var n=!1;for(t=t.parentNode;t&&!n;)n=t.body,t=t.parentNode;return!n},d={"export":h,"import":u,instance:a},g={init:function(t){return this.each(function(){l(this)||new s(this,t,a)})},getSettings:function(){return this.find("canvas."+o).add(this.filter("canvas."+o)).data(o+".this").settings},clear:e,reset:e,addPlugin:function(t,n,e){return d.hasOwnProperty(t)&&(d[t][n]=e),this},listPlugins:function(t){var n=[];if(d.hasOwnProperty(t)){var e=d[t];for(var i in e)e.hasOwnProperty(i)&&n.push(i)}return n},getData:function(t){var n,e=this.find("canvas."+o).add(this.filter("canvas."+o));return t===n&&(t="default"),0!==e.length&&h.hasOwnProperty(t)?h[t].call(e.get(0),e.data(o+".data")):void 0},importData:i,setData:i,globalEvents:function(){return r},events:function(){return this.find("canvas."+o).add(this.filter("canvas."+o)).data(o+".this").events}};$.fn[o]=function(t){"use strict";return t&&"object"!=typeof t?"string"==typeof t&&g[t]?g[t].apply(this,Array.prototype.slice.call(arguments,1)):void $.error("Method "+String(t)+" does not exist on jQuery."+o):g.init.apply(this,arguments)}};v(window)}();