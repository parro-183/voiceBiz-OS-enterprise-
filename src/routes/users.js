const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const userService = require('../services/userService');
const logger = require('../config/logger');

router.use(authMiddleware);

// Get all users
router.get('/', (req, res) => {
  try {
    const users = userService.getAllUsers();
    res.json({ users, count: users.length });
  } catch (error) {
    logger.error('Failed to fetch users', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:userId', (req, res) => {
  try {
    const user = userService.getUser(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    logger.error('Failed to fetch user', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user
router.put('/:userId', (req, res) => {
  try {
    const user = userService.updateUser(req.params.userId, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (error) {
    logger.error('Failed to update user', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
