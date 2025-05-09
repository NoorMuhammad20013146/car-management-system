import React from 'react';
import { Link } from 'react-router-dom';

// Inline styles to guarantee visibility regardless of CSS files
const styles = {
  navbar: {
    backgroundColor: '#0d6efd',
    padding: '10px 0',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  navSection: {
    display: 'flex',
    alignItems: 'center',
  },
  navItem: {
    margin: '0 10px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '5px 0',
  },
  badge: {
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginRight: '10px',
    display: 'inline-block',
  },
  adminBadge: {
    backgroundColor: '#dc3545',
  },
  userBadge: {
    backgroundColor: '#0dcaf0',
  },
  button: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    borderRadius: '4px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '5px',
  }
};

const Navbar = ({ isAuthenticated, isAdmin, onLogout }) => {
  console.log("Navbar rendered with:", { isAuthenticated, isAdmin });
  
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link 
          to={isAuthenticated ? (isAdmin ? "/admin" : "/cars") : "/auth"}
          style={styles.brand}
        >
          Car Management System
        </Link>
        
        <div style={styles.navSection}>
          {isAuthenticated && (
            <div style={styles.navSection}>
              {isAdmin && (
                <div style={styles.navItem}>
                  <Link style={styles.navLink} to="/admin">
                    Admin Dashboard
                  </Link>
                </div>
              )}
              <div style={styles.navItem}>
                <Link style={styles.navLink} to="/cars">
                  Car Listings
                </Link>
              </div>
              {isAdmin && (
                <div style={styles.navItem}>
                  <Link style={styles.navLink} to="/cars/add">
                    Add Car
                  </Link>
                </div>
              )}
            </div>
          )}
          
          <div style={styles.navSection}>
            {isAuthenticated ? (
              <>
                <div style={styles.navItem}>
                  {isAdmin ? (
                    <span style={{...styles.badge, ...styles.adminBadge}}>
                      Admin User
                    </span>
                  ) : (
                    <span style={{...styles.badge, ...styles.userBadge}}>
                      Regular User
                    </span>
                  )}
                </div>
                <div style={styles.navItem}>
                  <button 
                    style={styles.button}
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={styles.navItem}>
                  <Link style={styles.navLink} to="/login">
                    Login
                  </Link>
                </div>
                <div style={styles.navItem}>
                  <Link style={styles.navLink} to="/register">
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;