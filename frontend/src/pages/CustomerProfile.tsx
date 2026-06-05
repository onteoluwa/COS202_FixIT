import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Customer {
  id: number;
  first_name: string;
  surname: string;
  middle_name?: string;
  date_of_birth: string;
  home_address: string;
  registration_date: string;
  _24120112002: boolean;
}

const CustomerProfile = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    first_name: '',
    surname: '',
    middle_name: '',
    date_of_birth: '',
    home_address: '',
    registration_date: '',
    _24120112002: false,
  });

  const loadCustomers = async () => {
    const res = await api.get('/customers/');
    setCustomers(res.data);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, formData);
        toast.success('Customer updated successfully!');
      } else {
        await api.post('/customers/', formData);
        toast.success('Customer registered successfully!');
      }

      setFormData({
        first_name: '',
        surname: '',
        middle_name: '',
        date_of_birth: '',
        home_address: '',
        registration_date: '',
        _24120112002: false,
      });
      setEditingId(null);
      loadCustomers();
    } catch {
      toast.error('Error saving customer');
    }
  };

  const handleEdit = (cust: Customer) => {
    setEditingId(cust.id);
    setFormData({ ...cust });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await api.delete(`/customers/${id}`);
      toast.success('Customer deleted');
      loadCustomers();
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" />
      <h2 style={styles.heading}>
        {editingId ? 'Edit Customer' : 'Register Customer'}
      </h2>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        <div style={styles.formRow}>
          <div style={styles.field}>
            <label>First Name</label>
            <input name="first_name" value={formData.first_name} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.field}>
            <label>Surname</label>
            <input name="surname" value={formData.surname} onChange={handleChange} required style={styles.input} />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.field}>
            <label>Middle Name</label>
            <input name="middle_name" value={formData.middle_name} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.field}>
            <label>Date of Birth</label>
            <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required style={styles.input} />
          </div>
        </div>

        <div style={styles.field}>
          <label>Home Address</label>
          <textarea name="home_address" value={formData.home_address} onChange={handleChange} required style={{ ...styles.input, height: 60 }} />
        </div>

        <div style={styles.formRow}>
          <div style={styles.field}>
            <label>Date of Registration</label>
            <input type="date" name="registration_date" value={formData.registration_date} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={{ ...styles.field, flexDirection: 'row', alignItems: 'center' }}>
            <label style={{ marginRight: 10 }}>_24120112002</label>
            <input type="checkbox" name="_24120112002" checked={formData._24120112002} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" style={styles.button}>
          {editingId ? 'Update Customer' : 'Add Customer'}
        </button>
      </form>

      <h3 style={{ marginTop: 40, color: '#ff6600' }}>Registered Customers</h3>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th><th>DOB</th><th>Address</th><th>Registered</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.first_name} {c.middle_name} {c.surname}</td>
                <td>{c.date_of_birth}</td>
                <td>{c.home_address}</td>
                <td>{c.registration_date}</td>
                <td>
                  <button onClick={() => handleEdit(c)} style={styles.smallBtn}>Edit</button>
                  <button onClick={() => handleDelete(c.id)} style={{ ...styles.smallBtn, backgroundColor: '#cc0000' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '2rem', maxWidth: 900, margin: 'auto' },
  heading: { color: '#ff6600', marginBottom: 20 },
  formCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  formRow: { display: 'flex', gap: 16 },
  field: { flex: 1, display: 'flex', flexDirection: 'column' },
  input: {
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 6,
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    padding: 12,
    backgroundColor: '#ff6600',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: 16,
    marginTop: 10,
  },
  tableWrapper: {
    overflowX: 'auto',
    marginTop: 20,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
  },
  smallBtn: {
    backgroundColor: '#ff6600',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    marginRight: 6,
    borderRadius: 4,
    cursor: 'pointer',
  },
};

export default CustomerProfile;
