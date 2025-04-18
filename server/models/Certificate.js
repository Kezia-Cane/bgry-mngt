const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const certificateSchema = new Schema({
  certificateType: {
    type: String,
    required: [true, 'Certificate type is required'],
    enum: ['Barangay Clearance', 'Certificate of Residency', 'Certificate of Indigency', 'Business Permit', 'Other'], // Add more types as needed
    trim: true
  },
  resident: {
    type: Schema.Types.ObjectId,
    ref: 'Resident',
    required: [true, 'Resident is required']
  },
  issuedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Issuing user is required']
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  },
  controlNumber: { // Optional: Auto-generate or assign manually
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  validityDate: { // Optional: For certificates with an expiration
    type: Date
  },
  status: {
    type: String,
    enum: ['Issued', 'Revoked', 'Expired'],
    default: 'Issued'
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
