const express = require('express');
const {authenticate} = require("../middleware/middleware.js")
const loginRouter = express.Router()

loginRouter.post('/',(req,res)=>{
    const{username,password}=req.body;

    const user=authenticate(username,password);
    if(user){
        res.json({message:'Login successful',user});
    }else{
        res.status(401).json({error:'invalid credentials'});
    }
});

module.exports= loginRouter