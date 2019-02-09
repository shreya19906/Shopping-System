
var express = require('express');
var router = express.Router();
productModel=require('../models/product');

module.exports =function Cart(OldCart){
    this.items      =OldCart.items||{};
    this.totalQty   =OldCart.totalQty||0;
    this.totalPrice =OldCart.totalPrice||0;
   
    this.add=function(item,id){
       var storedItem=this.items[id];
       if(!storedItem){
       // console.log("inside empty cart"+storedItem.item.title);
        storedItem=this.items[id]={item:item,qty:0,price:0};
        console.log("in empty cart"+storedItem.item.title);
       }
     
        storedItem.qty++;
        storedItem.price=storedItem.item.price*storedItem.qty;
        this.totalQty++;
        this.totalPrice+=storedItem.item.price;
    
    }
    this.generateArray=function(){
        const arr=[];
    for(var id in this.items){
           arr.push(this.items[id]);
           console.log("inout"+this.items[id].title);
     }
    

     return arr;  
   }
}
