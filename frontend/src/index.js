// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

// This ensures localStorage is cleared on fresh load to avoid persistence issues
if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD) {
  // This is a hard refresh, not just a component re-render
  console.log('Page is being reloaded. Ensuring clean state...');
  // Uncomment the line below if you want to force logout on every page refresh
  // localStorage.removeItem('token');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);