Meteor.methods({
	// parent tags
	addTag: function(title, category_id){
		var attributes = {
			title:title,
			category_id:category_id
		};
		parent_tags.insert(attributes);
		console.log("parent_tags inserted");
	},
	updateTag: function(id, attributes){
		parent_tags.update({_id:id},{$set:attributes})
	},
	remove: function(id){
		parent_tags.remove(id);
	},
	addTagValue: function(title, parent_id){
		var attributes = {
			title:title,
			parent:parent_id
		};
		tags.insert(attributes);
		console.log("tag inserted");
	},
	removeValue: function(id){
		tags.remove(id);
	},
});