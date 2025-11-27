import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import expenseService from '../../services/ExpenseService';
import { formatCurrency, formatDate } from '../../utils/Formatters';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadExpenses();
    loadTotalExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const response = await expenseService.getAllExpenses();
      setExpenses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setLoading(false);
    }
  };

  const loadTotalExpenses = async () => {
    try {
      const response = await expenseService.getTotalExpenses();
      setTotalExpenses(response.data.total);
    } catch (error) {
      console.error('Error loading total expenses:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        loadExpenses();
        loadTotalExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleRowClick = (id) => {
    navigate(`/expenses/${id}`);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Expenses</h2>
          <p className="text-muted mb-0">
            Total Expenses: <strong>{formatCurrency(totalExpenses)}</strong>
          </p>
        </div>
        <Link to="/expenses/new" className="btn btn-primary">
          Add New Expense
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="alert alert-info">No expenses found. Add your first expense!</div>
      ) : (
        <div className="card">
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Receipt</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id} onClick={() => handleRowClick(expense.id)} style={{cursor: 'pointer'}}>
                    <td>{formatDate(expense.expenseDate)}</td>
                    <td>{expense.name}</td>
                    <td>{formatCurrency(expense.amount)}</td>
                    <td>
                      {expense.receiptPhoto ? (
                        <span className="badge bg-success">Yes</span>
                      ) : (
                        <span className="badge bg-secondary">No</span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Link
                        to={`/expenses/edit/${expense.id}`}
                        className="btn btn-sm btn-warning btn-action me-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;