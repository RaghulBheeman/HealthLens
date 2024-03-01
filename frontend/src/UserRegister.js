import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

const UserRegister = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const handleSubmit = (e) => {
        axios.post("http://localhost:3001/user/register", {
            userName: username,
            email: email,
            password: password,
            repeatPassword: repeatPassword
        })
        .then((response) => {
            e.preventDefault()
            setUsername('');
            setEmail('');
            setPassword('');
            setRepeatPassword('');
            alert("Registeration successfull")
            console.log(response.data);
            
        })
        .catch((error) => {
          alert("Registeration failed")
            console.error("Error registering:", error);
        });
    };
  return (
    <div>
        <h2>User Registeration</h2>
        <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
            <label>Repeat Password:</label>
            <input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
        </div>
        <button onClick={handleSubmit}>Register</button>
        <Link to="/user/login">Login</Link>
    </div>
);
}

export default UserRegister