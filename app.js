const express=require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
const {authenticate} = require('./middleware/middleware.js');
const {requireAuth} = require('./middleware/middleware.js'); 
const productRoutes=require('./routes/products.js');
const loginRouter = require("./routes/login.js")

//create our express app
const app=express();
const port=3000;
//middlewares
app.use(bodyParser.json());
const data=require('./data.json');
 
app.use('/api',productRoutes);
app.use('/login', loginRouter)
app.listen(port,()=>{
    console.log('Server is running on http://localhost:3000');
});