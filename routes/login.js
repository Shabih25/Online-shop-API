const express = require("express");
const fs = require("fs/promises");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const { authenticate } = require("../middleware/authentication.js");
const router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const { User } = require("../models/index.js");

const dataPath = path.resolve(__dirname, "../data.json");
router.get("/admin", (req, res) => {
  res.send("Admin Panel");
});

//create a new user
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);

    await User.create({ username, password: hash });

    return res.json({ message: "New user added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//Login to get JWT.
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(username, password);

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const secretKey = "your-secret-key";
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      secretKey
    );

    if (user && bcrypt.compareSync(password, user.password)) {
      return res.json({ message: "User logged in successfully", jwt: token });
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
