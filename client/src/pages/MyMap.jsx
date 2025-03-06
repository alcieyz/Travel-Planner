import {useState, useEffect} from "react";
import './MyMap.css';
import {useAuth} from "../AuthContext";
import Map from '../components/Map';

const MyMap = () => {

    return (
        <div className="page-container">
            <h1>My Map</h1>
            <h6>Your map</h6>
            <div className="map-container">
                <Map/>
            </div>
        </div>
    )
}

export default MyMap;