/* import MyCalendar from "../components/MyCalendar"; */
import {useEffect} from 'react';
import './MySchedule.css';
import Calendar from '../components/Calendar';
import {useAuth} from '../AuthContext';

const MySchedule = () => {
    const {username, currentTrip} = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="page-container">
            <div className='budget-content'>
                <div className="page-header">
                    <p><a href="/Dashboard">Dashboard</a> {'>'} <a href="/MyTrips">{currentTrip.name}</a> {'>'} My Schedule</p>
                </div>
                <div className="page-title">
                    <h1>My Schedule</h1>
                </div>
                <div className="calendar-container">
                    <Calendar
                        username={username}
                        tripId={currentTrip.id}
                    />
                </div>
            </div>
        </div>
    )
}

export default MySchedule;
