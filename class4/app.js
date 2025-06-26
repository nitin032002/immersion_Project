const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const VEHICLES_FILE = path.join(__dirname, 'vehicles.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Helper to read vehicles
function readVehicles() {
  if (!fs.existsSync(VEHICLES_FILE)) return [];
  const data = fs.readFileSync(VEHICLES_FILE);
  return JSON.parse(data);
}

// Helper to write vehicles
function writeVehicles(vehicles) {
  fs.writeFileSync(VEHICLES_FILE, JSON.stringify(vehicles, null, 2));
}

// Helper to read users
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
}

// Helper to write users
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Authentication middleware for API
function requireAuthAPI(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

// Authentication Routes

// Login page
app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { error: null });
});

// Login POST
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username);
  
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = { id: user.id, username: user.username, email: user.email };
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

// Register page
app.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('register', { error: null });
});

// Register POST
app.post('/register', async (req, res) => {
  const { username, password, email, age } = req.body;
  
  if (!username || !password || !email || !age) {
    return res.render('register', { error: 'All fields are required' });
  }
  
  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.render('register', { error: 'Username already exists' });
  }
  
  if (users.find(u => u.email === email)) {
    return res.render('register', { error: 'Email already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    email,
    age: parseInt(age)
  };
  
  users.push(newUser);
  writeUsers(users);
  
  req.session.user = { id: newUser.id, username: newUser.username, email: newUser.email };
  res.redirect('/');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Web Interface Routes (Protected)

// Home page - list all vehicles
app.get('/', requireAuth, (req, res) => {
  const vehicles = readVehicles();
  res.render('index', { vehicles, user: req.session.user });
});

// Create vehicle form
app.get('/create', requireAuth, (req, res) => {
  res.render('create', { user: req.session.user });
});

// Edit vehicle form
app.get('/edit/:id', requireAuth, (req, res) => {
  const vehicles = readVehicles();
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).render('error', { message: 'Vehicle not found', user: req.session.user });
  }
  res.render('edit', { vehicle, user: req.session.user });
});

// View single vehicle
app.get('/vehicle/:id', requireAuth, (req, res) => {
  const vehicles = readVehicles();
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).render('error', { message: 'Vehicle not found', user: req.session.user });
  }
  res.render('vehicle', { vehicle, user: req.session.user });
});

// API Routes (Protected)

// GET all vehicles
app.get('/api/vehicles', requireAuthAPI, (req, res) => {
  const vehicles = readVehicles();
  res.json(vehicles);
});

// GET one vehicle by id
app.get('/api/vehicles/:id', requireAuthAPI, (req, res) => {
  const vehicles = readVehicles();
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  res.json(vehicle);
});

// POST create vehicle
app.post('/api/vehicles', requireAuthAPI, (req, res) => {
  const { vehicleName, price, image, desc, brand } = req.body;
  if (!vehicleName || !price || !image || !desc || !brand) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const vehicles = readVehicles();
  const id = Date.now().toString();
  const newVehicle = { id, vehicleName, price: parseFloat(price), image, desc, brand };
  vehicles.push(newVehicle);
  writeVehicles(vehicles);
  res.status(201).json(newVehicle);
});

// PUT update vehicle
app.put('/api/vehicles/:id', requireAuthAPI, (req, res) => {
  const { vehicleName, price, image, desc, brand } = req.body;
  const vehicles = readVehicles();
  const idx = vehicles.findIndex(v => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Vehicle not found' });
  vehicles[idx] = { 
    ...vehicles[idx], 
    vehicleName, 
    price: parseFloat(price), 
    image, 
    desc, 
    brand 
  };
  writeVehicles(vehicles);
  res.json(vehicles[idx]);
});

// DELETE vehicle
app.delete('/api/vehicles/:id', requireAuthAPI, (req, res) => {
  const vehicles = readVehicles();
  const idx = vehicles.findIndex(v => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Vehicle not found' });
  const deleted = vehicles.splice(idx, 1);
  writeVehicles(vehicles);
  res.json(deleted[0]);
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found', user: req.session.user });
});

app.listen(PORT, () => {
  console.log(`🚗 Vehicle Management System with Authentication running on http://localhost:${PORT}`);
  console.log(`📖 API Documentation available at http://localhost:${PORT}/api/vehicles`);
  console.log(`🔐 Login required for all operations`);
}); 