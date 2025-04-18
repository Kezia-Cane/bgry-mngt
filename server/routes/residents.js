const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');
const {
  createResident,
  getAllResidents,
  getResidentById,
  updateResidentById,
  deleteResidentById
} = require('../controllers/residentController');

// Protect all resident routes - Accessible by admin and staff
router.use(authorize(['admin', 'staff']));

// @route   POST /api/residents
// @desc    Create a new resident
router.post('/', createResident);

// @route   GET /api/residents
// @desc    Get all residents (with optional search and pagination)
router.get('/', getAllResidents);

// @route   GET /api/residents/:id
// @desc    Get a resident by ID
router.get('/:id', getResidentById);

// @route   PUT /api/residents/:id
// @desc    Update a resident by ID
router.put('/:id', updateResidentById);

// @route   DELETE /api/residents/:id
// @desc    Delete a resident by ID
// Optional: Could restrict delete to admin only like: authorize('admin'), deleteResidentById
router.delete('/:id', deleteResidentById);

module.exports = router;
