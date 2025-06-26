# Vehicle Management System

A complete RESTful API and web application for managing vehicles with user authentication and modern UI.

## Features

### 🔐 Authentication System
- User registration with username, password, email, and age
- Secure login with password hashing using bcrypt
- Session-based authentication
- Protected routes for all CRUD operations

### 🚗 Vehicle Management
- **Create**: Add new vehicles with all required fields
- **Read**: View vehicle list and individual vehicle details
- **Update**: Edit existing vehicle information
- **Delete**: Remove vehicles from the system

### 🎨 Modern UI
- Responsive Bootstrap 5 design
- Beautiful gradient backgrounds
- Font Awesome icons
- Card-based layout
- Hover effects and animations

## Vehicle Model Fields

- **vehicleName** ✅ - Name of the vehicle
- **price** ✅ - Vehicle price in dollars
- **image** ✅ - URL to vehicle image
- **desc** ✅ - Vehicle description
- **brand** ✅ - Vehicle brand/manufacturer

## User Model Fields

- **username** - Unique username for login
- **password** - Hashed password using bcrypt
- **email** - User's email address
- **age** - User's age (13-120)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **For development with auto-restart:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /register` - Registration page
- `POST /register` - Create new user
- `GET /logout` - Logout user

### Vehicle CRUD (Protected - Requires Authentication)
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get specific vehicle
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Web Interface (Protected - Requires Authentication)
- `GET /` - Vehicle list page
- `GET /create` - Create vehicle form
- `GET /edit/:id` - Edit vehicle form
- `GET /vehicle/:id` - View vehicle details

## Data Storage

The application uses JSON files for data storage:
- `vehicles.json` - Stores vehicle data
- `users.json` - Stores user authentication data

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **Session Management**: Secure session handling with express-session
- **Input Validation**: Form validation for all user inputs
- **Protected Routes**: All vehicle operations require authentication
- **CSRF Protection**: Built-in protection through session management

## Default User

A default admin user is created:
- **Username**: admin
- **Password**: admin123
- **Email**: admin@example.com
- **Age**: 25

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templates, Bootstrap 5, Font Awesome
- **Authentication**: bcrypt, express-session
- **Data Storage**: JSON files
- **Development**: nodemon for auto-restart

## Project Structure

```
class4/
├── app.js              # Main application file
├── package.json        # Dependencies and scripts
├── vehicles.json       # Vehicle data storage
├── users.json          # User data storage
├── README.md           # Project documentation
├── public/             # Static assets
│   └── style.css       # Custom styles
└── views/              # EJS templates
    ├── login.ejs       # Login page
    ├── register.ejs    # Registration page
    ├── index.ejs       # Vehicle list
    ├── create.ejs      # Create vehicle form
    ├── edit.ejs        # Edit vehicle form
    ├── vehicle.ejs     # Vehicle details
    └── error.ejs       # Error page
```

## Usage

1. Start the application: `npm start`
2. Open browser and navigate to `http://localhost:3000`
3. Register a new account or login with default credentials
4. Start managing vehicles!

## API Testing

You can test the API endpoints using tools like Postman or curl. Remember to:
1. First login to get a session
2. Include session cookies in subsequent requests
3. All vehicle endpoints require authentication

Example API call:
```bash
# Get all vehicles (requires authentication)
curl -X GET http://localhost:3000/api/vehicles \
  -H "Cookie: connect.sid=YOUR_SESSION_ID"
```

## Contributing

Feel free to contribute to this project by:
- Adding new features
- Improving the UI/UX
- Fixing bugs
- Adding more validation
- Implementing database storage

## License

This project is open source and available under the ISC License. 