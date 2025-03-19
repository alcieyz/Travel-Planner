import React, {useState} from 'react';
import {useAuth} from '../AuthContext';
import './Settings.css';
import SideMenu from '../components/SideMenu';

const Settings = () => {
    const {username, logOut} = useAuth();

    const handleDeleteAccount = async (e, username) => {
        e.stopPropagation();

        const confirmDeleteAccount = window.confirm("Are you sure you want to delete this account?");
        if (!confirmDeleteAccount) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/Settings/${username}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error("Failed to delete account");
            }

            //Deletion successful
            logOut();
            alert('Account Deletion successful');
        }
        catch (error) {
            console.error("Error deleting account:", error.message);
            alert(error.message);
        }
    };

    return (
        <div className='dashboard-page-container'>
            <SideMenu/>
            <div className='dashboard-content'>
                <h2>Settings</h2>
                <h3>Theme? light/dark mode, skins</h3>
                <button className="delete-acc-btn" onClick={(e) => handleDeleteAccount(e, username)}>Delete Account</button>
            </div>
        </div>
    )
}

export default Settings;