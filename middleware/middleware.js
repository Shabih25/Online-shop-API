const path = require('path');
//const dataPath=path.resolve(__dirname,'data.json');
const data=require('../data.json');
function authenticate(username,password){
    let userExists = false;
    let user
    for (let i = 0; i < data.users.length; i++) {
      user = data.users[i]; 
      console.log(password,user.password)
      if (user.username == username && user.password == password) {
        userExists = true;
        break; 
      }
    }
    
    if (userExists) {
      return user
    } else {
return undefined    }
}

function requireAuth(req,res,next){
    const {username,password}=req.headers;
    console.log(username,password)
    const user=authenticate(username,password);
    if(user){
        req.user=user;
        next();
    }else{
        res.status(401).json({error:'Unauthorized'});
    }
}

module.exports = {
    authenticate,
    requireAuth,
};
