import React, {useState, useEffect, useRef} from 'react';
import {Outlet, useNavigate, NavLink, useLocation} from "react-router-dom";
import {useAuth} from '../AuthContext';
import { HiOutlineMenu, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import './Layout.css';

const Layout = ({children}) => {
    const {isLoggedIn, username, contextAvatar, logOut} = useAuth();
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const [isResizing, setIsResizing] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const isHomePage = location.pathname === '/';
    const showSidebar = isLoggedIn && !isHomePage;

    const startResizing = () => {
        setIsResizing(true);
    };

    const stopResizing = () => {
        setIsResizing(false);
    };

    const resize = (e) => {
        if (isResizing) {
            const newWidth = e.clientX;
            if (newWidth >= 150 && newWidth <= 400) {
                setSidebarWidth(newWidth);
            }
        }
    };

    /* useEffect(() => {
        if (!isLoggedIn) {
            navigate('/LogIn');
        }
    }, [isLoggedIn, navigate]); */

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        const confirmLogOut = window.confirm("Are you sure you want to log out?");
        if (!confirmLogOut) {
            return;
        }
        logOut();
        alert('You have been logged out.');
        navigate('/LogIn');
    };

    return (
        <div className="app-container">
            {isLoggedIn && (
                <div 
                    className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
                    ref={sidebarRef}
                    style={{ width: isCollapsed ? '70px' : `${sidebarWidth}px` }}
                >
                    <div className="sidebar-header">
                        <div className="header-top-row">
                            {isCollapsed ? (
                            <div className="user-icon-collapsed">
                                {/* <img src={contextAvatar} alt="User" className="user-avatar" /> */}
                            </div>
                            ) : (
                            <div className="user-info-expanded">
                                <img src={contextAvatar} alt="User" className="user-avatar" />
                                <div className="user-name-wrapper">
                                    <span className="user-name">{username}</span>
                                </div>
                            </div>
                            )}
                            <button 
                            className="toggle-btn" 
                            onClick={toggleSidebar}
                            title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
                            >
                            {isCollapsed ? <HiOutlineChevronRight size={24} /> : <HiOutlineChevronLeft size={24} />}
                            </button>
                        </div>
                        <div className="header-title">
                            <a href="/" title="Home"><h2>{isCollapsed ? 'TP' : 'Travel Planner'}</h2></a>
                            {!isCollapsed && <h3>Menu</h3>}
                        </div>
                    </div>
                    
                    <ul className="sidebar-menu">
                        <li>
                            <NavLink 
                                to="/Dashboard" 
                                title="Dashboard"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                {isCollapsed ? '📊' : 'Dashboard'}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/MySchedule" 
                                title="My Schedule"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                {isCollapsed ? '📅' : 'My Schedule'}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/MyMap" 
                                title="My Map"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                {isCollapsed ? '🗺️' : 'My Map'}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/MyBudget" 
                                title="My Budget"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                {isCollapsed ? '💰' : 'My Budget'}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/MyNotes" 
                                title="My Notes"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                {isCollapsed ? '📝' : 'My Notes'}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/MySuggestions" 
                                title="My Suggestions"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                {isCollapsed ? '🦙' : 'My Suggestions'}
                            </NavLink>
                        </li>
                        
                        {!isCollapsed && <div className="menu-divider"></div>}
                        
                        <li>
                            <NavLink 
                                to="/Profile" 
                                title="Profile"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                {isCollapsed ? '👤' : 'Profile'}
                                {/* {!isCollapsed && <span className="username">{username}</span>} */}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/Settings" 
                                title="Settings"
                                className={({ isActive }) => isActive ? "active-link" : ""}
                            >
                                {isCollapsed ? '⚙️' : 'Settings'}
                            </NavLink>
                        </li>
                        <li>
                            <button 
                                className="logout-btn" 
                                onClick={handleLogout}
                                title={isCollapsed ? "Log Out" : undefined}
                            >
                                {isCollapsed ? '🚪' : 'Log Out'}
                            </button>
                        </li>
                    </ul>

                    <div className="sidebar-footer">
                        
                    </div>

                    {!isCollapsed && (
                        <div 
                            className="sidebar-resizer" 
                            onMouseDown={startResizing}
                        />
                    )}
                </div>
            )}

            <div className='main-content-container'>
                <main 
                    className="main-content"
                    style={{
                        marginLeft: isLoggedIn ? (isCollapsed ? '60px' : `calc(${sidebarWidth}px + 30px)`) : '0',
                        transition: 'margin-left 0.3s ease'
                    }}
                >
                    {children}
                    <Outlet />
                </main>
            </div>
            {/* <div className="app-container">
            <nav>
                <div className="navigation-menu-container">
                    <div className="logo-container">
                        <h2>Travel Planner</h2>
                    </div>
                    <div className="navigation-menu">
                        <Link className="link" title="Home" to="/">Home</Link>
                        <img src={contextAvatar} alt="User icon" className="avatar-icon"/>
                        {!isLoggedIn ? (
                            <Link className="link" title="Log In/Sign Up" to="/LogIn">Log In</Link>
                        ) : (
                            <Link className="link" title="Dashboard" to="/Dashboard">{username}</Link>
                        )}
                    </div>
                </div>
            </nav>

            <div className="content-wrapper">
                {isLoggedIn && <SideMenu/>}
                
                <main 
                    className="main-content-area"
                    style={{
                        marginLeft: isLoggedIn && isExpanded ? `${sidebarWidth}px` : isLoggedIn ? '70px' : '0',
                        width: isLoggedIn && isExpanded ? `calc(100% - ${sidebarWidth}px)` : isLoggedIn ? 'calc(100% - 70px)' : '100%'
                    }}
                >
                    {children}
                    <Outlet />
                </main>
            </div>
        </div> */}

        </div>
    );
};

export default Layout;
