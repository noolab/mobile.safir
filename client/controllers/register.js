Template.register.events({
    'submit form': function(e){
    	//alert('hi');
    	e.preventDefault();
    	var username=$('[name=username]').val();
    	var firstname =$('[name=fname]').val();
		var lastname =$('[name=lname]').val();
		var email = $('[name=email]').val();
		var password =$('[name=password]').val();
		var country=$('[name=pays]').val();
		var city=$('[name=ville]').val();
		var shipcard = '';
		var point = 0;
		var rerole = 'member';
		//alert(username+firstname+lastname+email+password+country+city+shipcard+point+rerole);
		Meteor.call('regUser',firstname, lastname, email, password, shipcard, point, rerole,country,city,username,function(err){
				if(err){
					console.log(err.reason);
					Session.set("registerError",err.reason);
				}else{
					Session.set("registerError","");
					Router.go('register-success'); 
				}
			});
	}

});

