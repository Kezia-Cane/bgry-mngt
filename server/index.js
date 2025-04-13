const express = require('express');
const app = express();
const port = 3001; // Choose a different port than the React app

app.get('/api', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
