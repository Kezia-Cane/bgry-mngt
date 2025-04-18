const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');
const {
  createBlotter,
  getAllBlotters,
  getBlotterById,
  updateBlotterById,
  addActionToBlotter,
  deleteBlotterById
} = require('../controllers/blotterController');

// Protect all blotter routes - Accessible by admin and staff
router.use(authorize(['admin', 'staff']));

// @route   POST /api/blotters
// @desc    Create a new blotter record
router.post('/', createBlotter);

// @route   GET /api/blotters
// @desc    Get all blotter records (with search, filter, pagination)
router.get('/', getAllBlotters);

// @route   GET /api/blotters/:id
// @desc    Get a blotter record by ID
router.get('/:id', getBlotterById);

// @route   PUT /api/blotters/:id
// @desc    Update a blotter record by ID
router.put('/:id', updateBlotterById);

// @route   POST /api/blotters/:id/actions
// @desc    Add an action taken to a blotter record
router.post('/:id/actions', addActionToBlotter);

// @route   DELETE /api/blotters/:id
// @desc    Delete a blotter record by ID
// Optional: Restrict delete to admin only
router.delete('/:id', authorize('admin'), deleteBlotterById);

module.exports = router;
