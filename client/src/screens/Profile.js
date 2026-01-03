import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    language: 'en',
  });
  const [savedDestinations, setSavedDestinations] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/users/profile');
      setProfile(res.data.data);
      setFormData({
        name: res.data.data.name,
        photo: res.data.data.photo || '',
        language: res.data.data.language || 'en',
      });
      setSavedDestinations(res.data.data.savedDestinations || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/profile', formData);
      await fetchProfile();
      setEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await axios.delete('/api/users/account');
        alert('Account deleted. Redirecting to login...');
        window.location.href = '/login';
      } catch (error) {
        alert('Failed to delete account');
      }
    }
  };

  const handleRemoveDestination = async (cityId) => {
    try {
      await axios.delete(`/api/users/saved-destinations/${cityId}`);
      setSavedDestinations(savedDestinations.filter((dest) => dest._id !== cityId));
    } catch (error) {
      alert('Failed to remove destination');
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="container">
      <h1>Profile & Settings</h1>

      <div className="profile-section">
        <div className="profile-card">
          <h2>Profile Information</h2>
          {!editing ? (
            <div className="profile-view">
              {profile?.photo && (
                <img src={profile.photo} alt="Profile" className="profile-photo" />
              )}
              <div className="profile-info">
                <p><strong>Name:</strong> {profile?.name}</p>
                <p><strong>Email:</strong> {profile?.email}</p>
                <p><strong>Language:</strong> {profile?.language || 'en'}</p>
              </div>
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Photo URL</label>
                <input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="form-group">
                <label>Language</label>
                <select name="language" value={formData.language} onChange={handleChange}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-card">
          <h2>Saved Destinations</h2>
          {savedDestinations.length === 0 ? (
            <p>No saved destinations yet</p>
          ) : (
            <div className="destinations-list">
              {savedDestinations.map((dest) => (
                <div key={dest._id} className="destination-item">
                  <div>
                    <h4>{dest.name}</h4>
                    <p>{dest.country}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveDestination(dest._id)}
                    className="btn btn-danger"
                    style={{ fontSize: '12px', padding: '5px 10px' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile-card danger-zone">
          <h2>Danger Zone</h2>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button onClick={handleDeleteAccount} className="btn btn-danger">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

