const express = require("express");
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.post('/register',(req,res)=>{
  const{username,password} = req.body;
  res.json({requestData:{username,password}});
})

app.listen(4000)
