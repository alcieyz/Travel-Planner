import React, {useState} from 'react';
import {useAuth} from '../AuthContext';
import './Settings.css';

const Settings = () => {
    /* const {contextName, updateName} = useAuth();
    const [name, setName] = useState('');
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) { 
            alert("Please enter a name");
            return;
        }

        const username = localStorage.getItem('username');
        const url = '/Dashboard/Profile';

        try {
            const response = await fetch(`http://localhost:5000${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name,
                    username,
                }),
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
    } */

    return (
        <div>
            <h2>Settings</h2>
            <h3>Theme?</h3>
            {/* <form onSubmit={handleSubmit}>
                <div className="inputs">
                    <div className="input">
                        <input type="text" placeholder={(contextName !== null) ? contextName : "Name"} value={name} onChange={(e) => setName(e.target.value)}/>
                        <button type="submit" className="submit">Change Name</button>
                    </div>
                </div>
            </form>
            {(contextName !== null) ? <h3>Hi, {contextName}</h3> : ''} */}
        </div>
    )
}

export default Settings;