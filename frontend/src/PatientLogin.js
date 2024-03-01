import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UploadPdf from './UploadPdf';

const PatientLogin = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/patient/login", {
      userName: username,
      email: email
    })
      .then((response) => {
        setUsername('');
        setEmail('');
        setLoginSuccess(true);
        alert("Login Successful");
        console.log(response.data);
      })
      .catch(error => {
        alert("Login Failed");
        console.error(error);
      });
  }

  if (loginSuccess) {
    return <UploadPdf />;
  }

  return (
    <div>
      <h2>PatientLogin</h2>
      <div>
        <label>Username :</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Email :</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button onClick={handleSubmit}>Login</button>
      <p>Don't have an account? <Link to="/patient/register">Register here</Link></p>
    </div>
  );
}

export default PatientLogin;
