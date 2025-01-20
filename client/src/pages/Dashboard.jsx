import React, {useEffect, useState} from 'react';
import {Outlet, Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../AuthContext';
import './Dashboard.css';
import menu_icon from '../assets/TP_menu_icon_small.png';

const Dashboard = () => {
    const navigate = useNavigate();
    const {isLoggedIn, username, contextName, logOut} = useAuth();
    const [showMenu, setShowMenu] = useState(false);

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
        <div className="page-container">
            <div className="dashboard-container">
                <button className="show-menu-btn" onClick={() => setShowMenu(!showMenu)}>
                    <img src={menu_icon} alt="Menu icon"></img>
                </button>

                <div className={`side-menu ${showMenu ? 'visible' : ''}`}>
                    <h3>Menu</h3>
                    <ul>
                        <li><Link to="/Dashboard/Profile">Profile</Link></li>
                        <li><Link to="/Dashboard/Settings">Settings</Link></li>
                        <li><button className="log-out" onClick={handleLogout}>Log Out</button></li>
                    </ul>
                </div>

                <div className="main-content">
                    {(contextName !== null) ? <h1>{contextName}'s Account</h1> : <h1>{username}'s Account</h1>}
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;