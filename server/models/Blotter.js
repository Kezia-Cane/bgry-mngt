const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blotterSchema = new Schema({
  caseNumber: { // Optional: You might generate this programmatically or manually
    type: String,
    unique: true,
    sparse: true, // Allows null values but enforces uniqueness for non-nulls
    trim: true
  },
  incidentType: {
    type: String,
    required: [true, 'Incident type is required'],
    trim: true
  },
  incidentDate: {
    type: Date,
    required: [true, 'Incident date is required']
  },
  incidentLocation: {
    type: String,
    required: [true, 'Incident location is required'],
    trim: true
  },
  complainant: { // Person(s) reporting the incident
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    contactNumber: { type: String, trim: true }
    // You could also reference the Resident model here if complainants are always residents
    // residentId: { type: Schema.Types.ObjectId, ref: 'Resident' }
  },
  respondent: { // Person(s) subject of the complaint
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true }
    // residentId: { type: Schema.Types.ObjectId, ref: 'Resident' }
  },
  narrative: {
    type: String,
    required: [true, 'Narrative of the incident is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Open', 'Under Investigation', 'Amicably Settled', 'Referred', 'Closed'],
    default: 'Open'
  },
  actionsTaken: [
    {
      date: { type: Date, default: Date.now },
      action: { type: String, trim: true },
      remarks: { type: String, trim: true },
      recordedBy: { type: Schema.Types.ObjectId, ref: 'User' } // Link to the user who recorded the action
    }
  ],
  recordedBy: { // User who initially recorded the blotter
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Blotter', blotterSchema);
