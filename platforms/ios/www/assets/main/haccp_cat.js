function getHaccpCatCall(a,b){if(0==b.rows.length&&isOffline())$("#haccp_cat_list_no_results").text("No HACCP to show. Please connect to internet to sync.");else if(0!=b.rows.length||isOffline()){if(b.rows.length>0){for(var c=[],d=0;d<b.rows.length;d++)c.push({id:b.rows.item(d).id,data:'<a href="haccp_item.html?id='+b.rows.item(d).id+"&catId="+get.catId+'" data-transition="slide"><i class="fa fa-pagelines"></i> '+b.rows.item(d).content+"</a>"});_append("#haccp_cat_list",c),$("#haccp_cat_list_no_results").hide()}}else{$("#haccp_cat_list_no_results").text("No HACCP to show, yet.");var c={client:User.client,token:User.lastToken,haccp_category:get.catId};Page.apiCall("haccp",c,"get","haccpCat")}}function getHaccpCat(a){a.executeSql('select * from haccp_items where "cat" = "'+get.catId+'"',[],getHaccpCatCall,db.dbErrorHandle)}function haccp_catInit(){if(User.isLogged()){get=Page.get();var a=db.getDbInstance();a.transaction(getHaccpCat,db.dbErrorHandle)}else Page.redirect("login.html")}function haccpCat(a){if(a.success){var b,c=[],d={};if(a.haccp_subcategories_form&&void 0!=a.haccp_subcategories_form.answer){b=a.haccp_subcategories_form.answer;for(var e in b)b.hasOwnProperty(e)&&(d[b[e].subcategory]=JSON.stringify(b[e]))}if(a.haccp_subcategories){var f,g='INSERT OR REPLACE INTO "haccp_items"("id","cat","content","form","response")',h=!1;for(var e in a.haccp_subcategories)a.haccp_subcategories.hasOwnProperty(e)&&(f=void 0!=d[a.haccp_subcategories[e].id]?d[a.haccp_subcategories[e].id]:0,h?g+=" UNION":h=!0,g+=' SELECT "'+a.haccp_subcategories[e].id+'" as "id", "'+get.catId+'" as "cat", "'+a.haccp_subcategories[e].content+'" as "content",\''+JSON.stringify(a.haccp_subcategories_form)+"' as \"form\", '"+f+'\' as "response"',c.push({id:a.haccp_subcategories[e].id,data:'<a href="haccp_item.html?id='+a.haccp_subcategories[e].id+"&catId="+get.catId+'" data-transition="slide"><i class="fa fa-pagelines"></i> '+a.haccp_subcategories[e].content+"</a>"}));db.clean(),db.execute(g),$("#haccp_cat_list_no_results").hide(),_append("#haccp_cat_list",c)}}}var get,hpc_currentTime=!1,hpc_settings_type="haccpSubUpdated";