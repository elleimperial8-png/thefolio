import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Nav = ({ darkMode, toggleMode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="site-header">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/home" className="logo">
          ✈️ Dream Destinations
        </Link>

        {/* MENU */}
        <div className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link 
            to="/home" 
            className={`nav-link ${isActive('/home')}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about')}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${isActive('/contact')}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>

          {/* ADMIN BUTTON - ONLY SHOW IF ADMIN */}
          {user && user.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`nav-link admin-nav-link ${isActive('/admin')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              👨‍💼 Admin
            </Link>
          )}

          {/* AUTH SECTION */}
          {user ? (
            <div className="auth-buttons">
              <Link 
                to="/profile" 
                className={`nav-link profile-link ${isActive('/profile')}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                👤 {user.name}
              </Link>
              <button 
                className="logout-btn" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link 
                to="/login" 
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="nav-link register-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}

          {/* DARK MODE TOGGLE */}
          <button className="dark-mode-toggle" onClick={toggleMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;