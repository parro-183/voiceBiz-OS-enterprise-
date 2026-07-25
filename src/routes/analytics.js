const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const analyticsService = require('../services/analyticsService');
const logger = require('../config/logger');

router.use(authMiddleware);

// Get call metrics
router.get('/calls/metrics', (req, res) => {
  try {
    const metrics = analyticsService.getCallMetrics();
    res.json(metrics);
  } catch (error) {
    logger.error('Failed to fetch call metrics', error);
    res.status(500).json({ error: 'Failed to fetch call metrics' });
  }
});

// Get agent metrics
router.get('/agents/:agentId', (req, res) => {
  try {
    const metrics = analyticsService.getAgentMetrics(req.params.agentId);
    res.json(metrics);
  } catch (error) {
    logger.error('Failed to fetch agent metrics', error);
    res.status(500).json({ error: 'Failed to fetch agent metrics' });
  }
});

// Get sentiment metrics
router.get('/sentiment/metrics', (req, res) => {
  try {
    const metrics = analyticsService.getSentimentMetrics();
    res.json(metrics);
  } catch (error) {
    logger.error('Failed to fetch sentiment metrics', error);
    res.status(500).json({ error: 'Failed to fetch sentiment metrics' });
  }
});

module.exports = router;
