import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ClientProfile from './pages/ClientProfile';
import RepairHistory from './pages/RepairHistory';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div style={styles.appWrapper}>
        <Navbar />
        <div style={styles.brandContainer}>
          <span style={styles.brandIcon}>🔧</span>
          <span style={styles.brand}>FixIt</span>
          <span style={styles.brandSub}>Repair Shop</span>
        </div>
        <Routes>
          <Route path="/" element={<ClientProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/repairs/:clientId" element={<RepairHistory />} />
          <Route
            path="/repairs"
            element={
              <div style={{ padding: 20, color: '#1a73e8' }}>
                Please select a client from the dashboard to view their repairs.
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  appWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f4f6fb',
    fontFamily: "'Segoe UI', sans-serif",
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '10px 20px',
    backgroundColor: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 999,
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    gap: 6,
  },
  brandIcon: {
    fontSize: '20px',
  },
  brand: {
    fontFamily: "'Georgia', serif",
    fontSize: '24px',
    color: '#1a73e8',
    fontWeight: 'bold',
    letterSpacing: '-0.5px',
  },
  brandSub: {
    fontSize: '12px',
    color: '#888',
    fontWeight: '400',
    marginLeft: 2,
    marginTop: 4,
  },
};

export default App;
