import React, {useState, useEffect} from 'react';
import {useAuth} from '../AuthContext';
import './MyTrips.css';
import SideMenu from '../components/SideMenu';

const MyTrips = () => {
    const {username, logOut} = useAuth();
    
    return (
        <div className='page-container'>
            <div className='dashboard-content'>
                <div className='page-header'>
                    <p>Dashboard {'>'} Current Selected Trip</p>
                </div>
                <h2>Current Selected Trip</h2>
                
            </div>
        </div>
    )
}

export default MyTrips;