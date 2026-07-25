import React, { useState } from 'react';
import './Auth.css';

function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [isAgent, setIsAgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isAgent ? '/api/auth/register-agent' : '/api/auth/register';
      const body = isAgent
        ? { email, name }
        : { email, name, role };

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        onLogin(data.token);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isAgent ? 'Agent Registration' : 'User Registration'}</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {!isAgent && (
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="supervisor">Supervisor</option>
            </select>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <button
          className="toggle-btn"
          onClick={() => setIsAgent(!isAgent)}
        >
          {isAgent ? 'Register as User' : 'Register as Agent'}
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Auth;
