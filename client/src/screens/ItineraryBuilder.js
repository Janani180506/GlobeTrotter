import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ItineraryBuilder.css';

const ItineraryBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStop, setShowAddStop] = useState(false);
  const [newStop, setNewStop] = useState({
    city: '',
    arrivalDate: '',
    departureDate: '',
  });
  const [cities, setCities] = useState([]);
  const [searchCity, setSearchCity] = useState('');

  useEffect(() => {
    fetchTrip();
    fetchCities();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await axios.get(`/api/trips/${id}`);
      setTrip(res.data.data);
      setStops(res.data.data.stops || []);
    } catch (error) {
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await axios.get('/api/cities');
      setCities(res.data.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleAddStop = async () => {
    if (!newStop.city || !newStop.arrivalDate || !newStop.departureDate) {
      alert('Please fill all fields');
      return;
    }

    try {
      await axios.post(`/api/trips/${id}/stops`, {
        ...newStop,
        order: stops.length,
      });
      fetchTrip();
      setNewStop({ city: '', arrivalDate: '', departureDate: '' });
      setShowAddStop(false);
    } catch (error) {
      alert('Failed to add stop');
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (window.confirm('Are you sure you want to delete this stop?')) {
      try {
        await axios.delete(`/api/trips/${id}/stops/${stopId}`);
        fetchTrip();
      } catch (error) {
        alert('Failed to delete stop');
      }
    }
  };

  const handleAddActivity = async (stopId) => {
    const activityId = prompt('Enter activity ID (you can search activities in the Activities page)');
    if (!activityId) return;

    const date = prompt('Enter date (YYYY-MM-DD)');
    if (!date) return;

    try {
      await axios.post(`/api/trips/${id}/stops/${stopId}/activities`, {
        activity: activityId,
        date,
        time: '',
        cost: 0,
      });
      fetchTrip();
    } catch (error) {
      alert('Failed to add activity');
    }
  };

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchCity.toLowerCase()) ||
      city.country.toLowerCase().includes(searchCity.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="builder-header">
        <h1>{trip?.name} - Itinerary Builder</h1>
        <div>
          <button onClick={() => navigate(`/trips/${id}/view`)} className="btn btn-secondary">
            View Itinerary
          </button>
          <button onClick={() => navigate(`/trips/${id}/budget`)} className="btn btn-outline">
            Budget
          </button>
        </div>
      </div>

      <div className="stops-container">
        {stops.map((stop, index) => (
          <div key={stop._id} className="stop-card">
            <div className="stop-header">
              <h3>
                Stop {index + 1}: {stop.city?.name || 'Unknown City'}
              </h3>
              <button
                onClick={() => handleDeleteStop(stop._id)}
                className="btn btn-danger"
                style={{ fontSize: '12px', padding: '5px 10px' }}
              >
                Remove
              </button>
            </div>
            <p>
              {new Date(stop.arrivalDate).toLocaleDateString()} -{' '}
              {new Date(stop.departureDate).toLocaleDateString()}
            </p>
            <div className="activities-section">
              <h4>Activities</h4>
              {stop.activities?.length > 0 ? (
                <ul>
                  {stop.activities.map((act) => (
                    <li key={act._id}>
                      {act.activity?.name || 'Unknown'} -{' '}
                      {new Date(act.date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No activities yet</p>
              )}
              <button
                onClick={() => handleAddActivity(stop._id)}
                className="btn btn-outline"
                style={{ marginTop: '10px' }}
              >
                + Add Activity
              </button>
            </div>
          </div>
        ))}

        {showAddStop ? (
          <div className="add-stop-card">
            <h3>Add New Stop</h3>
            <div className="form-group">
              <label>Search City</label>
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Search cities..."
              />
              {searchCity && (
                <div className="city-dropdown">
                  {filteredCities.slice(0, 5).map((city) => (
                    <div
                      key={city._id}
                      className="city-option"
                      onClick={() => {
                        setNewStop({ ...newStop, city: city._id });
                        setSearchCity(city.name);
                      }}
                    >
                      {city.name}, {city.country}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Arrival Date</label>
                <input
                  type="date"
                  value={newStop.arrivalDate}
                  onChange={(e) =>
                    setNewStop({ ...newStop, arrivalDate: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Departure Date</label>
                <input
                  type="date"
                  value={newStop.departureDate}
                  onChange={(e) =>
                    setNewStop({ ...newStop, departureDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-actions">
              <button onClick={handleAddStop} className="btn btn-primary">
                Add Stop
              </button>
              <button
                onClick={() => {
                  setShowAddStop(false);
                  setNewStop({ city: '', arrivalDate: '', departureDate: '' });
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddStop(true)}
            className="btn btn-primary add-stop-btn"
          >
            + Add Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default ItineraryBuilder;

