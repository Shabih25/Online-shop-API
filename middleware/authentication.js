const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Assuming you've exported your User model

async function requireAuth(req, res, next) {
  const token = req.headers.authorization;

  try {
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Token missing" });
    }

    const decodedToken = jwt.verify(
      token.replace("Bearer ", ""),
      "your-secret-key"
    );

    const user = await authenticate(
      decodedToken.username,
      decodedToken.password
    );
    if (user) {
      req.user = user;

      // Attach the token to the response headers
      const token = generateToken(user);
      res.setHeader("Authorization", `Bearer ${token}`);

      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function generateToken(user) {
  // Replace 'your-secret-key' with a strong, unique secret key for JWT
  const secretKey = "your-secret-key";
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    secretKey
  );
  return token;
}

async function authenticate(username, password) {
  const user = await User.findOne({ where: { username } });

  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     return user;
  //   }
  if (user) return user;
  return null;
}

module.exports = {
  authenticate,
  requireAuth,
};
