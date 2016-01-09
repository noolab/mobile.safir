<<<<<<< HEAD
=======

>>>>>>> eade0cde050bb513e3372b140b20f2a371e175a6


fullpath=process.env.PWD;
  console.log('linux path:'+fullpath);
  if( typeof fullpath == 'undefined' ){
    base_path = Meteor.npmRequire('fs').realpathSync( process.cwd() + '../../' );
    console.log('window path:'+base_path);
    base_path = base_path.split('\\').join('/');
    base_path = base_path.replace(/\/\.meteor.*$/, '');
  }else{
    base_path=fullpath;
  }
Router.map(function() {
    this.route('serverFile', {
        where: 'server',
        path: /^\/uploads\/(.*)$/,
        action: function() {
           var filePath =  base_path+'/uploads/' + this.params;
       console.log('path:'+filePath);
           var data = fs.readFileSync(filePath);
           this.response.writeHead(200, {
                'Content-Type': 'image'
           });
           this.response.write(data);
           this.response.end();
        }
    });
});

 Meteor.methods({
   baseUrl: function(){
    basePath = Meteor.absoluteUrl.defaultOptions.rootUrl;
    return basePath;
   },
   basePath: function(){
    var base_path = Meteor.npmRequire('fs').realpathSync( process.cwd() + '../../' );
    base_path = base_path.split('\\').join('/');
    baseDir = base_path.replace(/\/\.meteor.*$/, '');
    return baseDir;
   },
 });
<<<<<<< HEAD
=======

>>>>>>> eade0cde050bb513e3372b140b20f2a371e175a6
