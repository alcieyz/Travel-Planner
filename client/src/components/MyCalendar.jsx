import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';




const MyCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState({});


    const handleDateClick = (value) => {
        const event = prompt(`Add an event for ${value.toDateString()}:`);
        if (event) {
            setEvents({
                ...events,
                [value.toDateString()]: event,
            });
        }
    };


    return (
        <div>
            <Calendar
                onChange={setDate}
                value={date}
                onClickDay={handleDateClick}
            />
            <div>
                <h3>Selected Date: {date.toDateString()}</h3>
                <p>Event: {events[date.toDateString()] || "No events"}</p>
            </div>
        </div>
    );
};


export default MyCalendar;
