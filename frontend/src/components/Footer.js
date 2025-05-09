// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-4">
      <div className="container text-center">
        <p className="mb-0">Car Management System &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;