cordova.define("org.apache.cordova.file-transfer.FileTransfer",function(e,r,o){function n(e){var r=new s;return r.lengthComputable=e.lengthComputable,r.loaded=e.loaded,r.total=e.total,r}function a(e){var r=null;if(window.btoa){var o=document.createElement("a");o.href=e;var n=null,a=o.protocol+"//",t=a+o.host.replace(":"+o.port,"");if(0!==o.href.indexOf(t)){var l=o.href.indexOf("@");n=o.href.substring(a.length,l)}if(n){var i="Authorization",s="Basic "+window.btoa(n);r={name:i,value:s}}}return r}var t=e("cordova/argscheck"),l=e("cordova/exec"),i=e("./FileTransferError"),s=e("org.apache.cordova.file.ProgressEvent"),u=0,d=function(){this._id=++u,this.onprogress=null};d.prototype.upload=function(e,r,o,s,u,d){t.checkArgs("ssFFO*","FileTransfer.upload",arguments);var f=null,c=null,h=null,p=null,v=!0,g=null,m=null,y=a(r);y&&(u=u||{},u.headers=u.headers||{},u.headers[y.name]=y.value),u&&(f=u.fileKey,c=u.fileName,h=u.mimeType,g=u.headers,m=u.httpMethod||"POST",m="PUT"==m.toUpperCase()?"PUT":"POST",(null!==u.chunkedMode||"undefined"!=typeof u.chunkedMode)&&(v=u.chunkedMode),p=u.params?u.params:{});var F=s&&function(e){var r=new i(e.code,e.source,e.target,e.http_status,e.body);s(r)},w=this,T=function(e){"undefined"!=typeof e.lengthComputable?w.onprogress&&w.onprogress(n(e)):o&&o(e)};l(T,F,"FileTransfer","upload",[e,r,f,c,h,p,d,v,g,this._id,m])},d.prototype.download=function(r,o,s,u,d,f){t.checkArgs("ssFF*","FileTransfer.download",arguments);var c=this,h=a(r);h&&(f=f||{},f.headers=f.headers||{},f.headers[h.name]=h.value);var p=null;f&&(p=f.headers||null);var v=function(r){if("undefined"!=typeof r.lengthComputable){if(c.onprogress)return c.onprogress(n(r))}else if(s){var o=null;r.isDirectory?o=new(e("org.apache.cordova.file.DirectoryEntry")):r.isFile&&(o=new(e("org.apache.cordova.file.FileEntry"))),o.isDirectory=r.isDirectory,o.isFile=r.isFile,o.name=r.name,o.fullPath=r.fullPath,s(o)}},g=u&&function(e){var r=new i(e.code,e.source,e.target,e.http_status,e.body);u(r)};l(v,g,"FileTransfer","download",[r,o,d,this._id,p])},d.prototype.abort=function(){l(null,null,"FileTransfer","abort",[this._id])},o.exports=d});