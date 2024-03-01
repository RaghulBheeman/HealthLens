import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

const PatientRegister = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');  

  const handleSubmit = (e) => {
    axios.post("http://localhost:3001/patient/register", {
        userName: username,
        email: email,

    })
    .then((response) => {
        e.preventDefault()
        setUsername('');
        setEmail('');
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
        <h2>Patient Registeration</h2>
        <div>
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button onClick={handleSubmit}>Register</button>
        <Link to="/patient/login">Login</Link>
    </div>
  )
}

export default PatientRegister