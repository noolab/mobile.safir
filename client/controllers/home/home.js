Template.home.rendered=function(){
	$('#slider').flexslider({
					animation: "slide",
					directionNav: true,
					animationLoop: true,
					controlNav: false,
					slideToStart: 1,
					slideshow: true,
					animationDuration: 300,
					start: function(){
						 $('#slider').animate({opacity: 1}, 750);
					},
				});

	$("#list1").flexslider({
					animation: "slide",
					directionNav: true,
					animationLoop: true,
					controlNav: false,
					slideToStart: 1,
					slideshow: true,
					animationDuration: 300,
					start: function(){
						 $('#list1').animate({opacity: 1}, 750);
					},
				});

	$("#list2").flexslider({
					animation: "slide",
					directionNav: true,
					animationLoop: true,
					controlNav: false,
					slideToStart: 1,
					slideshow: true,
					animationDuration: 300,
					start: function(){
						 $('#list2').animate({opacity: 1}, 750);
					},
				});

	$("#list3").flexslider({
					animation: "slide",
					directionNav: true,
					animationLoop: true,
					controlNav: false,
					slideToStart: 1,
					slideshow: true,
					animationDuration: 300,
					start: function(){
						 $('#list3').animate({opacity: 1}, 750);
					},
				});
									
};

Template.home.helpers({
	list1: function(){
		console.log('liste:'+list_product.find().fetch().length);
		return list_product.find().fetch()[0];
	},
	list2: function(){

		return list_product.find().fetch()[1];
	},
	list3: function(){

		return list_product.find().fetch()[2];
	},
	getProduct: function(id){
		return products.findOne({"_id":id});
	},
	contents : function(){
		var type=contents_type.findOne({"type":"News"});
		if(type!=null)
			return contents.find({"typeid":type._id});
	},
});
