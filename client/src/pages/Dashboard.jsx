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
        { id: 1, name: "China 2025", date: "Jun 1-15, 2025", daysLeft: 12, budget: "1,200 / 2,500", image: "china.jpg" },
        { id: 2, name: "Italy Summer", date: "Jul 10-20, 2025", daysLeft: 42, budget: "800 / 3,000", image: "italy.jpg" },
    ];

    const tools = [
        { name: "My Schedule", icon: "📅", desc: "Plan your itinerary day by day" },
        { name: "My Map", icon: "🗺️", desc: "View destinations on a map" },
        { name: "My Budget", icon: "💰", desc: "Track expenses and savings" },
        { name: "My Notes", icon: "📝", desc: "Write travel notes and ideas" },
        { name: "My Suggestions", icon: "🤖", desc: "Get AI-powered recommendations" },
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
                <p>You have 3 upcoming trips</p>
                <h3>My Trips</h3>

                
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

export default Dashboard;