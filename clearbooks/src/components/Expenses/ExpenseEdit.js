import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import expenseService from '../../services/ExpenseService';

const ExpenseEdit = () => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    expenseDate: '',
    notes: ''
  });
  const [receiptPhoto, setReceiptPhoto] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadExpense();
  }, [id]);

  const loadExpense = async () => {
    try {
      const response = await expenseService.getExpense(id);
      const expense = response.data;
      setFormData({
        name: expense.name,
        amount: expense.amount,
        expenseDate: expense.expenseDate,
        notes: expense.notes || ''
      });
      if (expense.receiptPhoto) {
        setReceiptPreview(expense.receiptPhoto);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading expense:', error);
      setError('Error loading expense');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setReceiptPhoto(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setReceiptPhoto(null);
    setReceiptPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!formData.name || !formData.amount) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    try {
      const expenseData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        expenseDate: formData.expenseDate,
        notes: formData.notes,
        receiptPhoto: receiptPreview
      };

      await expenseService.updateExpense(id, expenseData);
      navigate('/expenses');
    } catch (err) {
      console.error('Error updating expense:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          'Error updating expense';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Edit Expense</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
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

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Amount (€) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="expenseDate"
                      value={formData.expenseDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Receipt Photo</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted">
                    Upload a new photo to replace the existing one (max 5MB)
                  </small>
                </div>

                {receiptPreview && (
                  <div className="mb-3">
                    <label className="form-label">Current Receipt</label>
                    <div className="position-relative d-inline-block">
                      <img 
                        src={receiptPreview} 
                        alt="Receipt preview" 
                        className="img-thumbnail"
                        style={{ maxWidth: '300px', maxHeight: '300px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                        onClick={removePhoto}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => navigate('/expenses')}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseEdit;