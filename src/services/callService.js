const database = require('../config/database');
const logger = require('../config/logger');
const agentService = require('./agentService');

class CallService {
  createCall(callData) {
    try {
      const availableAgents = agentService.getAvailableAgents();
      if (availableAgents.length === 0) {
        throw new Error('No available agents');
      }

      const assignedAgent = availableAgents[0];
      agentService.incrementCallCount(assignedAgent.id);

      const call = {
        id: `call_${Date.now()}`,
        customerId: callData.customerId,
        agentId: assignedAgent.id,
        status: 'active',
        startTime: new Date(),
        endTime: null,
        duration: 0,
        recordingId: null,
        transcription: null,
        sentiment: null,
        ...callData,
      };

      database.calls.push(call);
      logger.info('Call created', { callId: call.id, agentId: assignedAgent.id });
      return call;
    } catch (error) {
      logger.error('Failed to create call', error);
      throw error;
    }
  }

  getCall(callId) {
    return database.calls.find(c => c.id === callId);
  }

  endCall(callId) {
    const call = this.getCall(callId);
    if (!call) return null;

    call.endTime = new Date();
    call.duration = Math.round((call.endTime - call.startTime) / 1000);
    call.status = 'completed';

    if (call.agentId) {
      agentService.decrementCallCount(call.agentId);
    }

    logger.info('Call ended', { callId, duration: call.duration });
    return call;
  }

  getAllCalls() {
    return database.calls;
  }

  getCallsByAgent(agentId) {
    return database.calls.filter(c => c.agentId === agentId);
  }
}

module.exports = new CallService();
