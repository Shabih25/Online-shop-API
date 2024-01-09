const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const data = require('../data.json');

async function requireAuth(req, res, next) {
    const { username, password } = req.headers;

    try {
        const user = await authenticate(username, password);

        if (user) {
            req.user = user;

            // Attach the token to the response headers
            const token = generateToken(user);
            res.setHeader('Authorization', `Bearer ${token}`);

            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

function generateToken(user) {
    // Replace 'your-secret-key' with a strong, unique secret key for JWT
    const secretKey = 'your-secret-key';
    const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    return token;
}

async function authenticate(username, password) {
    const user = data.users.find(u => u.username === username);
  console.log(user)
    if (user && (await bcrypt.compare(password, user.hash))) {
        return user;
    }
    return null;
}

module.exports = {
    authenticate,
    requireAuth,
};
