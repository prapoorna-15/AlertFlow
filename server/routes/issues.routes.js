const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

// GET /api/incidents - Fetch active IT incidents
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Return structured incident objects for the SRE dashboard
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
    res.status(500).json({ success: false, message: "Failed to fetch incidents" });
  }
});

// POST /api/incidents - Trigger/Ingest new IT error log
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, severity, rawLogs } = req.body;
    res.status(201).json({
      success: true,
      data: { id: Date.now(), title, severity, rawLogs, status: "OPEN" }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to trigger incident" });
  }
});

module.exports = router;