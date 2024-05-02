const express = require("express");
require('dotenv').config();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "/tmp" });
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const fs = require("fs");
const Post = require("./models/Post");
// const crypto = require('crypto');
// Generate a random JWT secret key
// const generateJWTSecret = () => {
//   return crypto.randomBytes(32).toString('hex');
// };
// const secretKey = crypto.randomBytes(32).toString('hex')
const bucket = "faizan-mern-blog";



// Enable CORS for all routes
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  process.env.MONGODB_URL
);

//Funtion to upload images of blogs to S3 bucket.
async function uploadToS3(path, originalFilename, mimetype){
  const client = new S3Client({
    region:'eu-north-1',
    credentials:{
      accessKeyId:process.env.S3_ACCESS_KEY,
      secretAccessKey:process.env.S3_SECRET_ACCESS_KEY,
    }
  })
  const parts = originalFilename.split('.');
  const ext = parts[parts.length - 1];
  const newFilename = Date.now()+ '.' + ext;
  await client.send(new PutObjectCommand({
    Bucket:bucket,
    Body:fs.readFileSync(path),
    Key:newFilename,
    ContentType:mimetype,
    ACL:'public-read'
  }))
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

//Register Api

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const UserDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(UserDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});


//Login Api

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const UserDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, UserDoc.password);
  if (passOk) {
    //logged in
    jwt.sign({ username, id: UserDoc._id }, secretKey, {}, (error, token) => {
      if (error) throw error;
      res.cookie("token", token).json({
        id: UserDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, (error, info) => {
    if (error) throw error;
    res.json(info);
  });
  res.json(req.cookies);
});

//for logout
app.post("/logout", (req, res) => {
  // res.cookie("token", "").json("Ok");
  res.cookie("token", "", { expires: new Date(0) }).json("Logged out successfully");
});

//Create Blog Api

app.post("/post",uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path,mimetype } = req.file;
  const url = await uploadToS3(path,originalname,mimetype);
  // PostDoc.push(url)
  // const parts = originalname.split(".");
  // const ext = parts[parts.length - 1];
  // const newPath = path + "." + ext;
  // fs.renameSync(path, newPath);
  // post.push(url)

  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, async (error, info) => {
    if (error) {
      // Handle the JWT verification error gracefully
      console.error("JWT verification error:", error);
      return res.status(401).json({ message: "Unauthorized" }); // Send an unauthorized response
    }
    const { title, summary, content } = req.body;
    // const newPath = path;
    const post = await Post.create({
      title,
      summary,
      content,
      cover: url,
      author: info.id,
    });
    res.json(post);
  });
});



//Update Blog Api

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    // const { originalname, path } = req.file;
    // const parts = originalname.split(".");
    // const ext = parts[parts.length - 1];
    // newPath = path + "." + ext;
    const { originalname, path, mimetype } = req.file;
    newPath = await uploadToS3(path, originalname, mimetype);
    // fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, async (error, info) => {
    if (error) throw error;
    const { id, title, summary, content } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    const updatedPostDoc = await post.updateOne(
      {
        title,
        summary,
        content,
        cover: newPath ? newPath : post.cover,
      },
      { new: true }
    );

    if (!updatedPostDoc) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPostDoc);
  });
});

app.get("/post", async (req, res) => {
  const Posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(30);
  res.json(Posts);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const PostDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(PostDoc);
});

app.use((req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
      return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
          return res.status(401).json({ message: "Failed to authenticate token" });
      }
      req.user = decoded;
      next();
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});