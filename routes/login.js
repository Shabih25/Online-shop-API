const express = require("express");
const fs = require("fs/promises");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const { authenticate } = require("../middleware/authentication.js");
const router = express.Router();
const path = require("path");

const dataPath = path.resolve(__dirname, "../data.json");
router.get("/admin", (req, res) => {
  res.send("Admin Panel");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await fs.readFile(dataPath, "utf8");
    const fileData = JSON.parse(data);

    // Find the admin user by username
    const adminUser = fileData.users.find(
      (user) => user.username === username && user.isAdmin
    );

    if (!adminUser) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Compare the provided password with the hashed password in the data
    const passwordMatch = await bcrypt.compare(password, adminUser.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // If the credentials are valid, send a success response
    res.json({ message: "Admin login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, saltRounds);
    const data = await fs.readFile("./data.json", "utf8");
    const fileData = JSON.parse(data);
    fileData.users.push({ username, hash });
    const newFile = JSON.stringify(fileData);
    await fs.writeFile("./data.json", newFile);
    return res.json({ message: "New user added successfully" });
  } catch (e) {
    return res.json(e.message);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await fs.readFile("./data.json", "utf8");
    const fileData = JSON.parse(data);
    const user = fileData.users.find((user) => user.username === username);

    if (user && bcrypt.compareSync(password, user.hash)) {
      return res.json({ message: "User logged in successfully" });
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
