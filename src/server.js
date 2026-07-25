const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
require('dotenv').config();

const logger = require('./config/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const WebSocketService = require('./services/websocketService');
const { initDatabase } = require('./config/postgres');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const callRoutes = require('./routes/calls');
const agentRoutes = require('./routes/agents');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Initialize WebSocket
let wsService;

// Middleware
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGIN || '*').split(','), credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

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
    environment: process.env.NODE_ENV || 'development',
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
    features: [
      'User Management',
      'Agent Management',
      'Call Management',
      'Recording System',
      'Transcription',
      'Sentiment Analysis',
      'Analytics Dashboard',
      'WebSocket Real-time',
      'Email Notifications',
      'Rate Limiting',
      'Encryption',
    ],
    docs: 'https://github.com/parro-183/voiceBiz-OS-enterprise-#endpoints',
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
server.listen(PORT, HOST, async () => {
  // Initialize WebSocket
  wsService = new WebSocketService(server);

  // Initialize database if PostgreSQL is configured
  if (process.env.DATABASE_URL) {
    await initDatabase();
  }

  logger.info(`
    ╔════════════════════════════════════════════╗
    ║   voiceBiz-OS-enterprise v1.0.0 COMPLETE ║
    ╠════════════════════════════════════════════╣
    ║   ✅ All 7 Features Enabled                 ║
    ║   🚀 Server running                        ║
    ║   📍 http://${HOST}:${PORT}
    ║   🌐 Environment: ${process.env.NODE_ENV || 'development'}
    ║   🔌 WebSocket enabled                     ║
    ║   💾 Database: ${process.env.DATABASE_URL ? 'PostgreSQL' : 'In-memory'}
    ║   📧 Email: ${process.env.EMAIL_USER ? 'Enabled' : 'Disabled'}
    ║   🔐 Security: Rate limiting + Encryption ║
    ╚════════════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server };
