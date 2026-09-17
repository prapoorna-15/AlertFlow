const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const incidentRoutes = require('./routes/incident.routes');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'HEALTHY', engine: 'AlertFlow' });
});

module.exports = app;