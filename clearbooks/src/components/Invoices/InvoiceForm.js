import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customerService from '../../services/CustomerService';
import invoiceService from '../../services/InvoiceService';

const InvoiceForm = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    taxRate: 21,
    notes: ''
  });
  const [items, setItems] = useState([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 }
  ]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].amount = parseFloat(newItems[index].quantity || 0) * 
                                 parseFloat(newItems[index].unitPrice || 0);
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const taxAmount = (subtotal * parseFloat(formData.taxRate || 0)) / 100;
    const total = subtotal + taxAmount;
    
    return { subtotal, taxAmount, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customerId) {
      setError('Please select a customer');
      return;
    }

    const { subtotal, taxAmount, total } = calculateTotals();

    const invoiceData = {
      ...formData,
      customerId: parseInt(formData.customerId),
      taxRate: parseFloat(formData.taxRate),
      subtotal,
      taxAmount,
      total,
      items: items.map(item => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        amount: parseFloat(item.amount)
      }))
    };

    try {
      await invoiceService.createInvoice(invoiceData);
      navigate('/invoices');
    } catch (err) {
      setError('Error creating invoice');
      console.error(err);
    }
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Nueva factura</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Cliente *</label>
                <select
                  className="form-select"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Fecha de emisión *</label>
                <input
                  type="date"
                  className="form-control"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Fecha de vencimiento</label>
                <input
                  type="date"
                  className="form-control"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">IVA (%)</label>
              <input
                type="number"
                className="form-control"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>

            <h4 className="mt-4 mb-3">Conceptos</h4>
            {items.map((item, index) => (
              <div key={index} className="row mb-3 border-bottom pb-3">
                <div className="col-md-4">
                  <label className="form-label">Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Cantidad</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Precio (€)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Total (€)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.amount.toFixed(2)}
                    readOnly
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-danger w-100"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <button type="button" className="btn btn-secondary mb-4" onClick={addItem}>
              Añadir concepto
            </button>

            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label">Notas</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-light">
                  <div className="card-body">
                    <h5>Resumen</h5>
                    <p className="mb-1">Subtotal: €{subtotal.toFixed(2)}</p>
                    <p className="mb-1">IVA ({formData.taxRate}%): €{taxAmount.toFixed(2)}</p>
                    <h5 className="mt-2">Total: €{total.toFixed(2)}</h5>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => navigate('/invoices')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Crear factura
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;