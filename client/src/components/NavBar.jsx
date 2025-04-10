import { Link } from "react-router-dom";
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/">Travel Planner</Link>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
      <div className="navbar-right">
        <Link to="/LogIn" className="navbar-btn subtle-btn">Log in</Link>
        <Link to="/SignUp" className="navbar-btn solid-btn">Get Started</Link>
      </div>
    </nav>
  );
};

export default NavBar;