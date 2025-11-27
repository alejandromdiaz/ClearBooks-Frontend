import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="sidebar bg-dark text-white" style={{ 
      width: '250px', 
      minHeight: '100vh', 
      position: 'fixed',
      top: '56px',
      left: 0,
      paddingTop: '20px',
      zIndex: 1000
    }}>
      <div className="px-3">
        <h5 className="text-white mb-4">Menu</h5>
        
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link 
              to="/invoices" 
              className={`nav-link text-white ${isActive('/invoices') ? 'active bg-primary' : ''}`}
              style={{ borderRadius: '5px' }}
            >
              <i className="bi bi-file-text me-2"></i>
              Invoices
            </Link>
          </li>
          
          <li className="nav-item mb-2">
            <Link 
              to="/estimates" 
              className={`nav-link text-white ${isActive('/estimates') ? 'active bg-primary' : ''}`}
              style={{ borderRadius: '5px' }}
            >
              <i className="bi bi-file-earmark-text me-2"></i>
              Estimates
            </Link>
          </li>
          
          <li className="nav-item mb-2">
            <Link 
              to="/customers" 
              className={`nav-link text-white ${isActive('/customers') ? 'active bg-primary' : ''}`}
              style={{ borderRadius: '5px' }}
            >
              <i className="bi bi-people me-2"></i>
              Customers
            </Link>
          </li>
        </ul>

        <hr className="text-white my-4" />

        <h6 className="text-white-50 mb-3">Quick Actions</h6>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link 
              to="/invoices/new" 
              className="nav-link text-white"
              style={{ borderRadius: '5px' }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              New Invoice
            </Link>
          </li>
          
          <li className="nav-item mb-2">
            <Link 
              to="/estimates/new" 
              className="nav-link text-white"
              style={{ borderRadius: '5px' }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              New Estimate
            </Link>
          </li>
          
          <li className="nav-item mb-2">
            <Link 
              to="/customers/new" 
              className="nav-link text-white"
              style={{ borderRadius: '5px' }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              New Customer
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;