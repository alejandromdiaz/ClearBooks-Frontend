import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import invoiceService from '../../services/InvoiceService';
import { formatCurrency, formatDate } from '../../utils/Formatters';

const InvoiceDetail = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const response = await invoiceService.getInvoice(id);
      setInvoice(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading invoice:', error);
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await invoiceService.downloadPdf(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF');
    }
  };

  const handleTogglePaid = async () => {
    try {
      await invoiceService.togglePaidStatus(id);
      loadInvoice(); // Reload to get updated status
    } catch (error) {
      console.error('Error toggling paid status:', error);
      alert('Error updating paid status');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!invoice) return <div className="alert alert-danger">Invoice not found</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-secondary" onClick={() => navigate('/invoices')}>
          Volver a las facturas
        </button>
        <div>
          <button 
            className={`btn ${invoice.isPaid ? 'btn-warning' : 'btn-success'} me-2`}
            onClick={handleTogglePaid}
          >
            {invoice.isPaid ? 'Marcar como pendiente' : 'Marcar como pagada'}
          </button>
          <button className="btn btn-success" onClick={handleDownloadPdf}>
            Exportar como PDF
          </button>
        </div>
      </div>

      <div className="invoice-detail">
        <div className="invoice-header">
          <div className="row">
            <div className="col-md-6">
              <h1>FACTURA</h1>
              <p className="mb-1"><strong>Fecha:</strong> {formatDate(invoice.invoiceDate)}</p>
              <p className="mb-1"><strong>Factura número:</strong> {invoice.invoiceNumber}</p>
              {invoice.dueDate && (
                <p className="mb-1"><strong>Fecha de vencimiento:</strong> {formatDate(invoice.dueDate)}</p>
              )}
              <p className="mb-1">
                <strong>Estado:</strong>{' '}
                {invoice.isPaid ? (
                  <span className="badge bg-success">Pagada</span>
                ) : (
                  <span className="badge bg-warning text-dark">Pendiente</span>
                )}
              </p>
              {invoice.isPaid && invoice.paidDate && (
                <p className="mb-1"><strong>Pagada el:</strong> {formatDate(invoice.paidDate)}</p>
              )}
            </div>
            <div className="col-md-6 text-end">
              <h4>Facturar a:</h4>
              <p className="mb-1"><strong>{invoice.customerName}</strong></p>
            </div>
          </div>
        </div>

        <div className="invoice-items">
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
              {invoice.items && invoice.items.map((item, index) => (
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

        <div className="invoice-totals">
          <p><strong>Subtotal:</strong> {formatCurrency(invoice.subtotal)}</p>
          <p><strong>IVA ({invoice.taxRate}%):</strong> {formatCurrency(invoice.taxAmount)}</p>
          <div className="total">
            <strong>TOTAL: {formatCurrency(invoice.total)}</strong>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-4">
            <h5>Notas:</h5>
            <p>{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;