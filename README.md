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

## Libraries & References

### Frontend Dependencies

- **React (v18.2.0)**: JavaScript library for building user interfaces
  - Documentation: [https://reactjs.org/docs/getting-started.html](https://reactjs.org/docs/getting-started.html)

- **React Router (v6.16.0)**: Routing library for React applications
  - Documentation: [https://reactrouter.com/en/main](https://reactrouter.com/en/main)

- **Bootstrap (v5.3.2)**: CSS framework for responsive design
  - Documentation: [https://getbootstrap.com/docs/5.3/getting-started/introduction/](https://getbootstrap.com/docs/5.3/getting-started/introduction/)

- **Bootstrap Icons (v1.11.1)**: Icon library for Bootstrap
  - Documentation: [https://icons.getbootstrap.com/](https://icons.getbootstrap.com/)

- **React-Toastify (v9.1.3)**: Toast notifications for React applications
  - Documentation: [https://fkhadra.github.io/react-toastify/introduction/](https://fkhadra.github.io/react-toastify/introduction/)

### Backend Dependencies

- **Flask (v2.3.3)**: Lightweight web framework for Python
  - Documentation: [https://flask.palletsprojects.com/en/2.3.x/](https://flask.palletsprojects.com/en/2.3.x/)

- **Flask-SQLAlchemy (v3.1.1)**: ORM for database operations
  - Documentation: [https://flask-sqlalchemy.palletsprojects.com/en/3.1.x/](https://flask-sqlalchemy.palletsprojects.com/en/3.1.x/)

- **Flask-JWT-Extended (v4.5.3)**: JWT authentication for Flask
  - Documentation: [https://flask-jwt-extended.readthedocs.io/en/stable/](https://flask-jwt-extended.readthedocs.io/en/stable/)

- **Flask-CORS (v4.0.0)**: Cross-Origin Resource Sharing for Flask
  - Documentation: [https://flask-cors.readthedocs.io/en/latest/](https://flask-cors.readthedocs.io/en/latest/)

- **Werkzeug (v2.3.7)**: WSGI utility library for Python
  - Documentation: [https://werkzeug.palletsprojects.com/en/2.3.x/](https://werkzeug.palletsprojects.com/en/2.3.x/)

## Troubleshooting

- If you encounter authentication issues, try clearing your browser cache
- Make sure both backend and frontend servers are running
- JWT tokens expire after 1 hour, requiring re-authentication
- For database issues, try deleting `cars.db` and restarting the backend