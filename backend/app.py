# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Configure SQLite database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'cars.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Change this in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    color = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Float, nullable=False)
    available = db.Column(db.Boolean, default=True)

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({"error": "Username and password are required"}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username already exists"}), 400
        
        # Create new user
        hashed_password = generate_password_hash(data['password'])
        new_user = User(username=data['username'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({"message": "User registered successfully"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({"error": "Username and password are required"}), 400
        
        # Check user credentials
        user = User.query.filter_by(username=data['username']).first()
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Create JWT token with string ID
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "is_admin": user.is_admin
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cars', methods=['GET'])
def get_cars():
    try:
        cars = Car.query.all()
        car_list = []
        
        for car in cars:
            car_list.append({
                "id": car.id,
                "make": car.make,
                "model": car.model,
                "year": car.year,
                "color": car.color,
                "price": car.price,
                "available": car.available
            })
        
        return jsonify(car_list), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cars/<int:car_id>', methods=['GET'])
def get_car(car_id):
    try:
        car = Car.query.get(car_id)
        
        if not car:
            return jsonify({"error": "Car not found"}), 404
        
        car_data = {
            "id": car.id,
            "make": car.make,
            "model": car.model,
            "year": car.year,
            "color": car.color,
            "price": car.price,
            "available": car.available
        }
        
        return jsonify(car_data), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cars', methods=['POST'])
@jwt_required()
def add_car():
    try:
        # Get user ID from JWT token (as string) and convert to int
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.is_admin:
            return jsonify({"error": "Admin privileges required"}), 403
        
        data = request.get_json()
        print("Received data:", data)
        
        # Validate input
        required_fields = ['make', 'model', 'year', 'color', 'price']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400
        
        # Validate year and price
        try:
            year = int(data['year'])
            price = float(data['price'])
            if year < 1900 or year > 2100:
                return jsonify({"error": "Year must be between 1900 and 2100"}), 400
            if price < 0:
                return jsonify({"error": "Price cannot be negative"}), 400
        except ValueError:
            return jsonify({"error": "Year must be an integer and price must be a number"}), 400
        
        # Create new car
        new_car = Car(
            make=data['make'],
            model=data['model'],
            year=year,
            color=data['color'],
            price=price,
            available=data.get('available', True)
        )
        
        db.session.add(new_car)
        db.session.commit()
        
        return jsonify({
            "message": "Car added successfully",
            "id": new_car.id
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print("Error adding car:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/cars/<int:car_id>', methods=['PUT'])
@jwt_required()
def update_car(car_id):
    try:
        # Get user ID from JWT token (as string) and convert to int
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        data = request.get_json()
        
        print(f"Update car request - User ID: {user_id}, Car ID: {car_id}, Data: {data}")
        
        # Allow both admins and regular users to update a car, but with different permissions
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        car = Car.query.get(car_id)
        
        if not car:
            return jsonify({"error": "Car not found"}), 404
        
        # Regular users can only update availability (for reservations)
        if not user.is_admin:
            if 'available' in data and data['available'] is False:
                car.available = False
                db.session.commit()
                return jsonify({"message": "Car reserved successfully"}), 200
            else:
                return jsonify({"error": "Regular users can only reserve cars"}), 403
        
        # Admins can update all fields
        if 'make' in data:
            car.make = data['make']
        if 'model' in data:
            car.model = data['model']
        if 'year' in data:
            try:
                year = int(data['year'])
                if year < 1900 or year > 2100:
                    return jsonify({"error": "Year must be between 1900 and 2100"}), 400
                car.year = year
            except ValueError:
                return jsonify({"error": "Year must be an integer"}), 400
        if 'color' in data:
            car.color = data['color']
        if 'price' in data:
            try:
                price = float(data['price'])
                if price < 0:
                    return jsonify({"error": "Price cannot be negative"}), 400
                car.price = price
            except ValueError:
                return jsonify({"error": "Price must be a number"}), 400
        if 'available' in data:
            car.available = bool(data['available'])
        
        db.session.commit()
        
        return jsonify({"message": "Car updated successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        print("Error updating car:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/cars/<int:car_id>', methods=['DELETE'])
@jwt_required()
def delete_car(car_id):
    try:
        # Get user ID from JWT token (as string) and convert to int
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        print(f"Delete car request - User ID: {user_id}, Car ID: {car_id}")
        
        if not user or not user.is_admin:
            return jsonify({"error": "Admin privileges required"}), 403
        
        car = Car.query.get(car_id)
        
        if not car:
            return jsonify({"error": "Car not found"}), 404
        
        db.session.delete(car)
        db.session.commit()
        
        return jsonify({"message": "Car deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        print("Error deleting car:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user_info():
    try:
        # Get user ID from JWT token (as string) and convert to int
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        print(f"Get user info request - User ID: {user_id}")
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user_data = {
            "id": user.id,
            "username": user.username,
            "is_admin": user.is_admin
        }
        
        return jsonify(user_data), 200
    
    except Exception as e:
        print("Error getting user info:", str(e))
        return jsonify({"error": str(e)}), 500

# Create admin user if none exists
def create_admin():
    with app.app_context():
        db.create_all()
        
        if not User.query.filter_by(is_admin=True).first():
            admin = User(
                username="admin",
                password=generate_password_hash("admin123"),
                is_admin=True
            )
            db.session.add(admin)
            
            # Add some sample cars
            cars = [
                Car(make="Toyota", model="Camry", year=2022, color="Blue", price=25000),
                Car(make="Honda", model="Civic", year=2023, color="Red", price=22000),
                Car(make="Ford", model="Mustang", year=2021, color="Black", price=35000),
                Car(make="Tesla", model="Model 3", year=2023, color="White", price=45000),
                Car(make="BMW", model="X5", year=2022, color="Silver", price=60000)
            ]
            
            for car in cars:
                db.session.add(car)
            
            db.session.commit()

if __name__ == '__main__':
    create_admin()  # Initialize data before starting the app
    app.run(debug=True)