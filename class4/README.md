# Vehicle Management API

A RESTful API for managing vehicles with CRUD operations built with Express.js and EJS.

## Features

- ✅ Create, Read, Update, Delete vehicles
- ✅ Vehicle fields: vehicleName, price, image, desc, brand
- ✅ JSON data persistence
- ✅ Web interface with EJS templates
- ✅ RESTful API endpoints

## Project Structure

```
vehicle-api/
├── app.js              # Main server file
├── package.json        # Project dependencies
├── vehicles.json       # Data storage
├── README.md          # Project documentation
├── views/             # EJS templates
│   ├── index.ejs      # Home page
│   ├── create.ejs     # Create vehicle form
│   ├── edit.ejs       # Edit vehicle form
│   └── vehicle.ejs    # Single vehicle view
└── public/            # Static files
    └── style.css      # CSS styles
```

## Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. For development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

### Web Interface
- `GET /` - Home page with vehicle list
- `GET /create` - Create vehicle form
- `GET /edit/:id` - Edit vehicle form
- `GET /vehicle/:id` - View single vehicle

### REST API
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

## Usage Examples

### Create a Vehicle
```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleName": "Tesla Model 3",
    "price": 45000,
    "image": "https://example.com/tesla.jpg",
    "desc": "Electric sedan with autopilot",
    "brand": "Tesla"
  }'
```

### Get All Vehicles
```bash
curl http://localhost:3000/api/vehicles
```

### Update a Vehicle
```bash
curl -X PUT http://localhost:3000/api/vehicles/1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleName": "Tesla Model 3 Updated",
    "price": 47000,
    "image": "https://example.com/tesla-new.jpg",
    "desc": "Updated electric sedan",
    "brand": "Tesla"
  }'
```

### Delete a Vehicle
```bash
curl -X DELETE http://localhost:3000/api/vehicles/1234567890
```

## Vehicle Model

```json
{
  "id": "1234567890",
  "vehicleName": "Tesla Model 3",
  "price": 45000,
  "image": "https://example.com/tesla.jpg",
  "desc": "Electric sedan with autopilot",
  "brand": "Tesla"
}
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **EJS** - Template engine
- **JSON** - Data storage

## License

ISC 