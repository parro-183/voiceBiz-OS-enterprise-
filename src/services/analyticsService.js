const database = require('../config/database');
const logger = require('../config/logger');

class AnalyticsService {
  getCallMetrics() {
    const calls = database.calls;
    const totalCalls = calls.length;
    const completedCalls = calls.filter(c => c.status === 'completed').length;
    const activeCalls = calls.filter(c => c.status === 'active').length;

    const totalDuration = calls.reduce((sum, c) => sum + (c.duration || 0), 0);
    const avgDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;

    return {
      totalCalls,
      completedCalls,
      activeCalls,
      totalDuration,
      avgDuration: Math.round(avgDuration),
      timestamp: new Date(),
    };
  }

  getAgentMetrics(agentId) {
    const agentCalls = database.calls.filter(c => c.agentId === agentId);
    const totalCalls = agentCalls.length;
    const completedCalls = agentCalls.filter(c => c.status === 'completed').length;
    const totalDuration = agentCalls.reduce((sum, c) => sum + (c.duration || 0), 0);
    const avgDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;

    const sentiments = agentCalls
      .filter(c => c.sentiment)
      .reduce((acc, c) => {
        acc[c.sentiment.sentiment] = (acc[c.sentiment.sentiment] || 0) + 1;
        return acc;
      }, {});

    return {
      agentId,
      totalCalls,
      completedCalls,
      totalDuration,
      avgDuration: Math.round(avgDuration),
      sentiments,
      timestamp: new Date(),
    };
  }

  getSentimentMetrics() {
    const calls = database.calls.filter(c => c.sentiment);
    const sentiments = calls.reduce((acc, c) => {
      acc[c.sentiment.sentiment] = (acc[c.sentiment.sentiment] || 0) + 1;
      return acc;
    }, {});

    return {
      totalAnalyzed: calls.length,
      sentiments,
      avgConfidence: calls.length > 0
        ? calls.reduce((sum, c) => sum + (c.sentiment.confidence || 0), 0) / calls.length
        : 0,
      timestamp: new Date(),
    };
  }
}

module.exports = new AnalyticsService();
