import {useAuth} from '../AuthContext';
import './Home.css';
import CatTravel from '../assets/CatTravel.jpg';

const Home = () => {

    const {isLoggedIn} = useAuth();

    return (
        <div className="page-container">
            <h1>Travel Planner</h1>
            <h6><i>Your simple and easy travel planner perfect for any trip!</i></h6>
            <img src={CatTravel} className="cat_travel" alt="Cat Travel"/><br></br>
            <a href={isLoggedIn ? "/MySchedule" : "/SignUp"}><button>Start Your Adventure</button></a>
            <p>perhaps a nice lovely description about the features of our website can go here ~</p>
        </div>
    )
}

export default Home;