import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Screens
import Login from './screens/Login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import TripList from './screens/TripList';
import CreateTrip from './screens/CreateTrip';
import ItineraryBuilder from './screens/ItineraryBuilder';
import ItineraryView from './screens/ItineraryView';
import CitySearch from './screens/CitySearch';
import ActivitySearch from './screens/ActivitySearch';
import Budget from './screens/Budget';
import Calendar from './screens/Calendar';
import PublicItinerary from './screens/PublicItinerary';
import Profile from './screens/Profile';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/trip/:token" element={<PublicItinerary />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <PrivateRoute>
                  <TripList />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/create"
              element={
                <PrivateRoute>
                  <CreateTrip />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:id/builder"
              element={
                <PrivateRoute>
                  <ItineraryBuilder />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:id/view"
              element={
                <PrivateRoute>
                  <ItineraryView />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:id/budget"
              element={
                <PrivateRoute>
                  <Budget />
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:id/calendar"
              element={
                <PrivateRoute>
                  <Calendar />
                </PrivateRoute>
              }
            />
            <Route
              path="/cities"
              element={
                <PrivateRoute>
                  <CitySearch />
                </PrivateRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <PrivateRoute>
                  <ActivitySearch />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

