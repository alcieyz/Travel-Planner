import {Outlet, Link} from "react-router-dom";
import {useAuth} from '../AuthContext';
import './Layout.css';

const Layout = ({children}) => {
    const {isLoggedIn, username, contextAvatar} = useAuth();

    return (
        <>
            <nav>
                <div className="navigation-menu-container">
                    <Link className="link" title="Home" to="/">Home</Link>
                    <Link className="link" title="My Schedule" to="/MySchedule">My Schedule</Link>
                    <Link className="link" title="My Map" to="/MyMap">My Map</Link>
                    <Link className="link" title="My Budget" to="/MyBudget">My Budget</Link>
                    <Link className="link" title="My Notes" to="/MyNotes">My Notes</Link>
                    <Link className="link" title="My Suggestions" to="/MySuggestions">My Suggestions</Link>
                    <img src={contextAvatar} alt="User icon" className="avatar-icon"/>
                    {!isLoggedIn ? (
                        <Link className="link" title="Log In/Sign Up" to="/LogIn">Log In</Link>
                    ) : (
                        <Link className="link" title="Dashboard" to="/Dashboard">{username}</Link>
                    )}
                </div>
            </nav>
            <main>{children}</main>
            <Outlet />
        </>
    )
};

export default Layout;
