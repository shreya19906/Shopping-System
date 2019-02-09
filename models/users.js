var mongoose=require('mongoose');
//reuquired to hash the passowrd
var bcrypt= require('bcrypt-nodejs');
var userSchema = new mongoose.Schema({
  email:{type:String,required:true},
  password:{type:String,required:true},

});

//encrypt password
userSchema.methods.encryptPassword=function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);

};

//comapre encrypted with entered password
userSchema.methods.validPassword=function(password){
    return bcrypt.compareSync(password,this.password);
};


var userModel = mongoose.model('userModel', userSchema,'signin_users');
module.exports=userModel;
