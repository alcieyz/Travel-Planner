/* import MyCalendar from "../components/MyCalendar"; */
import './MySchedule.css';
import Calendar from '../components/Calendar';
import SideMenu from '../components/SideMenu';

const MySchedule = () => {
    return (
        <div className="page-container">
            <SideMenu/>
            <div className='dashboard-content'>
                <h1>My Schedule</h1>
                <h1>{"This is where your scheule goes we haven't made it yet Sorry"}</h1>
                <div className="calendar-container">
                    {/* <MyCalendar /> */}
                    <Calendar/>
                </div>
            </div>
        </div>
    )
}

export default MySchedule;
