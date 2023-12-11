const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./models/user_schema');
const jwt = require('jsonwebtoken'); // Assuming you are using JWT for authentication

const router = express.Router();

// Login route
router.post('/', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be either email or username

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Login and password are required' });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a token (replace 'your_secret_key' with your actual secret key)
    const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1m' });

// Include the username in the response
res.json({
  message: 'Login successful',
  token,                 // Include the generated token in the response
  username: user.username // Include the username in the response
});
  } catch (error) {
    handleError(res, error);
  }
});

// Centralized error handling function
function handleError(res, error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = router;