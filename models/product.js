var mongoose=require('mongoose');

var userSchema = new mongoose.Schema({
  imagePath:{type:String,required:true},
  title:{type:String,required:true},
  description:{type:String,required:true},
  price:{type:Number,required:true}
  
});
var productModel = mongoose.model('productModel', userSchema,'video_games');
module.exports=productModel;

module.exports.insertData=function(){
    var item =  [
      new productModel ({
        imagePath:"https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png",
        title:'Gothic Video Game',
        description:"Awesome Game!!",
        price:10
    }),
    new productModel({
        imagePath:"https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png",
        title:'Gothic Video Game',
        description:"Lovely Game!!",
        price:70
    }),
    new productModel ({
        imagePath:"https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png",
        title:'Gothic Video Game',
        description:"Amazing Game!!",
        price:100
    })
    ];
   
    var done=0;
    for(var i=0;i<item.length;i++){
      done++;
      item[i].save(function(err,result) {
        if (err)
           console.log("error occured: "+err);
        else 
           console.log('save user successfully...');
           if(done==item.length)
           exit();
      });
       
    }

    function exit() {
        mongoose.disconnect();
    }
  
  }
