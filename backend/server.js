const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Test Route
app.get('/', (req, res) => {
  res.send('Interview Pro AI Backend Running');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/interview', require('./routes/interviewRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
