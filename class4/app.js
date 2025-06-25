const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const DATA_FILE = path.join(__dirname, 'vehicles.json');

// Helper to read vehicles
function readVehicles() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// Helper to write vehicles
function writeVehicles(vehicles) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(vehicles, null, 2));
}

// Web Interface Routes

// Home page - list all vehicles
app.get('/', (req, res) => {
  const vehicles = readVehicles();
  res.render('index', { vehicles });
});

// Create vehicle form
app.get('/create', (req, res) => {
  res.render('create');
});

// Edit vehicle form
app.get('/edit/:id', (req, res) => {
  const vehicles = readVehicles();
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).render('error', { message: 'Vehicle not found' });
  }
  res.render('edit', { vehicle });
});

// View single vehicle
app.get('/vehicle/:id', (req, res) => {
  const vehicles = readVehicles();
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).render('error', { message: 'Vehicle not found' });
  }
  res.render('vehicle', { vehicle });
});

// API Routes

// GET all vehicles
app.get('/api/vehicles', (req, res) => {
  const vehicles = readVehicles();
  res.json(vehicles);
});

// GET one vehicle by id
app.get('/api/vehicles/:id', (req, res) => {
  const vehicles = readVehicles();
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  res.json(vehicle);
});

// POST create vehicle
app.post('/api/vehicles', (req, res) => {
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
app.put('/api/vehicles/:id', (req, res) => {
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
app.delete('/api/vehicles/:id', (req, res) => {
  const vehicles = readVehicles();
  const idx = vehicles.findIndex(v => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Vehicle not found' });
  const deleted = vehicles.splice(idx, 1);
  writeVehicles(vehicles);
  res.json(deleted[0]);
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

app.listen(PORT, () => {
  console.log(`🚗 Vehicle Management System running on http://localhost:${PORT}`);
  console.log(`📖 API Documentation available at http://localhost:${PORT}/api/vehicles`);
}); 