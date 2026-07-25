const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const logger = require('./config/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const callRoutes = require('./routes/calls');
const agentRoutes = require('./routes/agents');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'voiceBiz-OS-enterprise',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to voiceBiz-OS-enterprise',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      calls: '/api/calls',
      agents: '/api/agents',
      analytics: '/api/analytics',
    },
    docs: 'https://github.com/parro-183/voiceBiz-OS-enterprise-#endpoints',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, HOST, () => {
  logger.info(`
    ╔═══════════════════════════════════════╗
    ║   voiceBiz-OS-enterprise v1.0.0       ║
    ╠═══════════════════════════════════════╣
    ║   🚀 Server running                   ║
    ║   📍 http://${HOST}:${PORT}
    ║   🌐 Environment: ${process.env.NODE_ENV || 'development'}
    ║   📚 API Docs: http://${HOST}:${PORT}
    ╚═══════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = app;
