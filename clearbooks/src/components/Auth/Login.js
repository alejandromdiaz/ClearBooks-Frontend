import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/AuthService';

const Login = () => {
  const [vatNumber, setVatNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await authService.login(vatNumber, password);
      navigate('/invoices');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container mt-3">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Iniciar sesión</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">NIF / CIF</label>
              <input
                type="text"
                className="form-control"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value.toUpperCase())}
                placeholder="e.j., B12345678"
                required
              />
              <small className="text-muted">Introduce tu NIF o CIF</small>
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Iniciar sesión
            </button>
          </form>
          <div className="text-center mt-3">
            <Link to="/register">¿No tienes una cuenta? Registrarse</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;