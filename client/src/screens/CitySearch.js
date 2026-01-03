import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';

const CitySearch = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    region: '',
    minCost: '',
    maxCost: '',
    sortBy: 'popularity',
  });

  useEffect(() => {
    fetchCities();
  }, [filters]);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.country) params.country = filters.country;
      if (filters.region) params.region = filters.region;
      if (filters.minCost) params.minCost = filters.minCost;
      if (filters.maxCost) params.maxCost = filters.maxCost;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      const res = await axios.get('/api/cities', { params });
      setCities(res.data.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getCostLabel = (costIndex) => {
    if (costIndex < 30) return 'Budget';
    if (costIndex < 60) return 'Moderate';
    return 'Expensive';
  };

  return (
    <div className="container">
      <h1>Search Cities</h1>

      <div className="search-filters">
        <div className="form-group">
          <label>Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by city or country..."
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={filters.country}
              onChange={handleFilterChange}
              placeholder="Filter by country..."
            />
          </div>
          <div className="form-group">
            <label>Region</label>
            <input
              type="text"
              name="region"
              value={filters.region}
              onChange={handleFilterChange}
              placeholder="Filter by region..."
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Min Cost Index</label>
            <input
              type="number"
              name="minCost"
              value={filters.minCost}
              onChange={handleFilterChange}
              min="0"
              max="100"
            />
          </div>
          <div className="form-group">
            <label>Max Cost Index</label>
            <input
              type="number"
              name="maxCost"
              value={filters.maxCost}
              onChange={handleFilterChange}
              min="0"
              max="100"
            />
          </div>
          <div className="form-group">
            <label>Sort By</label>
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value="popularity">Popularity</option>
              <option value="cost">Cost (Low to High)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading cities...</div>
      ) : (
        <div className="search-results">
          <p className="results-count">{cities.length} cities found</p>
          <div className="city-grid">
            {cities.map((city) => (
              <div key={city._id} className="city-card">
                {city.image && (
                  <img src={city.image} alt={city.name} className="city-image" />
                )}
                <div className="city-card-content">
                  <h3>{city.name}</h3>
                  <p className="city-country">{city.country}</p>
                  {city.region && <p className="city-region">{city.region}</p>}
                  <div className="city-meta">
                    <span className={`cost-badge ${getCostLabel(city.costIndex).toLowerCase()}`}>
                      {getCostLabel(city.costIndex)}
                    </span>
                    <span className="cost-index">Cost: {city.costIndex}/100</span>
                  </div>
                  {city.description && (
                    <p className="city-description">{city.description.substring(0, 100)}...</p>
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

export default CitySearch;

