const express=require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
//create our express app
const app=express();
const port=3000;
//middlewares
app.use(bodyParser.json());

app.listen(port,()=>{
    console.log('Server is running on http://localhost:3000');
});
const data=require('./data.json');

//get all products
app.get('/api/products',(req,res)=>{
    res.json(data.products);
});

//get a single product by ID
app.get('/api/products/:id',(req,res)=>{
    const productId=parseInt(req.params.id);
    const product=data.products.find(p => p.id === productId);

    if(!product){
        res.status(404).json({error:'Product not found'});
    }else {
        res.json(product);
    }
});
//creating a new product
app.post('/api/products',(req,res)=>{
    console.log('POST request received');
    const newProduct=req.body;
    //validating the input before adding it to data
    data.products.push(newProduct);
    res.json(newProduct);
});
//update a product by ID
app.put('/api/products/:id',(req,res)=>{
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
app.delete('/api/products/:id',(req,res)=>{
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
