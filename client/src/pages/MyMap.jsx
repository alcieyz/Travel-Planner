import {useState, useEffect} from "react";
import './MyMap.css';
import {useAuth} from "../AuthContext";
import Map from '../components/Map';
import SideMenu from '../components/SideMenu';
import MapBanner from '../assets/mymap_banner.png';

const MyMap = () => {

    return (
        <div className="page-container">
            <SideMenu/>
            <div className='map-content'>
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