Meteor.methods({
  insertFavorite:function(attr){
    favorite.insert(attr);
  },
  deleteFavorite:function(attr){
    favorite.remove({"proId":attr});
  },
  reviewtFavorite:function(attr){
    favoritereview.insert(attr);
  }
});