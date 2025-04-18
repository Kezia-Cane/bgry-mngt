const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById
} = require('../controllers/adminController');

// Protect all routes in this file - ONLY Admin access
router.use(authorize('admin'));

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', getAllUsers);

// @route   POST /api/admin/users
// @desc    Create a new user
router.post('/users', createUser);

// @route   GET /api/admin/users/:id
// @desc    Get a single user by ID
router.get('/users/:id', getUserById);

// @route   PUT /api/admin/users/:id
// @desc    Update a user by ID (role, username, password)
router.put('/users/:id', updateUserById);

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user by ID
router.delete('/users/:id', deleteUserById);

module.exports = router;
