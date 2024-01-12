// admin.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const path = require("path");

const dataPath = path.resolve(__dirname, "../data.json");

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const data = await fs.readFile(dataPath, "utf8");
    const fileData = JSON.parse(data);

    const newAdmin = {
      id: fileData.users.length + 1,
      username,
      password: hash,
      isAdmin: true, // Add a property to identify admin users
    };

    fileData.users.push(newAdmin);
    await fs.writeFile(dataPath, JSON.stringify(fileData));

    res.json({
      id: newAdmin.id,
      username: newAdmin.username,
      isAdmin: newAdmin.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Update admin user by ID
router.put("/admin/:id", async (req, res) => {
  try {
    const adminId = parseInt(req.params.id);
    const { username, password } = req.body;

    const data = await fs.readFile(dataPath, "utf8");
    const fileData = JSON.parse(data);

    const index = fileData.users.findIndex(
      (user) => user.id === adminId && user.isAdmin
    );

    if (index === -1) {
      res.status(404).json({ error: "Admin user not found" });
    } else {
      const adminUser = fileData.users[index];
      adminUser.username = username || adminUser.username;

      if (password) {
        const saltRounds = 10;
        adminUser.password = await bcrypt.hash(password, saltRounds);
      }

      await fs.writeFile(dataPath, JSON.stringify(fileData));
      res.json({
        id: adminUser.id,
        username: adminUser.username,
        isAdmin: adminUser.isAdmin,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Partially update admin user by ID
router.patch("/admin/:id", async (req, res) => {
  try {
    const adminId = parseInt(req.params.id);
    const updatedFields = req.body;

    const data = await fs.readFile(dataPath, "utf8");
    const fileData = JSON.parse(data);

    const index = fileData.users.findIndex(
      (user) => user.id === adminId && user.isAdmin
    );

    if (index === -1) {
      res.status(404).json({ error: "Admin user not found" });
    } else {
      // Update only the specified fields
      const adminUser = fileData.users[index];
      adminUser.username = updatedFields.username || adminUser.username;

      if (updatedFields.password) {
        const saltRounds = 10;
        adminUser.password = await bcrypt.hash(
          updatedFields.password,
          saltRounds
        );
      }

      await fs.writeFile(dataPath, JSON.stringify(fileData));
      res.json({
        id: adminUser.id,
        username: adminUser.username,
        isAdmin: adminUser.isAdmin,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete admin user by ID
router.delete("/admin/:id", async (req, res) => {
  try {
    const adminId = parseInt(req.params.id);

    const data = await fs.readFile(dataPath, "utf8");
    const fileData = JSON.parse(data);

    const index = fileData.users.findIndex(
      (user) => user.id === adminId && user.isAdmin
    );

    if (index === -1) {
      res.status(404).json({ error: "Admin user not found" });
    } else {
      const deletedAdmin = fileData.users.splice(index, 1);
      await fs.writeFile(dataPath, JSON.stringify(fileData));
      res.json({
        id: deletedAdmin[0].id,
        username: deletedAdmin[0].username,
        isAdmin: deletedAdmin[0].isAdmin,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
