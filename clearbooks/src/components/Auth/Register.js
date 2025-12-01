import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/AuthService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    companyName: '',
    vatNumber: '',
    email: '',
    address: '',
    phoneNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'vatNumber' ? value.toUpperCase() : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // --- FIX START: Clean the formData to remove empty strings ---
    const payload = Object.keys(formData).reduce((acc, key) => {
        const value = formData[key];
        // Only include fields that are not null, not undefined, and not an empty string
        if (value !== null && value !== undefined && value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {});
    // --- FIX END ---
    
    // NOTE: This ensures that mandatory fields (like vatNumber, email, password) 
    // are present because they are marked 'required' in the form, 
    // preventing submission if they are empty.

    try {
      // Use the cleaned payload
      const data = await authService.register(payload); 
      
      if (data.token) {
        // Since we are moving towards a persistent database, local storage is only used 
        // as a temporary cache and should ideally be replaced with state management 
        // or cookies/session storage for real applications.
        localStorage.setItem('user', JSON.stringify(data)); 
        setSuccess(true);
        navigate('/invoices'); // redirect on success
      } else {
        // If the backend returns data but no token, something is still unexpected
        setError('Registration succeeded but no token returned');
      }
    } catch (err) {
      // The error is now coming from the backend's validation process.
      // The 'err.error' should contain the specific validation failure message.
      const errorMessage = err.message || err.error || 'Registration failed due to invalid data.';
      setError(errorMessage);
      console.error("Backend Registration Error:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-5 text-primary fw-bold">Registro</h2>

              {/* Error/Success Messages */}
              {error && <div className="alert alert-danger text-center">{error}</div>}
              {success && <div className="alert alert-success text-center">Registro exitoso! Redirigiendo...</div>}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Nombre */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Apellidos */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Apellidos *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Nombre de la empresa */}
                <div className="mb-3">
                  <label className="form-label">Nombre de la empresa (Opcional)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  {/* NIF / CIF */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">NIF / CIF *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="vatNumber"
                      value={formData.vatNumber}
                      onChange={handleChange}
                      placeholder="e.j., B12345678"
                      required
                    />
                    <small className="text-muted">Puede incluir letras y números</small>
                  </div>
                  {/* Correo electrónico */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Correo electrónico *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Dirección comercial */}
                <div className="mb-3">
                  <label className="form-label">Dirección comercial *</label>
                  <textarea
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                    required
                  />
                </div>

                <div className="row">
                  {/* Número de teléfono */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Número de teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Contraseña */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contraseña *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-4">
                  Registro
                </button>
              </form>

              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none">¿Ya tienes una cuenta? Inicia sesión</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;