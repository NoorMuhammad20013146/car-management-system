// src/components/CarDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CarDetails = ({ isAuthenticated }) => {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCarDetails();
  }, []);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setCar(data);
      } else {
        toast.error('Failed to fetch car details');
      }
    } catch (error) {
      console.error('Error fetching car details:', error);
      toast.error('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to reserve a car');
      return;
    }

    setReserving(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          available: false
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Car reserved successfully!');
        // Update the local car state to show as unavailable
        setCar({
          ...car,
          available: false
        });
      } else {
        toast.error(data.error || 'Failed to reserve car');
      }
    } catch (error) {
      console.error('Error reserving car:', error);
      toast.error('Connection error. Please try again later.');
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Car not found.</div>
        <Link to="/cars" className="btn btn-primary">Back to Cars</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">{car.make} {car.model}</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h4>Vehicle Information</h4>
              <p><strong>Make:</strong> {car.make}</p>
              <p><strong>Model:</strong> {car.model}</p>
              <p><strong>Year:</strong> {car.year}</p>
              <p><strong>Color:</strong> {car.color}</p>
              <p><strong>Price:</strong> ${car.price.toLocaleString()}</p>
              <p>
                <strong>Status:</strong> {car.available ? 
                  <span className="badge bg-success">Available</span> : 
                  <span className="badge bg-danger">Unavailable</span>
                }
              </p>
            </div>
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h5 className="card-title">Car Image</h5>
                  <div className="bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                    <i className="bi bi-car-front" style={{ fontSize: "3rem" }}></i>
                  </div>
                  <p className="card-text mt-3">This is a placeholder for a car image.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <Link to="/cars" className="btn btn-primary">Back to Cars</Link>
          {isAuthenticated && car.available && (
            <button 
              className="btn btn-success" 
              onClick={handleReserve}
              disabled={reserving}
            >
              {reserving ? 'Processing...' : 'Reserve Now'}
            </button>
          )}
          {isAuthenticated && !car.available && (
            <span className="text-danger d-flex align-items-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              This car is currently unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;