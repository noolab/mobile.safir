
Template.listproducts.events({
    'click #unlike':function(e){
        
            
             e.preventDefault();
             var like="#like"+this._id;
             var unlike="#unlike"+this._id;
             $(like).removeClass('hidelike');
             $(unlike).addClass('hidelike');
             //console.log('id'+Session.get('userId'));
             if(Meteor.userId()){
                var userId=Meteor.userId();
             }else{
                var userId=Session.get('userId');
                if(!userId){
                    var newId=Random.id();
                    Session.setPersistent('userId',newId);
                }
                
             }
             
            var obj={
                proId:this._id,
                userId:userId
            }

            Meteor.call('insertFavorite',obj);
            alert('Product successfully append to favorite!'); 
                

            
    },
    'click #like':function(e){
        e.preventDefault();
        var like="#like"+this._id;
        var unlike="#unlike"+this._id;
        $(like).addClass('hidelike');
        $(unlike).removeClass('hidelike');
        if(Meteor.userId()){
                var userId=Meteor.userId();
        }else{
            var userId=Session.get('userId');
                
        }
        alert(userId);
        var obj=favorite.findOne({userId:userId},{proId:this._id});
        //alert(obj._id);
       
        favorite.remove(obj._id);
       
        
    }
});
Template.listproducts.onRendered(function(){
  var userId=Session.get('userId');
  if(Meteor.userId()){
    var userId=Meteor.userId();
  }
  var favoritelist=favorite.find({userId:userId});
  favoritelist.forEach(function(value){
    var like="#like"+value.proId;
    var unlike="#unlike"+value.proId;
    $(like).removeClass('hidelike');
    $(unlike).addClass('hidelike');
  });
});
Template.headermobile.events({
  'click #favorite':function(e){
    e.preventDefault();
    Router.go('/favorite');
  }
});