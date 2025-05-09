# Car Management System

A full-stack web application for managing car inventory with user authentication and role-based access control.

## Features

- **User Authentication**: Secure login and registration system
- **Role-Based Access**:
  - **Admin Users**: Full CRUD operations (Create, Read, Update, Delete)
  - **Regular Users**: Car browsing and reservation capabilities
- **Car Management**: Add, edit, view, and delete cars
- **Responsive Design**: Works on mobile and desktop devices

## Tech Stack

- **Frontend**: React, Bootstrap, React Router
- **Backend**: Flask, SQLAlchemy
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)

## Installation & Setup

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python3 app.py
```

The backend server will run on `http://localhost:5000`.

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the React application
npm start
```

The frontend will run on `http://localhost:3000`.

## Usage

1. **Authentication**:
   - Use default admin account: `username: admin, password: admin123`
   - Or register a new user account

2. **Admin Features**:
   - View all cars in the admin dashboard
   - Add new cars
   - Edit existing cars
   - Delete cars

3. **Regular User Features**:
   - Browse car listings
   - View car details
   - Reserve available cars

## Project Structure

```
car-management-system/
├── backend/
│   ├── app.py           # Flask application
│   ├── requirements.txt # Python dependencies
│   └── cars.db          # SQLite database
└── frontend/
    ├── public/          # Static files
    ├── src/             # React components
    │   ├── components/  # UI components
    │   ├── App.js       # Main application component
    │   └── index.js     # Entry point
    └── package.json     # Node.js dependencies
```

## Important Notes

- The backend must be running for the frontend to function properly
- JWT tokens expire after 1 hour of inactivity
- Clear browser cache if you encounter persistent login issues