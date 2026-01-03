import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';

const ActivitySearch = () => {
  const [activities, setActivities] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    type: '',
    minCost: '',
    maxCost: '',
    minDuration: '',
    maxDuration: '',
  });

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const fetchCities = async () => {
    try {
      const res = await axios.get('/api/cities');
      setCities(res.data.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.city) params.city = filters.city;
      if (filters.type) params.type = filters.type;
      if (filters.minCost) params.minCost = filters.minCost;
      if (filters.maxCost) params.maxCost = filters.maxCost;
      if (filters.minDuration) params.minDuration = filters.minDuration;
      if (filters.maxDuration) params.maxDuration = filters.maxDuration;

      const res = await axios.get('/api/activities', { params });
      setActivities(res.data.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const activityTypes = [
    'sightseeing',
    'food',
    'adventure',
    'culture',
    'nightlife',
    'shopping',
    'nature',
    'other',
  ];

  return (
    <div className="container">
      <h1>Search Activities</h1>

      <div className="search-filters">
        <div className="form-group">
          <label>Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search activities..."
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <select name="city" value={filters.city} onChange={handleFilterChange}>
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}, {city.country}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              {activityTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Min Cost ($)</label>
            <input
              type="number"
              name="minCost"
              value={filters.minCost}
              onChange={handleFilterChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Max Cost ($)</label>
            <input
              type="number"
              name="maxCost"
              value={filters.maxCost}
              onChange={handleFilterChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Min Duration (min)</label>
            <input
              type="number"
              name="minDuration"
              value={filters.minDuration}
              onChange={handleFilterChange}
              min="15"
              step="15"
            />
          </div>
          <div className="form-group">
            <label>Max Duration (min)</label>
            <input
              type="number"
              name="maxDuration"
              value={filters.maxDuration}
              onChange={handleFilterChange}
              min="15"
              step="15"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading activities...</div>
      ) : (
        <div className="search-results">
          <p className="results-count">{activities.length} activities found</p>
          <div className="activity-grid">
            {activities.map((activity) => (
              <div key={activity._id} className="activity-card">
                {activity.image && (
                  <img src={activity.image} alt={activity.name} className="activity-image" />
                )}
                <div className="activity-card-content">
                  <h3>{activity.name}</h3>
                  <p className="activity-location">
                    {activity.city?.name}, {activity.city?.country}
                  </p>
                  <span className="activity-type-badge">{activity.type}</span>
                  {activity.description && (
                    <p className="activity-description">{activity.description.substring(0, 150)}...</p>
                  )}
                  <div className="activity-meta">
                    {activity.cost > 0 && <span>💰 ${activity.cost}</span>}
                    {activity.duration && <span>⏱️ {activity.duration} min</span>}
                    {activity.rating > 0 && <span>⭐ {activity.rating}</span>}
                  </div>
                  {activity.address && (
                    <p className="activity-address">📍 {activity.address}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySearch;

