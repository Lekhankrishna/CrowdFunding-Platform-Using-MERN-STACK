import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    navigate('/login', { state: { role } });
  };

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="gradient-text">Crowdfunding</span> Platform
            </h1>
            <p className="hero-subtitle">
              Connect innovative creators with passionate investors. 
              Turn great ideas into reality through collaborative funding.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Projects Funded</span>
              </div>
              <div className="stat">
                <span className="stat-number">₹50M+</span>
                <span className="stat-label">Total Raised</span>
              </div>
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Users</span>
              </div>
            </div>
            <button className="cta-button" onClick={handleGetStarted}>
              Get Started Today
            </button>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">💡</div>
              <div className="card-content">
                <h4>Innovation</h4>
                <p>Great ideas</p>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <h4>Funding</h4>
                <p>Smart investments</p>
              </div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🚀</div>
              <div className="card-content">
                <h4>Growth</h4>
                <p>Success stories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>For Creators</h3>
            <p>Share your innovative ideas and get funding from investors who believe in your vision.</p>
            <button 
              className="feature-button creator-btn"
              onClick={() => handleRoleSelection('creator')}
            >
              Start Creating
            </button>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>For Investors</h3>
            <p>Discover promising projects and invest in the next big thing. Support innovation.</p>
            <button 
              className="feature-button investor-btn"
              onClick={() => handleRoleSelection('investor')}
            >
              Start Investing
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">🔒</div>
            <h4>Secure Platform</h4>
            <p>Your investments and data are protected with industry-standard security.</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <h4>Fast & Easy</h4>
            <p>Quick setup and seamless experience for both creators and investors.</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">📊</div>
            <h4>Transparent</h4>
            <p>Clear tracking of all investments and project progress.</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🤝</div>
            <h4>Community</h4>
            <p>Join a community of innovators and forward-thinking investors.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of creators and investors who are already changing the world.</p>
          <div className="cta-buttons">
            <button 
              className="cta-button primary"
              onClick={() => handleRoleSelection('creator')}
            >
              Become a Creator
            </button>
            <button 
              className="cta-button secondary"
              onClick={() => handleRoleSelection('investor')}
            >
              Become an Investor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;