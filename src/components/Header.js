import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  // Hide buttons on Login page
  const isLoginPage = location.pathname === '/';

  return (
    <header className="main-header">
      <h1>CROWDFUNDING PLATFORM</h1>

      {!isLoginPage && (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </header>
  );
}

export default Header;
