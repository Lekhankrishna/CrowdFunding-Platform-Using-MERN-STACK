import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/signup', { username, password, role, email });
      if (res.data.success) {
        setUsername('');
        setEmail('');
        setPassword('');
        navigate('/login', { state: { role } });
      } else {
        setMessage(res.data.message || 'Error signing up');
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

  if (!role) {
    return (
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-card">
            <div className="signup-header">
              <div className="role-icon default-gradient">
                <span className="icon-text">U</span>
              </div>
              <h1 className="signup-title">Join Our Platform</h1>
              <p className="signup-subtitle">Choose your role to get started</p>
            </div>

            <div className="role-selection">
              <button 
                className="role-button creator-gradient"
                onClick={() => setRole('creator')}
              >
                <div className="role-icon-small">C</div>
                <div className="role-content">
                  <h3>Creator</h3>
                  <p>Share your ideas and raise funds</p>
                </div>
                <div className="role-arrow">→</div>
              </button>

              <button 
                className="role-button investor-gradient"
                onClick={() => setRole('investor')}
              >
                <div className="role-icon-small">I</div>
                <div className="role-content">
                  <h3>Investor</h3>
                  <p>Discover and invest in great ideas</p>
                </div>
                <div className="role-arrow">→</div>
              </button>
            </div>

            <div className="signup-footer">
              <Link to="/login" className="login-link">
                Already have an account? Sign In
              </Link>
              <Link to="/" className="back-link">
                ← Back to Home
              </Link>
            </div>
          </div>

          <div className="signup-decoration">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <div className={`role-icon ${getRoleColor()}`}>
              {role.charAt(0).toUpperCase()}
            </div>
            <h1 className="signup-title">
              {role.charAt(0).toUpperCase() + role.slice(1)} Signup
            </h1>
            <p className="signup-subtitle">
              Create your {role} account to get started
            </p>
          </div>

          <form onSubmit={handleSignup} className="signup-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Create a password"
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
              className={`signup-button ${getRoleColor()}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="signup-footer">
            <button 
              onClick={() => setRole(null)} 
              className="back-role-button"
            >
              ← Choose Different Role
            </button>
            <Link to="/login" className="login-link">
              Already have an account? Sign In
            </Link>
            <Link to="/" className="back-link">
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="signup-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </div>
    </div>
  );
}

export default Signup;