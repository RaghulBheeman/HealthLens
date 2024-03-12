import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const PatientLogout = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Importing useNavigate hook from react-router-dom

  const handleLogout = async () => {
    try {
      //console.log(_id)
      const response = await axios.post("http://localhost:3001/patient/logout"); 
      setMessage(response.data);
      // Redirecting to the homepage after logout
      navigate('/user'); 
    } catch (error) {
      console.error('Error logging out user:', error);
      setMessage('Failed to logout');
    }
  };

  return (
    <div>
      <h2>User Logout</h2>
      <p>Are you sure you want to logout?</p>
      <button onClick={handleLogout}>Logout</button>
      <p>{message}</p>
    </div>
  );
};

export default PatientLogout;
