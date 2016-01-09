Template.tutodetails.events({
	'click #addreview': function(e,tpl){
		var userid=Meteor.userId();
		if(userid==null){
			alert("You have to be logged to submit a review!");
			return;
		}
		//var textname='#comment'+this._id;
		//alert(textname);
		var title=tpl.$("#title").val();
		var text=$('#comment').val();
		var grade=tpl.$("#sel1").val();

		Meteor.call('addReviewContent',title,text,grade,userid,this._id);
		alert("Review added successfully!")
	},
	'click #bt_review': function(e,tpl){
		if(tpl.$("#add_review").css("display")=='none')
			tpl.$("#add_review").css("display","block");
		else
			tpl.$("#add_review").css("display",'none');
	},
	'click #btnMore':function(e){
			e.preventDefault();
			//alert();
			var last = Session.get('numberOfReviews');
			var sum = Number(last) + 5;
			var update = Session.set('numberOfReviews',sum);
			return update;
		}
});
Template.tutodetails.helpers({
 getImgUrl: function(userid){
  console.log('avatar='+userid);
  var user=users.findOne({"_id":userid});
  if(!user.hasOwnProperty('image'))
            return 'unknown.png';
  var img = images.findOne({_id:user.image});
            console.log("current img="+img);
            
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }else{
                return;
            }
 }
});

Template.tutodetails.helpers({
	getUsername: function(userid){
		return users.findOne({_id:userid}).emails[0].address;
	},
	getImgUrl: function(userid){
		console.log('avatar='+userid);
		var user=users.findOne({"_id":userid});
		if(!user.hasOwnProperty('avatar'))
            return 'unknown.png';
		var img = images.findOne({_id:user.avatar});
            console.log("current img="+img);
            
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }else{
                return;
            }
	},
	//getreveiw
		getReviews: function(reviews,filtre,toremove){
			/*
			console.log('reloading reviews...'+Session.get('fiterValue'));
			var toRemove=Session.get('removefilter').split(':');
			var myFilter=Session.get('fiterValue');
			for(var i=0;i<toRemove.length;i++){
				if(toRemove[i]=='')
					continue;
				var str=':'+toRemove[i];
				myFilter.replace(str,'');
			}*/

			//console.log('Before: '+Session.get('fiterValue'));
			//console.log('ToRemove:'+Session.get('removefilter'));
	
			
			if(Session.get('fiterValue')=="" || Session.get('fiterValue')=="undefined"){
				var lastResult=[];
				var numberOfResult=Session.get('numberOfReviews');

				if(numberOfResult>reviews.length)
					numberOfResult=reviews.length
				console.log('NUMBER OF lastResult.length '+numberOfResult);
				for(var i=0;i<numberOfResult;i++)
					lastResult.push(reviews[i]);

				console.log('NUMBER OF lastResult.length '+lastResult.length);
				return lastResult;
					
			}
			console.log('Calling filterReview='+reviews.length);
			var values=Session.get('fiterValue').split(':');
			//fiterValue
			var ages=[];
			var myTags=[];
			var grades=[];

			for(var i=0;i<values.length;i++){
				var param=values[i];
				if(param=='')
					continue;
				console.log("Processing "+param);
				if(param.indexOf('-')>=0){
					ages.push(param);
				}else if(param.indexOf('/')>=0){
					grades.push(param);
				}else{
					myTags.push(param);
				}
			}

			console.log('ages:'+ages.length);
			console.log('myTags:'+myTags.length);
			console.log('grades:'+grades.length);

			var results=[];
			for(var i=0;i<ages.length;i++){
				var ageMin=Number(ages[i].split('-')[0]);
				var ageMax=Number(ages[i].split('-')[1]);

				console.log('min:'+ageMin);
				console.log('max:'+ageMax);
				//Loop into reviews
				for(var j=0;j<reviews.length;j++){
					var curUser=users.findOne({"_id":reviews[j].user});
					if(Number(curUser.profile.age)<= ageMax && Number(curUser.profile.age)>=ageMin){
						results.push(reviews[j]);

					}
						
				}
			}
			console.log('Size of the rest:'+reviews.length);
			console.log('Still in the sand after ager filter:'+results.length);
			if(results.length>0){
					console.log('remise a 0');
					reviews=[];
					reviews=results.slice(0);
					results=[];
			}
				
			console.log('Size of the rest:'+reviews.length);
			for(var i=0;i<myTags.length;i++){
				var curTag=myTags[i];
				console.log('tagging '+curTag);
				for(var j=0;j<reviews.length;j++){
					var curUser=users.findOne({"_id":reviews[j].user});
					if(curUser.profile.tag.indexOf(curTag)>=0)
						results.push(reviews[j]);
				}
			}

			console.log('Still in the sand(tags):'+results.length);
			if(results.length>0){
					console.log('remise a 0');
					reviews=[];
					reviews=results.slice(0);
					results=[];

			}
			if(grades.length==0)
				results=reviews.slice(0);
			console.log('Size of the rest:'+reviews.length);
			for(var i=0;i<grades.length;i++){
				var curGrade=grades[i].split('/')[0];
				//Loop into reviews

				for(var j=0;j<reviews.length;j++){
					
					if(Number(reviews[j].grade)==Number(curGrade) && results.indexOf(reviews[j])<0){
						results.push(reviews[j]);
						console.log('Comparing '+curGrade+' and '+reviews[j].grade);
					}
						
				}
			}

			console.log('Still in the sand(grades):'+results.length);
			console.log('afterFilter:'+results.length);

			var lastResult=[];
			var numberOfResult=Session.get('numberOfReviews');

			if(numberOfResult>results.length)
				numberOfResult=results.length
			console.log('NUMBER OF lastResult.length '+numberOfResult);
			for(var i=0;i<numberOfResult;i++)
				lastResult.push(results[i]);

			console.log('NUMBER OF lastResult.length '+lastResult.length);
			return lastResult;
		
	},
	filterReview: function(){
		Tracker.autorun(function () {
			console.log('RERUNNING');
			return Session.get('fiterValue');
		});
	},
	removeFilter: function(){
		Tracker.autorun(function () {
			console.log('RERUNNING delete');
			return Session.get('removefilter');
		});
	},
	//
});


