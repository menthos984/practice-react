import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSSOLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        'http://localhost:3001/api/auth/sso-login', 
        {}, // empty body
        { withCredentials: true } // Important for cookies
      );
      
      if (response.data.success) {
        onLoginSuccess(response.data.user);
      }
    } catch (err) {
      console.error('SSO login failed:', err);
      
      if (err.response?.status === 401) {
        setError('SSO authentication failed. Make sure you are on the domain network.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🏥 Hospital Directory</h1>
        <p>Sign in with your Windows credentials</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          onClick={handleSSOLogin}
          disabled={loading}
          className="sso-button"
        >
          {loading ? 'Authenticating...' : '🔐 Login with SSO'}
        </button>
        
        <div className="login-info">
          <small>Uses your current Windows login</small>
          <small>No password required</small>
        </div>
      </div>
    </div>
  );
}

export default Login;