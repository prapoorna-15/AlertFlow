const express = require('express');
const router = express.Router();

// GET /api/incidents - Fetch all active server incidents
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

// POST /api/incidents - Trigger new incident
router.post('/', async (req, res) => {
  try {
    const { title, severity, rawLogs } = req.body;
    res.status(201).json({
      success: true,
      data: { id: Date.now(), title, severity, rawLogs, status: 'OPEN' }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to trigger incident' });
  }
});

module.exports = router;