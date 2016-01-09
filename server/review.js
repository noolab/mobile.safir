Meteor.methods({
	addReview: function(title,text,grade,userid,productId){
		var curDate=Date.now();
		var attr={
			title:title,
			comment:text,
			grade:grade,
			user:userid,
			date:curDate
		};

		products.update(
   { "_id": productId },
   { $addToSet: {review: attr } });

	},
		addReviewContent: function(title,text,grade,userid,contentId){
		var curDate=Date.now();
		var attr={
			title:title,
			comment:text,
			grade:grade,
			user:userid,
			date:curDate
		};

		contents.update(
   { "_id": contentId },
   { $addToSet: {review: attr } });

	}
});