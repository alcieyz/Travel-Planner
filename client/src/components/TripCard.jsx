import React from 'react';
import { HiOutlineArrowRight } from "react-icons/hi";
import {useAuth} from '../AuthContext';
import './TripCard.css'

const TripCard = ({ trip, onClick }) => {
  const {currentTrip, setCurrentTrip} = useAuth();
  const isSelected = currentTrip?.id === trip.id;

  // Calculate days until

  const handleSelectTrip = (e) => {
    e.stopPropagation();
    
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