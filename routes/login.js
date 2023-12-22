const express = require('express');
const fs=require('fs/promises')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {authenticate} = require("../middleware/middleware.js")
const router = express.Router()

router.post('/signup',async (req,res)=>{
    try{
        const {username,email,password}=req.body;
        const hash = bcrypt.hashSync(password, saltRounds);
        const data=await fs.readFile('./data.json','utf8');
        const fileData=JSON.parse(data);
        fileData.users.push({username,email,hash})
        const newFile=JSON.stringify(fileData);
        await fs.writeFile('./data.json',newFile);
        return res.json({message:"New user added successfully"})


    }catch(e){
        return res.json(e.message)
    }
});

router.post('/signin',async (req,res)=>{
    try{
        const{email,password}=req.body;
        const data= await fs.readFile('./data.json','utf8');
        const fileData=JSON.parse(data);
        const user=fileData.users.find(user =>user.email===email);
        
        if(user  && bcrypt.compareSync(password, user.hash)){
            return res.json({message:"User logged in successfully"});
        }else{
            return res.status(401).json({error:"Invalid email or password"});
        }
        }catch(e){
        return res.status(500).json({error:e.message});
        }
});



module.exports= router