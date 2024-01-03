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
        const users = JSON.parse(data).users.map(user => ({ id: user.id, username: user.username }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// router.post('/users', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const saltRounds = 10;
//         const hash = await bcrypt.hash(password, saltRounds);

//         const data = await fs.readFile(dataPath, 'utf8');
//         const fileData = JSON.parse(data);

//         const newUser = {
//             id: fileData.users.length + 1,
//             username,
//             password: hash,
//         };

//         fileData.users.push(newUser);
//         await fs.writeFile(dataPath, JSON.stringify(fileData));

//         res.json({ id: newUser.id, username: newUser.username });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

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

module.exports = router;
