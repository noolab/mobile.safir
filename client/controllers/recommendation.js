Template.recommendation.helpers({
    products: function(categoryid){
        return products.find({category:categoryid},{limit : 4});
    },
    getImage: function(id){

            var img = images.findOne({_id:id});
            console.log(img);
            
            if(img){
                console.log(img.copies.images.key);
                return img.copies.images.key;
            }else{
                return;
            }
    }
});