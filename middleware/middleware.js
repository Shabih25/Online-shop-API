const path = require('path');
//const dataPath=path.resolve(__dirname,'data.json');
const data=require('../data.json');
async function requireAuth(req,res,next){
  const {username,password}=req.headers;
  console.log(username,password)
  const user=await authenticate(username,password);
  if(user){
      req.user=user;
      next();
  }else{
      res.status(401).json({error:'Unauthorized'});
  }
}

function generateToken(user){
  return jwt.sign({userId:user.id,username:user.username})
}
async function authenticate(username,password){
    const user=data.users.find(u=>u.username===username);

    if (user&&await bcrypt.compare(password,user.passwordHash)){
      return user;
    }
    return null;
  }


module.exports = {
    authenticate,
    requireAuth,
};
