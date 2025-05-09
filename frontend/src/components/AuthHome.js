import React from 'react';
import { Link } from 'react-router-dom';

const AuthHome = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Welcome to Car Management System</h2>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h4>Please login or register to continue</h4>
                <p className="text-muted">
                  Access our car inventory and management features after authentication
                </p>
              </div>
              
              <div className="row mb-4">
                <div className="col-sm-6 mb-3 mb-sm-0">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">Already have an account?</h5>
                      <p className="card-text flex-grow-1">Sign in with your existing credentials to access the system.</p>
                      <Link to="/login" className="btn btn-primary">
                        Login
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">New user?</h5>
                      <p className="card-text flex-grow-1">Create a new account to start managing cars.</p>
                      <Link to="/register" className="btn btn-success">
                        Register
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="alert alert-info">
                <strong>Admin Access:</strong> To login as administrator, use username: <strong>admin</strong> and password: <strong>admin123</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthHome;