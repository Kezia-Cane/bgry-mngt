const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Barangay Management System backend is running.');
});

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Barangay Official routes
const barangayOfficialRoutes = require('./routes/barangayOfficials');
app.use('/api/barangay-officials', barangayOfficialRoutes);

// Resident routes
const residentRoutes = require('./routes/residents');
app.use('/api/residents', residentRoutes);

// Blotter routes
const blotterRoutes = require('./routes/blotters');
app.use('/api/blotters', blotterRoutes);

// Certificate routes
const certificateRoutes = require('./routes/certificates');
app.use('/api/certificates', certificateRoutes);

// Admin routes (for user management)
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
