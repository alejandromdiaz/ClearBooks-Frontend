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
      
      setSuccess('Profile updated successfully!');
      
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
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setUpdating(true);

    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess('Password changed successfully!');
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

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">My Profile</h2>

              {/* Tabs */}
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile Information
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                  >
                    Change Password
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
                      <label className="form-label">Name *</label>
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
                      <label className="form-label">Surname *</label>
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
                    <label className="form-label">Company Name</label>
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
                      <label className="form-label">VAT Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="vatNumber"
                        value={formData.vatNumber}
                        onChange={handleChange}
                        required
                      />
                      <small className="text-muted">
                        Warning: Changing your VAT number will change your login credentials
                      </small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email *</label>
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
                    <label className="form-label">Address *</label>
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
                    <label className="form-label">Phone Number</label>
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
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={updating}>
                      {updating ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Current Password *</label>
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
                    <label className="form-label">New Password *</label>
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
                      Must be at least 6 characters long
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm New Password *</label>
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
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={updating}>
                      {updating ? 'Changing...' : 'Change Password'}
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