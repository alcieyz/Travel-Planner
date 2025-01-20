import React, { useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './LogIn.css';
import user_icon from '../assets/TP_person_icon_small.png'
import pw_icon from '../assets/TP_pw_icon_small.png'

const LogIn = () => {

    const [username, setUsername] = useState('');
    const [pw, setPw] = useState('');
    const [showPw, setShowPw] = useState(false);
    const navigate = useNavigate(); //initialize navigate function
    const {logIn} = useAuth();

    //Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); //Prevent page refresh

        //Basic form validation
        if (!username || !pw) {
            alert('Please fill out all fields');
            return;
        }

        const url = '/LogIn';

        try {
            //Send POST request to backend with user data
            const response = await fetch(`http://localhost:5000${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username, password: pw,
                }),
            });

            if (!response.ok) {
                const message = await response.text(); //Get response text in case of error
                throw new Error(message);
            }

            const data = await response.json(); //Parse JSON response

            //Log In successful
            logIn(data.user.username, data.user.name, data.user.avatar); //Update auth state
            alert('Log In successful!');
            navigate('/Dashboard');

        } catch (err) {  
            alert(err.message); //Show error message if there's issue with the request
            //Clear input fields
            setUsername('');
            setPw('');
        }
    };

    return (
        <div  className="page-container">
            <div className='login-container'>
                <div className="header">
                    <div className="text">Log In</div>
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
                    <div className="forgot-pw">Forgot Password? <span>Too bad!</span></div>
                    <div className="no-account">Don't have an account? <a href="/SignUp"><span>Sign Up!</span></a></div>
                    <div className="submit-container">
                        <button type="submit" className="submit">Log In</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LogIn;

{/* <div>
            <h1>Account Log In</h1>
            
            <form action="/" target="_self" autocomplete="on">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username"></input><br></br>

                <label for="password">Password:</label>
                <input type="password" id="password" name="password"></input><br></br>

                <input type="submit" value="Log In"></input>
            </form>
            <button>Forgot Password?</button>

            <p>Don't have an account?</p>
            <button>Sign Up</button>
        </div> */}