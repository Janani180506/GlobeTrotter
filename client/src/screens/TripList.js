import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TripList.css';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get('/api/trips');
      setTrips(res.data.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await axios.delete(`/api/trips/${tripId}`);
        setTrips(trips.filter((trip) => trip._id !== tripId));
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="trip-list-header">
        <h1>My Trips</h1>
        <Link to="/trips/create" className="btn btn-primary">
          + New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <p>No trips yet. Start planning your first adventure!</p>
          <Link to="/trips/create" className="btn btn-primary">
            Create Your First Trip
          </Link>
        </div>
      ) : (
        <div className="trip-list">
          {trips.map((trip) => (
            <div key={trip._id} className="trip-list-card">
              <div className="trip-list-info">
                <h3>{trip.name}</h3>
                <p className="trip-description">{trip.description || 'No description'}</p>
                <div className="trip-meta">
                  <span>
                    📅 {new Date(trip.startDate).toLocaleDateString()} -{' '}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                  <span>📍 {trip.stops?.length || 0} stops</span>
                  <span>💰 ${(trip.budget?.total || 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="trip-list-actions">
                <Link to={`/trips/${trip._id}/view`} className="btn btn-secondary">
                  View
                </Link>
                <Link to={`/trips/${trip._id}/builder`} className="btn btn-outline">
                  Edit
                </Link>
                <Link to={`/trips/${trip._id}/budget`} className="btn btn-outline">
                  Budget
                </Link>
                <Link to={`/trips/${trip._id}/calendar`} className="btn btn-outline">
                  Calendar
                </Link>
                <button
                  onClick={() => handleDelete(trip._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripList;

