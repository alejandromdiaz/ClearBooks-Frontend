import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';

const Navbar = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'var(--bs-secondary-bg)' }}>
      <div className="container-fluid">
        <Link class="navbar-brand" to="/">
          <img src={process.env.PUBLIC_URL + '/img/ClearBooks icon.png'} alt="Logo" width="30" height="30" class="d-inline-block align-text-top me-2"></img>
          ClearBooks
        </Link>
        
        {user && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/invoices">Invoices</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/estimates">Estimates</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/expenses">Expenses</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/customers">Customers</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/timer">Timer</Link>
                </li>
              </ul>
              
              <div className="d-flex">
                <span className="navbar-text me-3">
                  Welcome, {user.name} {user.surname}
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;