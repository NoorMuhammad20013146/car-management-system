// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CarList from './components/CarList';
import CarDetails from './components/CarDetails';
import AddCar from './components/AddCar';
import EditCar from './components/EditCar';
import Footer from './components/Footer';
import AuthHome from './components/AuthHome';
import AdminDashboard from './components/AdminDashboard';

function App() {
  // Use explicit state variables with default values
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navKey, setNavKey] = useState(Date.now()); // Add a key to force Navbar re-render

  // Memoize the checkAuth function to avoid recreation on every render
  const checkAuth = useCallback(async () => {
    // Set loading state
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log("No token found, not authenticated");
        setIsAuthenticated(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      // Make API call to validate token
      const response = await fetch('http://localhost:5000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log("Valid authentication, user data:", userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.is_admin);
      } else {
        console.log("Invalid token, clearing");
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Authentication check error:", error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Function to handle login
  const handleLogin = (token, isAdmin) => {
    console.log("Login successful, setting auth state:", { token: token.substring(0, 10) + "...", isAdmin });
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setIsAdmin(isAdmin);
    setNavKey(Date.now()); // Force Navbar re-render
    toast.success('Login successful!');
  };

  // Function to handle logout
  const handleLogout = () => {
    console.log("Logging out, clearing auth state");
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setNavKey(Date.now()); // Force Navbar re-render
    toast.info('Logged out successfully');
    
    // Force reload to clear any cached state
    window.location.href = '/auth';
  };

  // Protected route component
  const ProtectedRoute = ({ children, requireAdmin }) => {
    if (loading) {
      return <div className="container mt-5 text-center">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/auth" />;
    }
    
    if (requireAdmin && !isAdmin) {
      toast.error('Admin access required');
      return <Navigate to="/cars" />;
    }
    
    return children;
  };

  // Render loading state if still checking authentication
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading application...</p>
      </div>
    );
  }

  // Main render
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Force Navbar to re-render when auth state changes */}
        <Navbar 
          key={navKey}
          isAuthenticated={isAuthenticated} 
          isAdmin={isAdmin} 
          onLogout={handleLogout} 
        />
        <main className="flex-grow-1">
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {/* Home route */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  isAdmin ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Navigate to="/cars" replace />
                  )
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            
            {/* Auth routes */}
            <Route
              path="/auth"
              element={
                isAuthenticated ? (
                  isAdmin ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Navigate to="/cars" replace />
                  )
                ) : (
                  <AuthHome />
                )
              }
            />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  isAdmin ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Navigate to="/cars" replace />
                  )
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? (
                  isAdmin ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Navigate to="/cars" replace />
                  )
                ) : (
                  <Register />
                )
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cars" 
              element={
                <ProtectedRoute requireAdmin={false}>
                  <CarList isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cars/:id" 
              element={
                <ProtectedRoute requireAdmin={false}>
                  <CarDetails isAuthenticated={isAuthenticated} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cars/add" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AddCar />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cars/edit/:id" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <EditCar />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;