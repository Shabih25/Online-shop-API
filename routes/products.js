// routes/products.js
const express = require('express');
const { requireAuth } = require('../middleware/middleware.js');
const data=require('../data.json');

const productRoutes = express.Router();

module.exports = productRoutes;

//get all products
productRoutes.get('/products',requireAuth,(req,res)=>{
    res.json(data.products);
});

//get a single product by ID
productRoutes.get('/products/:id',requireAuth,(req,res)=>{
    const productId=parseInt(req.params.id);
    const product=data.products.find(p => p.id === productId);

    if(!product){
        res.status(404).json({error:'Product not found'});
    }else {
        res.json(product);
    }
});
//creating a new product
productRoutes.post('/products',requireAuth,(req,res)=>{
    console.log('POST request received');
    const newProduct=req.body;
    //validating the input before adding it to data
    data.products.push(newProduct);
    res.json(newProduct);
});
//update a product by ID
productRoutes.put('/products/:id',requireAuth,(req,res)=>{
    console.log('PUT request received');
    const productId=parseInt(req.params.id);
    const updatedProduct=req.body;
    const index=data.products.findIndex(p=>p.id===productId);
    if(index===-1){
        res.status(404).json({error:'Product not found'});
    }else{
        data.products[index]={...data.products[index],...updatedProduct};
        res.json(data.products[index]);
    }
});
//deleting a product by Id
productRoutes.delete('/products/:id',requireAuth,(req,res)=>{
    console.log('DELETE request received');
    const productId=parseInt(req.params.id);
    const index=data.products.findIndex(p=>p.id===productId);
    if(index===-1){
        res.status(404).json({error:'Product not found'});
    }else{
        const deletedProduct=data.products.splice(index,1);
        res.json(deletedProduct[0]);
    }
});