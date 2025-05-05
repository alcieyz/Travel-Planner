import React, {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {useAuth} from '../AuthContext';
import './Dashboard.css';
import ScheduleImage from '../assets/schedule_image.png';
import MapImage from '../assets/map_image.png';
import BudgetImage from '../assets/budget_image.png';
import NotesImage from '../assets/notes_image.png';
import SuggestionsImage from '../assets/suggestions_image.png';
import { HiOutlineArrowRight } from "react-icons/hi";
import TripCard from '../components/TripCard';

const Dashboard = () => {
    const {username, isLoggedIn, contextName, currentTrip} = useAuth();
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (isLoggedIn && username) {
            fetchTrips();
        }
    }, [isLoggedIn, username, currentTrip]);

    const fetchTrips = async () => {
        try {
            const response = await fetch(`http://localhost:5000/MyTrips?username=${username}`);
            if (!response.ok) {
                throw new Error("Failed to fetch trips");
            }
            const data = await response.json();
            setTrips(data);
        }
        catch (error) {
            console.error("Error fetching trips:", error.message);
        }
    };

    const upcomingTrips = trips
        .filter(trip => new Date(trip.end) >= new Date())
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, 3); // Show only 3 closest trips
    
    return (
        <div className="page-container">
            <div className="dashboard-content">
                {(contextName !== null) ? <h1>Welcome to Travel Planner, {contextName}</h1> : <h1>Welcome to Travel Planner, {username}</h1>}
                <h2>Recommended</h2>
                <h3>Upcoming Trips</h3>
                <p>You have {trips.length} upcoming trips</p>
                <br></br>
                {upcomingTrips.length > 0 ? (
                    <div className="tools-grid">
                        {upcomingTrips.map((trip) => (
                            <TripCard 
                                key={trip.id} 
                                trip={trip}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="no-trips-message">No upcoming trips planned</p>
                )}
                <br></br>
                <a href="/MyTrips"><button>View All </button></a>
                <h3>Tools</h3>
                <div className='tools-grid'> 
                    <div className='tools-item'>
                        <img src={ScheduleImage} alt='My Schedule'/>
                        <h3>My Schedule</h3>
                        <p>Plan and organize your trip activities and details in an event calendar!</p>
                        <a href="/MySchedule"><button className='go-btn'>Go <HiOutlineArrowRight/> </button></a>
                    </div>
                    <div className='tools-item'>
                        <img src={MapImage} alt='My Map'/>
                        <h3>My Map</h3>
                        <p>View and mark your trip destinations and stops on the world map!</p>
                        <a href="/MyMap"><button className='go-btn'>Go <HiOutlineArrowRight/></button></a>
                    </div>
                    <div className='tools-item'>
                        <img src={BudgetImage} alt='My Budget'/>
                        <h3>My Budget</h3>
                        <p>Add travel expenses and track your total spendings!</p>
                        <a href="/MyBudget"><button className='go-btn'>Go <HiOutlineArrowRight/></button></a>
                    </div>
                    <div className='tools-item'>
                        <img src={NotesImage} alt='My Notes'/>
                        <h3>My Notes</h3>
                        <p>Add personal travel notes and brainstorming ideas here so you don't forget!</p>
                        <a href="/MyNotes"><button className='go-btn'>Go <HiOutlineArrowRight/></button></a>
                    </div>
                    <div className='tools-item'>
                        <img src={SuggestionsImage} alt='My Suggestions'/>
                        <h3>My Suggestions</h3>
                        <p>Ask Lily the Llama for travel suggestions customized for your trip!</p>
                        <a href="/MySuggestions"><button className='go-btn'>Go <HiOutlineArrowRight/></button></a>
                    </div>
                </div>

                <Outlet/>
            </div>
        </div>
    )
}

/* function TripCard({ trip }) {
    const progress = (trip.budget.spent / trip.budget.total) * 100;
    
    return (
      <div className='tools-item'>
        <img 
          src={trip.image} 
          alt={trip.name}
        />
        <h3>{trip.name}</h3>
        <p>🗓️ {trip.date}</p>
        <p>⏳ {trip.daysLeft} days to go</p>
        <p>${trip.budget.spent} / ${trip.budget.total} spent</p>
        <div className="progress-container">
          <div style={{background: "rgb(115, 255, 153)", width: `${progress}%`, height: "100%", borderRadius: "10px"}}></div>
        </div>
        <button className='go-btn'>View Trip <HiOutlineArrowRight/></button>
      </div>
    );
  }
 */
export default Dashboard;