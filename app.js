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
const cart = [];

// Route to get the current cart items
app.get('/cart', (req, res) => {
  res.json(cart);
});

// Route to add a product to the cart
app.post('/cart/add', (req, res) => {
  const { productId, productName, price } = req.body;
  const product = { productId, productName, price };

  cart.push(product);
  res.json({ message: 'Product added to cart', cart });
});

// Route to remove a product from the cart
app.post('/cart/remove', (req, res) => {
  const { productId } = req.body;
  const index = cart.findIndex((item) => item.productId === productId);

  if (index !== -1) {
    cart.splice(index, 1);
    res.json({ message: 'Product removed from cart', cart });
  } else {
    res.status(404).json({ error: 'Product not found in cart' });
  }
});
const data=require('./data.json');
 
app.use('/api',productRoutes);
app.use('/login', loginRouter);
app.listen(port,()=>{
    console.log('Server is running on http://localhost:3000');
});