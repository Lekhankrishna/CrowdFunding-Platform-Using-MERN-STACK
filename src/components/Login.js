import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(location.state?.role || null);

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location.state?.role]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password, role });
      if (res.data.success) {
        // Store user information in localStorage
        localStorage.setItem('userInfo', JSON.stringify({
          userId: res.data.userId,
          username: res.data.username,
          role: res.data.role
        }));
        
        if (res.data.role === 'creator') {
          navigate('/creator');
        } else if (res.data.role === 'investor') {
          navigate('/investor');
        }
      } else {
        setMessage(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      setMessage('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = () => {
    if (role === 'creator') return 'creator-gradient';
    if (role === 'investor') return 'investor-gradient';
    return 'default-gradient';
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className={`role-icon ${getRoleColor()}`}>
              {role ? role.charAt(0).toUpperCase() : 'U'}
            </div>
            <h1 className="login-title">
              {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Login` : 'Welcome Back'}
            </h1>
            <p className="login-subtitle">
              {role 
                ? `Sign in to your ${role} account` 
                : 'Sign in to access your account'
              }
            </p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {message && (
              <div className="error-message">
                {message}
              </div>
            )}

            <button 
              type="submit" 
              className={`login-button ${getRoleColor()}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="signup-text">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link">
                Sign Up
              </Link>
            </p>
            <Link to="/" className="back-link">
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="login-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;