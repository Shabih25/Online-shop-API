const express=require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
const {authenticate} = require('./middleware/middleware.js');
const {requireAuth} = require('./middleware/middleware.js'); 
const productRoutes=require('./routes/products.js');
const loginRouter = require("./routes/login.js");
const bcrypt=require('bcrypt');
//create our express app
const app=express();
const port=3000;
//middlewares
app.use(bodyParser.json());
const data=require('./data.json');
app.use('/api',productRoutes);
app.use(loginRouter);
app.get('/api/cart',requireAuth,(req,res)=>{
    res.json(req.user.cart);
});
//add product
app.post('/api/cart/:productId',requireAuth,(req,res)=>{
    const productId=parseInt(req.params.productId);
    if (!req.user.cart) {
        req.user.cart = []; 
  }
    const product=data.products.find(p=>p.id==productId);
    if(!product){
        res.status(404).json({error:'Product not found'});
    }else{
        req.user.cart.push(product);
        res.json(req.user.cart);
    }
});

//remove product
app.delete('/api/cart/:productId',requireAuth,(req,res)=>{
    const productId=parseInt(req.params.productId);
    const index=req.user.cart.findIndex(p=>p.id===productId);
    if (index===-1){
        res.status(404).json({error:'Product not found in the cart'});
    }else{
        const removeProduct=req.user.cart.splice(index,1);
        res.json(removeProduct[0]);
    }
})
app.listen(port,()=>{
    console.log('Server is running on http://localhost:3000');
});