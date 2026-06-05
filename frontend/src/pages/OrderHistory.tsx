import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Order {
  id: number;
  order_date: string;
  menu_item: string;
  instructions?: string;
  payment_method: string;
  next_reservation?: string;
}

const OrderHistory = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const numericCustomerId = parseInt(customerId || '0');

  const [orders, setOrders] = useState<Order[]>([]);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [orderForm, setOrderForm] = useState<Omit<Order, 'id'>>({
    order_date: '',
    menu_item: '',
    instructions: '',
    payment_method: '',
    next_reservation: '',
  });

  const loadOrders = async () => {
    try {
      const res = await api.get(`/orders/${numericCustomerId}`);
      setOrders(res.data);
    } catch {
      toast.error('Failed to fetch orders');
    }
  };

  useEffect(() => {
    if (numericCustomerId > 0) {
      loadOrders();
    }
  }, [numericCustomerId]);

  if (!customerId || isNaN(numericCustomerId) || numericCustomerId <= 0) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOrderId) {
        await api.put(`/orders/${editingOrderId}`, orderForm);
        toast.success('Order updated!');
      } else {
        await api.post(`/orders/${numericCustomerId}`, orderForm);
        toast.success('Order added!');
      }
      setOrderForm({
        order_date: '',
        menu_item: '',
        instructions: '',
        payment_method: '',
        next_reservation: '',
      });
      setEditingOrderId(null);
      loadOrders();
    } catch {
      toast.error('Failed to save order');
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrderId(order.id);
    setOrderForm({ ...order });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await api.delete(`/orders/${id}`);
      toast.success('Order deleted');
      loadOrders();
    } catch {
      toast.error('Failed to delete order');
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" />
      <h2 style={styles.heading}>Order History for Customer #{numericCustomerId}</h2>
      <Link to="/dashboard" style={styles.backLink}>← Back to Dashboard</Link>

      <div style={styles.card}>
        <ul style={styles.orderList}>
          {orders.map(order => (
            <li key={order.id} style={styles.orderItem}>
              <strong>{order.menu_item}</strong> — {order.order_date}<br />
              <small>Payment: {order.payment_method}</small><br />
              <small>Instructions: {order.instructions || 'None'}</small><br />
              {order.next_reservation && (
                <small>Next Reservation: {order.next_reservation}</small>
              )}<br />
              <button onClick={() => handleEdit(order)} style={styles.smallBtn}>Edit</button>
              <button onClick={() => handleDelete(order.id)} style={{ ...styles.smallBtn, backgroundColor: '#cc0000' }}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <h3 style={{ marginTop: 30 }}>{editingOrderId ? 'Edit Order' : 'Add New Order'}</h3>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        {[
          { name: 'order_date', label: 'Order Date', type: 'date' },
          { name: 'menu_item', label: 'Menu Item' },
          { name: 'instructions', label: 'Special Instructions' },
          { name: 'payment_method', label: 'Payment Method' },
          { name: 'next_reservation', label: 'Next Reservation Date', type: 'date' },
        ].map(({ name, label, type }) => (
          <div key={name} style={styles.field}>
            <label>{label}</label>
            <input
              type={type || 'text'}
              name={name}
              value={(orderForm as any)[name]}
              onChange={handleChange}
              style={styles.input}
              required={name !== 'instructions' && name !== 'next_reservation'}
            />
          </div>
        ))}
        <button type="submit" style={styles.button}>
          {editingOrderId ? 'Update Order' : 'Add Order'}
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '2rem', maxWidth: 700, margin: 'auto' },
  heading: { color: '#ff6600', marginBottom: 20 },
  backLink: {
    display: 'inline-block',
    marginBottom: 20,
    textDecoration: 'none',
    color: '#ff6600',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fffaf0',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
  },
  orderList: { listStyleType: 'none', padding: 0 },
  orderItem: {
    padding: 12,
    border: '1px solid #eee',
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 20,
  },
  field: { display: 'flex', flexDirection: 'column' },
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
  smallBtn: {
    marginTop: 10,
    marginRight: 10,
    backgroundColor: '#ff6600',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

export default OrderHistory;
