import React, { useState, useEffect } from 'react';
import './AgentStatus.css';

function AgentStatus({ token }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 3000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchAgents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/agents', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Failed to fetch agents', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (agentId, newStatus) => {
    try {
      await fetch(`http://localhost:3001/api/agents/${agentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAgents();
    } catch (error) {
      alert('Failed to update status: ' + error.message);
    }
  };

  if (loading) return <div>Loading agents...</div>;

  return (
    <div className="agent-status">
      <h3>Agent Management</h3>
      <div className="agents-grid">
        {agents.map(agent => (
          <div key={agent.id} className={`agent-card ${agent.status}`}>
            <div className="agent-info">
              <h4>{agent.name}</h4>
              <p><strong>ID:</strong> {agent.id}</p>
              <p><strong>Email:</strong> {agent.email}</p>
              <p><strong>Status:</strong> <span className="status-badge">{agent.status}</span></p>
              <p><strong>Calls:</strong> {agent.currentCalls}/{agent.maxCalls}</p>
            </div>
            <div className="status-buttons">
              <button
                onClick={() => updateStatus(agent.id, 'available')}
                className={agent.status === 'available' ? 'active' : ''}
              >
                Available
              </button>
              <button
                onClick={() => updateStatus(agent.id, 'break')}
                className={agent.status === 'break' ? 'active' : ''}
              >
                Break
              </button>
              <button
                onClick={() => updateStatus(agent.id, 'offline')}
                className={agent.status === 'offline' ? 'active' : ''}
              >
                Offline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentStatus;
