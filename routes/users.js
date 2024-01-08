// users.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs/promises');
const path = require('path');


const dataPath = path.resolve(__dirname, '../data.json');
router.get('/users', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        const jsonData = JSON.parse(data);

        // Pagination
        const { pageNo = 1, pageSize = 3, sort } = req.query;
        const startIndex = (pageNo - 1) * pageSize;
        const endIndex = pageNo * pageSize;
        let paginatedUsers = jsonData.users.slice(startIndex, endIndex);

        // Sorting
        if (sort === 'asc') {
            paginatedUsers = paginatedUsers.sort((a, b) => a.username.localeCompare(b.username));
        } else if (sort === 'desc') {
            paginatedUsers = paginatedUsers.sort((a, b) => b.username.localeCompare(a.username));
        }

        // Extracting relevant user information
        const users = paginatedUsers.map(user => ({ id: user.id, username: user.username }));

        res.json({
            data: users,
            totalPages: Math.ceil(jsonData.users.length / pageSize),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

   

 router.post('/users', async (req, res) => {
     try {
         const { username, password } = req.body;
         const saltRounds = 10;
         const hash = await bcrypt.hash(password, saltRounds);

         const data = await fs.readFile(dataPath, 'utf8');
         const fileData = JSON.parse(data);

         const newUser = {
             id: fileData.users.length + 1,
             username,
             password: hash,
         };

         fileData.users.push(newUser);
         await fs.writeFile(dataPath, JSON.stringify(fileData));

         res.json({ id: newUser.id, username: newUser.username });
     } catch (error) {
        res.status(500).json({ error: error.message });
     }
 });

router.put('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { username, password } = req.body;

        const data = await fs.readFile(dataPath, 'utf8');
        const fileData = JSON.parse(data);

        const index = fileData.users.findIndex(user => user.id === userId);

        if (index === -1) {
            res.status(404).json({ error: 'User not found' });
        } else {
            const user = fileData.users[index];
            user.username = username || user.username;

            if (password) {
                const saltRounds = 10;
                user.password = await bcrypt.hash(password, saltRounds);
            }

            await fs.writeFile(dataPath, JSON.stringify(fileData));
            res.json({ id: user.id, username: user.username });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const data = await fs.readFile(dataPath, 'utf8');
        const fileData = JSON.parse(data);

        const index = fileData.users.findIndex(user => user.id === userId);

        if (index === -1) {
            res.status(404).json({ error: 'User not found' });
        } else {
            const deletedUser = fileData.users.splice(index, 1);
            await fs.writeFile(dataPath, JSON.stringify(fileData));
            res.json({ id: deletedUser[0].id, username: deletedUser[0].username });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH operation to partially update a user by ID
router.patch('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const updatedFields = req.body;

        const data = await fs.readFile(dataPath, 'utf8');
        const fileData = JSON.parse(data);

        const index = fileData.users.findIndex(user => user.id === userId);

        if (index === -1) {
            res.status(404).json({ error: 'User not found' });
        } else {
            // Update only the specified fields
            const user = fileData.users[index];
            user.username = updatedFields.username || user.username;

            if (updatedFields.password) {
                const saltRounds = 10;
                user.password = await bcrypt.hash(updatedFields.password, saltRounds);
            }

            await fs.writeFile(dataPath, JSON.stringify(fileData));
            res.json({ id: user.id, username: user.username });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
