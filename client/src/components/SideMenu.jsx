import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../AuthContext';
import menu_icon from '../assets/TP_menu_icon_small.png';
import './SideMenu.css';
import { HiOutlineMenu } from "react-icons/hi";

const SideMenu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const {isLoggedIn, logOut} = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/LogIn');
        }
    }, [isLoggedIn, navigate]);
    
    const handleLogout = () => {
        logOut();
        alert('You have been logged out.');
        navigate('/LogIn');
    };

    return (
        <div className="side-menu-container">
            <button className="show-menu-btn" onClick={() => setShowMenu(!showMenu)}>
                <HiOutlineMenu size={30}/>
            </button>

            <div className={`side-menu ${showMenu ? 'visible' : ''}`}>
                <h2>Travel Planner</h2>
                <h3>Menu</h3>
                <ul>
                    <li><Link title="Dashboard" to="/Dashboard">Dashboard</Link></li>
                    <li><Link title="My Schedule" to="/MySchedule">My Schedule</Link></li>
                    <li><Link title="My Map" to="/MyMap">My Map</Link></li>
                    <li><Link title="My Budget" to="/MyBudget">My Budget</Link></li>
                    <li><Link title="My Notes" to="/MyNotes">My Notes</Link></li>
                    <li><Link title="My Suggestions" to="/MySuggestions">My Suggestions</Link></li>
                    <br/>
                    <div style={{borderTop:'1px solid #fff', marginLeft: 30, marginRight: 30}}></div>
                    <li><Link to="/Profile">Profile</Link></li>
                    <li><Link to="/Settings">Settings</Link></li>
                    <li><button className="log-out" onClick={handleLogout}>Log Out</button></li>
                </ul>
            </div>
        </div>
    );
};


export default SideMenu;