const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
// const secretKey = process.env.JWT_SECRET_KEY;
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const Post = require("./models/Post");
require('dotenv').config();

const crypto = require('crypto');
// Generate a random JWT secret key
const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};
const secretKey = process.env.JWT_SECRET_KEY || generateJWTSecret();



// Enable CORS for all routes
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  process.env.MONGODB_URL
);

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
  res.cookie("token", "").json("Ok");
});

//Create Blog Api

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, async (error, info) => {
    if (error) throw error;
    const { title, summary, content } = req.body;
    const PostDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(PostDoc);
  });
});



//Update Blog Api

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, async (error, info) => {
    if (error) throw error;
    const { id, title, summary, content } = req.body;
    const PostDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(PostDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    const updatedPostDoc = await PostDoc.updateOne(
      {
        title,
        summary,
        content,
        cover: newPath ? newPath : PostDoc.cover,
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});