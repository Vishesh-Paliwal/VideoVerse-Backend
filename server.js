// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

const authMiddleware = require('./api/middlewares/authMiddleware');

// Routes
const authRoutes = require('./api/routes/authRoutes');
const uploadRoutes = require('./api/routes/uploadRoutes');
const trimRoutes = require('./api/routes/trimRoutes');
const mergeRoutes = require('./api/routes/mergeRoutes');
const shareRoutes = require('./api/routes/shareRoutes');

// Apply authentication middleware to all routes except authRoutes
app.use('/auth', authRoutes);
// app.use('/upload', authMiddleware, uploadRoutes);
// app.use('/trim', authMiddleware, trimRoutes);
// app.use('/merge', authMiddleware, mergeRoutes);
// app.use('/share', authMiddleware, shareRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
