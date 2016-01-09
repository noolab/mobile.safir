//Start contents========================================================*/
Template.addContent.events({
	'click #btnAdd': function(e){
		e.preventDefault();
		var datestr = new Date().toString("yyyy-MM-dd HH:mm:ss");
		//var datestr = 'Thu Sep 17 2015 18:24:52 GMT+0700 (SE Asia Standard Time)';
		var timestamp = (new Date(datestr.split(".").join("-")).getTime())/1000;
		//alert("post");
		var author = Meteor.userId();
		var title =$('#title').val();
		var content =CKEDITOR.instances.editor1.getData();//$('#editor1').val();
		var typeid =$('#type').val();
		var category =$('#catId').val();
		var url =$('#url').val();
		//alert(category);
		var date = timestamp;
		var image =$('#image').val();
		var img_id = Session.get('ADDIMAGEID');
		Meteor.call('addContent', title, content, typeid, date, img_id, author,category,url);
		Router.go('managecontent');
		console.log("Inserted");
	},
	'change #image': function(event, template) {
		event.preventDefault();
	    var files = event.target.files;
	    for (var i = 0, ln = files.length; i < ln; i++) {
	      images.insert(files[i], function (err, fileObj) {
	      	console.log('inserted image: '+fileObj);
	      	console.log('error:'+JSON.stringify(err));
	        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
			Session.set('ADDIMAGEID', fileObj._id);
		 });
    }
  }
});
Session.get('UPDATEIMAGEID','');
Template.updateContent.events({
	'click #btnUpdate': function(e,tmp){
		e.preventDefault();
		var datestr = new Date().toString("yyyy-MM-dd HH:mm:ss");
		//var datestr = 'Thu Sep 17 2015 18:24:52 GMT+0700 (SE Asia Standard Time)';
		var timestamp = (new Date(datestr.split(".").join("-")).getTime())/1000;
		//alert("post");
		var author = Meteor.userId();
		var title =$('#title').val();
		var content =CKEDITOR.instances.editor1.getData();//$('#editor1').val();
		var typeid =$('#type').val();
		var category =$('#catId').val();
		var url =$('#url').val();
		//alert(category);
		var date = timestamp;
		var image =$('#image').val();
		var img_id = Session.get('UPDATEIMAGEID');
		//delete Session.keys['UPDATEIMAGEID'];
		console.log("img;"+ img_id);
		
		if( typeid=="" || category==""){
			console.log("Some field is require. Check again!");
		}else{
		



			var obj={
				title:title,
				image:img_id,
				url:url,
				author:author,
				content:content,
				typeid:typeid,
				category:category,
				date:timestamp
			}
			contents.update(this._id,obj);
			Router.go('managecontent');
			console.log("updated!");
		}
	},
	'change #image': function(event, template) {
		//alert(this.image);
		event.preventDefault();
        var id=this.image;
        alert(id);
            images.remove(id, function(err, file) {
            if (err) {
              console.log('error', err);
            } else {
              console.log('remove success');
              success();
                };
            });
   
    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      images.insert(files[i], function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
		Session.set('UPDATEIMAGEID', fileObj._id);
	  });
    }
  },
  'click #remove':function(e){

  }
});
i = 0;
Template.webzinelisting.helpers({
	webzine1 : function(){
		var type=contents_type.findOne({"type":"Webzine"});

		return contents.findOne({"typeid":type._id});
	},
	webzineall : function(){
		var type=contents_type.findOne({"type":"Webzine"});

		return contents.find({"typeid":type._id});
	},
	getCatergoryName: function(categoryId){
		 return categories.findOne({"_id":categoryId}).title;
	},
	isFirstWebzine: function(){
		i = i +1;
		if( i <= 1 ) return false;
		else return true;
	},
	     getImage: function(id){
            var img = images.findOne({_id:id});
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }
            else{
                return;
            }
    }
});
Session.set("commentValidation","");
Template.webzinedetails.helpers({
	related_product: function( categoryId ){
		console.log('Related Product');
		var prod = products.find({},{category:categoryId, limit:4});
		console.log('count:'+ prod.count());
		if( prod ) return prod;
		else return;
	},
	getErrormsg: function(){
		return Session.get("commentValidation");
	},
	getComment: function(){
		var comment = contents.findOne({_id:this._id});
		if( comment ) return comment.review;
		else return;
	},
	getUsername: function( userid ){
		var user = users.findOne(userid);
		if( user ) return user.profile.firstname+' '+user.profile.lastname
	},
	getarticle: function(){
		var article = contents_type.findOne({_id:this.typeid}).type;
		return article;
	}
});
Template.webzinedetails.events({
	"submit .addComment": function(e,tmp){
		e.preventDefault();
		var title = $("#inputName").val();
		var description = $("#description").val();
		var grade = 0;
		$(".group-grade input").each( function(){
			if( this.checked ){
				grade = parseInt($(this).val());
			}
		});
		if( title == "" || description =="" || grade == 0 || !Meteor.userId() ){
			$("#inputName").parent().removeClass("has-error");
			$("#description").parent().removeClass("has-error");
			$(".group-grade").removeClass("has-error");
			$(".group-grade").children(".with-errors").html("");
			if( title == "" )
				$("#inputName").parent().addClass("has-error");
			if( description == "" )
				$("#description").parent().addClass("has-error");
			if( grade == 0 ){
				var error = $(".group-grade").attr("data-error");
				$(".group-grade").addClass("has-error");
				$(".group-grade").children(".with-errors").html(error)
			}
			if( !Meteor.userId() ){
				var msg = '<div class="alert-danger form-control" role="alert">Please <a href="/login">login </a>before add comment.</div>';
				Session.set("commentValidation",msg);
			}
		}else{
			var userId = Meteor.userId();
			var review = [];
			var con = contents.findOne({_id:this._id});
			var review = ( con.review )? con.review:[];
			review.push({title:title,description:description,grade:grade,userId:userId});
			var id = contents.update(this._id,{$set:{review:review}})
			if( id ){
				$("#inputName").val("");
				$("#description").val("");
				$("#inputName").parent().removeClass("has-error");
				$("#description").parent().removeClass("has-error");
				$(".group-grade").removeClass("has-error");
				$(".group-grade").children(".with-errors").html("");
				Session.set("commentValidation","");
			}
		}
		//console.log("title:"+ title+ " des:"+description +" grade:"+grade);
	}
});



Template.addContent.helpers({
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
	contentposttype: function(){
		//alert('ddd');
 		//console.log('type='+contents_type.find({}).fetch().length);
		var co = contents_type.find();
		//console.log('type length'+co.fetch().length);
		return co;
	},	
	getcategory: function(){
		return categories.find();
	}
});

Template.updateContent.helpers({
	contentposttype: function(){
		//alert('ddd');
		
		//var co = contents_type.find();
		//console.log('type length'+co.fetch().length);
		return contents_type.find();;
	},	
	getcategory: function(){
		
		return categories.find();
	},
	getCategoryOne:function(cat){
		console.log('ILOVEU:'+cat);
		return categories.findOne({_id:cat});
	},
	getText: function( content ){
		return Session.get('contentText');
	},
	getToUpadteSelectType:function(id){
		return contents_type.findOne({_id:id});
	},

});

//ManageContent
Template.managecontent.helpers({
	managecontent: function(){
		return contents.find();
	},
	getTypename: function(){
		var id =this.typeid;
		return contents_type.findOne({_id:id}).type;
	},
	getCatname: function(){
		var id = this.category;
		return categories.findOne({_id:id}).title;
	},
	getImg: function(id){
            var img = images.findOne({_id:id});
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }
            else{
                return;
            }
    }
});
//Remove all content
Template.managecontent.events({
'click #remove':function(){
		var id = this._id;
		return contents.remove({_id:id});
	}
});
/*
Template.showwebzine.events({
'click #remove':function(){
		var id = this._id;
		return contents.remove({_id:id});
	}
});

Template.showtuto.events({
'click #remove':function(){
		var id = this._id;
		return contents.remove({_id:id});
	}
});
Template.showlooks.events({
'click #remove':function(){
		var id = this._id;
		return contents.remove({_id:id});
	}
});

//show Webzine
Template.showwebzine.helpers({
	getWebzine: function(){
		return contents.find({"type":"Webzine"});
	},
	getTypename: function(){
		var id =this.typeid;
		return contents_type.findOne({_id:id}).type;
	},
	getCatname: function(){
		var id = this.category;
		return categories.findOne({_id:id}).title;
	}
});
//show Tuto
Template.showtuto.helpers({
	getTuto: function(){
		return contents.find({"type":"Tuto"});
	},
	getTypename: function(){
		var id =this.typeid;
		return contents_type.findOne({_id:id}).type;
	},
	getCatname: function(){
		var id = this.category;
		return categories.findOne({_id:id}).title;
	}
});
//show Looks
Template.showlooks.helpers({
	getLooks: function(){
		return contents.find({"type":"Looks"});
	},
	getTypename: function(){
		var id =this.typeid;
		return contents_type.findOne({_id:id}).type;
	},
	getCatname: function(){
		var id = this.category;
		return categories.findOne({_id:id}).title;
	}
});

*/

Template.tutolisting.helpers({
	getContent:function(id){
		var type=contents_type.findOne({type:"Tuto"});
		//console.log('makar:'+type._id+'categoryId:'+id);

		console.log('Displaying tuto');
		var string=type._id+':'+id;
		Session.set('Tuto',string);
		return contents.find({category:id},{typeid:type._id});
	}
});
Template.tutodetails.helpers({
	getTutodetails:function(id){

		return contents.findOne({_id:id});
	},
	getRelated: function(){
		var string=Session.get('Tuto');
		var arraytuto=string.split(':');
		console.log('typeId:'+arraytuto[0]+'category:'+arraytuto[1]);
		return contents.find({typeid:arraytuto[0],category:arraytuto[1]},{limit:4});
	},
	tuto : function(){
		//var type=contents_type.findOne({"type":"Tuto"});
		
		return contents.find({});
	},
	getCatergoryName: function(categoryId){
		 	return categories.findOne({"_id":categoryId}).title;
		 }
})