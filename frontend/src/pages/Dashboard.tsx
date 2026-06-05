import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
}

const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/customers/')
      .then(res => setClients(res.data))
      .catch(() => toast.error('Failed to load clients'));
  }, []);

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" />

      <div style={styles.header}>
        <h2 style={styles.heading}>🔧 All Clients</h2>
        <span style={styles.badge}>{clients.length} registered</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Client Name</th>
              <th style={styles.th}>Date of Birth</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Date Joined</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c, i) => (
              <tr key={c.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>
                  <strong>{c.first_name} {c.middle_name} {c.surname}</strong>
                </td>
                <td style={styles.td}>{c.date_of_birth}</td>
                <td style={styles.td}>{c.home_address}</td>
                <td style={styles.td}>{c.registration_date}</td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => navigate(`/repairs/${c.id}`)}
                  >
                    View Repairs
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} style={styles.empty}>
                  No clients registered yet. Add one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    maxWidth: 1000,
    margin: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  heading: {
    color: '#1a73e8',
    margin: 0,
  },
  badge: {
    backgroundColor: '#e8f0fe',
    color: '#1a73e8',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: 10,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: '#1a73e8',
  },
  th: {
    color: '#fff',
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: 14,
  },
  td: {
    padding: '12px 16px',
    fontSize: 14,
    color: '#333',
  },
  rowEven: {
    backgroundColor: '#fff',
  },
  rowOdd: {
    backgroundColor: '#f8faff',
  },
  button: {
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '6px 14px',
    borderRadius: 20,
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: 13,
  },
  empty: {
    textAlign: 'center',
    padding: 30,
    color: '#999',
    fontSize: 14,
  },
};

export default Dashboard;
