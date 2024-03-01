import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import User from './User'; // Assuming this is the correct import for the User component

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleSubmit = (e) => {
        axios.post("http://localhost:3001/user/login", {
            email: email,
            password: password
        })
        .then((response) => {
            e.preventDefault()
            setEmail('');
            setPassword('');
            alert("Login Successful")
            setLoginSuccess(true);
            console.log(response.data);
        })
        .catch((error) => {
            alert("Invalid Credentials")
            console.error("Error Logging:", error);
        });
    };

    if (loginSuccess) {
        return <User />;
    }

    return (
        <div>
            <h2>User Login</h2>
            <div>
                <label>Email:</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button onClick={handleSubmit}>Login</button>
            <p>Don't have an account? <Link to="/user/register">Register here</Link></p>
        </div>
    )
}

export default UserLogin;
