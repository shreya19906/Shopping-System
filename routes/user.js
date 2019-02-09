var express = require('express');
var router = express.Router();
productModel=require('../models/product');
var Cart=require('../models/cart');
var Order=require('../models/order')
var passport=require('passport');
var csrf=require('csurf');
var csrfProtection=csrf();
router.use(csrfProtection);//all the routes in this should be protected by csrf protection



 
router.get('/profile',isLoggedIn,(req,res,next)=>{
  Order.find({user:req.user},(err,orders)=>{
    if(err)
    res.write("Error!!");
    var cart;
    orders.forEach(function(order){
      cart=new Cart(order.cart);
      order.items=cart.generateArray();
    });
    res.render('user/profile',{orders:orders});
  });

});
//checks for all get post requests any request id  logged in or not
/*router.use('/',notLoggedIn,(req,res,next)=>{
    next();
});*/

router.get('/signup',(req,res,next)=>{
    //we are storing the error messages from the flash 
     var messages=req.flash('error')
    res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
  })
  
  router.post('/signup',passport.authenticate('local-signup',{
    failureRedirect:'/user/signup',
    failureFlash:true
  }),(req,res,next)=>{
    if(req.session.oldUrl){
      var url=req.session.oldUrl;
      req.session.oldUrl=null;
      res.redirect(url);
    }else{
      res.redirect('/user/profile');
    }
  });
 
 
  router.get('/signin',(req,res,next)=>{
    //we are storing the error messages from the flash 
     var messages=req.flash('error')
    res.render('user/signin',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
  })
  
  router.post('/signin',passport.authenticate('local-sign_in',{
    failureRedirect:'/user/signin',
    failureFlash:true
  }),(req,res,next)=>{
    if(req.session.oldUrl){
      var url=req.session.oldUrl;
      req.session.oldUrl=null;
      res.redirect(url);
    }else{
      res.redirect('/user/profile');
    }
  });
 
  

  router.get('/logout',(req,res,next)=>{
      req.logOut();
      res.redirect('/');
  })


 //function to lock some of the routes that is to make them protected 
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated())
    return next();
    res.redirect('/');
}
function notLoggedIn(req,res,next) {
    if(!req.isAuthenticated())
    return next();
    res.redirect('/');
}
  module.exports = router;

  

