import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import estimateService from '../../services/EstimateService';
import { formatCurrency, formatDate } from '../../utils/Formatters';

const EstimateList = () => {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEstimates();
  }, []);

  const loadEstimates = async () => {
    try {
      const response = await estimateService.getAllEstimates();
      setEstimates(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading estimates:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this estimate?')) {
      try {
        await estimateService.deleteEstimate(id);
        loadEstimates();
      } catch (error) {
        console.error('Error deleting estimate:', error);
      }
    }
  };

  const handleRowClick = (id) => {
    navigate(`/estimates/${id}`);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Estimates</h2>
        <Link to="/estimates/new" className="btn btn-primary">
          Create New Estimate
        </Link>
      </div>

      {estimates.length === 0 ? (
        <div className="alert alert-info">No estimates found. Create your first estimate!</div>
      ) : (
        <div className="card">
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Estimate #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Valid Until</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {estimates.map(estimate => (
                  <tr key={estimate.id} onClick={() => handleRowClick(estimate.id)} style={{cursor: 'pointer'}}>
                    <td>{estimate.estimateNumber}</td>
                    <td>{estimate.customerName}</td>
                    <td>{formatDate(estimate.estimateDate)}</td>
                    <td>{formatDate(estimate.validUntil)}</td>
                    <td>{formatCurrency(estimate.total)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(estimate.id)}
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

export default EstimateList;