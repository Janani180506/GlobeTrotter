import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            🌍 GlobalTrotters
          </Link>
          {user && (
            <div className="navbar-menu">
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/trips" className="navbar-link">My Trips</Link>
              <Link to="/cities" className="navbar-link">Cities</Link>
              <Link to="/activities" className="navbar-link">Activities</Link>
              <Link to="/profile" className="navbar-link">Profile</Link>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

