import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CustomerList from './components/Customers/CustomerList';
import CustomerForm from './components/Customers/CustomerForm';
import CustomerEdit from './components/Customers/CustomerEdit';
import InvoiceList from './components/Invoices/InvoiceList';
import InvoiceForm from './components/Invoices/InvoiceForm';
import InvoiceDetail from './components/Invoices/InvoiceDetail';
import EstimateList from './components/Estimates/EstimateList';
import EstimateForm from './components/Estimates/EstimateForm';
import EstimateDetail from './components/Estimates/EstimateDetail';
import ExpenseList from './components/Expenses/ExpenseList';
import ExpenseForm from './components/Expenses/ExpenseForm';
import ExpenseDetail from './components/Expenses/ExpenseDetail';
import ExpenseEdit from './components/Expenses/ExpenseEdit';
import TimerPage from './components/Timer/TimerPage';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/Common/PrivateRoute';
import ProfilePage from './components/User/ProfilePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            
            <Route path="/customers" element={
              <PrivateRoute>
                <CustomerList />
              </PrivateRoute>
            } />
            <Route path="/customers/new" element={
              <PrivateRoute>
                <CustomerForm />
              </PrivateRoute>
            } />
            <Route path="/customers/edit/:id" element={
              <PrivateRoute>
                <CustomerEdit />
              </PrivateRoute>
            } />
            
            <Route path="/invoices" element={
              <PrivateRoute>
                <InvoiceList />
              </PrivateRoute>
            } />
            <Route path="/invoices/new" element={
              <PrivateRoute>
                <InvoiceForm />
              </PrivateRoute>
            } />
            <Route path="/invoices/:id" element={
              <PrivateRoute>
                <InvoiceDetail />
              </PrivateRoute>
            } />
            
            <Route path="/estimates" element={
              <PrivateRoute>
                <EstimateList />
              </PrivateRoute>
            } />
            <Route path="/estimates/new" element={
              <PrivateRoute>
                <EstimateForm />
              </PrivateRoute>
            } />
            <Route path="/estimates/:id" element={
              <PrivateRoute>
                <EstimateDetail />
              </PrivateRoute>
            } />
            
            <Route path="/expenses" element={
              <PrivateRoute>
                <ExpenseList />
              </PrivateRoute>
            } />
            <Route path="/expenses/new" element={
              <PrivateRoute>
                <ExpenseForm />
              </PrivateRoute>
            } />
            <Route path="/expenses/:id" element={
              <PrivateRoute>
                <ExpenseDetail />
              </PrivateRoute>
            } />
            <Route path="/expenses/edit/:id" element={
              <PrivateRoute>
                <ExpenseEdit />
              </PrivateRoute>
            } />
            <Route path="/timer" element={
              <PrivateRoute>
                <TimerPage />
              </PrivateRoute>
            } />
            
            <Route path="/" element={<Navigate to="/invoices" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;