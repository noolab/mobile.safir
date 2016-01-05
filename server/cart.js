Meteor.methods({
	addToCart: function(userId,productid,shopid,qty){//DEPRECATED
		var ipAddress=this.connection.clientAddress;
		var attr={
			"ip_address":ipAddress,
			"user":userId,
			"product":productid,
			"shop":shopid,
			"quantity":qty
		};

		cart.insert(attr);
	},

	addtocart: function(obj){
		var ipAddress=this.connection.clientAddress;
		console.log("IP ADDRESS:"+ipAddress);
		obj.ip_address=ipAddress;


		cart.insert(obj);
	},
	removecart: function(id){
		cart.remove(id);
	},
	updatCart:function(id,obj){
		cart.update({_id:id},{$set:obj});
	},
	removecart: function(item,user){
		cart.remove({"userId":user,"id_product":item});
	},
	updateCartcheckout: function(id,qty,subtotal){
		cart.update(id, {$set: {quantity: qty, subtotal:subtotal}});
	},
	updateStatus:function(id,obj){
		cart.update({_id:id},{$set:obj});
	}
});