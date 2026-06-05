import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Repair {
  id: number;
  order_date: string;
  menu_item: string;
  instructions?: string;
  payment_method: string;
  next_reservation?: string;
}

const statusColors: { [key: string]: string } = {
  Cash: '#34a853',
  Transfer: '#1a73e8',
  POS: '#fbbc04',
};

const RepairHistory = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const numericClientId = parseInt(clientId || '0');
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [editingRepairId, setEditingRepairId] = useState<number | null>(null);
  const [repairForm, setRepairForm] = useState<Omit<Repair, 'id'>>({
    order_date: '',
    menu_item: '',
    instructions: '',
    payment_method: '',
    next_reservation: '',
  });

  const loadRepairs = async () => {
    try {
      const res = await api.get(`/orders/${numericClientId}`);
      setRepairs(res.data);
    } catch {
      toast.error('Failed to fetch repairs');
    }
  };

  useEffect(() => {
    if (numericClientId > 0) loadRepairs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericClientId]);

  if (!clientId || isNaN(numericClientId) || numericClientId <= 0) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRepairForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRepairId) {
        await api.put(`/orders/${editingRepairId}`, repairForm);
        toast.success('Repair updated!');
      } else {
        await api.post(`/orders/${numericClientId}`, repairForm);
        toast.success('Repair job added!');
      }
      setRepairForm({ order_date: '', menu_item: '', instructions: '', payment_method: '', next_reservation: '' });
      setEditingRepairId(null);
      loadRepairs();
    } catch {
      toast.error('Failed to save repair');
    }
  };

  const handleEdit = (repair: Repair) => {
    setEditingRepairId(repair.id);
    setRepairForm({ ...repair });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this repair record?')) return;
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Repair deleted');
      loadRepairs();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" />

      <Link to="/dashboard" style={styles.backLink}>← Back to Dashboard</Link>

      <div style={styles.header}>
        <h2 style={styles.heading}>🔧 Repair History</h2>
        <span style={styles.badge}>Client #{numericClientId}</span>
      </div>

      {repairs.length === 0 ? (
        <div style={styles.emptyState}>No repairs recorded yet for this client.</div>
      ) : (
        <div style={styles.repairGrid}>
          {repairs.map(repair => (
            <div key={repair.id} style={styles.repairCard}>
              <div style={styles.cardTop}>
                <span style={styles.deviceName}>🛠 {repair.menu_item}</span>
                <span style={{
                  ...styles.paymentBadge,
                  backgroundColor: statusColors[repair.payment_method] || '#888',
                }}>
                  {repair.payment_method}
                </span>
              </div>
              <div style={styles.cardInfo}>
                <span>📅 Drop-off: <strong>{repair.order_date}</strong></span>
                {repair.next_reservation && (
                  <span>🗓 Pickup: <strong>{repair.next_reservation}</strong></span>
                )}
                {repair.instructions && (
                  <span>📝 {repair.instructions}</span>
                )}
              </div>
              <div style={styles.cardActions}>
                <button onClick={() => handleEdit(repair)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(repair.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 style={styles.formHeading}>{editingRepairId ? '✏️ Edit Repair' : '➕ Add New Repair'}</h3>
      <form onSubmit={handleSubmit} style={styles.formCard}>
        <div style={styles.field}>
          <label style={styles.label}>Drop-off Date</label>
          <input type="date" name="order_date" value={repairForm.order_date} onChange={handleChange} style={styles.input} required />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Device / Item to Repair</label>
          <input type="text" name="menu_item" value={repairForm.menu_item} onChange={handleChange} style={styles.input} placeholder="e.g. iPhone 13, Samsung TV, Laptop" required />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Problem Description</label>
          <textarea name="instructions" value={repairForm.instructions} onChange={handleChange} style={{ ...styles.input, height: 70 }} placeholder="Describe the fault or issue" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Payment Method</label>
          <select name="payment_method" value={repairForm.payment_method} onChange={handleChange} style={styles.input} required>
            <option value="">Select payment method</option>
            <option value="Cash">Cash</option>
            <option value="Transfer">Bank Transfer</option>
            <option value="POS">POS</option>
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Pickup / Next Visit Date</label>
          <input type="date" name="next_reservation" value={repairForm.next_reservation} onChange={handleChange} style={styles.input} />
        </div>
        <button type="submit" style={styles.submitBtn}>
          {editingRepairId ? 'Update Repair' : 'Add Repair'}
        </button>
        {editingRepairId && (
          <button type="button" onClick={() => { setEditingRepairId(null); setRepairForm({ order_date: '', menu_item: '', instructions: '', payment_method: '', next_reservation: '' }); }} style={styles.cancelBtn}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '1.5rem', maxWidth: 750, margin: 'auto' },
  backLink: { display: 'inline-block', marginBottom: 16, textDecoration: 'none', color: '#1a73e8', fontWeight: 600, fontSize: 14 },
  header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 },
  heading: { color: '#1a73e8', margin: 0 },
  badge: { backgroundColor: '#e8f0fe', color: '#1a73e8', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 },
  emptyState: { textAlign: 'center', padding: 30, color: '#999', backgroundColor: '#fff', borderRadius: 10, marginBottom: 20 },
  repairGrid: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 },
  repairCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.07)', border: '1px solid #eef0f4' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  deviceName: { fontWeight: 700, fontSize: 15, color: '#222' },
  paymentBadge: { color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  cardInfo: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: '#555' },
  cardActions: { display: 'flex', gap: 8, marginTop: 12 },
  editBtn: { backgroundColor: '#1a73e8', color: '#fff', border: 'none', padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontWeight: 600, fontSize: 12 },
  deleteBtn: { backgroundColor: '#d93025', color: '#fff', border: 'none', padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontWeight: 600, fontSize: 12 },
  formHeading: { color: '#1a73e8', marginBottom: 12 },
  formCard: { backgroundColor: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 4 },
  input: { padding: 10, border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none' },
  submitBtn: { padding: 12, backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', fontSize: 15 },
  cancelBtn: { padding: 10, backgroundColor: '#f1f3f4', color: '#333', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', fontSize: 14 },
};

export default RepairHistory;
