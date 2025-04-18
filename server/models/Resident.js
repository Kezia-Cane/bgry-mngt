const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  address: {
    street: { type: String, trim: true },
    barangay: { type: String, required: true, trim: true, default: 'Your Barangay Name' }, // Set a default or make it required
    city: { type: String, required: true, trim: true, default: 'Your City Name' },
    province: { type: String, required: true, trim: true, default: 'Your Province Name' }
  },
  birthdate: {
    type: Date,
    required: [true, 'Birthdate is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  contactNumber: {
    type: String,
    trim: true,
    // Optional: Add validation for phone number format
    // match: [/^[0-9]{10,11}$/, 'Please fill a valid contact number']
  },
  // Optional fields
  civilStatus: {
    type: String,
    enum: ['Single', 'Married', 'Widowed', 'Separated', 'Divorced'],
    trim: true
  },
  occupation: {
    type: String,
    trim: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Optional: Calculate age virtually
residentSchema.virtual('age').get(function() {
  if (!this.birthdate) return undefined;
  const today = new Date();
  const birthDate = new Date(this.birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Ensure virtual fields are included when converting to JSON
residentSchema.set('toJSON', { virtuals: true });
residentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Resident', residentSchema);
