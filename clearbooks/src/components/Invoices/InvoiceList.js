import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import invoiceService from '../../services/InvoiceService';
import { formatCurrency, formatDate } from '../../utils/Formatters';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await invoiceService.getAllInvoices();
      setInvoices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar la factura?')) {
      try {
        await invoiceService.deleteInvoice(id);
        loadInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const handleRowClick = (id) => {
    navigate(`/invoices/${id}`);
  };

  if (loading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Facturas</h2>
        <Link to="/invoices/new" className="btn btn-primary">
          Nueva factura
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="alert alert-info">No se han encontrado registros. Crea tu primera factura.</div>
      ) : (
        <div className="card">
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Factura #</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Vencimiento</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id} onClick={() => handleRowClick(invoice.id)} style={{cursor: 'pointer'}}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.customerName}</td>
                    <td>{formatDate(invoice.invoiceDate)}</td>
                    <td>{formatDate(invoice.dueDate)}</td>
                    <td>{formatCurrency(invoice.total)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {invoice.isPaid ? (
                        <span className="badge bg-success">Pagada</span>
                      ) : (
                        <span className="badge bg-warning text-dark">Pendiente</span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Eliminar
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

export default InvoiceList;