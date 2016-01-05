Template.register.events({
    'click #register': function(event){
    	event.preventDefault();
    	console.log('Register in progress...');
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
		var msg = '';
		console.log(username, firstname, lastname, email, password, country, city, shipcard, point, rerole, msg);
		console.log('register in progress 2...')
		if( firstname == '' || lastname == ''  || email=='' || password ==''){
			if( firstname == '' )
				msg += 'Firt Name is required.';
			if( lastname == '' )
				msg += 'Last Name is required.';
			if( email == '' )
				msg += 'email is required.';
			if( password == '' )
				msg += 'password is required.';
			
			Session.set("registerError", msg );
		}
		else{
			//alert(firstname+lastname+email+password);
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
    	
    }
});

