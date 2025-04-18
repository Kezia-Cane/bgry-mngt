const Certificate = require('../models/Certificate');
const Resident = require('../models/Resident'); // Needed to check resident existence

// Issue a new Certificate
const issueCertificate = async (req, res) => {
  try {
    const issuedById = req.user.userId; // Logged-in user issuing the cert
    const { residentId, certificateType, purpose, remarks, controlNumber, validityDate } = req.body;

    // Check if resident exists
    const resident = await Resident.findById(residentId);
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found.' });
    }

    const newCertificateData = {
      certificateType,
      resident: residentId,
      issuedBy: issuedById,
      purpose,
      remarks,
      controlNumber, // Consider auto-generating this
      validityDate,
      issueDate: new Date() // Ensure issue date is set server-side
    };

    const newCertificate = new Certificate(newCertificateData);
    const savedCertificate = await newCertificate.save();

    // Populate resident and user details before sending response
    const populatedCertificate = await Certificate.findById(savedCertificate._id)
      .populate('resident', 'fullName address') // Select specific resident fields
      .populate('issuedBy', 'username'); // Select specific user fields

    res.status(201).json(populatedCertificate);

  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    // Handle potential duplicate control number error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.controlNumber) {
       return res.status(409).json({ message: 'Control number already exists.' });
    }
    res.status(500).json({ message: 'Error issuing certificate', error: err.message });
  }
};

// Get all Certificates (with filter, search, pagination)
const getAllCertificates = async (req, res) => {
  try {
    const { search, certificateType, status, page = 1, limit = 10 } = req.query;
    let query = {};

    // We need to join Resident to search by resident name
    // This is more complex and might require aggregation or adjustments
    // For simplicity, we'll search by control number or purpose for now
    if (search) {
       const searchRegex = { $regex: search, $options: 'i' };
       query.$or = [
         { controlNumber: searchRegex },
         { purpose: searchRegex }
         // Searching resident name requires populating first or using aggregation pipeline
       ];
    }

    if (certificateType) {
      query.certificateType = certificateType;
    }
     if (status) {
      query.status = status;
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      sort: { issueDate: -1 }, // Sort by most recent issue date
      populate: [
        { path: 'resident', select: 'fullName' },
        { path: 'issuedBy', select: 'username' }
      ]
    };

    const certificates = await Certificate.find(query)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .populate(options.populate);

    const totalCertificates = await Certificate.countDocuments(query);

    res.json({
      certificates,
      currentPage: options.page,
      totalPages: Math.ceil(totalCertificates / options.limit),
      totalCertificates
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching certificates', error: err.message });
  }
};

// Get a specific Certificate by ID
const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('resident', 'fullName address birthdate gender contactNumber') // Populate more resident details
      .populate('issuedBy', 'username role'); // Populate more user details

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching certificate', error: err.message });
  }
};

// Revoke a Certificate by ID
const revokeCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            { status: 'Revoked' },
            { new: true }
        )
        .populate('resident', 'fullName')
        .populate('issuedBy', 'username');

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.json({ message: 'Certificate revoked successfully', certificate });
    } catch (err) {
        res.status(500).json({ message: 'Error revoking certificate', error: err.message });
    }
};

// Delete a Certificate by ID
const deleteCertificateById = async (req, res) => {
  try {
    const deletedCertificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!deletedCertificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json({ message: 'Certificate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting certificate', error: err.message });
  }
};

module.exports = {
  issueCertificate,
  getAllCertificates,
  getCertificateById,
  revokeCertificate,
  deleteCertificateById
};
