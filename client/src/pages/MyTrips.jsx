import React, {useState, useEffect} from 'react';
import {useAuth} from '../AuthContext';
import './MyTrips.css';
import TripCard from '../components/TripCard';
import TripFormModal from '../components/TripFormModal';

const MyTrips = () => {
    const {username, isLoggedIn} = useAuth();
    const [trips, setTrips] = useState([]);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    const [selectedTrip, setSelectedTrip] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(() => {
        if (isLoggedIn && username) {
            fetchTrips();
        }
    }, [isLoggedIn, username]);

    const fetchTrips = async () => {
        try {
            const response = await fetch(`http://localhost:5000/MyTrips?username=${username}`);
            if (!response.ok) {
                throw new Error("Failed to fetch trips");
            }
            const data = await response.json();
            setTrips(data);
        }
        catch (error) {
            console.error("Error fetching trips:", error.message);
        }
    };

    const handleTripClick = (trip) => {
        setSelectedTrip(trip);
        setName(trip.name);
        setDescription(trip.description);
        setStart(trip.start);
        setEnd(trip.end);
        setIsModalOpen(true);
    };

    const handleAddTrip = async (e) => {
        e.preventDefault();

        if (new Date(end) < new Date(start)) {
            alert('End date cannot be before start date');
            return;
        }

        try {
            const newTrip = {name, description, start, end, username};
            const response = await fetch("http://localhost:5000/MyTrips", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newTrip),
            });
            if (!response.ok) {
                throw new Error('Failed to add trip');
            }
            fetchTrips();
            resetForm();
            setIsModalOpen(false);
        }
        catch (error) {
            console.error("Error adding trip:", error.message);
        }
    };

    const handleUpdateTrip = async (e) => {
        e.preventDefault();

        if (new Date(end) < new Date(start)) {
            alert('End date cannot be before start date');
            return;
        }

        if (!selectedTrip) {
            return;
        }

        try {
            const updatedTrip = {id: selectedTrip.id, name, description, start, end, username};
            const response = await fetch("http://localhost:5000/MyTrips", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(updatedTrip),
            });
            if (!response.ok) {
                throw new Error("Failed to updated trip");
            }
            fetchTrips();
            resetForm();
            setIsModalOpen(false);
        }
        catch (error) {
            console.error("Error updating trip:", error.message);
            alert(error.message);
        }
    };

    const deleteTrip = async (event, tripId) => {
        event.stopPropagation();
        const confirmDeleteTrip = window.confirm("Are you sure you want to delete this trip?");
        if (!confirmDeleteTrip) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/MyTrips/${tripId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete trip");
            }
            fetchTrips();
            resetForm();
            alert("Trip deleted successfully")
        }
        catch (error) {
            console.error("Error deleting trip:", error.message);
            alert(error.message);
        }
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setStart("");
        setEnd("");
        setSelectedTrip(null);
    }

    const openAddTripModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    return (
        <div className='page-container'>
            <div className='dashboard-content'>
                <div className='page-header'>
                    <p><a href="/Dashboard">Dashboard</a> {'>'} My Trips</p>
                </div>
                <h2>Current Selected Trip</h2>
                <div className="add-btn">
                    <button className='add-trip-btn' onClick={openAddTripModal}>
                        + Add Trip
                    </button>
                </div>

                <h2>My Trips</h2>
                    <div className="tools-grid">
                        {trips.map((trip) => (
                            <TripCard 
                            key={trip.id} 
                            trip={{
                                ...trip,
                                /* budget: trip.budget || { spent: 0, total: 0 }, // Add default budget if missing
                                image: trip.image || '/default-trip-image.jpg' */
                            }} 
                            onClick={() => handleTripClick(trip)}
                            />
                        ))}
                    </div>
                    <TripFormModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={selectedTrip ? handleUpdateTrip : handleAddTrip}
                        selectedTrip={selectedTrip}
                        name={name}
                        setName={setName}
                        description={description}
                        setDescription={setDescription}
                        start={start}
                        setStart={setStart}
                        end={end}
                        setEnd={setEnd}
                        onDelete={(e) => {
                            e.preventDefault(); // Prevent form submission
                            if (selectedTrip) {
                              deleteTrip(e, selectedTrip.id);
                            }
                            setIsModalOpen(false);
                          }}
                    />
                
            </div>
        </div>
    )
}

export default MyTrips;