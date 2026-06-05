import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Client {
  id: number;
  first_name: string;
  surname: string;
  middle_name?: string;
  date_of_birth: string;
  home_address: string;
  registration_date: string;
  _24120112002: boolean;
}

const ClientProfile = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Client, 'id'>>({
    first_name: '',
    surname: '',
    middle_name: '',
    date_of_birth: '',
    home_address: '',
    registration_date: '',
    _24120112002: false,
  });

  const loadClients = async () => {
    const res = await api.get('/customers/');
    setClients(res.data);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, formData);
        toast.success('Client updated successfully!');
      } else {
        await api.post('/customers/', formData);
        toast.success('Client registered successfully!');
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
      loadClients();
    } catch {
      toast.error('Error saving client');
    }
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setFormData({ ...client });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      await api.delete(`/customers/${id}`);
      toast.success('Client deleted');
      loadClients();
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" />

      <h2 style={styles.heading}>
        {editingId ? '✏️ Edit Client' : '➕ Register New Client'}
      </h2>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        <div style={styles.formRow}>
          <div style={styles.field}>
            <label style={styles.label}>First Name</label>
            <input name="first_name" value={formData.first_name} onChange={handleChange} required style={styles.input} placeholder="e.g. John" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Surname</label>
            <input name="surname" value={formData.surname} onChange={handleChange} required style={styles.input} placeholder="e.g. Doe" />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.field}>
            <label style={styles.label}>Middle Name</label>
            <input name="middle_name" value={formData.middle_name} onChange={handleChange} style={styles.input} placeholder="Optional" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Date of Birth</label>
            <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required style={styles.input} />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Address</label>
          <textarea name="home_address" value={formData.home_address} onChange={handleChange} required style={{ ...styles.input, height: 60 }} placeholder="Client's home or business address" />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Date Joined</label>
          <input type="date" name="registration_date" value={formData.registration_date} onChange={handleChange} required style={styles.input} />
        </div>

        <button type="submit" style={styles.button}>
          {editingId ? 'Update Client' : 'Register Client'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setFormData({ first_name: '', surname: '', middle_name: '', date_of_birth: '', home_address: '', registration_date: '', _24120112002: false }); }} style={styles.cancelBtn}>
            Cancel
          </button>
        )}
      </form>

      <h3 style={styles.subHeading}>Registered Clients</h3>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: '#1a73e8' }}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>DOB</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} style={styles.row}>
                <td style={styles.td}>{c.first_name} {c.middle_name} {c.surname}</td>
                <td style={styles.td}>{c.date_of_birth}</td>
                <td style={styles.td}>{c.home_address}</td>
                <td style={styles.td}>{c.registration_date}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(c)} style={styles.smallBtn}>Edit</button>
                  <button onClick={() => handleDelete(c.id)} style={{ ...styles.smallBtn, backgroundColor: '#d93025' }}>Delete</button>
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
  heading: { color: '#1a73e8', marginBottom: 20 },
  subHeading: { marginTop: 40, color: '#1a73e8' },
  formCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  formRow: { display: 'flex', gap: 16 },
  field: { flex: 1, display: 'flex', flexDirection: 'column' },
  label: { fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 4 },
  input: {
    padding: 10,
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
  },
  button: {
    padding: 12,
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: 15,
  },
  cancelBtn: {
    padding: 10,
    backgroundColor: '#f1f3f4',
    color: '#333',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: 14,
  },
  tableWrapper: { overflowX: 'auto', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginTop: 16 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { color: '#fff', padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 13 },
  td: { padding: '11px 16px', fontSize: 14, color: '#333' },
  row: { borderBottom: '1px solid #f0f0f0', backgroundColor: '#fff' },
  smallBtn: {
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '5px 12px',
    marginRight: 6,
    borderRadius: 20,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
  },
};

export default ClientProfile;
