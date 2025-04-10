import React from 'react';
import { HiOutlineArrowRight } from "react-icons/hi";
import {useAuth} from '../AuthContext';
import './TripCard.css'

const TripCard = ({ trip, onClick }) => {
  const {currentTrip, setCurrentTrip} = useAuth();
  const isSelected = currentTrip?.id === trip.id;
  // Calculate days left (assuming trip.end is a date string)
  const endDate = new Date(trip.end);
  const today = new Date();
  const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
  
  // Calculate budget progress (with fallbacks if budget data doesn't exist)
  const spent = trip.budget?.spent || 0;
  const total = trip.budget?.total || 1; // Avoid division by zero
  const progress = Math.min(100, (spent / total) * 100);
  
  // Format date
  const formattedDate = new Date(trip.start).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleSelectTrip = (e) => {
    e.stopPropagation();
    
    // Skip confirmation if no trip selected or selecting the same trip
    if (!currentTrip || currentTrip.id === trip.id) {
      setCurrentTrip(trip);
      return;
    }
    
    if (window.confirm("Are you sure you want to change the selected trip?")) {
      setCurrentTrip(trip);
    }
  };

  return (
    <div className='tools-item' onClick={onClick}>
        <h3>{trip.name}</h3>
        <p>{trip.description}</p>
        <p>Start: {trip.start}</p>
        <p>End: {trip.end}</p>
      {/* <img 
        src={trip.image || '/default-trip-image.jpg'} 
        alt={trip.name}
        className="trip-image"
      />
      <h3>{trip.name}</h3>
      <p>🗓️ {formattedDate}</p>
      <p>⏳ {daysLeft > 0 ? `${daysLeft} days to go` : "Trip completed"}</p>
      <p>${spent.toLocaleString()} / ${total.toLocaleString()} spent</p>
      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{
            width: `${progress}%`,
            backgroundColor: progress > 80 ? '#ff6b6b' : '#73ff99'
          }}
        ></div>
      </div> */}
      <button onClick={handleSelectTrip} className={`select-trip-btn ${isSelected ? 'active' : ''}`}>
        {isSelected ? (
          <>
            Selected
          </>
        ) : (
          <>
            Select Trip
          </>
        )}
      </button>
    </div>
  );
};

export default TripCard;