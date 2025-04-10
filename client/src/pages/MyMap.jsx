import {useState, useEffect} from "react";
import './MyMap.css';
import {useAuth} from "../AuthContext";
import Map from '../components/Map';
import SideMenu from '../components/SideMenu';
import MapBanner from '../assets/mymap_banner.png';

const MyMap = () => {
    const {currentTrip} = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="page-container">
            <div className='map-content'>
                <div className="page-header">
                    <p><a href="/Dashboard">Dashboard</a> {'>'} <a href="/MyTrips">{currentTrip.name}</a> {'>'} My Map</p>
                </div>
                {/* <div className="map-banner">
                    <img src={MapBanner} alt='Map Banner'/>
                </div> */}
                <div className="page-title">
                    <h1>My Map</h1>
                </div>
                <Map/>
            </div>
        </div>
    )
}

export default MyMap;