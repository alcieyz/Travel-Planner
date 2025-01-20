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

        try {
            const response = await fetch('http://localhost:5000/Dashboard/Profile/Name', {
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

        console.log("Selected file:", avatarFile);
        console.log("File type:", avatarFile.type);
        console.log("File name:", avatarFile.name);

        const formData = new FormData();
        formData.append('username', username);
        formData.append('avatar', avatarFile);

        try {
            const response = await fetch('http://localhost:5000/Dashboard/Profile/Avatar', {
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
        <div>
            <h2>Your Progile</h2>
            <img src={contextAvatar || '/TP_person_icon.png'} alt="Avatar" className="avatar-img"/>

            <h3>Sorry youre gonna have to crop the iamge yourself if you want a circular profile.</h3>
            <h3>Oh and if youll do me a favor and not upload any viruses thatd be much appreciated🤗</h3>

            <form onSubmit={handleAvatarSubmit}>
                <div className="inputs">
                    <div className="input">
                        <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])}/>
                        <button type="submit" className="submit">{(contextAvatar !== '/uploads/TP_person_icon.png') ? "Change" : "Add"} Avatar</button>
                    </div>
                </div>
            </form>

            {(contextName !== null) ? <h3>Hi, {contextName}</h3> : ''}
            <form onSubmit={handleNameSubmit}>
                <div className="inputs">
                    <div className="input">
                        <input type="text" placeholder={(contextName !== null) ? contextName : "Name"} value={name} onChange={(e) => setName(e.target.value)}/>
                        <button type="submit" className="submit">{(contextName !== null) ? "Change" : "Add"} Name</button>
                    </div>
                </div>
            </form>
            
        </div>
    )
}

export default Profile;