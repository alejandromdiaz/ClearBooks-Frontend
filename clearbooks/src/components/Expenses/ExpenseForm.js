import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import expenseService from '../../services/ExpenseService';

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [receiptPhoto, setReceiptPhoto] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setReceiptPhoto(file);
      
      // Create preview
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
    setLoading(true);

    if (!formData.name || !formData.amount) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const expenseData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        expenseDate: formData.expenseDate,
        notes: formData.notes,
        receiptPhoto: receiptPreview // Send base64 encoded image
      };

      await expenseService.createExpense(expenseData);
      navigate('/expenses');
    } catch (err) {
      console.error('Error creating expense:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          'Error creating expense';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">New Expense</h2>
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
                    placeholder="e.g., Office Supplies"
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
                      placeholder="0.00"
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
                    Upload a photo of your receipt (max 5MB, image files only)
                  </small>
                </div>

                {receiptPreview && (
                  <div className="mb-3">
                    <label className="form-label">Receipt Preview</label>
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
                    placeholder="Additional notes about this expense..."
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => navigate('/expenses')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Expense'}
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

export default ExpenseForm;