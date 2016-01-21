
Router.configure({
    layoutTemplate: 'headermobile'
});



Router.route('/',{
    //layoutTemplate: 'homeLayout',
    name:'home',
    waitOn : function () {
            return [Meteor.subscribe("products",-1)];
        },
});

Router.route('/login', {
    name: 'login'
});

Router.route('/register', {
    name: 'register'
});

Router.route('/member', {
    name: 'member'
});

Router.route('/register-success', {
    name: 'register-success'
});
//admin
Router.route('/addproduct',{
	name:'addproduct',
    waitOn : function () {
            return [Meteor.subscribe("parent_tags"),Meteor.subscribe("tags"),Meteor.subscribe("categories")];
        }
});

// admin Products
Router.route('/manageproduct',{
    name:'manageproduct',
    waitOn : function () {
            return [Meteor.subscribe("categories"),Meteor.subscribe("products",-1)];
        }
});


Router.route('/updateproduct/:_id',{
	name: 'updateproduct',
    template: 'addproduct',
    waitOn : function () {
            return [Meteor.subscribe("products",-1),Meteor.subscribe('attribute')];
        },
	data: function(){
        var id = this.params._id;
        var da = products.findOne({_id: id });
		return da;
    }
});


Router.route('/linkselling', {
    name: 'linkselling',
    waitOn : function () {
            return [Meteor.subscribe("question"),Meteor.subscribe("linkselling")];
        },
});

Router.route('/category/:id',{
        name: 'listing',
        template:'listproducts',
        waitOn : function () {
            return [Meteor.subscribe("products",-1),Meteor.subscribe('categories')];
        },
        data: function() {
            var limit=Session.get('querylimit');/////////////////
            console.log('PNC limit:'+limit);
            Session.set('currentCategory',this.params.id);
            var result=products.find({"category":this.params.id},{limit:limit});///////////////
            Session.set('nbproducts',result.fetch().length);
            return {products:result};

        //return categories.findOne({_id: this.params.id},{limit:Session.get('querylimit')});
    }
});

Router.route('/details/:id', {
    name: 'details',
    waitOn : function () {
            return [Meteor.subscribe("products",-1)];
        },
    data: function() {
        
        var prod=products.findOne({"_id": this.params.id});
        if(prod!=null){
            console.log('ID='+this.params.id+' /'+JSON.stringify(prod));
            Session.set('currentCategory',prod.category);
            return prod;
        }
        
    }
    
    
});





Router.route('/profile', {
    name: 'profile' 
});
Router.route('/editprofile', {
    name: 'editprofile'  
});

Router.route('/reward', {
    name: 'reward',
    waitOn : function () {
        return [Meteor.subscribe('products',-1)];
    }
});

// admin categories
Router.route('/managecategory',{
	name: 'managecategory'
});
Router.route('/addcategory',{
	name: 'addcategory'
	
});

Router.route('/updatecategory/:_id',{
	name: 'updatecategory',
	data: function(){
        var id = this.params._id;
        var da = categories.findOne({_id: id });
		return da;
    }
});


// shop
Router.route('/manageshop',{
	name:'manageshop'
});

Router.route('/shopdetail/:id',{
	name:'shopdetail',
	data: function(){
        var id = this.params.id;
        var da = shops.findOne({_id: id });
		return da;
    }
});

Router.route('/updateshop/:_id',{
	name: 'updateshop',
	data: function(){
        var id = this.params._id;
        var da = shops.findOne({_id: id });
		return da;
    }
});

// parent tags
Router.route('/manageparenttag',{
		name:'manageparenttag'
});
Router.route('/updateparenttag/:_id',{
		name:'updateparenttag',
		data: function(){
			var id = this.params._id;
			var result = parent_tags.findOne({_id: id});
			return result;
		}
});
// tags
Router.route('/managetag',{
		name:'managetag'
});

Router.route('/listproducts/:brand',{
        name:'listproducts',
        waitOn : function () {
            return [Meteor.subscribe('products',-1)];
        },
        data: function(){
            
                Session.set('limit',-1);
                Session.set('querylimit',16);
                var brand = this.params.brand;
                var result = products.find({"Brand":brand},{limit:Session.get('querylimit')});
                Session.set('nbproducts',result.fetch().length);
                return result;

        }
});

Router.route('/advanced',{
        name:'advanced',
        template: 'listproducts',
        waitOn : function () {
            return [Meteor.subscribe('products',-1),Meteor.subscribe('categories')];
        },
        data: function(){
                var list_categories=[];
                if(Session.get('currentCategory')=='' || Session.get('currentCategory')=='undefined'){
                    console.log('pas encore de categories');
                    var allCat=categories.find({}).fetch();
                    console.log('pas de cat in session:'+allCat.length);
                    for(var i=0;i<allCat.length;i++){
                        
                        list_categories.push(allCat[i]._id);
                    }
                }else{
                    console.log('already:'+Session.get('currentCategory'));
                    list_categories.push(Session.get('currentCategory'));
                }

                console.log('CURRENTCATEGORY='+list_categories);

                Session.set('limit',-1);
                Session.setDefault('querylimit',16);
                var list_brand=[];
                var list_tags=[];
                var review_part={};

                if(Session.get('advanced_brand')!='')
                    list_brand = Session.get('advanced_brand').split(';');

                var priceMin=0;
                if(Session.get('advanced_price_min')!= "")
                    priceMin=Number(Session.get('advanced_price_min'));

                var priceMax=Number.MAX_VALUE;
                if(Session.get('advanced_price_max')!="")
                    priceMax=Session.get('advanced_price_max');
                priceMax=Number(priceMax);

                list_tags=Session.get('advanced_tags').split(';');


                var has_comment=Session.get('advanced_has_comment');
                var is_favorite=Session.get('advanced_is_favorite');

                if(list_brand.length==0){
                    
                    var allProducts=products.find().fetch();
                    console.log('Remplissage des Brand: '+allProducts.length);
                    for(var i=0;i<allProducts.length;i++){
                        if(list_brand.indexOf(allProducts[i].Brand)<0)
                            list_brand.push(allProducts[i].Brand);
                    }

                }
                console.log('list_brand='+list_brand);

                /*
                if(list_tags.length==0){
                    var allProducts=products.find();
                    for(var i=0;i<allProducts.length;i++){
                        if(list_tags.indexOf(allProducts[i].Brand)==-1)
                            list_brand.push(allProducts[i].Brand);
                    }

                }{review : {$exists:true}, {$where:'this.review.length>0'}}
                */

                console.log('PriceMin= '+priceMin);
                console.log('PriceMax= '+priceMax);
                //alert('priceMin='+priceMin);
                //alert('priceMax='+priceMax);
                //alert('list_categories='+list_categories);
                //alert('list_brand='+list_brand);
                //alert('q');
                //var result = products.find({"category":{"$in":list_categories},"Brand":{"$in":list_brand},"price":{"$gte":priceMin,"$lt":priceMax}},{limit:Session.get('querylimit')});
                var arrayobj=[];
                if(has_comment==0){
                    var result = products.find({$and:[{category:{$in:list_categories}},{Brand:{$in:list_brand}}]});
                    result.forEach(function(value){
                        if(value.price>=priceMin && value.price<priceMax){
                            arrayobj.push(value);
                        }
                    });
                }
                else{
                    var result = products.find({$and:[{category:{$in:list_categories}},{Brand:{$in:list_brand}}]});
                    result.forEach(function(value){
                        if(value.price>=priceMin && value.price<priceMax){
                            arrayobj.push(value);
                        }
                    });
                }
                //alert('myresult:'+result.count());
                Session.set('nbproducts',arrayobj.length);
                return {products:arrayobj};

        }
});

Router.route('/favorite', {
    template:'listproducts',
        waitOn : function () {
            return [Meteor.subscribe('products',-1)];
        },
        data: function(){
            
                Session.set('limit',-1);
                var userId=Session.get('userId');
                if(Meteor.userId()){
                    var userId=Meteor.userId();
                }
                      var ses=Session.get('userId');
                      var data=  favorite.find({userId:userId},{limit:Session.get('querylimit')});
                      var object=[];
                      var obj={};
                      data.forEach(function(entry) {
                        var proid=entry.proId;
                          obj=products.findOne({_id:proid});
                          object.push(obj);
                            
                       });
                  console.log(object);
                  Session.set('nbproducts',object.length);
                return {products:object};
                
        }
    
});

Router.route('/searchproduct',{
        template:'searchproduct',
        waitOn : function () {
            return [Meteor.subscribe('products',-1)];
        },
        data: function(){
            /*var keyword = Session.get('keyword');

            console.log('parameter:'+keyword);
            if(keyword==""){
                Session.set('nbproducts',0);
                return null;
            }
                
            var result = "";
            result = products.find({title: {$regex: new RegExp(keyword, "i")}},{limit:Session.get('querylimit')});
            Session.set('nbproducts',result.fetch().length);
            console.log("pro:"+result.count());
            return result;

            */

            var keyword = Session.get('keyword');
        var groupid = parseInt(Session.get('groupsearch'));
        if( keyword != ""){
            console.log("group:"+groupid);
            var result = [];
            var result1=[];
            if( groupid == 1){
                result = products.find({$or:[{title: {$regex: new RegExp(keyword, "i")}},{description: {$regex: new RegExp(keyword, "i")}}]}).fetch();
                Session.set("searchall","");
            }
            else if( groupid == 2 ){
                var forum = contents_type.findOne({type:"Forum"});
                result1 = contents.find({$or:[{title: {$regex: new RegExp(keyword, "i")}},{content: {$regex: new RegExp(keyword, "i")}}], typeid:forum._id}).fetch();
                Session.set("searchall","");
            }
            else if( groupid == 3 ){
                var look = contents_type.findOne({type:"Looks"});
                result1 = contents.find({$or:[{title: {$regex: new RegExp(keyword, "i")}},{content: {$regex: new RegExp(keyword, "i")}}], typeid:look._id}).fetch();
                Session.set("searchall","");
            }
            else if( groupid == 4 ){
                var webzine = contents_type.findOne({type:"Webzine"});
                result1 = contents.find({$or:[{title: {$regex: new RegExp(keyword, "i")}},{content: {$regex: new RegExp(keyword, "i")}}], typeid:webzine._id}).fetch();
                Session.set("searchall","");
            }
            else if( groupid == 5 ){
                var tuto = contents_type.findOne({type:"Tuto"});
                result1 = contents.find({$or:[{title: {$regex: new RegExp(keyword, "i")}},{content: {$regex: new RegExp(keyword, "i")}}], typeid:tuto._id}).fetch();
                Session.set("searchall","");
            }
            else{
                console.log("Searchin  all");
                result = products.find({$or:[{title: {$regex: new RegExp(keyword, "i")}},{description: {$regex: new RegExp(keyword, "i")}}]});
                result1 = contents.find({$or:[{title: {$regex: new RegExp(keyword, "i")}},{content: {$regex: new RegExp(keyword, "i")}}]});
                Session.set("searchall",1);            
            }
            
            Session.set('nbproducts',result.count());
            Session.set('nbcontents',result1.count());
            console.log('nbproducts:'+result.length);
            return {products:result,content:result1};
            /*
            console.log("value:"+groupid);
            var result = "";
            switch( groupid ){
                case 1:
                    result = products.find({title: {$regex: keyword}});
                //case 4:
                    //result = content.find({title: {$regex: keyword}});
                default:
                    return;
            }*/
            //console.log("pro:"+result.count());
            
        }else{
            Session.set('nbproducts',0);
            Session.set('nbcontents',0);
            return;
        }
        }
});

Router.route('/checkout',{
    name:'checkout'
});

Router.route('/webzinelisting',{
    name: 'webzinelisting'
});
Router.route('/webzinedetails/:_id', {
    name: 'webzinedetails' ,
    data: function(){
         return contents.findOne({_id: this.params._id});
    } 
});

Router.route('/addContent', {
    name: 'addContent',
    template:'addContent'
});

Router.route('/updateContent/:_id', {
    name: 'updateContent',
    data: function(){
        return contents.findOne({_id: this.params._id});
    }
});

Router.route('/managecontent', {
    name: 'managecontent'
});
//end kis

//Parent Attribute
Router.route('/parentattr', {
    name: 'parentattr',
    
});

Router.route('/editparentattr/:_id', {
    name: 'editparentattr',
    data: function() {
        return parentattr.findOne({_id: this.params._id});
    },

    
});
//Attribute
Router.route('/attribute', {
    name: 'attribute',
    
});
Router.route('/editattr/:_id', {
    name: 'editattr',
    data: function() {
        var attr= attribute.findOne({_id: this.params._id});
        Session.setPersistent('id',attr.productImage);//store field productImage to use in helper to get file dispay
        Session.setPersistent('attrId',this.params._id);//store id attribute to use delete file
        var id =attr.parentId;
        var parent=parentattr.findOne({_id:id})
        Session.setPersistent('parentID',parent._id);//store id parent attribute to find where not equal parentId
        var dataAll={
            attr:attr,
            parent:parent
        }
        return dataAll;
    }

    
});

Router.route('/tutolisting/:_id',{
    name:'tutolisting',
    data:function(){
        return categories.findOne({_id: this.params._id});
    }
});
Router.route('/tutodetails/:_id',{
    name:'tutodetails',
    data:function(){
        return contents.findOne({_id: this.params._id});
    }
});
Router.route('/tuto',{
    name:'tutonew',
});

Router.route('/journey', {
    name: 'journey'  
});


Router.route('/test', {
    name: 'test',
    waitOn : function () {
            return [Meteor.subscribe("products",-1)];
        }  
});

Router.route('/addlistproduct', {
    name: 'addlistproduct',
    waitOn : function () {
            return [Meteor.subscribe("products",-1)];
        } 
});
Router.route('/updatelistproduct/:_id',{
    name: 'updatelistproduct',
    waitOn : function () {
            return [Meteor.subscribe("products",-1)];
        } ,
    data: function(){
        var id = this.params._id;
        var da = list_product.findOne({_id: id });
        return da;
    }
});
Router.route('/confirmorder',{
    name: 'confirmorder',
});
// Router.route('/confirmorder1',{
//     name: 'confirmorder1',
// });
Router.route('/confirmorder2',{
    name: 'confirmorder2',
});
Router.route('/popupcart',{
    name:'popupcart'
});


