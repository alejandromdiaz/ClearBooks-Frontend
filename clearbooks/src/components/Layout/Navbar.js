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
                  <Link className="nav-link" to="/invoices">Facturas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/estimates">Presupuestos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/expenses">Gastos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/customers">Clientes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/timer">Temporizador</Link>
                </li>
              </ul>
              
              <div className="d-flex align-items-center">
                <div className="dropdown me-2">
                  <button 
                    className="btn btn-outline-secondary btn-sm dropdown-toggle" 
                    type="button" 
                    id="userDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    {user.name} {user.surname}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person-circle me-2"></i>
                        Mi perfil
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Salir
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;