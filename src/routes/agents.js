const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const agentService = require('../services/agentService');
const logger = require('../config/logger');

router.use(authMiddleware);

// Get all agents
router.get('/', (req, res) => {
  try {
    const agents = database.agents;
    res.json({ agents, count: agents.length });
  } catch (error) {
    logger.error('Failed to fetch agents', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get available agents
router.get('/available', (req, res) => {
  try {
    const agents = agentService.getAvailableAgents();
    res.json({ agents, count: agents.length });
  } catch (error) {
    logger.error('Failed to fetch available agents', error);
    res.status(500).json({ error: 'Failed to fetch available agents' });
  }
});

// Get agent by ID
router.get('/:agentId', (req, res) => {
  try {
    const agent = agentService.getAgent(req.params.agentId);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    res.json(agent);
  } catch (error) {
    logger.error('Failed to fetch agent', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Update agent status
router.put('/:agentId/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const agent = agentService.updateAgentStatus(req.params.agentId, status);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    res.json({ message: 'Agent status updated', agent });
  } catch (error) {
    logger.error('Failed to update agent status', error);
    res.status(500).json({ error: 'Failed to update agent status' });
  }
});

module.exports = router;
