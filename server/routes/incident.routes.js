const express = require('express');
const router = express.Router();
const { getIO } = require('../config/socket');

// GET /api/incidents
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: [
        {
          id: 1,
          title: "High Latency - Payment Gateway",
          severity: "CRITICAL",
          status: "OPEN",
          rawLogs: "HTTP 504 Gateway Timeout in microservice auth-db",
          createdAt: new Date()
        }
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch incidents' });
  }
});

// POST /api/incidents - Broadcast incident live via WebSocket
router.post('/', async (req, res) => {
  try {
    const { title, severity, rawLogs } = req.body;
    const newIncident = { id: Date.now(), title, severity, rawLogs, status: 'OPEN', createdAt: new Date() };

    // Emit live WebSocket event
    getIO().emit('INCIDENT_CREATED', newIncident);

    res.status(201).json({ success: true, data: newIncident });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to trigger incident' });
  }
});

module.exports = router;