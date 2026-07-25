const WebSocket = require('ws');
const logger = require('../config/logger');

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    this.setupConnections();
  }

  setupConnections() {
    this.wss.on('connection', (ws) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);
      logger.info('WebSocket client connected', { clientId });

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(data, clientId);
        } catch (error) {
          logger.error('WebSocket message error', error);
          ws.send(JSON.stringify({ error: 'Invalid message' }));
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        logger.info('WebSocket client disconnected', { clientId });
      });
    });
  }

  handleMessage(data, clientId) {
    const { type, payload } = data;

    switch (type) {
      case 'call_start':
        this.broadcastToAll({
          type: 'call_started',
          payload: { ...payload, timestamp: new Date() },
        });
        break;

      case 'call_end':
        this.broadcastToAll({
          type: 'call_ended',
          payload: { ...payload, timestamp: new Date() },
        });
        break;

      case 'agent_status':
        this.broadcastToAll({
          type: 'agent_status_updated',
          payload: { ...payload, timestamp: new Date() },
        });
        break;

      default:
        logger.warn('Unknown WebSocket message type', { type });
    }
  }

  broadcastToAll(message) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = WebSocketService;
