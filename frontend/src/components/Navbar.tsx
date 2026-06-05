import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '+ New Client' },
    { path: '/dashboard', label: 'All Clients' },
  ];

  return (
    <nav style={styles.nav}>
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            ...styles.link,
            ...(location.pathname === item.path ? styles.activeLink : {}),
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: 'flex',
    gap: 8,
    padding: '12px 20px',
    backgroundColor: '#1a73e8',
  },
  link: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    padding: '6px 14px',
    borderRadius: 20,
    transition: 'all 0.2s',
  },
  activeLink: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
  },
};

export default Navbar;
