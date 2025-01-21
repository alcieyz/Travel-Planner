import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './SignUp.css';
import user_icon from '../assets/TP_person_icon_small.png'
import pw_icon from '../assets/TP_pw_icon_small.png'

const SignUp = () => {
   
    const [username, setUsername] = useState('');
    const [pw, setPw] = useState('');
    const [showPw, setShowPw] = useState(false);
    const navigate = useNavigate(); //initialize navigate function

    //Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); //Prevent page refresh

        //Basic form validation
        if (!username || !pw) {
            alert('Please fill out all fields');
            return;
        }

        const url = '/SignUp';

        try {
            //Send POST request to backend with user data
            const response = await fetch(`http://localhost:5000${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password: pw,
                }),
            });

            if (!response.ok) {
                const message = await response.text(); //Get response text in case of error
                throw new Error(message);
            }

            const data = await response.json(); //Parse JSON response

            alert('Sign Up successful!');

            //If Sign Up successful, store user info in localStorage
            localStorage.setItem('username', data.user.username); //Store user's name in localStorage
            navigate('/LogIn');

        } catch (err) {
            alert(err.message); //Show error message if there's issue with the request
            setUsername('');
            setPw('');
        }
    };

    return (
        <div className="page-container">
            <div className='login-container'>
                <div className="header">
                    <div className="text">Sign Up</div>
                    <div className="underline"></div>
                </div>
                <form onSubmit={handleSubmit}> 
                    <div className="inputs">
                        <div className="input">
                            <img src={user_icon} alt="User icon" />
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="input">
                            <img src={pw_icon} alt="Password icon" />
                            <input type={showPw ? 'text' : 'password'} placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)}/>
                            <button type="button" className="show-password" onClick={() => setShowPw(!showPw)}>
                                {showPw ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    <div className="account-exists">Already have an account? <a href="/LogIn"><span>Log In</span></a></div>
                    <div className="submit-container">
                        <button type="submit" className="submit">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;