Session.set("total", 0);

Template.checkout.helpers({
	getCart: function(){
		//alert('ok');
		var mycart = '';
		if(Meteor.userId()){
			//userid = Meteor.userId();	
			mycart = cart.find({$and:[{order_status:0},{userId:Meteor.userId()}]});
		}
		// else{
		// 	userid = Session.get('userId');
		// 	if( userid ){
		// 		mycart = cart.find({$and:[{order_status:0},{userId:userid}]});
		// 	}
		// }
		var total = 0;
		
		mycart.forEach( function(value,index){
			total = total + value.subtotal;
		});
		Session.set("total", total);

		 
		return mycart;
	},	
	getProductInfo: function(productid){
 		return products.findOne({_id:productid});	
	},
	getImage: function(id){
		var image=products.findOne({_id:id}).image;
		
		var res = image.replace("uploads", "upload"); 
		return res;
	},
	getShopName: function(id){
		return shops.findOne({"_id":id}).name;
	},
	getProname:function(id){
		return products.findOne({_id:id}).title;
 	},
 	getPrice:function(id){
		return products.findOne({_id:id}).price;
 	},
	getTotal: function(){
		return Session.get("total");
	},
	getImageid:function(id){

		return products.findOne({_id:id}).image;
	}
});
Template.checkout.events({
	"change .qty":function(e,tmp){
		alert("Changing qty");
		var qty = $(e.currentTarget).val();
		var id =this._id; //$(e.currentTarget).attr("data-id");
		var productid =this.id_product; $(e.currentTarget).attr("pro-id");
		var pro = products.findOne({_id:productid});
		var subtotal = 0;
		if( pro ){
			subtotal = parseInt(pro.price) * parseInt(qty);
		}
		Meteor.call('updateCartcheckout',id,qty,subtotal);
		
		
		var mycart = '';
		if(Meteor.userId()){
				mycart = cart.find({$and:[{order_status:0},{userId:Meteor.userId()}]});
		}
		
		var total = 0;
		
		mycart.forEach( function(value,index){
			total = total + value.subtotal;
		});
		Session.set("total", total);
		//Meteor._reload.reload();
	},
	"click #removeCheckOut":function(e){
		e.preventDefault();
		var comfirm=confirm('Do you want to remove?');
		if(comfirm){
			cart.remove(this._id);
		}
	},
	'click #btnAdd':function(e){
		e.preventDefault();
		var mycart = '';
		var arrCartId=[];
		if(Meteor.userId()){
				mycart = cart.find({$and:[{order_status:0},{userId:Meteor.userId()}]});
		}
		var total = 0;
		//alert("My"+JSON.stringify(mycart.fetch()[0]));
		//Session.set("allcart", mycart);
		mycart.forEach( function(value){
			total = total + value.subtotal;
			
			//alert("My"+JSON.stringify(obj));
			arrCartId.push(value._id);
			var objStatus={
				order_status:1
			}
			Meteor.call('updateStatus',value._id,objStatus);
			
		});
		Session.setPersistent('orderId',Random.id());
		var obj={
			userid:Meteor.userId(),
			cartId:arrCartId,
			orderId:Session.get('orderId'),
			total:total
		}
		
		Meteor.call('insertOrder',obj);
		

		Router.go("/confirmorder");
	}
});
Template.checkout.helpers({
	getprofile:function(){
		var id = Meteor.userId();
		return Meteor.users.findOne({_id:id});
	}
});
Template.confirmorder.helpers({
	getprofile:function(){
		var id = Meteor.userId();
		return Meteor.users.findOne({_id:id});
	},
	getAddress1:function(){
		var id = Meteor.userId();
		return Meteor.users.findOne({_id:id}).profile.address;
	}
});
Template.confirmorder.events({
	'submit form':function(e){
		e.preventDefault();
		var id = Session.get('orderId');
		var address = $('#address').val();
		var address1=$('input[name=address1]:checked').val();
		if(address){
			var addresses=address;
		}else{
			var addresses=address1
		}
		//alert(addresses);
		
		var obj = {
			address:addresses
		}
		
	
		Meteor.call('updateOrder',id,obj);
		alert('successful change');
	
	},
	'click #btnAdd':function(e){
		e.preventDefault();
		Router.go("/confirmorder");
	}
});
Template.confirmorder2.events({
	'submit form':function(e){
		e.preventDefault();
		var idorder = Session.get('orderId');
		alert(idorder);
		var delivery = $('#sel1').val();
		var obj = {
			deliverytype:delivery
		}
		Meteor.call('updateOrder',idorder,obj);
		alert('successful updated');
	}
});