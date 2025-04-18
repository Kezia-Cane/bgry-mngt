const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    // Exclude passwords from the result
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Get a single user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

// Create a new user (Admin only - similar to register but controlled)
const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // Validate role if provided
    if (role && !['admin', 'staff'].includes(role)) {
         return res.status(400).json({ message: 'Invalid role specified.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role }); // Role defaults to 'staff' if not provided
    await newUser.save();

    // Return user data without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: 'User created successfully.', user: userResponse });
  } catch (err) {
     if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Update a user by ID (Admin only - e.g., change role)
const updateUserById = async (req, res) => {
  try {
    const { username, role, password } = req.body;
    const userId = req.params.id;

    // Basic validation
    if (!username && !role && !password) {
        return res.status(400).json({ message: 'No update fields provided.' });
    }
    if (role && !['admin', 'staff'].includes(role)) {
         return res.status(400).json({ message: 'Invalid role specified.' });
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (role) updateData.role = role;

    // Handle password update separately if provided
    if (password) {
        if (password.length < 6) { // Example minimum length check
             return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }
        updateData.password = await bcrypt.hash(password, 10);
    }

    // Prevent username conflict if username is being changed
    if (username) {
      const existingUser = await User.findOne({ username: username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(409).json({ message: 'Username already taken.' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
     if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// Delete a user by ID (Admin only)
const deleteUserById = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;
    const requestingUserId = req.user.userId; // ID of the admin making the request

    // Prevent admin from deleting themselves
    if (userIdToDelete === requestingUserId) {
        return res.status(403).json({ message: 'Admin cannot delete their own account.' });
    }

    const deletedUser = await User.findByIdAndDelete(userIdToDelete);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById
};
