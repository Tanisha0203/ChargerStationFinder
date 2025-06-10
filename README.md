# Charging Station Management System

A full-stack application for managing electric vehicle charging stations, built with Node.js, Express, MongoDB, and Vue.js.

## Features

- User authentication with JWT
- CRUD operations for charging stations
- Interactive map view of charging stations
- Filtering and search capabilities
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Project Structure

```
.
├── backend/             # Node.js + Express backend
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── server.js       # Entry point
└── frontend/           # Vue.js frontend
    ├── src/
    │   ├── components/ # Vue components
    │   ├── views/      # Page components
    │   ├── store/      # Vuex store
    │   └── router/     # Vue Router
    └── public/         # Static files
```

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd charging-station-management
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/charging-stations
JWT_SECRET=your-secret-key
PORT=5000
```

5. Start the backend server:
```bash
cd backend
npm run dev
```

6. Start the frontend development server:
```bash
cd frontend
npm run serve
```

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: https://chargerstationfinder.onrender.com/

## Deployment Information

### Frontend Application
The frontend application is deployed at: http://localhost:8080

### Backend API
The backend API is deployed at:https://chargerstationfinder.onrender.com/

### API Documentation
- Swagger UI: http://localhost:5000/api-docs
- Postman Collection: [backend/Charging_Station_API.postman_collection.json](backend/Charging_Station_API.postman_collection.json)

To use the Postman collection:
1. Import the collection file into Postman
2. Set up environment variables:
   - `base_url`: https://chargerstationfinder.onrender.com/
   - `token`: Your JWT token (obtained after login)

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and get JWT token

### Charging Stations
- GET /api/chargers - Get all charging stations
- POST /api/chargers - Create a new charging station
- PUT /api/chargers/:id - Update a charging station
- DELETE /api/chargers/:id - Delete a charging station

## Technologies Used

- Backend:
  - Node.js
  - Express
  - MongoDB with Mongoose
  - JWT for authentication
  - Express Validator

- Frontend:
  - Vue.js 3
  - Vuex for state management
  - Vue Router
  - Leaflet for maps
  - Axios for API calls

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 