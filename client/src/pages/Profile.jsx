import React, {useState} from 'react';
import {useAuth} from '../AuthContext';
import './Profile.css';

const Profile = () => {
    const {username, contextName, updateName, contextAvatar, updateAvatar} = useAuth();
    const [name, setName] = useState(contextName || '');
    const [avatarFile, setAvatarFile] = useState(null);

    const handleNameSubmit = async (e) => {
        e.preventDefault();

        if (!name) { 
            alert("Please enter a name");
            return;
        }

        if (name === contextName) {
            alert("Name already updated");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/Profile/Name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ name, username }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message);
            }

            const data = await response.json();

            //Successful
            updateName(data.user.name);
            alert('Name updated successfully!');
        }
        catch (err) {
            alert(err.message);
        }
    }

    const handleAvatarSubmit = async (e) => {
        e.preventDefault();

        if (!avatarFile) {
            alert("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('avatar', avatarFile);

        try {
            const response = await fetch('http://localhost:5000/Profile/Avatar', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message);
            }

            const data = await response.json();
            updateAvatar(data.user.avatarPath);
            alert('Avatar updated successfully!');
        }
        catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className='page-container'>
            <div className='dashboard-content'>
                <div className="page-header">
                    <p><a href="/Dashboard">Dashboard</a> {'>'} Profile</p>
                </div>
                <h2>Your Profile</h2>
                <img src={contextAvatar || '/TP_person_icon.png'} alt="Avatar" className="avatar-img"/>
            

                <form onSubmit={handleAvatarSubmit}>
                    <div>
                        <div>
                            <input className='suggestions-search-bar' type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])}/>
                            &nbsp;
                            <button type="submit" className="submit">{(contextAvatar !== '/uploads/TP_person_icon.png') ? "Change" : "Add"}&nbsp;Avatar</button>
                        </div>
                    </div>
                </form>

                {contextName && <h3>Hi, {contextName}!</h3>}
                <form onSubmit={handleNameSubmit}>
                    <div>
                        <div>
                            <input className='suggestions-search-bar' type="text" placeholder={(contextName) ? contextName : "Name"} value={name || ''} onChange={(e) => setName(e.target.value)}/>
                            &nbsp;
                            <button type="submit" className="submit">{(contextName) ? "Change" : "Add"}&nbsp;Name</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile;