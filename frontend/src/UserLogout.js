import React, { useState } from 'react';
import axios from 'axios';

const UserLogout = ({ userId }) => {
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/user/logout/${userId}`);
      setMessage(response.data);
      // Optionally, you can redirect the user to the homepage or another route after logout
      window.location.href = '/';
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

export default UserLogout;
