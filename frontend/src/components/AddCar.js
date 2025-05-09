// src/components/AddCar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddCar = () => {
  const [car, setCar] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    price: '',
    available: true
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCar({
      ...car,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const { make, model, year, color, price } = car;
    
    if (!make || !model || !year || !color || !price) {
      toast.error('Please fill in all fields');
      return false;
    }
    
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      toast.error('Year must be a valid number between 1900 and 2100');
      return false;
    }
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Price must be a positive number');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      console.log('Adding car with token:', token);
      console.log('Car data:', car);
      
      const response = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          make: car.make,
          model: car.model,
          year: parseInt(car.year),
          color: car.color,
          price: parseFloat(car.price),
          available: car.available
        }),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        toast.success('Car added successfully');
        navigate('/admin');
      } else {
        toast.error(data.error || 'Failed to add car');
      }
    } catch (error) {
      console.error('Error adding car:', error);
      toast.error('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Add New Car</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="make" className="form-label">Make</label>
                    <input
                      type="text"
                      className="form-control"
                      id="make"
                      name="make"
                      value={car.make}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="model" className="form-label">Model</label>
                    <input
                      type="text"
                      className="form-control"
                      id="model"
                      name="model"
                      value={car.model}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="year" className="form-label">Year</label>
                    <input
                      type="number"
                      className="form-control"
                      id="year"
                      name="year"
                      min="1900"
                      max="2100"
                      value={car.year}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="color" className="form-label">Color</label>
                    <input
                      type="text"
                      className="form-control"
                      id="color"
                      name="color"
                      value={car.color}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="price" className="form-label">Price ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={car.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="available"
                    name="available"
                    checked={car.available}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="available">Available</label>
                </div>
                <div className="d-grid gap-2 d-md-flex">
                  <button 
                    type="submit" 
                    className="btn btn-primary me-md-2"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Car'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCar;