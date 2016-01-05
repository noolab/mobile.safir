var open=0;
var direction='left';
Template.headermobile.onRendered(function () {
            $('#sl2').slider();
            //$(".container").hide();
            //$("#submenu-1").hide();
            $(".deroulant").hide();
            $("#refineMenu").hide();
            $("#refineMenuAll").hide();
            $(".hold_sub_dropdown").hide();

});

Template.headermobile.events({
	'click #logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('home');
    },
	'mouseup .panel_price_range': function(e,tpl){
		Router.go('advanced');
	},
	'click .validSearch': function(e,tpl){
		var search=$("#menu-search-input-text").val();
		console.log("searching "+search);
		Session.set('keyword',search);
		Session.set('groupsearch',0);
		Router.go('searchproduct');
	},
	'click .menu-li-arrow-submenu' :function(e,tpl){
		e.preventDefault();
		//alert("yes");
		$(e.currentTarget).parent().parent().find(".deroulant:first").toggle(250);
	},
	'click .refine_subAll': function(e,tpl){
		$(e.currentTarget).parent().find(".hold_sub_dropdown:first").toggle(250);
		$(e.currentTarget).parent().find(".sub_dropdown:first").toggle(250);
		//$(e.currentTarget).parent().find(".sub_dropdown").css("width:250px;");
	},

	/*
	'click .toggle': function(e,tpl){
		$(this).toggleClass("active").next().slideToggle(350);
			return false;
	},
	'click #a-submenu-1': function(e,tpl){
		$('#submenu-1').toggle(250);
	},
	'click .sousmenu': function(e,tpl){
		var id=this._id;
		var name="#submenu-"+id;
		console.log('OUVRIR '+name);
		$(name).toggle(250);
		//$(name).attr('style','display=block;');
	},*/
	'click #refineCateg': function(e,tpl){
		$("#refineMenu").slideToggle("slow");
	},
	'click #refineAll': function(e,tpl){
		$("#refineMenuAll").slideToggle("slow");
	},
	'click #panel_makeup': function(e,tpl){
		//$(".sub_dropdown").slideToggle("slow");
	},
	'click #price_range': function(e,tpl){
		$(".panel_price_range").slideToggle("slow");
	},
	'click #brands': function(e,tpl){
		$(".panel_brands").slideToggle("slow");
	},
	'click #advanced': function(e,tpl){
		$(".panel_advanced").slideToggle("slow");
	},
	'click #skin_type': function(e,tpl){
		$(".panel_skin_type").slideToggle("slow");
	},
	'click #a-menu': function(e,tpl){
		if(open==0){
			var from="left";
			var to="right";
			open=1;
		}
		else{
			var from="right";
			var to="left";
			open=0;
		}
		
		var cls_to = 'moved-'+to, cls_from = 'moved-'+from;
	            if (jQuery('#content-wrapper').is("."+cls_from)) {
	                jQuery('#content-wrapper').removeClass(cls_from);
	            } else if (!jQuery('#content-wrapper').is("."+cls_to)) {
	                if(cls_to == "moved-right") jQuery('#sidebar-wrapper').css("z-index", "-2");
	                if(cls_to == "moved-left") jQuery('#sidebar-wrapper').css("z-index", "0");
	                jQuery('#content-wrapper').addClass(cls_to);
	            }
	},
	'click #a-sidebar': function(e,tpl){
		
		var class_selector = 'moved-'+direction;
		if (jQuery('#content-wrapper').is("."+class_selector)) {
	                jQuery('#content-wrapper').removeClass(class_selector);

	            } else {
	                jQuery('#sidebar-wrapper').css("z-index", "-2");
	                if(class_selector == "moved-right") jQuery('#sidebar-wrapper').css("z-index", "-2");
	                if(class_selector == "moved-left") jQuery('#sidebar-wrapper').css("z-index", "0");
	                jQuery('#content-wrapper').addClass(class_selector);
	            }
	}

});

Template.headermobile.helpers({
	getParent: function(){
		return categories.find({"parent":"0"});
	},
	getChildren: function(parent){
		return categories.find({"parent":parent});
	},
	hasChildren: function(id){
		var size=categories.find({"parent":id}).count();
		console.log('this category size'+id+' : '+size);
		if(size==0)
			return false;
		else
			return true;
	},
	currentCategory: function(){
		var route=Router.current().route.getName();
		var categoryId='';
		if(route=='listing'){
			categoryId=Router.current().params.id;
			return categories.findOne({"_id":categoryId});
		}else if(route=='details'){
			var productId=Router.current().params.id;
			var pro=products.findOne({"_id":productId});
			categoryId=pro.category;
			return categories.findOne({"_id":categoryId});
		}else{
			categoryId='0';
			return categories.findOne({"parent":"0"});
		}


	},
	getBrothers: function(category){
		var parent=category.parent;
		return categories.find({"parent":parent});
	}
});

Template.headermobile.rendered = function(){
  
};
