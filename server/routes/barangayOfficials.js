const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth'); // Import the authorize middleware
const {
  createBarangayOfficial,
  getAllBarangayOfficials,
  getBarangayOfficialById,
  updateBarangayOfficialById,
  deleteBarangayOfficialById
} = require('../controllers/barangayOfficialController');

// Protect all routes in this file. Only allow 'admin' and 'staff' roles.
router.use(authorize(['admin', 'staff']));

// @route   POST /api/barangay-officials
// @desc    Create a new barangay official (Requires admin or staff role)
router.post('/', createBarangayOfficial);

// @route   GET /api/barangay-officials
// @desc    Get all barangay officials (Requires admin or staff role)
router.get('/', getAllBarangayOfficials);

// @route   GET /api/barangay-officials/:id
// @desc    Get a barangay official by ID (Requires admin or staff role)
router.get('/:id', getBarangayOfficialById);

// @route   PUT /api/barangay-officials/:id
// @desc    Update a barangay official by ID (Requires admin or staff role)
router.put('/:id', updateBarangayOfficialById);

// @route   DELETE /api/barangay-officials/:id
// @desc    Delete a barangay official by ID (Requires admin role only - example)
// Example: Restrict DELETE operation to only admins
router.delete('/:id', authorize('admin'), deleteBarangayOfficialById);

module.exports = router;
