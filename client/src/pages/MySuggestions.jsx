import {useState, useEffect} from "react";
import axios from 'axios';
import './MySuggestions.css';
import Llama from '../assets/llama-free.jpg';
import {useAuth} from "../AuthContext";

const MySuggestions = () => {
    const [destination, setDestination] = useState('');
    const [suggestions, setSuggestions] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
              });
              setSuggestions(response.data.suggestions);
        } catch (err) {
            setError('Failed to fetch travel suggestions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderSuggestions = (text) => {
        return text.split('\n').map((line, index) => {
            if (line.endsWith(':')) {
                return <h3 key={index}>{line}</h3>; // Render as heading
            } else if (line.startsWith('- ')) {
                return <li key={index}>{line.slice(2)}</li>; // Render as list item
            } else {
                return <p key={index}>{line}</p>; // Render as paragraph
            }
        });
    };

    return (
        <div className="page-container">
            <h1>My Travel Suggestions</h1>
            <h6>Your suggestions</h6>
            <img src={Llama} className="llama" alt="Llama"/>
            <br></br>
            <form onSubmit={handleSubmit}>
                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Enter a destination"/>
                <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Get Suggestions'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {suggestions && (
                <div className="suggestions-container">
                    <h2>Suggestions for {destination}:</h2>
                    <ul>{renderSuggestions(suggestions)}</ul>
                </div>
            )}
        </div>
    );
};

export default MySuggestions;