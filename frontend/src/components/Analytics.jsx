import React, { useState, useEffect } from 'react';
import './Analytics.css';

function Analytics({ token }) {
  const [metrics, setMetrics] = useState(null);
  const [sentiments, setSentiments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [token]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const callMetricsRes = await fetch('http://localhost:3001/api/analytics/calls/metrics', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const callMetrics = await callMetricsRes.json();
      setMetrics(callMetrics);

      const sentimentsRes = await fetch('http://localhost:3001/api/analytics/sentiment/metrics', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const sentimentsData = await sentimentsRes.json();
      setSentiments(sentimentsData);
    } catch (error) {
      console.error('Failed to fetch metrics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="analytics">
      <h3>Call Metrics</h3>
      {metrics && (
        <div className="metrics-grid">
          <div className="metric-card">
            <h4>Total Calls</h4>
            <p className="big-number">{metrics.totalCalls}</p>
          </div>
          <div className="metric-card">
            <h4>Completed Calls</h4>
            <p className="big-number">{metrics.completedCalls}</p>
          </div>
          <div className="metric-card">
            <h4>Active Calls</h4>
            <p className="big-number">{metrics.activeCalls}</p>
          </div>
          <div className="metric-card">
            <h4>Avg Duration</h4>
            <p className="big-number">{metrics.avgDuration}s</p>
          </div>
        </div>
      )}

      <h3>Sentiment Analysis</h3>
      {sentiments && (
        <div className="sentiment-chart">
          <div className="sentiment-item positive">
            <span>Positive</span>
            <span className="count">{sentiments.sentiments?.positive || 0}</span>
          </div>
          <div className="sentiment-item neutral">
            <span>Neutral</span>
            <span className="count">{sentiments.sentiments?.neutral || 0}</span>
          </div>
          <div className="sentiment-item negative">
            <span>Negative</span>
            <span className="count">{sentiments.sentiments?.negative || 0}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
