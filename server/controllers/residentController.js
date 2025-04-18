const Resident = require('../models/Resident');

// Create a new Resident
const createResident = async (req, res) => {
  try {
    const newResident = new Resident(req.body);
    const savedResident = await newResident.save();
    res.status(201).json(savedResident);
  } catch (err) {
    // Handle validation errors specifically
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ message: 'Error creating resident', error: err.message });
  }
};

// Get all Residents (with optional search and pagination)
const getAllResidents = async (req, res) => {
  try {
    // Basic search (can be expanded)
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } }, // Case-insensitive search by name
          { 'address.street': { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Basic pagination (can be improved)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const residents = await Resident.find(query).skip(skip).limit(limit);
    const totalResidents = await Resident.countDocuments(query);

    res.json({
      residents,
      currentPage: page,
      totalPages: Math.ceil(totalResidents / limit),
      totalResidents
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching residents', error: err.message });
  }
};

// Get a specific Resident by ID
const getResidentById = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    res.json(resident);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching resident', error: err.message });
  }
};

// Update a Resident by ID
const updateResidentById = async (req, res) => {
  try {
    const updatedResident = await Resident.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedResident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    res.json(updatedResident);
  } catch (err) {
     if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ message: 'Error updating resident', error: err.message });
  }
};

// Delete a Resident by ID
const deleteResidentById = async (req, res) => {
  try {
    const deletedResident = await Resident.findByIdAndDelete(req.params.id);
    if (!deletedResident) {
      return res.status(404).json({ message: 'Resident not found' });
    }
    res.json({ message: 'Resident deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting resident', error: err.message });
  }
};

module.exports = {
  createResident,
  getAllResidents,
  getResidentById,
  updateResidentById,
  deleteResidentById
};
