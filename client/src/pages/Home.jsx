import {useAuth} from '../AuthContext';
import {useEffect} from 'react';
import './Home.css';
import AboutImage from '../assets/about_image_small.png'
import Slider from '../components/Slider';
import { HiOutlineArrowRight } from "react-icons/hi";
import CatPlane from '../assets/cat_plane.png';
import NavBar from '../components/NavBar';

const Home = () => {

    const {isLoggedIn} = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='home-page'>
            <NavBar/>
            <section className="hero-section">
                <div className='hero-content'>
                    <h1>Plan your perfect trip!</h1>
                    <p></p>
                    <a href={isLoggedIn ? "/Dashboard" : "/LogIn"} className="cta-btn">Start Your Adventure {/* <HiOutlineArrowRight/> */}</a>
                </div>
            </section>
            <section className="about-section">
                <div className='about-content'>
                    <div className='about-img'>
                        <img src={AboutImage} alt="Travel Image"/>
                    </div>
                    <div className='about-text'>
                        <h2>Your simple and easy travel planner, perfect for any trip!</h2>
                        <p>Have you ever thought that blah blah rhetorical question? We thought so too! That's why we created the travel planner pro that offers a variety of helpful tools to help make your travel planning a smooth, fun, and successful experience! blah blah nice description promotional blah blah ~~~</p>
                    </div>
                </div>
            </section>
            <section className="offerings-section">
                <div className='offerings-content'>
                    <h2>What We Offer</h2> 
                    <Slider/>
                </div>
            </section>
            <section className="footer-section">
                <div className='footer-content'>
                    <p>Home</p>
                    <p>About</p>
                    <p>Help Center</p>
                    <p>Contact Us</p>
                </div>
                <div className='logo'>
                    <h2>Travel Planner</h2>
                </div>
            </section>
        </div>
    );
};

export default Home;