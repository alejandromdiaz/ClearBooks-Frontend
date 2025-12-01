import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/UserService';
import authService from '../../services/AuthService';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    companyName: '',
    vatNumber: '',
    email: '',
    address: '',
    phoneNumber: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await userService.getUserProfile();
      setFormData({
        name: response.data.name || '',
        surname: response.data.surname || '',
        companyName: response.data.companyName || '',
        vatNumber: response.data.vatNumber || '',
        email: response.data.email || '',
        address: response.data.address || '',
        phoneNumber: response.data.phoneNumber || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Error loading profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'vatNumber' ? value.toUpperCase() : value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      const response = await userService.updateUserProfile(formData);
      
      // Update local storage with new user data
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      setSuccess('Perfil actualizado correctamente');
      
      // Reload page after 1.5 seconds to refresh navbar and all components
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data || 'Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las nuevas contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe contener al menos 6 caracteres');
      return;
    }

    setUpdating(true);

    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess('Contraseña actualizada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data || 'Error changing password');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Mi perfil</h2>

              {/* Tabs */}
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Detalles del usuario
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                  >
                    Cambiar contraseña
                  </button>
                </li>
              </ul>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit}>
                  <div className="row">
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

                  <div className="mb-3">
                    <label className="form-label">Nombre de la empresa</label>
                    <input
                      type="text"
                      className="form-control"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">NIF / CIF *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="vatNumber"
                        value={formData.vatNumber}
                        onChange={handleChange}
                        required
                      />
                      <small className="text-muted">
                        Atención: Al actualizar el NIF o el CIF, las credenciales de acceso cambiarán
                      </small>
                    </div>
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

                  <div className="mb-3">
                    <label className="form-label">Número de teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => navigate('/invoices')}
                      disabled={updating}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={updating}>
                      {updating ? 'Guardando...' : 'Actualizar perfil'}
                    </button>
                  </div>
                </form>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Contraseña actual *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nueva contraseña *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                    />
                    <small className="text-muted">
                      Debe contener al menos 6 caracteres
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirmar nueva contraseña *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                    />
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => navigate('/invoices')}
                      disabled={updating}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={updating}>
                      {updating ? 'Actualizando...' : 'Cambiar contraseña'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;