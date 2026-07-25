import React, { useState, useEffect } from 'react';
import CallManager from './CallManager';
import Analytics from './Analytics';
import AgentStatus from './AgentStatus';
import './Dashboard.css';

function Dashboard({ token }) {
  const [activeTab, setActiveTab] = useState('calls');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [token]);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analytics/calls/metrics', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="stats-bar">
        <div className="stat">
          <span className="label">Total Calls</span>
          <span className="value">{stats?.totalCalls || 0}</span>
        </div>
        <div className="stat">
          <span className="label">Active Calls</span>
          <span className="value">{stats?.activeCalls || 0}</span>
        </div>
        <div className="stat">
          <span className="label">Avg Duration</span>
          <span className="value">{stats?.avgDuration || 0}s</span>
        </div>
        <div className="stat">
          <span className="label">Completed</span>
          <span className="value">{stats?.completedCalls || 0}</span>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'calls' ? 'active' : ''}`}
          onClick={() => setActiveTab('calls')}
        >
          📞 Calls
        </button>
        <button
          className={`tab ${activeTab === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveTab('agents')}
        >
          🤖 Agents
        </button>
        <button
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'calls' && <CallManager token={token} />}
        {activeTab === 'agents' && <AgentStatus token={token} />}
        {activeTab === 'analytics' && <Analytics token={token} />}
      </div>
    </div>
  );
}

export default Dashboard;
