var express = require('express');
var router = express.Router();
productModel=require('../models/product');
var Cart=require('../models/cart');
var Order=require('../models/order')
/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg=req.flash('success')[0];
 productModel.find((err,docs)=>{
   if(err) res.send("Sorry request failed");
   var chunksize=3;
   var productChunks=[];
   for(var i=0;i<docs.length;i+=chunksize){
     productChunks.push(docs.slice(i,i+chunksize));

   }
  res.render('shop/index', { title: 'Shopping Website' ,products:productChunks,successMsg:successMsg,noMessages:!successMsg});
 });
  
});

router.get('/add_to_cart/:id',(req,res)=>{
var productId =req.params.id;
var cart=new Cart(req.session.cart?req.session.cart:{});
 productModel.findById(productId,(err,product)=>{
    if(err)
    return res.redirect('/');
    cart.add(product,product.id);
    req.session.cart=cart;  
    res.redirect('/');
 })


});

router.get('/my_cart',(req,res)=>{
  if(!req.session.cart){
    return res.render('shop/shop_cart',{products:null});
  }
  var cart= new Cart(req.session.cart);
  console.log(cart)
res.render('shop/shop_cart',{products:cart.generateArray(),totalPrice:cart.totalPrice});
});

router.get('/checkout',isLoggedIn,(req,res)=>{
  if(!req.session.cart){
    return res.redirect('/my_cart');
  }
  var cart= new Cart(req.session.cart);
  var errMsg=req.flash('error')[0];
res.render('shop/checkout',{total:cart.totalPrice,errMsg:errMsg,noError:!errMsg});
})

router.post('/checkout',isLoggedIn,(req,res)=>{
  if(!req.session.cart){
    return res.redirect('/my_cart');
  }
  var cart= new Cart(req.session.cart);
  var stripe = require("stripe")("sk_test_BcQHrivV8H3vhcVdRgDTdvSg");

  stripe.charges.create({
    amount:cart.totalPrice*100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
  }, function(err, charge) {
    // asynchronously called
    if(err){
      console.log(req.body.stripeToken);
      req.flash('error',err.message);
      return res.redirect('/checkout');
    }
    var order=new Order({
      //user is stored on request due to passport 
      user:req.user,
      cart:cart,
      //after post request value was set in these fields
      address:req.body.address,
      name:req.body.name,
      //charge object stores the payment id
      paymentId:charge.id,
      orderTime:new Date()
    });
    order.save((err,result)=>{
      if(err) {console.log("Error: "+err);}
      req.flash('success','Successfully bought product')
      req.session.cart=null;
      res.redirect('/');
    })
   
  });
})


module.exports=router;
function isLoggedIn(req,res,next) {
  if(req.isAuthenticated())
  return next();
  req.session.oldUrl=req.url;
  res.redirect('/user/signin');
}