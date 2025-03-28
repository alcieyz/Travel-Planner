import React, { useEffect, useState, useRef } from 'react';
import {useNavigate, NavLink} from 'react-router-dom';
import {useAuth} from '../AuthContext';
import menu_icon from '../assets/TP_menu_icon_small.png';
import './SideMenu.css';
import { HiOutlineMenu, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const SideMenu = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const {isLoggedIn, logOut} = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/LogIn');
        }
    }, [isLoggedIn, navigate]);

    const startResizing = (e) => {
        e.preventDefault();
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
    };

    const resize = (e) => {
        if (sidebarRef.current) {
            const newWidth = e.clientX;
            // Constrain between min and max widths
            const constrainedWidth = Math.max(200, Math.min(newWidth, 400));
            setSidebarWidth(constrainedWidth);
        }
    };

    const stopResizing = () => {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResizing);
    };
    
    const handleLogout = () => {
        logOut();
        alert('You have been logged out.');
        navigate('/LogIn');
    };

    return (
        <div ref={sidebarRef} className={`side-menu-container ${isExpanded ? 'expanded' : 'collapsed'}`} style={{ width: isExpanded ? `${sidebarWidth}px` : '70px' }}>

            <div className="side-menu-content">
                <h2>{isExpanded ? 'Travel Planner' : 'TP'}</h2>
                {isExpanded && <h3>Menu</h3>}
                <ul>
                    <li><NavLink title="Dashboard" to="/Dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>{isExpanded ? 'Dashboard' : '📊'}</NavLink></li>
                    <li><NavLink title="My Schedule" to="/MySchedule" className={({ isActive }) => isActive ? "active-link" : ""}>{isExpanded ? 'My Schedule' : '📅'}</NavLink></li>
                    <li><NavLink title="My Map" to="/MyMap" className={({ isActive }) => isActive ? "active-link" : ""}>{isExpanded ? 'My Map' : '🗺️'}</NavLink></li>
                    <li><NavLink title="My Budget" to="/MyBudget" className={({ isActive }) => isActive ? "active-link" : ""}>{isExpanded ? 'My Budget' : '💰'}</NavLink></li>
                    <li><NavLink title="My Notes" to="/MyNotes" className={({ isActive }) => isActive ? "active-link" : ""}>{isExpanded ? 'My Notes' : '📝'}</NavLink></li>
                    <li><NavLink title="My Suggestions" to="/MySuggestions" className={({ isActive }) => isActive ? "active-link" : ""}>{isExpanded ? 'My Suggestions' : '🦙'}</NavLink></li>
                    {isExpanded && (
                        <>
                            <div style={{borderTop:'1px solid #fff'}}></div>
                        </>
                    )}
                    <li><NavLink to="/Profile" className={({ isActive }) => isActive ? "active-link" : ""}>{isExpanded ? 'Profile' : '👤'}</NavLink></li>
                    <li><NavLink to="/Settings" className={({ isActive }) => isActive ? "active-link" : ""}>{isExpanded ? 'Settings' : '⚙️'}</NavLink></li>
                    <li><button className="log-out" onClick={handleLogout} title={!isExpanded ? "Log Out" : undefined}>{isExpanded ? 'Log Out' : '🚪'}</button></li>
                </ul>
            </div>

            <button className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <HiOutlineChevronLeft size={24} /> : <HiOutlineChevronRight size={24} />}
            </button>

            {isExpanded && (
                <div 
                    className="resize-handle"
                    onMouseDown={startResizing}
                />
            )}
        </div>
    );
};


export default SideMenu;