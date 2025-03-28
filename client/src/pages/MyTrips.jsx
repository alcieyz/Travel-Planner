import React, {useState, useEffect} from 'react';
import {useAuth} from '../AuthContext';
import './MyTrips.css';
import SideMenu from '../components/SideMenu';

const MyTrips = () => {
    const {username, isLoggedIn} = useAuth();
    const [trips, setTrips] = useState([]);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    /* const [color, setColor] = useState('#FF0000'); */
    const [error, setError] = useState('');
    
    
    return (
        <div className='page-container'>
            <div className='dashboard-content'>
                <div className='page-header'>
                    <p>Dashboard {'>'} Current Selected Trip</p>
                </div>
                <h2>Current Selected Trip</h2>
                <div className="trip-form-container">
                    <h2>{isEditing ? 'Edit Trip' : 'Add Trip'}</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form /* onSubmit={handleSubmit} */>
                        <label>Trip Name:</label>
                        <input className="trip-input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        <br />
                        <label>Description:</label>
                        <textarea className="trip-input" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <br />
                        <label>Start:</label>
                        <input className="trip-input" type="date" value={start} onChange={(e) => setStart(e.target.value)} required />
                        <br />
                        <label>End:</label>
                        <input className="trip-input" type="date" value={end} onChange={(e) => setEnd(e.target.value)} required />
                        <br />
                        {/* <label>Color:</label>
                        <select className="trip-input" value={color} onChange={(e) => setColor(e.target.value)}>
                            <option value="#FF0000">Red</option>
                            <option value="#00FF00">Green</option>
                            <option value="#0000FF">Blue</option>
                            <option value="#FFFF00">Yellow</option>
                            <option value="#FF00FF">Magenta</option>
                            <option value="#00FFFF">Cyan</option>
                        </select>
                        <br /> */}
                        <div className="trip-submit-container">
                            <button className="trip-submit-btns" type="submit">Save</button>
                            <button className="trip-submit-btns" type="button" /* onClick={onClose} */>Cancel</button>
                            {isEditing && (
                                <button className="trip-submit-btns delete-btn" type="button" /* onClick={handleDelete} */>
                                    Delete
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                
            </div>
        </div>
    )
}

export default MyTrips;