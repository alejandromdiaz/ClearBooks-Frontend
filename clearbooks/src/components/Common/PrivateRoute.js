import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/AuthService';

const PrivateRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;