const logger = require('../config/logger');

// Simple JWT-like token authentication
const generateToken = (userId, agentId) => {
  const token = Buffer.from(JSON.stringify({ userId, agentId, timestamp: Date.now() })).toString('base64');
  return token;
};

const verifyToken = (token) => {
  try {
    if (!token) return null;
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return decoded;
  } catch (error) {
    logger.error('Token verification failed', error);
    return null;
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No authorization token' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = decoded;
  next();
};

module.exports = { generateToken, verifyToken, authMiddleware };
