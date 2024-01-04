// routes/products.js
const express = require('express');
const { requireAuth } = require('../middleware/authentication.js');
const data=require('../data.json');
const fs = require("fs")
const productRoutes = express.Router();

module.exports = productRoutes;

//get all products
productRoutes.get('/products',(req,res)=>{
    const dataBuffer = fs.readFileSync('./data.json');
    let dataJSON = dataBuffer.toString();
    dataJSON = JSON.parse(dataJSON);
    
    const { pageNo, pageSize, sort } = req.query;
    let sortedData = dataJSON.products;

    if (sort === 'asc') {
        sortedData = sortedData.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
        sortedData = sortedData.sort((a, b) => b.price - a.price);
    }

        
    const startIndex = (pageNo - 1) * pageSize;
    const endIndex = pageNo * pageSize;
  
    const paginatedData = dataJSON.products.slice(startIndex, endIndex);
  
    res.json({
      data: paginatedData,
      totalPages: Math.ceil(data.products.length / pageSize),
      
    });
});

//get a single product by ID
productRoutes.get('/products/:id',(req,res)=>{
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
// ...

// Patch operation to partially update a product by ID
productRoutes.patch('/products/:id',  (req, res) => {
    console.log('PATCH request received');
    const productId = parseInt(req.params.id);
    const updatedFields = req.body;
    
    const index = data.products.findIndex(p => p.id === productId);

    if (index === -1) {
        res.status(404).json({ error: 'Product not found' });
    } else {
        // Update only the specified fields
        data.products[index] = { ...data.products[index], ...updatedFields };
        res.json(data.products[index]);
    }
});


  