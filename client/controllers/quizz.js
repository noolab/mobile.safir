Session.set('currentAnswer','');
Session.set('list_tag','');
Session.set('parentAnswer','');
Session.set('currentAnswer','');
Session.set('parentAnswer','');
Template.quizz.helpers({
	currentQuestionId: function(){
		return Session.get('currentQuestion');
	},
	currentQuestion: function(){
		if(Session.get('parentAnswer')=='')
			var j=journey.find({"category":Session.get('curCategory')}).fetch();
		else
			var j=journey.find({"parent":Session.get('parentAnswer')}).fetch();
		console.log("journey:"+j.length);
		console.log('currentanwser'+Session.get('parentAnswer'));
		return j[0];
	}	
});


Template.quizz.events({
	'click #next': function(e,tpl){
		//TAGS
		var choice=Session.get('currentAnswer');
		var list=Session.get('list_tag')+choice+';';
		Session.set('list_tag',list);

		//id
		var temp=Session.get('currentAnswerIdTemp');
		Session.set('parentAnswer',temp);
		
		var j=journey.find({"parent":Session.get('parentAnswer')}).fetch();
		if(j.length==0){
			$('#myJourney').modal('hide');
			console.log('listTag:'+list);
		}
		$("#choice_tag").attr('checked', false);;
		var old=Session.get('search')+list;
		Session.set('search',old);
			

	},
	'change #choice_tag': function(e,tpl){
		if(e.target.checked){
			Session.set('currentAnswer',this.tag);
			Session.set('currentAnswerIdTemp',this.id);
		}
		
	}
});

Template.quizz.onRendered(function () {
	console.log("this"+this.data._id);
  // Use the Packery jQuery plugin
  var curCategory=this.data._id;
  Session.set('curCategory',curCategory);
  $('#myJourney').modal('show');

});