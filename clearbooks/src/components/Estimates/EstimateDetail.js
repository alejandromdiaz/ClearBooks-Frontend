import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import estimateService from '../../services/EstimateService';
import { formatCurrency, formatDate } from '../../utils/Formatters';

const EstimateDetail = () => {
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadEstimate();
  }, [id]);

  const loadEstimate = async () => {
    try {
      const response = await estimateService.getEstimate(id);
      setEstimate(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading estimate:', error);
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await estimateService.downloadPdf(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `estimate-${estimate.estimateNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF');
    }
  };

  const handleConvertToInvoice = async () => {
    if (window.confirm('Convert this estimate to an invoice? The estimate will be removed from the estimates list.')) {
      try {
        await estimateService.convertToInvoice(id);
        alert('Estimate converted to invoice successfully!');
        navigate('/invoices');
      } catch (error) {
        console.error('Error converting estimate:', error);
        alert(error.response?.data || 'Error converting estimate to invoice');
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!estimate) return <div className="alert alert-danger">Estimate not found</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-secondary" onClick={() => navigate('/estimates')}>
          Volver a los presupuestos
        </button>
        <div>
          <button className="btn btn-primary me-2" onClick={handleConvertToInvoice}>
            Convertir a factura
          </button>
          <button className="btn btn-success" onClick={handleDownloadPdf}>
            Exportar como PDF
          </button>
        </div>
      </div>

      <div className="estimate-detail">
        <div className="estimate-header">
          <div className="row">
            <div className="col-md-6">
              <h1>PRESUPUESTO</h1>
              <p className="mb-1"><strong>Presupuesto número:</strong> {estimate.estimateNumber}</p>
              <p className="mb-1"><strong>Fecha:</strong> {formatDate(estimate.estimateDate)}</p>
              {estimate.validUntil && (
                <p className="mb-1"><strong>Válido hasta:</strong> {formatDate(estimate.validUntil)}</p>
              )}
            </div>
            <div className="col-md-6 text-end">
              <h4>For:</h4>
              <p className="mb-1"><strong>{estimate.customerName}</strong></p>
            </div>
          </div>
        </div>

        <div className="estimate-items">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Descripción</th>
                <th className="text-center">Cantidad</th>
                <th className="text-end">Precio</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {estimate.items && estimate.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                  <td className="text-end">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="estimate-totals">
          <p><strong>Subtotal:</strong> {formatCurrency(estimate.subtotal)}</p>
          <p><strong>IVA ({estimate.taxRate}%):</strong> {formatCurrency(estimate.taxAmount)}</p>
          <div className="total">
            <strong>TOTAL: {formatCurrency(estimate.total)}</strong>
          </div>
        </div>

        {estimate.notes && (
          <div className="mt-4">
            <h5>Notas:</h5>
            <p>{estimate.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateDetail;