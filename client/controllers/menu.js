Session.set('children1','');
Session.set('children2','');
Session.set('selected_menu','');
/*

Deps.autorun(function () {
	var current=Session.get('selected_menu');
  			if(current!='none'){
  				console.log('Have value');
  				if(current!=''){
					if($(current).attr('class').indexOf('selected_item')==-1)
						$(current).addClass('selected_item');
					
				}else{
					console.log('removing class');
					$("li").removeClass('selected_item');
				}
					
  			}
  });
*/
Template.header.helpers({
	getParent: function(){
		return categories.find({"parent":"0"});
	},
	getChildren: function(parent){
		return categories.find({"parent":parent});
	}
});


Template.header.events({
	'mouseover #child1': function(e,tpl){
		tpl.$(".list").html('');
		tpl.$(".num2").html('');
		var catId=this._id;
		
		var list=categories.find({"parent":catId}).fetch();
		console.log('length1: '+list.length);
		for(var i=0;i<list.length;i++)
			tpl.$(".num2").append('<li><a href="/category/'+list[i]._id+'" id="child2" data-id="'+list[i]._id+'">'+list[i].title+'</a></li>');
		
		
	},
	'mouseover .biglink': function(e,tpl){
		//$('.biglink').removeClass('selected_item');
		/*var current=$(e.currentTarget).attr('id');
		current='#'+current;
		Session.set('selected_menu',current);
		console.log('setting selected item= '+current);
	},
	'mouseover #back': function(e,tpl){
		/*console.log('event mouseover');
		var current=Session.get('selected_menu');
		if(current!=''){
			if($(current).attr('class').indexOf('selected_item')==-1)
				$(current).addClass('selected_item');
		}*/
	},
	'mouseleave #back': function(e,tpl){
		/*console.log('event mouse leave');
		var current=Session.get('selected_menu');
		if(current!=''){
			if($(current).attr('class').indexOf('selected_item')!=-1)
				$(current).removeClass('selected_item');
			Session.set('selected_menu','');
		}*/
		/*console.log('event mouse leave');
		Session.set('selected_menu','none');
		console.log('session: '+Session.get('selected_menu'));
		$("li").removeClass('selected_item');*/
	},
	'mouseover #child2': function(e,tpl){
		tpl.$(".list").html('');
		//tpl.$(".num2").html('');
		var catId=e.currentTarget.getAttribute('data-id');;
		var list=categories.find({"parent":catId}).fetch();
		console.log('length2: '+list.length);
		for(var i=0;i<list.length;i++)
			tpl.$(".list").append('<li><a href="/category/'+list[i]._id+'" id="child3" data-id="'+list[i]._id+'">'+list[i].title+'</a></li>');
		console.log("hover!!!!! "+this.title);
	},
	'mouseleave #staticmenu': function(e,tpl){
		console.log('resetting menu!');
		tpl.$(".list").html('');
		tpl.$(".num2").html('');
	},
	'mouseover .megamenu_drop1': function(e,tpl){
		console.log('resetting BIG menu!');
		tpl.$(".list").html('');
		tpl.$(".num2").html('');
	},
	'click .kesearch': function(e,tpl){
		var search=tpl.$("#textToSearch").val();
		Session.set('keyword',search);
		var url="/searchproduct";
		Router.go(url);
		//var listProducts=products.find({"title":{"$regex": search}});
		
	}
});