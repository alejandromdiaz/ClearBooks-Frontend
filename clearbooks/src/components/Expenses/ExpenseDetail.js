import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import expenseService from '../../services/ExpenseService';
import { formatCurrency, formatDate } from '../../utils/Formatters';

const ExpenseDetail = () => {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadExpense();
  }, [id]);

  const loadExpense = async () => {
    try {
      const response = await expenseService.getExpense(id);
      setExpense(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading expense:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        navigate('/expenses');
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense');
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!expense) return <div className="alert alert-danger">Expense not found</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-secondary" onClick={() => navigate('/expenses')}>
          Volver a los gastos
        </button>
        <div>
          <button 
            className="btn btn-warning me-2" 
            onClick={() => navigate(`/expenses/edit/${id}`)}
          >
            Editar
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Eliminar
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">{expense.name}</h2>
          
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="text-muted">Fecha</label>
                <p className="h5">{formatDate(expense.expenseDate)}</p>
              </div>
              
              <div className="mb-3">
                <label className="text-muted">Total</label>
                <p className="h4 text-danger">{formatCurrency(expense.amount)}</p>
              </div>
            </div>

            <div className="col-md-6">
              {expense.receiptPhoto && (
                <div>
                  <label className="text-muted d-block mb-2">Imagen del ticket o factura </label>
                  <img 
                    src={expense.receiptPhoto} 
                    alt="Receipt" 
                    className="img-fluid img-thumbnail"
                    style={{ maxWidth: '100%', maxHeight: '400px', cursor: 'pointer' }}
                    onClick={() => window.open(expense.receiptPhoto, '_blank')}
                  />
                  <p className="text-muted small mt-2">Pulse para ver en tamaño completo</p>
                </div>
              )}
            </div>
          </div>

          {expense.notes && (
            <div className="mt-4">
              <label className="text-muted">Notas</label>
              <p className="border-top pt-3">{expense.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;