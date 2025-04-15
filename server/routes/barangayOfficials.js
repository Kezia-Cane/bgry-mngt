const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the auth middleware
const {
  createBarangayOfficial,
  getAllBarangayOfficials,
  getBarangayOfficialById,
  updateBarangayOfficialById,
  deleteBarangayOfficialById
} = require('../controllers/barangayOfficialController');

// Protect these routes with the auth middleware
router.use(auth);

// @route   POST /api/barangay-officials
// @desc    Create a new barangay official
router.post('/', createBarangayOfficial);

// @route   GET /api/barangay-officials
// @desc    Get all barangay officials
router.get('/', getAllBarangayOfficials);

// @route   GET /api/barangay-officials/:id
// @desc    Get a barangay official by ID
router.get('/:id', getBarangayOfficialById);

// @route   PUT /api/barangay-officials/:id
// @desc    Update a barangay official by ID
router.put('/:id', updateBarangayOfficialById);

// @route   DELETE /api/barangay-officials/:id
// @desc    Delete a barangay official by ID
router.delete('/:id', deleteBarangayOfficialById);

module.exports = router;
