import {useEffect, useState} from "react";
import axios from 'axios';
import './MySuggestions.css';
import Llama from '../assets/llama-free.jpg';
import {useAuth} from "../AuthContext";
import SideMenu from '../components/SideMenu';

const MySuggestions = () => {
    const {isLoggedIn} = useAuth();
    const [destination, setDestination] = useState('');
    const [details,setDetails] = useState('');
    const [suggestions, setSuggestions] = useState(localStorage.getItem('suggestions'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isLoggedIn) {
            fetchSuggestions();
        }
    }, [isLoggedIn]);

    const fetchSuggestions = () => {
        setSuggestions(localStorage.getItem('suggestions'));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!destination) {
            setError('Please enter a destination');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/travel-suggestions', {
                destination,
                details,
              });
              localStorage.setItem('suggestions', response.data.suggestions);
              fetchSuggestions();
        } catch (err) {
            setError('Failed to fetch travel suggestions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderSuggestions = (text) => {
        return text.split('\n').map((line, index) => {
            if (line.endsWith(':')) {
                return <h3 key={index}>{renderBoldText(line)}</h3>;
            } else if (line.startsWith('- ')) {
                return <li key={index}>{renderBoldText(line.slice(2))}</li>;
            } else {
                return <p key={index}>{renderBoldText(line)}</p>;
            }
        });
    };

    const renderBoldText = (text) => {
        const parts = text.split('**'); // Split text by double asterisks
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return <strong key={index}>{part}</strong>; // Render odd-indexed segments as bold
            } else {
                return part; // Render even-indexed segments as plain text
            }
        });
    };

    return (
        <div className="page-container">
            <SideMenu/>
            <div className="suggestions-content">
                <div className="page-title">
                    <h1>My Travel Suggestions</h1>
                </div>
                {/* <img src={Llama} className="llama" alt="Llama"/> */}
                <p>Hi, I'm Mr. Llama. I'm here to help!<br></br>Enter any destination for attraction, food, and lodging suggestions!</p>
                <form className='suggestions-form' onSubmit={handleSubmit}>
                    <input className='suggestions-search-bar' type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Enter a destination"/>
                    <input className='suggestions-search-bar' value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Enter any details/ specifications"/>
                    <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Get Suggestions'}
                    </button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {suggestions && (
                    <div className="suggestions-container">
                        <h2>Mr Llama's Suggestions 🦙</h2>
                        <ul>{renderSuggestions(suggestions)}</ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MySuggestions;