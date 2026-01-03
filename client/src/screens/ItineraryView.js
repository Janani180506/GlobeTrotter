import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ItineraryView.css';

const ItineraryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await axios.get(`/api/trips/${id}`);
      setTrip(res.data.data);
    } catch (error) {
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const res = await axios.post(`/api/trips/${id}/share`);
      const shareUrl = `${window.location.origin}/trip/${res.data.shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (error) {
      alert('Failed to generate share link');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!trip) {
    return <div className="container">Trip not found</div>;
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
          <button onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')} className="btn btn-outline">
            {viewMode === 'list' ? '📅 Calendar View' : '📋 List View'}
          </button>
          <button onClick={handleShare} className="btn btn-secondary">
            Share
          </button>
          <button onClick={() => navigate(`/trips/${id}/builder`)} className="btn btn-outline">
            Edit
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
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
      ) : (
        <div className="itinerary-calendar">
          <p>Calendar view - Navigate to Calendar page for full calendar view</p>
          <button onClick={() => navigate(`/trips/${id}/calendar`)} className="btn btn-primary">
            View Full Calendar
          </button>
        </div>
      )}
    </div>
  );
};

export default ItineraryView;

