// add Products
Session.set("tags", "");
Session.set("category", "");
Session.set("filter","");
Session.set("attributes","");
Session.set('selected_attr','No attribute');
Session.set("tag_filter",'');


Session.set("parentAttr","");
Session.set('ADDIMAGEID', "");
Session.set('ADDIMAGEID_ATTR', "");
Session.set("filter","");
Session.set('fiterValue',"");
Session.set('tags','');
Session.setDefault('userId','');
Session.set('removefilter','');
Session.set('numberOfReviews',2);

Meteor.call('getPath',function(err,res){
				Session.set('path',res);
			});
Template.addproduct.events({
	'click #add_attr': function(e,tpl){
		var price=tpl.$('#price_attr').val();
		var point=tpl.$('#point_attr').val();
		var attr=tpl.$('#attribute').val();
		var barcode=tpl.$('#barcode').val();
		var parent=tpl.$('#parent_attr').val();

		var str=Session.get('attributes');
		str=str+price+':'+point+':'+parent+':'+attr+':'+barcode+';';
		Session.set('attributes',str);
		console.log(Session.get('attributes'));
	},
	'click .deleteAttr': function(e,tpl){
		var oldAttr=Session.get('attributes');	
		var str=this.price+':'+this.point+':'+this.parent+':'+this.attribute+ ':'+this.barcode+';'
		oldAttr=oldAttr.replace(str,'');
		console.log('New attr='+oldAttr);
		Session.set('attributes',oldAttr);
	},
	'click #btnAdd': function(e){
		e.preventDefault();
		var title = $('#title').val();
		var description =CKEDITOR.instances.editor1.getData();//$('#editor1').val();// $('.froala-element').html();//froala-element
		var price = -1;//$('#price').val();
		var point = -1; //$('#point').val();
		var priority = $('#priority').val();
		var image = $('#image').val();
		var brand = $('#brand').val();
		var img_id = Session.get('ADDIMAGEID');
		var text = 0;
		var rate = 0;
		var date = new Date();
		var category = $('#category').val();
		var status = 0;
		var ratio=100;
		

		console.log('IMAGE='+image);
		console.log('IMGE_ID='+img_id);

		var alltags=Session.get('tags');
		alltags=alltags.split(';');

		jsonToSend=[];
		if(alltags!= null){
			for(var i=0;i<alltags.length;i++){
				if(alltags[i]=='')
					continue;
				var parent=alltags[i].split(':')[0];
				var value=alltags[i].split(':')[1];
				var current={
					parent: parent,
					value: value
				};
				if(current!=null && current!='')
					jsonToSend.push(current);
			}
		}

		var attr=Session.get('attributes');
		attr=attr.split(';');

		var oldId=Session.get('oldId');

		listAttr=[];
		
		
		if(attr!= null){
			price=attr[0].split(':')[0];
			point=attr[0].split(':')[1];
			for(var i=0;i<attr.length;i++){
				var current=attr[i];
				var vals=current.split(':');
				var obj={'value':vals[3],'parent':vals[2],'price':vals[0],'point':vals[1],'product':oldId,'barcode':vals[4]};
				if(current!='null' && current!='')
					listAttr.push(obj);
			}
		}
		//console.log('title:'+title+' price:'+price+' point:'+point+' priority:'+priority+' imageid:'+img_id+' category:'+category+' status:'+status);
		
		var shopid = [];
		var instock= [];
		$("#shophtml .shopname").each( function(){
			shopid.push( $(this).attr('dataid') );
		})
		$("#shophtml .instock").each( function(){
			instock.push( $(this).val() );
		})
		console.log(shopid);
		console.log(instock);
		var data_shop = [];
		for(i=0; i< shopid.length; i++){
			data_shop.push({shopid:shopid[i],instock:instock[i]});
		}
		var data ={
				oldId 		:oldId,
				price		:price,
				title		:title,
				description	:description,
				image		:image,
				Brand		:brand,
				CODE		:123,
				metaTitle	:description,
				metaKeyword	:description,
				point		:point,
				ratio		:ratio,
				status		:status,
				category	:category,
				rate		:rate,
				priority	:priority,
				shop		:data_shop,
				date		:date,
				brand 		:brand,
				tags        :jsonToSend,
				attr 		:listAttr 
				
		}
		if(Router.current().route.getName()=='updateproduct'){
			var currentid=Router.current().params._id;
			console.log('UPDATE OF '+currentid);
			data._id=currentid;
			var id = Meteor.call('updateProduct',data);
		}
		else
			var id = Meteor.call('addPro',data);
		console.log('ProductID:'+id);
		//Meteor.call('addPro',title, description, price,point,img_id, category, status,ratio,jsonToSend,listAttr,priority);
		//Router.go('/addproduct');
		Router.go('manageproduct');

	},
	'click .deleteTag': function(e,tpl){
		var allTags=Session.get('tags');
		var parent=this.parent;
		var value=this.value;
		var str=parent+':'+value+';';
		allTags=allTags.replace(str,'');
		Session.set('tags',allTags);
		console.log('NEW TAGS'+Session.get('tags'));
	},
	'change #category': function(e,tpl){
		var category=tpl.$('#category').val();
		Session.set('category',category);
		//console.log('heho');
		//console.log(category);
	},

	'change #parent_attr': function(e,tpl){
		var parent=tpl.$("#parent_attr").val();
		Session.set('parentAttr',parent);
	},
	// upload image
	'change #image': function(event, template) {
	//e.preventDefault();
    var files = event.target.files;
		for (var i = 0, ln = files.length; i < ln; i++) {
				images.insert(files[i], function (err, fileObj) {
				 //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
				Session.set('ADDIMAGEID', fileObj._id);
			});
			//console.log(files[i]);
		}
		console.log('img uploaded!');
	},
	'click #tagAdd': function(e,tpl){
		console.log('start');
		var nameTag="#tag_"+this._id;
		var value=tpl.$(nameTag).find(":selected").text();;
		var parent=tpl.$(nameTag).find(":selected").attr('id');


		var listTags=Session.get("tags")+parent+':'+value+";";
		Session.set("tags", listTags);
		console.log('tag:'+Session.get("tags"));
	},
	'click .remove': function(e,tpl){
		$(e.currentTarget).parent().parent().remove();
	},
	'click #addshop': function(e,tpl){
		var html = "";
		var instock = ($("#instock").val()!="")? parseInt($("#instock").val()):"";
		var value= $("#myshop").val();
		var text = $("#myshop option:selected").text();
		//console.log("#instock"+instock);
		//console.log("#myshop"+);
		var msg = "";
		if( instock == "" || value==""){
			if( instock == 0 || instock == "" )
				msg += "In Stock can not empty or 0<br>";
			if( value=="" )
				msg += "Select shop is require.";
			
			alert(msg);
		}else{
			html += '<div class="row" style="margin-bottom:5px;">';
			html += '<label class="control-label col-sm-3" for="tag"></label>';
			//html += ''
			html += '<div class="col-sm-3">';
						//console.log( value._id);
						html += '<input class="form-control shopname" type="text" name="shopname" dataid="'+value+'" value="'+text+'">';
						//i++;
			html += '</div>';
			html += '<div class="col-sm-3"><input type="text" name="instock" class="form-control instock" value="'+instock+'"></div>';
			html += '<div class="col-sm-3"><a class="remove glyphicon glyphicon-remove-circle"></a></div>';
			html += '</div>';
			$('#shophtml').append(html);
			$("#instock").val('');
		
		}
		
	},
});
Template.updateproduct.events({
	getTag: function(parentid){
		console.log('parent='+parentid);
		return tags.find({"parent":parentid});
	},
	'click #btnUpdate': function(e,tpl){
		e.preventDefault();
		var title = $('#title').val();
		var description =CKEDITOR.instances.editor1.getData();//$('#editor1').val();// $('.froala-element').html();//froala-element
		var price = -1;// $('#price').val();
		var point =-1;// $('#point').val();
		var priority = $('#priority').val();
		
		var brand = $('#brand').val();
		var text = 0;
		var rate = 0;
		var date = new Date();
		var category = $('#category').val();
		var status = 0;
		var ratio=100;
		

		var alltags=Session.get('tags');
		alltags=alltags.split(';');

		jsonToSend=[];
		if(alltags!= null){
			for(var i=0;i<alltags.length;i++){
				if(alltags[i]=='')
					continue;
				var parent=alltags[i].split(':')[0];
				var value=alltags[i].split(':')[1];
				var current={
					parent: parent,
					value: value
				};
				if(current!=null && current!='')
					jsonToSend.push(current);
			}
		}

		var attr=Session.get('attributes');
		attr=attr.split(';');

		var oldId=Session.get('oldId');

		listAttr=[];
		if(attr!= null){
			price=attr[0].split(':')[0];
			point=attr[0].split(':')[1];
			for(var i=0;i<attr.length;i++){
				var current=attr[i];
				var vals=current.split(':');
				var obj={'value':vals[3],'parent':vals[2],'price':vals[0],'point':vals[1],'product':oldId};
				if(current!='null' && current!='')
					listAttr.push(obj);
			}

		}

		//console.log('title:'+title+' price:'+price+' point:'+point+' priority:'+priority+' imageid:'+img_id+' category:'+category+' status:'+status);
		
		var shopid = [];
		var instock= [];
		$("#shophtml .shopname").each( function(){
			shopid.push( $(this).attr('dataid') );
		});
		$("#shophtml .instock").each( function(){
			instock.push( $(this).val() );
		});
		console.log(shopid);
		console.log(instock);
		var data_shop = [];
		for(i=0; i< shopid.length; i++){
			data_shop.push({shopid:shopid[i],instock:instock[i]});
		}
		var data ={
				_id			:this._id,
				oldId 		:oldId,
				price		:price,
				title		:title,
				description	:description,
				image		:image,
				Brand		:brand,
				CODE		:123,
				metaTitle	:description,
				metaKeyword	:description,
				point		:point,
				ratio		:ratio,
				status		:status,
				category	:category,
				rate		:rate,
				priority	:priority,
				shop		:data_shop,
				date		:date,
				brand 		:brand,
				tags        :jsonToSend,
				attr 		:listAttr 
				
		}
		var id = Meteor.call('updateProduct',data);
		console.log('ProductID:'+id);
		//Meteor.call('addPro',title, description, price,point,img_id, category, status,ratio,jsonToSend,listAttr,priority);
		Router.go('manageproduct');
	},
	/*// upload image
	'change #image': function(event, template) {
    var files = event.target.files;
		for (var i = 0, ln = files.length; i < ln; i++) {
				images.insert(files[i], function (err, fileObj) {
				 //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
				Session.set('UPDATEIMAGEID', fileObj._id);
			});
			//console.log(files[i]);
		}
	},*/
	'click #addshop': function(e,tpl){
		var html = "";
		var instock = ($("#instock").val()!="")? parseInt($("#instock").val()):"";
		var value= $("#myshop").val();
		var text = $("#myshop option:selected").text();
		//console.log("#instock"+instock);
		//console.log("#myshop"+);
		var msg = "";
		if( instock == "" || value==""){
			if( instock == 0 || instock == "" )
				msg += "In Stock can not empty or 0<br>";
			if( value=="" )
				msg += "Select shop is require.";
			
			alert(msg);
		}else{
			html += '<div class="row" style="margin-bottom:5px;">';
			html += '<label class="control-label col-sm-3" for="tag"></label>';
			//html += ''
			html += '<div class="col-sm-3">';
						//console.log( value._id);
						html += '<input class="form-control shopname" type="text" name="shopname" dataid="'+value+'" value="'+text+'">';
						//i++;
			html += '</div>';
			html += '<div class="col-sm-3"><input type="text" name="instock" class="form-control instock" value="'+instock+'"></div>';
			html += '<div class="col-sm-3"><a class="remove glyphicon glyphicon-remove-circle"></a></div>';
			html += '</div>';
			$('#shophtml').append(html);
			$("#instock").val('');
			
		}
		
	},
	'click .remove': function(e,tpl){
		$(e.currentTarget).parent().parent().remove();
	},
	'change #category': function(e,tpl){

		var category=tpl.$('#category').val();
		Session.set('category',category);
		//console.log('heho');
		//console.log(category);
	}
});
// helpers products
Template.addproduct.helpers({
	getBrand: function(){
		var myBrands=[];

		var liste=products.find().fetch();
		console.log("Processing2:"+liste.length);
		for(var i=0;i<liste.length;i++){
			if(liste[i].hasOwnProperty('Brand')){
				var first=liste[i].Brand;
					//console.log('first:'+first);
					//console.log(first.substr(0,1)+' = '+letter+' ???');
				if(first!='' && myBrands.indexOf(first)==-1)
					myBrands.push(first);
				}
			
		}
		return myBrands;
	},
	getFEContext: function () {
    var self = this;
    return {
      // Set html content
      _value: self.myDoc.myHTMLField,

      // Set some FE options
      toolbarInline: true,
      initOnClick: false,
      tabSpaces: false,

      // FE save.before event handler function:
      "_onsave.before": function (e, editor) {
        // Get edited HTML from Froala-Editor
        var newHTML = editor.html.get();
        // Do something to update the edited value provided by the Froala-Editor plugin, if it has changed:
        if (!_.isEqual(newHTML, self.myDoc.myHTMLField)) {
          console.log("onSave HTML is :"+newHTML);
          myCollection.update({_id: self.myDoc._id}, {
            $set: {myHTMLField: newHTML}
          });
        }
        return false; // Stop Froala Editor from POSTing to the Save URL
      },
    }
  },
  getSessionTag: function(){
  		Tracker.autorun(function () {
  			return Session.get('tags');
  		});
  },
	listTag: function(){
			var list=Session.get('tags');
			if(list=='')
				return;
			console.log('process:'+list);
			var liste=list.split(";");
			var tab=[];
			for(var i=0;i<liste.length;i++){
				if(liste[i]=='')
					continue;
				console.log(liste[i]);
				var parent=liste[i].split(':')[0];
				var value=liste[i].split(':')[1]
				var currentTag={parent:parent,value:value};
				tab.push(currentTag);
			}
			return tab;
		
	},
	listAttr: function(){
		if(Session.get('attributes')=='')
			return;
		var liste=Session.get('attributes').split(";");
		var tab=[];
		for(var i=0;i<liste.length;i++){
			if(liste[i]=='')
				continue;
			var line=liste[i].split(":");
			var obj={
				price:line[0],
				point:line[1],
				attribute:line[3],
				parent:line[2],
				barcode: line[4]
			};
			tab.push(obj);
		}
		return tab;
	},
	getParentNameTag: function(parent){
		if(parent=='' || parent==null)
			return;
		return parent_tags.findOne({"_id":parent}).title;
	},
	getAttributeName: function(id){
		if(id=='' || id==null)
			return;
		return attribute.findOne({"_id":id}).value;
	},
	getParentName: function(id_attr){
		if(id_attr=='undefined' || id_attr==null)
			return;
		
		return parentattr.findOne({"_id":id_attr}).name;
	},
	getCat: function(){
		return categories.find({});
	},
	getShop: function(){
		return shops.find({});
	},
	parentTag: function(){
		
			var cat=Session.get('category');
			console.log("CATI:"+cat);
			if(cat==null)
				var ret= parent_tags.find({});
			else
				var ret= parent_tags.find({"category_id":cat});
			console.log("category:"+ret.count());
			return ret;
		

			
	},
	getTag: function(parentid){
		console.log('parent='+parentid);
		return tags.find({"parent":parentid});
	},
	myTags: function () {
    	return Session.get("tags");
  },
  	getcategory: function(){
  		Tracker.autorun(function () {
  			return Session.get('category');
  		});
  	},
  	getParentAttr: function(){
  		return parentattr.find();
  	},
  	getAttr: function(parent){
  		return attribute_value.find({"parentId": parent});
  	},
  	parentAttr: function(){
  		return Session.get('parentAttr');
  	},
  	catName: function(cat){

		if(cat==0 || cat=='' || cat=='undefined' || cat==null)
			return;
		var result = categories.findOne({_id:cat});
		console.log(result);
		if(result){
			Session.set('data',result.title);
			return result.title;
		}
		
	},
});

Template.updateproduct.helpers({
	catName: function(cat){
		if(cat==0 || cat=='' || cat=='undefined' || cat==null)
			return;
		var result = categories.findOne({_id:cat});
		console.log(result);
		if(result){
			Session.set('data',result.title);
			return result.title;
		}
		
	},
	catAll: function(){
		var catName = Session.get('data');
		return categories.find({title:{$ne:catName}});
	},
	getShop: function(){
		return shops.find({});
	},
	getShopname: function( id ){
		var shop = shops.findOne({_id:id });
		if( shop ) return shop.name; 
	},
	getImage: function(){
		return Session.get('ADDIMAGEID');
	}
});

Template.manageproduct.onCreated(function() {
    
    $(window).on('scroll', function(e) {
       if($(window).scrollTop() == $(document).height() - $(window).height()) {
       		var limit=Number(Session.get('querylimit'));
	    	limit=limit+16;
	    	Session.set('querylimit',limit);
           //alert("Welcome Rosoty");
    	}
    });
});

Template.manageproduct.events({
	'click #remove': function(){
		var id = this._id;
		Meteor.call('deletePro', id);
	},

	'click #publish': function(e){
		e.preventDefault();
		var id = this._id;
		var status = 0;
		var attributes = {
			status:status
		};
		Meteor.call('publishPro',id, attributes);
	},
	'click .more': function(e,tpl){
	    	var limit=Number(Session.get('querylimit'));
	    	limit=limit+16;
	    	Session.set('querylimit',limit);
	    	console.log('limite='+Session.get('querylimit'));
	    },
	"click #unpublish": function(e) {
		e.preventDefault();
		var id = this._id;
		var status = 1;
		var attr = {
			status:status
		};
		Meteor.call('unpublishPro',id, attr);
	}
});

Template.add_review.events({
	'click #commentok': function(e,tpl){
		var title=tpl.$("#title").val();
		var comment=tpl.$("#comment").val();
		var grade=tpl.$("#grade").val();
		var user=Meteor.user()._id;
		var productid=this._id;
		Meteor.call("add_review",title,comment,grade,user,productid);
	}
});

Template.details.events({
	'click #refresh': function(e,tpl){

	},
	'click .octofilter-link': function(e,tpl){
		console.log('ABC');
	},
	'click .octofilter-clear': function(e,tpl){
		//alert("deleting...");
	},
	'click #flip': function(e,tpl){
		$("#panel").slideToggle("slow");
	},
	'click #show': function(e,tpl){
		$("#show-text").slideToggle("slow");
	},
	'click h3': function(e,tpl){
		$(".fa-angle-down").slideToggle("slow");
	},
	'click .octofilter-link':function(e,tpl){

		//alert('heho');
	},
	'click #filterok': function(e,tpl){
		var username=tpl.$("#filter").val();
		Session.set("filter",username);
		
	},
	'click #img_attr':function(e,tpl){
		var title=attribute.findOne({"_id":this._id}).value;
		var product=attribute.findOne({"_id":this._id});
		
		if(product.price!=-1){
			Session.set('selected_price',product.price);
			Session.set('selected_point',product.point);
			Session.set('selected_attr',title);
		}
			
		var url=product.productImage;
		url=url.replace('uploads','upload');
		tpl.$("#imageDetails").attr('src',url);

	},
	'click #favorite':function(e){
        
        
             e.preventDefault();
             var id=this._id;
             console.log('id'+Session.get('userId'));
             if(Session.get('userId')){
                 //alert();
                 var obj={
                    proId:id,
                    userId:Session.get('userId')
                 }

                 Meteor.call('insertFavorite',obj);
                  alert('Product successfully append to favorite!');
            }
            else{
            	var newId=Random.id();
                Session.setPersistent('userId',newId);
                 //var ses=Session.get('userId');
                 
                 var obj={
                    proId:id,
                    userId:Session.get('userId')
                 }

                 Meteor.call('insertFavorite',obj);
                 alert('Product successfully added to favorite!');
            }
    },
    'click #addtocart':function(e,tpl){
        
        
             e.preventDefault();
             var id_product=this._id;
             var qty=tpl.$("#qty").val();
             var shop=tpl.$("#shop").val();
             var attribute=Session.get('selected_attr');

             if(shop==''){
             	alert("Please select a shop!");
             	return;
             }
             if(attribute=='No attribute')
             	attribute='';
			
			if(Meteor.userId()){
				var userId = Meteor.userId();
				Session.setPersistent('userId',userId);
			}
			else{
				if( Session.get('userId') == ""){
					var newId=Random.id();
					Session.setPersistent('userId',newId);
					console.log('Newid'+newId);
				}
				console.log('id='+Session.get('userId'));
				var userId = Session.get('userId');
			}	
			
			var subtotal = 0;
			
			var sameproduct = cart.findOne({ id_product:id_product, userId:userId, shop:shop})
			if( sameproduct){
				var pro = products.findOne({_id:id_product})
				upqty = parseInt( sameproduct.quantity ) + parseInt(qty);
				if( pro ){
					subtotal = upqty * parseInt(pro.price);
				}
				cart.update(sameproduct._id, {$set: {quantity: upqty, subtotal:subtotal}});
			}else{
				var pro = products.findOne({_id:id_product})
				if( pro ){
					subtotal = parseInt(qty) * parseInt(pro.price);
				}
				var obj={
					id_product:id_product,
					userId:Session.get('userId'),
					quantity:qty,
					subtotal:subtotal,
					shop:shop,
					attribute:attribute,
					order_status:0
				};
			
				cart.insert(obj);
				//Meteor.call('addtocart',obj);
				alert('Product successfully append to cart!'+userId);
			}
			 
            
    },
});

Template.manageproduct.helpers({
	managePro: function(){
		var data= products.find({},{limit:Session.get('querylimit')});
		if(data.count()<=0){
			return false;
		}
		else{
			return data;
		}
	},
	catName: function(cat){
		var result = categories.findOne({_id:cat});
		return result.title;
	},
	checkStatus: function(status){
		if(status === 0){
			return false;
		}
		else{
			return true;
		}
	},
	shopName: function(name){
		if(name=='0')
			return;
		var result = shops.findOne({_id: name});
		return result.title;
	},
	shopIn: function(nameIn){
		var result = shops.findOne({_id:nameIn});
		return result.instock;
	}
	,
	// upload image
	getImage: function(id){

			var img = images.findOne({_id:id});
			if(img){
				console.log(img.copies.images.key);
				return img.copies.images.key;
			}else{
				return;
			}
	}
});

Template.details.helpers({
	articles: function(title){
		return contents.find({"content":{"$regex":title}});
	},
	getAllAttributes: function(productId,parent){
		return attribute.find({"product":productId,"parent":parent});
	},
	getParentDetails: function(parent){
		return parentattr.findOne({"_id":parent});
	},
	listAttr: function(parent){
		console.log("OLDID="+parent);
		return attribute.find({"product":parent});
	},
	getParentAttr: function(product){
		console.log('cherche les attr de '+product);
		var list=attribute.find({"product":product}).fetch();
		var out=[];
		for(var i=0;i<list.length;i++){
			var contains=0;
			for(var j=0;j<out.length;j++)
				if(out[j].parent==list[i].parent)
					contains=1;
			if(contains==0)
				out.push(list[i]);
		}
			
		return out;
	},
	getShops: function(id){
		return shops.find({"products.product":id,"products.quantity":{ "$nin": ["0"] }});
	},
	getAttribute: function(id){
  		
  		return attribute.findOne({"_id": id});
  	},
	getTagName: function(tagid){
		if(tagid!=null)
			return tags.findOne({_id:tagid}).title;
		else
			return;
	},
	getAttr: function(id){
		return attribute.findOne({"_id":id});
	},
	getCategoryName: function(categoryid){
		console.log("cat:"+categoryid);
		if(categoryid!=null)
			return categories.findOne({_id:categoryid}).title;
		else
			return;
	},
	getShopname: function( id ){
		var shop = shops.findOne({_id:id });
		if( shop ) return shop.name; 
	},
	filterReview: function(){
		Tracker.autorun(function () {
			console.log('RERUNNING');
			return Session.get('fiterValue');
		});
	},
	removeFilter: function(){
		Tracker.autorun(function () {
			console.log('RERUNNING delete');
			return Session.get('removefilter');
		});
	},
	getParentTagName: function(id){
		return parent_tags.findOne({"_id":id}).title;
	},
	getReviews: function(reviews,filtre,toremove){
			/*
			console.log('reloading reviews...'+Session.get('fiterValue'));
			var toRemove=Session.get('removefilter').split(':');
			var myFilter=Session.get('fiterValue');
			for(var i=0;i<toRemove.length;i++){
				if(toRemove[i]=='')
					continue;
				var str=':'+toRemove[i];
				myFilter.replace(str,'');
			}*/

			//console.log('Before: '+Session.get('fiterValue'));
			//console.log('ToRemove:'+Session.get('removefilter'));
	
			
			if(Session.get('fiterValue')=="" || Session.get('fiterValue')=="undefined"){
				var lastResult=[];
				var numberOfResult=Session.get('numberOfReviews');

				if(numberOfResult>reviews.length)
					numberOfResult=reviews.length
				console.log('NUMBER OF lastResult.length '+numberOfResult);
				for(var i=0;i<numberOfResult;i++)
					lastResult.push(reviews[i]);

				console.log('NUMBER OF lastResult.length '+lastResult.length);
				return lastResult;
					
			}
			console.log('Calling filterReview='+reviews.length);
			var values=Session.get('fiterValue').split(':');
			//fiterValue
			var ages=[];
			var myTags=[];
			var grades=[];

			for(var i=0;i<values.length;i++){
				var param=values[i];
				if(param=='')
					continue;
				console.log("Processing "+param);
				if(param.indexOf('-')>=0){
					ages.push(param);
				}else if(param.indexOf('/')>=0){
					grades.push(param);
				}else{
					myTags.push(param);
				}
			}

			console.log('ages:'+ages.length);
			console.log('myTags:'+myTags.length);
			console.log('grades:'+grades.length);

			var results=[];
			for(var i=0;i<ages.length;i++){
				var ageMin=Number(ages[i].split('-')[0]);
				var ageMax=Number(ages[i].split('-')[1]);

				console.log('min:'+ageMin);
				console.log('max:'+ageMax);
				//Loop into reviews
				for(var j=0;j<reviews.length;j++){
					var curUser=users.findOne({"_id":reviews[j].user});
					if(Number(curUser.profile.age)<= ageMax && Number(curUser.profile.age)>=ageMin){
						results.push(reviews[j]);

					}
						
				}
			}
			console.log('Size of the rest:'+reviews.length);
			console.log('Still in the sand after ager filter:'+results.length);
			if(results.length>0){
					console.log('remise a 0');
					reviews=[];
					reviews=results.slice(0);
					results=[];
			}
				
			console.log('Size of the rest:'+reviews.length);
			for(var i=0;i<myTags.length;i++){
				var curTag=myTags[i];
				console.log('tagging '+curTag);
				for(var j=0;j<reviews.length;j++){
					var curUser=users.findOne({"_id":reviews[j].user});
					if(curUser.profile.tag.indexOf(curTag)>=0)
						results.push(reviews[j]);
				}
			}

			console.log('Still in the sand(tags):'+results.length);
			if(results.length>0){
					console.log('remise a 0');
					reviews=[];
					reviews=results.slice(0);
					results=[];

			}
			if(grades.length==0)
				results=reviews.slice(0);
			console.log('Size of the rest:'+reviews.length);
			for(var i=0;i<grades.length;i++){
				var curGrade=grades[i].split('/')[0];
				//Loop into reviews

				for(var j=0;j<reviews.length;j++){
					
					if(Number(reviews[j].grade)==Number(curGrade) && results.indexOf(reviews[j])<0){
						results.push(reviews[j]);
						console.log('Comparing '+curGrade+' and '+reviews[j].grade);
					}
						
				}
			}

			console.log('Still in the sand(grades):'+results.length);
			console.log('afterFilter:'+results.length);

			var lastResult=[];
			var numberOfResult=Session.get('numberOfReviews');

			if(numberOfResult>results.length)
				numberOfResult=results.length
			console.log('NUMBER OF lastResult.length '+numberOfResult);
			for(var i=0;i<numberOfResult;i++)
				lastResult.push(results[i]);

			console.log('NUMBER OF lastResult.length '+lastResult.length);
			return lastResult;
		
		
	},
	getReviewsShort: function(reviews,limit){
		if(Session.get("filter")==""){
			var ret=[];
			for(var i=0;i<reviews.length && i<=limit;i++){
					var current=reviews[i];
					ret.push(current);
			}
			return ret;
		}
		else{
			var ret=[];
			for(var i=0;i<reviews.length && i<=limit;i++){
				var current=reviews[i];
				var currentAuthor=users.findOne({_id:current.user});
				if(currentAuthor.emails[0].address==Session.get("filter"))
					ret.push(current);
			}
			return ret;
		}
	},
	path: function(){
		return Session.get('path');
	},
	selected_attr: function(){
		return Session.get('selected_attr');
	},
	selected_price: function(){
		return Session.get('selected_price');
	},
	selected_point: function(){
		return Session.get('selected_point');
	}
});




Template.details.rendered=function(){
	console.log('limit'+Session.get('limit'));
	console.log('PRODUCTS'+products.find().fetch().length);
	var productId=String(Router.current().params.id);
	var p=products.find({"_id":productId});

	console.log('RECUP LE PRIX:'+p.fetch()[0].price);
	Session.set('selected_price',p.fetch()[0].price);
	Session.set('selected_point',p.fetch()[0].point);

	var arr=[];
	console.log('data: '+productId);
	if(p.fetch().length>0){
		var currentProduct=p.fetch()[0];
		console.log('user selected');
		
		if(p.hasOwnProperty('review')){
			var coms=currentProduct.review;
			console.log('has my reviews2 '+coms );

			for(var i=0;i<coms.length;i++){
				var curUser=users.findOne({"_id":coms[i].user});
				console.log('comm selected'+curUser.profile.tag);
				

				//if(curUser.profile.tag!='undefined'){
				if(curUser.profile.hasOwnProperty('tag')){
					console.log('saving'+curUser.profile.tag);
					for(var j=0;j<curUser.profile.tag.length;j++)
						arr.push(curUser.profile.tag[j]);
				}
				
			}
		}
			console.log("tagggg:"+arr);
	}
	var result=[];
	for(var i=0;i<arr.length;i++){
		if(result.indexOf(arr[i])<0)
			result.push(arr[i]);
	}
	
	console.log("final:"+result);
	
	$('#input').octofilter({
			 
			  source: {
				Grade: ['1/5', '2/5', '3/5', '4/5', '5/5'],
				Tag:result ,
				Age: ['15-25','25-35' , '35-50', '50-100'],
				Hair:['Black ','White']
			  }
			});

	$('.container').click();

	$('.octofilter-link').click(function() {
		console.log("TRIGGER");
		var value=$( this ).text();
		
		if($( this ).hasClass('octofiltered')){//delete
			
			var tagSession=Session.get("tag_filter");
			
			var indexTag=tagSession.indexOf(value);
			tagSession=tagSession.replace(value+';','');
			Session.set("tag_filter",tagSession);
		}else{
			var tagSession=Session.get("tag_filter");
			if(tagSession.indexOf(value)<0){
				tagSession=tagSession+value+';';
				Session.set("tag_filter",tagSession);
			}
			
		}
		//console.log('Filter:');
		//console.log(Session.get("tag_filter"));
		//alert(value);
	  alert( "HOP" );

	});
	/*alert("finish");
	$(".gallery-top").Swiper({
	    nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 10,
        loop:true,
        loopedSlides: 3, //looped slides should be the same 
    });

  	$(".gallery-thumbs").Swiper({
  			spaceBetween: 10,
	        slidesPerView: 3,
	        touchRatio: 0.2,
	        loop:true,
	        loopedSlides: 3, //looped slides should be the same
	        slideToClickedSlide: true
        });
  	
  	galleryTop = new Swiper('.gallery-top', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 10,
        loop:true,
        loopedSlides: 3, //looped slides should be the same     
    });
    galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 3,
        touchRatio: 0.2,
        loop:true,
        loopedSlides: 3, //looped slides should be the same
        slideToClickedSlide: true
    });
    galleryTop.params.control = galleryThumbs;
    galleryThumbs.params.control = galleryTop;*/
  	//alert("finish");
};
// datetimepicker
Template.addproduct.onRendered(function() {
    
});
Template.updateproduct.onRendered(function() {
	

});

Template.addproduct.rendered = function(){
	/*Session.set('ADDIMAGEID',this.data.image);
	console.log('PUT IMAGE='+Session.get('ADDIMAGEID'));
    this.$('.datetimepicker').datetimepicker();*/

    if(this.data!=null){
    	Session.set('oldId',this.data.oldId);


    	console.log('yeah');
	    Session.set('category',this.data.category);
	    var alltags="";
	    if(this.data.hasOwnProperty('tags')){
	    	for(var i=0;i<this.data.tags.length;i++){
	    		alltags=alltags+''+this.data.tags[i].parent+':'+this.data.tags[i].value+';';
	    	}
		    console.log('OldTags='+alltags);
		    Session.set('tags',alltags);
	    }
	    

	    var allAttr="";
	    console.log('OLDID='+this.data.oldId);
	    var attrs=attribute.find({"product":this.data.oldId}).fetch();
	    
	    for(var i=0;i<attrs.length;i++){
	    	allAttr=allAttr+attrs[i].price+':'+attrs[i].point+':'+attrs[i].parent+':'+attrs[i].value+':'+attrs[i].barcode+';';
	    }
	    console.log('Old:'+allAttr);
	    Session.set('attributes',allAttr);

	    if(this.data.hasOwnProperty('shop'))
	    	var list_shops=this.data.shop;
	    else
	    	var list_shops=[];
	    
	    for(var i=0;i<list_shops.length;i++){
	    	var html = "";
	    	var instock = list_shops[i].instock;
			var value= list_shops[i].shopid;
			var text=shops.findOne({"_id":value}).name;
			

			html += '<div class="row" style="margin-bottom:5px;">';
			html += '<label class="control-label col-sm-3" for="tag"></label>';
			//html += ''
			html += '<div class="col-sm-3">';
						//console.log( value._id);
						html += '<input class="form-control shopname" type="text" name="shopname" dataid="'+value+'" value="'+text+'">';
						//i++;
			html += '</div>';
			html += '<div class="col-sm-3"><input type="text" name="instock" class="form-control instock" value="'+instock+'"></div>';
			html += '<div class="col-sm-3"><a class="remove glyphicon glyphicon-remove-circle"></a></div>';
			html += '</div>';
			$('#shophtml').append(html);
			
	    }
		
    }else{
    	Session.set('oldId',Random.id());
    }
    
    console.log('hopppp');
    

	};
	Template.details.events({
		'click #btnMore':function(e){
			e.preventDefault();
			alert();
			var last = Session.get('numberOfReviews');
			var sum = Number(last) + 5;
			var update = Session.set('numberOfReviews',sum);
			return update;
		}
	});