/* import MyCalendar from "../components/MyCalendar"; */
import './MySchedule.css';
import Calendar from '../components/Calendar';


const MySchedule = () => {
    return (
        <div className="page-container">
            <h1>My Schedule</h1>
            <h1>{"This is where your scheule goes we haven't made it yet Sorry"}</h1>
            <div className="calendar-container">
                {/* <MyCalendar /> */}
                <Calendar/>
            </div>
        </div>
    )
}

export default MySchedule;
