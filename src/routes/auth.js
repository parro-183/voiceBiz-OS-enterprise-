const express = require('express');
const router = express.Router();
const { generateToken } = require('../middleware/auth');
const userService = require('../services/userService');
const agentService = require('../services/agentService');
const logger = require('../config/logger');

// User Registration
router.post('/register', (req, res) => {
  try {
    const { email, name, role } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const user = userService.createUser({ email, name, role });
    const token = generateToken(user.id, null);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    logger.error('Registration failed', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Agent Registration
router.post('/register-agent', (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const agent = agentService.createAgent({ name, email });
    const token = generateToken(null, agent.id);

    res.status(201).json({
      message: 'Agent registered successfully',
      agent: { id: agent.id, name: agent.name, email: agent.email, status: agent.status },
      token,
    });
  } catch (error) {
    logger.error('Agent registration failed', error);
    res.status(500).json({ error: 'Agent registration failed' });
  }
});

module.exports = router;
