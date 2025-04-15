const BarangayOfficial = require('../models/BarangayOfficial');

// Create a new Barangay Official
const createBarangayOfficial = async (req, res) => {
  try {
    const newOfficial = new BarangayOfficial(req.body);
    const savedOfficial = await newOfficial.save();
    res.status(201).json(savedOfficial);
  } catch (err) {
    res.status(500).json({ message: 'Error creating official', error: err.message });
  }
};

// Get all Barangay Officials
const getAllBarangayOfficials = async (req, res) => {
  try {
    const officials = await BarangayOfficial.find();
    res.json(officials);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching officials', error: err.message });
  }
};

// Get a specific Barangay Official by ID
const getBarangayOfficialById = async (req, res) => {
  try {
    const official = await BarangayOfficial.findById(req.params.id);
    if (!official) {
      return res.status(404).json({ message: 'Official not found' });
    }
    res.json(official);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching official', error: err.message });
  }
};

// Update a Barangay Official by ID
const updateBarangayOfficialById = async (req, res) => {
  try {
    const updatedOfficial = await BarangayOfficial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOfficial) {
      return res.status(404).json({ message: 'Official not found' });
    }
    res.json(updatedOfficial);
  } catch (err) {
    res.status(500).json({ message: 'Error updating official', error: err.message });
  }
};

// Delete a Barangay Official by ID
const deleteBarangayOfficialById = async (req, res) => {
  try {
    const deletedOfficial = await BarangayOfficial.findByIdAndDelete(req.params.id);
    if (!deletedOfficial) {
      return res.status(404).json({ message: 'Official not found' });
    }
    res.json({ message: 'Official deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting official', error: err.message });
  }
};

module.exports = {
  createBarangayOfficial,
  getAllBarangayOfficials,
  getBarangayOfficialById,
  updateBarangayOfficialById,
  deleteBarangayOfficialById
};
