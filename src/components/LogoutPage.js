import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Page.css';

function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user information from localStorage
    localStorage.removeItem('userInfo');
    
    // Redirect to home page after a short delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="page-box">
      <div className="logout-content">
        <div className="logout-icon">👋</div>
        <h2>You are logged out</h2>
        <p>Thank you for using the Crowdfunding platform!</p>
        <p>Redirecting to home page...</p>
      </div>
    </div>
  );
}

export default LogoutPage;
