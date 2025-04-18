const Blotter = require('../models/Blotter');

// Create a new Blotter record
const createBlotter = async (req, res) => {
  try {
    // Add the logged-in user's ID as the initial recorder
    const recordedById = req.user.userId;
    const newBlotterData = { ...req.body, recordedBy: recordedById };

    const newBlotter = new Blotter(newBlotterData);
    const savedBlotter = await newBlotter.save();
    res.status(201).json(savedBlotter);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ message: 'Error creating blotter record', error: err.message });
  }
};

// Get all Blotter records (with search, filter, and pagination)
const getAllBlotters = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { caseNumber: searchRegex },
        { incidentType: searchRegex },
        { 'complainant.name': searchRegex },
        { 'respondent.name': searchRegex },
        { narrative: searchRegex }
      ];
    }

    if (status) {
      query.status = status;
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      skip: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      sort: { incidentDate: -1 }, // Sort by most recent incident date
      populate: { path: 'recordedBy', select: 'username' } // Populate user who recorded
    };

    const blotters = await Blotter.find(query)
                                 .sort(options.sort)
                                 .skip(options.skip)
                                 .limit(options.limit)
                                 .populate(options.populate);

    const totalBlotters = await Blotter.countDocuments(query);

    res.json({
      blotters,
      currentPage: options.page,
      totalPages: Math.ceil(totalBlotters / options.limit),
      totalBlotters
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching blotter records', error: err.message });
  }
};

// Get a specific Blotter record by ID
const getBlotterById = async (req, res) => {
  try {
    const blotter = await Blotter.findById(req.params.id)
                                  .populate('recordedBy', 'username')
                                  .populate('actionsTaken.recordedBy', 'username'); // Populate users for actions
    if (!blotter) {
      return res.status(404).json({ message: 'Blotter record not found' });
    }
    res.json(blotter);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blotter record', error: err.message });
  }
};

// Update a Blotter record by ID (e.g., update status, narrative)
const updateBlotterById = async (req, res) => {
  try {
    // Exclude changing recordedBy field on update
    const { recordedBy, ...updateData } = req.body;

    const updatedBlotter = await Blotter.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
                                       .populate('recordedBy', 'username')
                                       .populate('actionsTaken.recordedBy', 'username');
    if (!updatedBlotter) {
      return res.status(404).json({ message: 'Blotter record not found' });
    }
    res.json(updatedBlotter);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ message: 'Error updating blotter record', error: err.message });
  }
};

// Add an action to a Blotter record
const addActionToBlotter = async (req, res) => {
  try {
    const blotterId = req.params.id;
    const recordedById = req.user.userId; // User performing the action
    const { action, remarks } = req.body;

    if (!action) {
        return res.status(400).json({ message: 'Action description is required.' });
    }

    const newAction = {
      action,
      remarks,
      recordedBy: recordedById,
      date: new Date() // Ensure date is set server-side
    };

    const updatedBlotter = await Blotter.findByIdAndUpdate(
      blotterId,
      { $push: { actionsTaken: newAction } }, // Add the new action to the array
      { new: true, runValidators: true }
    ).populate('recordedBy', 'username')
     .populate('actionsTaken.recordedBy', 'username');

    if (!updatedBlotter) {
      return res.status(404).json({ message: 'Blotter record not found' });
    }
    res.json(updatedBlotter);

  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: err.errors });
    }
    res.status(500).json({ message: 'Error adding action to blotter record', error: err.message });
  }
};

// Delete a Blotter record by ID (Use with caution! Consider soft delete instead)
const deleteBlotterById = async (req, res) => {
  try {
    const deletedBlotter = await Blotter.findByIdAndDelete(req.params.id);
    if (!deletedBlotter) {
      return res.status(404).json({ message: 'Blotter record not found' });
    }
    res.json({ message: 'Blotter record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blotter record', error: err.message });
  }
};

module.exports = {
  createBlotter,
  getAllBlotters,
  getBlotterById,
  updateBlotterById,
  addActionToBlotter,
  deleteBlotterById
};
