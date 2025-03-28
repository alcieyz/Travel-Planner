import React, {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {useAuth} from '../AuthContext';
import './Dashboard.css';
import SideMenu from '../components/SideMenu';
import ScheduleImage from '../assets/schedule_image.png';
import MapImage from '../assets/map_image.png';
import BudgetImage from '../assets/budget_image.png';
import NotesImage from '../assets/notes_image.png';
import SuggestionsImage from '../assets/suggestions_image.png';
import { HiOutlineArrowRight } from "react-icons/hi";

const Dashboard = () => {
    const {username, contextName} = useAuth();

    const trips = [
        {
          id: 1,
          name: "China 2025",
          image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b",
          date: "Jun 1-15, 2025",
          daysLeft: 12,
          budget: { spent: 1200, total: 2500 }
        },
        {
            id: 2,
            name: "Japan 2025",
            image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b",
            date: "Jul 1-15, 2025",
            daysLeft: 43,
            budget: { spent: 1500, total: 3000 }
          },
    ];


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    return (
        <div className="page-container">
            <div className="dashboard-content">
                {(contextName !== null) ? <h1>Welcome to Travel Planner, {contextName}</h1> : <h1>Welcome to Travel Planner, {username}</h1>}
                <h2>Recommended</h2>
                <h3>Quick Stats</h3>
                <p className="text-gray-600 mt-2">
                    You have {trips.length} upcoming trips | ${trips.reduce((sum, trip) => sum + trip.budget.total, 0)} planned spending
                </p>
                <h3>My Trips</h3>
                <a href="/MyTrips" className="text-blue-600 hover:underline">View All</a>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trips.map(trip => (
                    <TripCard key={trip.id} trip={trip} />
                    ))}
                </div>
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

function TripCard({ trip }) {
    const progress = (trip.budget.spent / trip.budget.total) * 100;
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* <img 
          src={trip.image} 
          alt={trip.name} 
          className="w-full h-32 object-cover"
        /> */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{trip.name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <span className="mr-2">🗓️</span>
            <span>{trip.date}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-3">
            <span className="mr-2">⏳</span>
            <span>{trip.daysLeft} days to go</span>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>${trip.budget.spent} spent</span>
              <span>${trip.budget.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            View Trip
          </button>
        </div>
      </div>
    );
  }

export default Dashboard;