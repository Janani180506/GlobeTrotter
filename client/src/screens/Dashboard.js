import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [popularCities, setPopularCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tripsRes, citiesRes] = await Promise.all([
        axios.get('/api/trips'),
        axios.get('/api/cities/popular'),
      ]);
      setTrips(tripsRes.data.data.slice(0, 5));
      setPopularCities(citiesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget?.total || 0), 0);

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome to GlobalTrotters</h1>
        <Link to="/trips/create" className="btn btn-primary">
          Plan New Trip
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{trips.length}</h3>
          <p>Upcoming Trips</p>
        </div>
        <div className="stat-card">
          <h3>${totalBudget.toLocaleString()}</h3>
          <p>Total Budget</p>
        </div>
        <div className="stat-card">
          <h3>{popularCities.length}</h3>
          <p>Popular Destinations</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Trips</h2>
        {trips.length === 0 ? (
          <div className="empty-state">
            <p>No trips yet. Start planning your first adventure!</p>
            <Link to="/trips/create" className="btn btn-primary">
              Create Your First Trip
            </Link>
          </div>
        ) : (
          <div className="trip-grid">
            {trips.map((trip) => (
              <div key={trip._id} className="trip-card">
                <h3>{trip.name}</h3>
                <p className="trip-dates">
                  {new Date(trip.startDate).toLocaleDateString()} -{' '}
                  {new Date(trip.endDate).toLocaleDateString()}
                </p>
                <p className="trip-stops">{trip.stops?.length || 0} stops</p>
                <div className="trip-actions">
                  <Link to={`/trips/${trip._id}/view`} className="btn btn-secondary">
                    View
                  </Link>
                  <Link to={`/trips/${trip._id}/builder`} className="btn btn-outline">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Recommended Destinations</h2>
        <div className="city-grid">
          {popularCities.map((city) => (
            <div key={city._id} className="city-card">
              <h4>{city.name}</h4>
              <p>{city.country}</p>
              <p className="city-cost">Cost Index: {city.costIndex}/100</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

