
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
Template.tutodetails.events({
  'click #unlike':function(e){
    e.preventDefault();
    var like ='#like'+this._id;
    var unlike ='#unlike'+this._id;
    $(like).removeClass('fanone');
    $(unlike).addClass('fanone');
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
                videoId:this._id,
                userId:userId
            }

      Meteor.call('reviewtFavorite',obj);
      alert('video successfully append to favorite!'); 
  },
  'click #like':function(e){
    e.preventDefault();
     var unlike ='#unlike'+this._id;
     var like ='#like'+this._id;
     $(unlike).removeClass('fanone');
     $(like).addClass('fanone');
     if(Meteor.userId()){
                var userId=Meteor.userId();
        }else{
            var userId=Session.get('userId');
                
        }
        alert(userId);
        var obj=favoritereview.findOne({userId:userId},{videoId:this._id});
        //alert(obj._id);
       
        favoritereview.remove(obj._id);
  }
});
Template.tutodetails.helpers({
    getfavorit:function(){
       return favoritereview.find();
    }
});
Template.tutodetails.onRendered(function(){
  var userId=Session.get('userId');
  if(Meteor.userId()){
    var userId=Meteor.userId();
  }
  var favoritelist=favoritereview.find({userId:userId});
  favoritelist.forEach(function(value){
    var like="#like"+value.videoId;
    var unlike="#unlike"+value.videoId;
    $(like).removeClass('fanone');
    $(unlike).addClass('fanone');
  });
});