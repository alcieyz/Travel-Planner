import {Outlet, Link} from "react-router-dom";
import {useAuth} from '../AuthContext';
import './Layout.css';
import user_icon from '../assets/TP_person_icon_small.png'

const Layout = ({children}) => {
    const {isLoggedIn, username} = useAuth();

    return (
        <>
            <nav>
                <div className="navigation-menu-container">
                    <Link className="link" title="Home" to="/">Home</Link>
                    &emsp;
                    <Link className="link" title="My Schedule" to="/MySchedule">My Schedule</Link>
                    &emsp;
                    <Link className="link" title="My Notes" to="/MyNotes">My Notes</Link>
                    &emsp;
                    <img src={user_icon} alt="User icon"/>
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
