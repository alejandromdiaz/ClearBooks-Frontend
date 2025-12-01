import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import customerService from '../../services/CustomerService';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading customers:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Clientes</h2>
        <Link to="/customers/new" className="btn btn-primary">
          Añadir nuevo cliente
        </Link>
      </div>

      {customers.length === 0 ? (
        <div className="alert alert-info">No se han encontrado registros. Añade tu primer cliente.</div>
      ) : (
        <div className="card">
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>NIF / CIF</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.vatNumber}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td>
                      <Link
                        to={`/customers/edit/${customer.id}`}
                        className="btn btn-sm btn-warning btn-action me-2"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(customer.id)}
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

export default CustomerList;