# RouteKL - Logistics Routing Web Application

A modern web application for logistics routing in Kuala Lumpur, built with React and Google Maps API.

## Features

- User authentication (Login/Signup)
- Interactive map with Google Maps integration
- Distribution centre selection
- Route calculation with multiple preferences:
  - Shortest route
  - Least traffic
  - Eco-friendly (least fuel)
- Vehicle type selection (Car/Bike)
- Real-time route visualization
- Route information display (distance, duration, fuel consumption)

## Project Structure

```
logistics-routing-app/
├── client/          # React web application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/        # Screen components (Login, SignUp, Map)
│   │   ├── services/       # API service layer
│   │   └── utils/          # Utility functions
│   └── package.json
└── server/          # Express backend API
    ├── controllers/
    ├── routes/
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

Or install manually:
```bash
# Root dependencies
npm install

# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```
The server will run on `http://localhost:3000`

2. In a new terminal, start the frontend:
```bash
cd client
npm run dev
```
The web app will run on `http://localhost:3001`

3. Open your browser and navigate to `http://localhost:3001`

### Building for Production

Build the client:
```bash
cd client
npm run build
```

The production build will be in `client/dist/`

## Technology Stack

### Frontend
- React 18
- Vite (build tool)
- Google Maps JavaScript API
- CSS3

### Backend
- Node.js
- Express
- CORS enabled for web app

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/distribution-centres` - Get all distribution centres
- `POST /api/routes` - Calculate route

## Configuration

The Google Maps API key is configured in `client/index.html`. Make sure to replace it with your own API key if needed.

## Development

The app uses Vite for fast development with hot module replacement. Changes to the code will automatically reload in the browser.

