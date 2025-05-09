import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    unavailableCars: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cars');
      if (response.ok) {
        const data = await response.json();
        setCars(data);
        
        // Calculate stats
        const available = data.filter(car => car.available).length;
        setStats({
          totalCars: data.length,
          availableCars: available,
          unavailableCars: data.length - available
        });
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
        fetchCars(); // Refresh the car list
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Connection error. Please try again later.');
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <Link to="/cars/add" className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i>Add New Car
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Total Cars</h5>
              <h2>{stats.totalCars}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Available Cars</h5>
              <h2>{stats.availableCars}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Unavailable Cars</h5>
              <h2>{stats.unavailableCars}</h2>
            </div>
          </div>
        </div>
      </div>
      
      <h4 className="mb-3">Car Inventory Management</h4>
      
      {cars.length === 0 ? (
        <div className="alert alert-info">No cars in the inventory. Add your first car!</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>Color</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <tr key={car.id}>
                  <td>{car.id}</td>
                  <td>{car.make}</td>
                  <td>{car.model}</td>
                  <td>{car.year}</td>
                  <td>{car.color}</td>
                  <td>${car.price.toLocaleString()}</td>
                  <td>
                    {car.available ? 
                      <span className="badge bg-success">Available</span> : 
                      <span className="badge bg-danger">Unavailable</span>
                    }
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/cars/${car.id}`} className="btn btn-sm btn-primary">
                        <i className="bi bi-eye"></i>
                      </Link>
                      <Link to={`/cars/edit/${car.id}`} className="btn btn-sm btn-warning">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(car.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4">
        <Link to="/cars" className="btn btn-secondary">
          <i className="bi bi-grid me-2"></i>View User Car List
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;