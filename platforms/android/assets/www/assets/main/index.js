function getUserHandle(a,b){if(4!=b.rows.length)Page.redirect("login.html");else{for(var c,d,e,f,g=0;g<b.rows.length;g++)switch(b.rows[g].key){case"token":c=b.rows[g].value;break;case"client":d=b.rows[g].value;break;case"name":e=b.rows[g].value;break;case"role":f=b.rows[g].value}localStorage.setItem("user_name",e),localStorage.setItem("role",f),User.login(d,c)}}function indexInit(){db.getDbInstance("settings").query({map:function(a,b){-1!=["token","client","name","role"].indexOf(a.type)&&b(a.type,a.value)}},getUserHandle),executeSyncQuery()}