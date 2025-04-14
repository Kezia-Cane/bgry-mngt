require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Barangay Management System backend is running.');
});

// TODO: Add database connection here

// TODO: Add authentication and other routes here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
