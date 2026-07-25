import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // Decode token to get user info
      try {
        const decoded = JSON.parse(atob(token));
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token', error);
        setToken(null);
      }
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎤 voiceBiz-OS-enterprise</h1>
        {user && <p>Welcome, {user.userId || user.agentId}!</p>}
      </header>
      {!token ? (
        <Auth onLogin={setToken} />
      ) : (
        <>
          <Dashboard token={token} />
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </>
      )}
    </div>
  );
}

export default App;
