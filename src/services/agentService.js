const database = require('../config/database');
const logger = require('../config/logger');

class AgentService {
  createAgent(agentData) {
    try {
      const agent = {
        id: `agent_${Date.now()}`,
        name: agentData.name,
        email: agentData.email,
        status: 'available',
        currentCalls: 0,
        maxCalls: agentData.maxCalls || 5,
        createdAt: new Date(),
        ...agentData,
      };
      database.agents.push(agent);
      logger.info('Agent created', { agentId: agent.id, name: agent.name });
      return agent;
    } catch (error) {
      logger.error('Failed to create agent', error);
      throw error;
    }
  }

  getAvailableAgents() {
    return database.agents.filter(
      a => a.status === 'available' && a.currentCalls < a.maxCalls
    );
  }

  getAgent(agentId) {
    return database.agents.find(a => a.id === agentId);
  }

  updateAgentStatus(agentId, status) {
    const agent = this.getAgent(agentId);
    if (!agent) return null;
    agent.status = status;
    logger.info('Agent status updated', { agentId, status });
    return agent;
  }

  incrementCallCount(agentId) {
    const agent = this.getAgent(agentId);
    if (agent) agent.currentCalls++;
    return agent;
  }

  decrementCallCount(agentId) {
    const agent = this.getAgent(agentId);
    if (agent) agent.currentCalls--;
    if (agent && agent.currentCalls === 0) agent.status = 'available';
    return agent;
  }
}

module.exports = new AgentService();
