// src/components/CarList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CarList = ({ isAuthenticated, isAdmin }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cars');
      if (response.ok) {
        const data = await response.json();
        setCars(data);
      } else {
        toast.error('Failed to fetch cars');
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cars/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        toast.success('Car deleted successfully');
        fetchCars();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Connection error. Please try again later.');
    }
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.year.toString().includes(searchTerm);
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'available') return matchesSearch && car.available;
    if (filter === 'unavailable') return matchesSearch && !car.available;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Car Inventory</h2>
      
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by make, model, color, or year"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Cars</option>
            <option value="available">Available Cars</option>
            <option value="unavailable">Unavailable Cars</option>
          </select>
        </div>
      </div>
      
      {filteredCars.length === 0 ? (
        <div className="alert alert-info">No cars found.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredCars.map(car => (
            <div key={car.id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{car.make} {car.model}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{car.year}</h6>
                  <p className="card-text">
                    <strong>Color:</strong> {car.color}<br />
                    <strong>Price:</strong> ${car.price.toLocaleString()}<br />
                    <strong>Status:</strong> {car.available ? 
                      <span className="badge bg-success">Available</span> : 
                      <span className="badge bg-danger">Unavailable</span>
                    }
                  </p>
                  <div className="d-flex justify-content-between">
                    <Link to={`/cars/${car.id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                    {isAdmin && (
                      <div>
                        <Link to={`/cars/edit/${car.id}`} className="btn btn-warning btn-sm me-2">
                          Edit
                        </Link>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(car.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarList;