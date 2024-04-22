const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const app = express();
// const cors = require("cors");
app.use(express.json());
// app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(
    "mongodb+srv://anjeet:anjeet@cluster0.a01xrew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.error(err);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

app.post("/users", (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  user
    .save()
    .then((newUser) => {
      res.status(200).json(newUser);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const updateData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  User.findByIdAndUpdate(userId, updateData, { new: true })
    .then((updateUser) => {
      if (!updateUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updateUser);
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
    });
});
// Delete a user by its id
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const updateData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  User.findByIdAndDelete(userId, { new: true })
    .then((updateUser) => {
      if (!updateUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted success" });
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
    });
});

app.listen(4000, () => {
  console.log("Server Started");
});
