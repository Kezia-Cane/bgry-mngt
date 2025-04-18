const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');
const {
  issueCertificate,
  getAllCertificates,
  getCertificateById,
  revokeCertificate,
  deleteCertificateById
} = require('../controllers/certificateController');

// Protect all certificate routes - Accessible by admin and staff
router.use(authorize(['admin', 'staff']));

// @route   POST /api/certificates
// @desc    Issue a new certificate
router.post('/', issueCertificate);

// @route   GET /api/certificates
// @desc    Get all certificates (with filters, pagination)
router.get('/', getAllCertificates);

// @route   GET /api/certificates/:id
// @desc    Get a certificate by ID
router.get('/:id', getCertificateById);

// @route   PUT /api/certificates/:id/revoke
// @desc    Revoke a certificate by ID
router.put('/:id/revoke', revokeCertificate);

// @route   DELETE /api/certificates/:id
// @desc    Delete a certificate by ID
// Optional: Restrict delete to admin only
router.delete('/:id', authorize('admin'), deleteCertificateById);

module.exports = router;
