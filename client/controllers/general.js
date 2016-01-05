Template.registerHelper('getImg', function (id) {
    
        if(id=='')
            return 'unknown.png';
            if(id.indexOf("/uploads")>-1){
                //console.log('oldSafir');
                id=id.replace("/uploads/","");
                //console.log('oldSafir2'+id);
                return id;
            }else{
                var img = images.findOne({_id:id});
            //console.log("current img="+img);
            
            if(img){
                //console.log(img.copies.images.key);
                return img.copies.images.key;
            }else{
                return;
            }
   
            }
            
});

Template.registerHelper('getDate', function (curdate) {
	var d = new Date(curdate);
	var str=d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear();
    return str;
}); 

Template.registerHelper('recap', function (text) {
    return text.split(" ").splice(0,3).join(" ");
}); 

Template.registerHelper('getTotal', function (text) {
    return Session.get("total");
}); 

Template.registerHelper('getProductInfo', function (item_id) {
    var cartItem=cart.findOne({"_id":item_id});
    //console.log('TESTING CART SIZE' +cart.count());
    var pro=products.findOne({"_id":cartItem.id_product});
    var shop = shops.findOne({"_id":cartItem.shop});
    console.log('TESTING CART' +pro.title);  
    return {_id:item_id,product:pro, qty:cartItem.quantity, subtotal:cartItem.subtotal, item_id:item_id,shop:shop.name};
}); 

Template.registerHelper('getCart', function (curdate) {
    var mycart = '';
        if(Meteor.userId()){
            userid = Meteor.userId();

            if( userid ){
                mycart = cart.find({userId:userid});
            }
        }else{
            userid = Session.get('userId');
            if( userid ){
                mycart = cart.find({userId:userid});
            }
        }
        console.log('cart id='+userid);
        var total = 0;
        
        mycart.forEach( function(value,index){
            total = total + value.subtotal;
        })
        Session.set("total", total);
        console.log('TOTAL'+total);
        return mycart;
}); 