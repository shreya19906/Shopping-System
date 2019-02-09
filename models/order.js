var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var userSchema = new mongoose.Schema({
  user:{type:Schema.Types.ObjectId,ref:'userModel'},
  cart:{type:Object,required:true},
  address:{type:String,required:true},
  name:{type:String,required:true},
  paymentId:{type:String,required:true},
  orderTime:{type:Date}

});
var  orderModel = mongoose.model('orderModel', userSchema,'Orders_placed');
module.exports=orderModel;