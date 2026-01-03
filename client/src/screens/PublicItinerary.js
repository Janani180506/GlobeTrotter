import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ItineraryView.css';

const PublicItinerary = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrip();
  }, [token]);

  const fetchTrip = async () => {
    try {
      const res = await axios.get(`/api/trips/share/${token}`);
      setTrip(res.data.data);
    } catch (error) {
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrip = () => {
    alert('Copy trip functionality - would create a copy for logged-in users');
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: trip?.name,
        text: `Check out this trip: ${trip?.name}`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <div className="loading">Loading itinerary...</div>;
  }

  if (!trip) {
    return <div className="container">Itinerary not found</div>;
  }

  const sortedStops = [...(trip.stops || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="container">
      <div className="itinerary-header">
        <div>
          <h1>{trip.name}</h1>
          <p className="trip-dates">
            {new Date(trip.startDate).toLocaleDateString()} -{' '}
            {new Date(trip.endDate).toLocaleDateString()}
          </p>
          {trip.description && <p className="trip-description">{trip.description}</p>}
        </div>
        <div className="itinerary-actions">
          <button onClick={handleShare} className="btn btn-secondary">
            Share
          </button>
          <button onClick={handleCopyTrip} className="btn btn-primary">
            Copy Trip
          </button>
        </div>
      </div>

      <div className="itinerary-list">
        {sortedStops.map((stop, index) => (
          <div key={stop._id} className="itinerary-stop">
            <div className="stop-header">
              <h2>
                {index + 1}. {stop.city?.name || 'Unknown City'}
              </h2>
              <span className="stop-dates">
                {new Date(stop.arrivalDate).toLocaleDateString()} -{' '}
                {new Date(stop.departureDate).toLocaleDateString()}
              </span>
            </div>
            {stop.city?.description && (
              <p className="city-description">{stop.city.description}</p>
            )}
            {stop.activities && stop.activities.length > 0 && (
              <div className="activities-list">
                <h3>Activities</h3>
                {stop.activities.map((act) => (
                  <div key={act._id} className="activity-item">
                    <div className="activity-info">
                      <h4>{act.activity?.name || 'Unknown Activity'}</h4>
                      <p className="activity-type">{act.activity?.type}</p>
                      {act.activity?.description && (
                        <p className="activity-description">{act.activity.description}</p>
                      )}
                      <div className="activity-meta">
                        <span>📅 {new Date(act.date).toLocaleDateString()}</span>
                        {act.time && <span>🕐 {act.time}</span>}
                        {act.cost > 0 && <span>💰 ${act.cost}</span>}
                        {act.activity?.duration && (
                          <span>⏱️ {act.activity.duration} min</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicItinerary;

