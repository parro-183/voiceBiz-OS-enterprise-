import React, { useState } from 'react';
import './CallManager.css';

function CallManager({ token }) {
  const [customerId, setCustomerId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);

  const createCall = async () => {
    if (!customerId || !phoneNumber) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ customerId, phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setCalls([...calls, data.call]);
        setCustomerId('');
        setPhoneNumber('');
        alert('Call created!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Failed to create call: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const endCall = async (callId) => {
    try {
      await fetch(`http://localhost:3001/api/calls/${callId}/end`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setCalls(calls.map(c => c.id === callId ? { ...c, status: 'completed' } : c));
    } catch (error) {
      alert('Failed to end call: ' + error.message);
    }
  };

  return (
    <div className="call-manager">
      <h3>Create New Call</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button onClick={createCall} disabled={loading}>
          {loading ? 'Creating...' : 'Create Call'}
        </button>
      </div>

      <h3>Active Calls</h3>
      <div className="calls-list">
        {calls.length === 0 ? (
          <p>No calls yet</p>
        ) : (
          calls.map(call => (
            <div key={call.id} className={`call-card ${call.status}`}>
              <div className="call-info">
                <p><strong>Call ID:</strong> {call.id}</p>
                <p><strong>Customer:</strong> {call.customerId}</p>
                <p><strong>Status:</strong> {call.status}</p>
                <p><strong>Duration:</strong> {call.duration}s</p>
              </div>
              {call.status === 'active' && (
                <button onClick={() => endCall(call.id)} className="end-btn">
                  End Call
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CallManager;
