const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();
const User = require("./models/user");
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const secretKey = "padkcw6t456yge0948eujhhbcnb2m3n4nm7fcyq7betiyushd"
const cookieParser = require("cookie-parser")

// Enable CORS for all routes
app.use(cors({credentials:true,origin:'http://localhost:5173'}));
app.use(express.json());
app.use(cookieParser())

mongoose.connect(
  "mongodb+srv://Faizan:TcNaWUyVCvAXsSOF@cluster0.fwl3b04.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const UserDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(UserDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login",async(req,res) => {
  const{username,password} = req.body;
  const UserDoc = await User.findOne({username})
  const passOk = bcrypt.compareSync(password,UserDoc.password)
  if(passOk){
    //logged in
    jwt.sign({username,id:UserDoc._id},secretKey,{},(error,token)=>{
      if(error) throw error
      res.cookie('token',token).json({
        id:UserDoc._id,
        username,
      });
    });
  }else{
    res.status(400).json('wrong credentials')
  }
})

app.get("/profile",(req,res) => {
  const {token} = req.cookies;
  jwt.verify(token,secretKey,{},(error,info)=>{
    if(error) throw error
    res.json(info)
  })
  res.json(req.cookies);
})

//for logout
app.post("/logout",(req,res)=>{
  res.cookie('token','').json('Ok')
})

app.listen(4000);

//TcNaWUyVCvAXsSOF  (MongoDb-Password)
//mongodb+srv://Faizan:TcNaWUyVCvAXsSOF@cluster0.fwl3b04.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 (connection url)
//mongodb+srv://Faizan:<password>@cluster0.fwl3b04.mongodb.net/ (connection url)
