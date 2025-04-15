const mongoose = require('mongoose');

const barangayOfficialSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 18 // Assuming officials must be adults
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  term: { // Example: "2023-2025"
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  },
  // Optional: Add profile picture URL later if needed
  // profilePicture: {
  //   type: String,
  //   default: ''
  // }
}, { timestamps: true });

module.exports = mongoose.model('BarangayOfficial', barangayOfficialSchema);
