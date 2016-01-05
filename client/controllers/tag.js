//tags CRUD
Session.set('tag_msg','');
Session.set('ADDIMAGEID','');
Session.set('tagValidation', "");
function attrDept( id = 0){
	var multi_level_attr =  "";
	var attr = tags.find( {parent:"",_id:{$ne:id}});
	if( attr ){
		var dep = 0;
		attr.forEach( function(val, index){
			
				//space = '&nbsp'; 
			multi_level_attr += '<option value="'+val._id+'">'+ val.title+'</option>';
			var attr =  tags.find({parent:val._id, _id:{$ne:id}});
			if(attr){
				attr.forEach( function(val, index){
					multi_level_attr += '<option value="'+val._id+'">&mdash; '+ val.title+'</option>';
					var attr =  tags.find({parent:val._id, _id:{$ne:id}});
					if(attr){
						attr.forEach( function(val, index){
							multi_level_attr += '<option value="'+val._id+'">&mdash;&mdash; '+ val.title+'</option>';
						})
					}
				})
			}
			
		})
		return multi_level_attr;
	}
}
function catDept(){
	var multi_level =  "";
	var attr = categories.find({parent:"0"});
	if( attr ){
		var dep = 0;
		attr.forEach( function(val, index){
			
			multi_level += '<option value="'+val._id+'">'+val.title+'</option>';
			var attr =  categories.find({parent:val._id});
			if(attr){
				attr.forEach( function(val, index){
					multi_level += '<option value="'+val._id+'">&mdash;'+ val.title+'</option>';
					var attr =  categories.find({parent:val._id});
					if(attr){
						attr.forEach( function(val, index){
							multi_level += '<option value="'+val._id+'">&mdash;'+ val.title+'</option>';
						})
					}
				})
			}
	
		})
		return multi_level;
	}
}
Template.managetag.events({
    'submit form':function(e){
        e.preventDefault();
        var parent = e.target.selectParent.value;
		var categoryId = e.target.selectCategory.value;
        var value=e.target.value.value;
        //var image =$('#image').val();
        //var img_id = Session.get('ADDIMAGEID');
		var error = "";
         if( value == '' ||  categoryId == ''){
			 if( value == '' )
				error += '<p>tags name is require.</p>';
			if( categoryId == '' )
				error += '<p>Category is require.</p>';
			msg = {status:false,data:error};
		}else{
			msg = {status:true,data:'Successfully added.'}
			var obj={
				title:value,
				parent:parent,
				categoryId:categoryId
			}
			var id = tags.insert(obj);
			//Meteor.call('insertAttr',obj);
			e.target.name.value='';
			e.target.value.value='';
		}
		Session.set('tagValidation', msg);
    },
	'click #bnt_delete':function(e){
        e.preventDefault();
        var result = tags.findOne({_id:this._id});
        var id=result.productImage;
        var result=confirm('Do you want to delete?');
        //alert(id);
        if(result){
            tags.remove(this._id);
            //delete file
            images.remove(id, function(err, file) {
            if (err) {
              console.log('error', err);
            } else {
              console.log('remove success');
              success();
                };
            });
        }
    },
})
Template.managetag.helpers({
    datashow:function(){
        return tags.find();
    },
    getImage: function(id){
		var img = images.findOne({_id:id});
		console.log(img);
		
		if(img){
			console.log(img.copies.images.key);
			return img.copies.images.key;
		}else{
			return;
		}
    },
    getparent:function(){
		var id = ( this._id !='')? this._id:0;
        var data = attrDept( id );
		console.log(data);
		return data;
    },
	getParent:function(parentId){
        var parentData = tags.findOne({_id:parentId});
		if( parentData ) return parentData.title;
    },
	getCategory:function(){
        var data = catDept( );
		console.log(data);
		return data;
	},
	addshopmsg: function(){
		var msg = Session.get('tagValidation');
		if( msg ) return msg.data;
	},
	isAddShopmsg: function(){
		var msg = Session.get('tagValidation');
		if(msg) return true;
		else return false;
	},
	addShopSuccess: function(){
		var msg = Session.get('tagValidation');
		if( msg ){
			if( msg.status == true ) return true;
			else return false;
		}
	}
	
});
//Delete tags

Template.edittag.events({
   'submit form':function(e){
        e.preventDefault();
        var parent = e.target.selectParent.value;
		var categoryId = e.target.selectCategory.value;
        var value=e.target.value.value;
        //var image =$('#image').val();
        //var img_id = Session.get('ADDIMAGEID');
		var error = "";
         if( value == '' ||  categoryId == ''){
			 if( value == '' )
				error += '<p>tags name is require.</p>';
			if( categoryId == '' )
				error += '<p>Category is require.</p>';
			msg = {status:false,data:error};
			Session.set('tagValidation', msg);
		}else{
			msg = {status:true,data:'Successfully updated.'}
			var obj={
				title:value,
				parent:parent,
				categoryId:categoryId
			}
			var id = tags.update(this._id,obj);
			//Meteor.call('insertAttr',obj);
			e.target.name.value='';
			e.target.value.value='';
			Session.set('tagValidation', msg);
			Router.go('/managetag');
		}
		
    }
})
Template.edittag.helpers({
	getparent:function(){
		var id = ( this._id !='')? this._id:0;
        var data = attrDept( id );
		console.log(data);
		return data;
    },
	getParent:function(parentId){
        var parentData = tags.findOne({_id:parentId});
		if( parentData ) return parentData.title;
    },
	getCategory:function(){
        var data = catDept( );
		console.log(data);
		return data;
	},
	addshopmsg: function(){
		var msg = Session.get('tagValidation');
		if( msg ) return msg.data;
	},
	isAddShopmsg: function(){
		var msg = Session.get('tagValidation');
		if(msg) return true;
		else return false;
	},
	addShopSuccess: function(){
		var msg = Session.get('tagValidation');
		if( msg ){
			if( msg.status == true ) return true;
			else return false;
		}
	}
});