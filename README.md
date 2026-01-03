# GlobalTrotters - Travel Planning Application

A comprehensive MERN stack application for planning multi-city travel itineraries with budget tracking, activity discovery, and sharing capabilities.

## Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Trip Management**: Create, edit, and delete multi-city trips
- **Itinerary Builder**: Add stops, activities, and organize your trip
- **City & Activity Search**: Discover destinations and things to do
- **Budget Tracking**: Automatic cost breakdowns with visualizations
- **Calendar View**: Visual timeline of your trip
- **Sharing**: Share trips publicly with shareable links
- **User Profile**: Manage settings and saved destinations

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: React, React Router
- **Authentication**: JWT (JSON Web Tokens)
- **Charts**: Recharts
- **Calendar**: react-calendar

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd Triptales
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/triptales
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in `.env`.

## Running the Application

### Development Mode

**Option 1: Run both servers separately**

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

**Option 2: Run both servers concurrently**
```bash
npm run dev:all
```

The backend will run on `http://localhost:5000`
The frontend will run on `http://localhost:3000`

## Database Seeding (Optional)

To populate the database with sample cities and activities, you can create a seed script. Example:

```javascript
// scripts/seed.js
const mongoose = require('mongoose');
const City = require('../models/City');
const Activity = require('../models/Activity');
require('dotenv').config();

// Connect to MongoDB and seed data
// (Create this file with sample data)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgotpassword` - Request password reset

### Trips
- `GET /api/trips` - Get all user trips
- `GET /api/trips/:id` - Get single trip
- `POST /api/trips` - Create new trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `POST /api/trips/:id/stops` - Add stop to trip
- `PUT /api/trips/:id/stops/:stopId` - Update stop
- `DELETE /api/trips/:id/stops/:stopId` - Delete stop
- `POST /api/trips/:id/stops/:stopId/activities` - Add activity to stop
- `DELETE /api/trips/:id/stops/:stopId/activities/:activityId` - Remove activity
- `GET /api/trips/:id/budget` - Get budget breakdown
- `POST /api/trips/:id/share` - Generate share link
- `GET /api/trips/share/:token` - Get public trip by token

### Cities
- `GET /api/cities` - Search cities
- `GET /api/cities/:id` - Get single city
- `GET /api/cities/popular` - Get popular cities

### Activities
- `GET /api/activities` - Search activities
- `GET /api/activities/:id` - Get single activity

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/saved-destinations` - Add saved destination
- `DELETE /api/users/saved-destinations/:cityId` - Remove saved destination
- `DELETE /api/users/account` - Delete account

## Project Structure

```
Triptales/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── screens/       # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── models/                # MongoDB models
│   ├── User.js
│   ├── Trip.js
│   ├── City.js
│   └── Activity.js
├── routes/                # API routes
│   ├── auth.js
│   ├── trips.js
│   ├── cities.js
│   ├── activities.js
│   └── users.js
├── middleware/           # Express middleware
│   └── auth.js
├── server.js             # Express server
├── package.json
└── README.md
```

## Features Implementation

### 1. Login/Signup Screen
- Email and password authentication
- Form validation
- Forgot password functionality

### 2. Dashboard
- Welcome message
- Recent trips overview
- Popular destinations
- Quick actions

### 3. Create Trip
- Trip name, dates, description
- Optional cover photo

### 4. My Trips
- List view of all trips
- Edit, view, delete actions
- Trip summary cards

### 5. Itinerary Builder
- Add/remove stops (cities)
- Assign dates to stops
- Add activities to stops
- Reorder stops

### 6. Itinerary View
- Day-wise layout
- City headers
- Activity blocks with details
- Toggle between list and calendar view

### 7. City Search
- Search by name or country
- Filter by region, cost index
- Sort by popularity, cost, name

### 8. Activity Search
- Filter by city, type, cost, duration
- Browse activities with details

### 9. Budget & Cost Breakdown
- Total budget calculation
- Breakdown by category (transport, accommodation, activities, meals)
- Pie and bar charts
- Average cost per day

### 10. Calendar/Timeline
- Calendar view of trip
- Day-wise activity display
- Current location tracking

### 11. Shared/Public Itinerary
- Public URL generation
- Read-only view
- Copy trip functionality
- Social sharing

### 12. User Profile
- Edit profile information
- Language preferences
- Saved destinations
- Account deletion

## Database Schema

### User
- name, email, password (hashed)
- photo, language
- savedDestinations (array of City references)

### Trip
- user (reference)
- name, description
- startDate, endDate
- coverPhoto
- stops (embedded array)
- budget (nested object)
- isPublic, shareToken

### Stop (embedded in Trip)
- city (reference)
- arrivalDate, departureDate
- order
- activities (array)
- accommodation, transport

### City
- name, country, region
- costIndex, popularity
- description, image
- coordinates, timezone

### Activity
- name, city (reference)
- type, description
- cost, duration
- image, rating, address

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Input validation
- CORS configuration

## Future Enhancements

- Email notifications
- Real-time collaboration
- Mobile app (React Native)
- Integration with booking APIs
- Weather forecasts
- Currency conversion
- Offline mode
- Admin dashboard with analytics

## License

This project is created for educational purposes.

## Support

For issues or questions, please create an issue in the repository.

