const express = require("express");
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

app.post('/register',(req,res)=>{
  res.json('test ok , great')
})

app.listen(4000)
