const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { auth } = require('../middleware/auth'); // Import the basic auth middleware

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user and return JWT token
router.post('/login', login);

// @route   POST /api/auth/logout
// @desc    Logout user (symbolic - requires valid token)
// Client-side should clear the token upon receiving success response
router.post('/logout', auth, logout);

module.exports = router;
