const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import Express configuration app or routes
let app;
try {
  app = require('./app');
} catch (err) {
  // Fallback inline Express setup if app.js is not yet configured
  app = express();
  app.use(cors({ origin: '*' }));
  app.use(express.json());

  const authRoutes = require('./routes/auth.routes');
  const incidentRoutes = require('./routes/incident.routes');

  app.use('/api/auth', authRoutes);
  app.use('/api/incidents', incidentRoutes);

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'HEALTHY', engine: 'AlertFlow' });
  });
}

const PORT = process.env.PORT || 5000;

// Keep process alive by listening on configured port
app.listen(PORT, () => {
  console.log(`⚡ AlertFlow Engine active on port ${PORT}`);
});