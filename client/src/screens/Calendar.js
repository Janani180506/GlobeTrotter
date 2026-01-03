import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const CalendarView = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  if (loading) {
    return <div className="loading">Loading calendar...</div>;
  }

  if (!trip) {
    return <div className="container">Trip not found</div>;
  }

  const getActivitiesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const activities = [];

    trip.stops?.forEach((stop) => {
      stop.activities?.forEach((act) => {
        const actDate = new Date(act.date).toISOString().split('T')[0];
        if (actDate === dateStr) {
          activities.push({
            ...act,
            city: stop.city?.name,
          });
        }
      });
    });

    return activities;
  };

  const getStopsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return trip.stops?.filter((stop) => {
      const arrival = new Date(stop.arrivalDate).toISOString().split('T')[0];
      const departure = new Date(stop.departureDate).toISOString().split('T')[0];
      return dateStr >= arrival && dateStr <= departure;
    }) || [];
  };

  const selectedDateActivities = getActivitiesForDate(selectedDate);
  const selectedDateStops = getStopsForDate(selectedDate);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const activities = getActivitiesForDate(date);
      if (activities.length > 0) {
        return <div className="calendar-activity-dot" />;
      }
    }
    return null;
  };

  return (
    <div className="container">
      <h1>{trip.name} - Calendar View</h1>

      <div className="calendar-container">
        <div className="calendar-wrapper">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={new Date(trip.startDate)}
            maxDate={new Date(trip.endDate)}
            tileContent={tileContent}
          />
        </div>

        <div className="calendar-details">
          <h2>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>

          {selectedDateStops.length > 0 && (
            <div className="day-stops">
              <h3>Current Location</h3>
              {selectedDateStops.map((stop) => (
                <div key={stop._id} className="stop-info">
                  <strong>{stop.city?.name || 'Unknown City'}</strong>
                  <p>{stop.city?.country}</p>
                </div>
              ))}
            </div>
          )}

          {selectedDateActivities.length > 0 ? (
            <div className="day-activities">
              <h3>Activities</h3>
              {selectedDateActivities.map((act, index) => (
                <div key={index} className="activity-item">
                  <h4>{act.activity?.name || 'Unknown Activity'}</h4>
                  <p className="activity-city">📍 {act.city}</p>
                  {act.time && <p>🕐 {act.time}</p>}
                  {act.cost > 0 && <p>💰 ${act.cost}</p>}
                  {act.notes && <p>{act.notes}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-activities">
              <p>No activities scheduled for this day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

