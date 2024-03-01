import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom to create links

const User = () => {
  // Assuming user details are received as props
  const userDetails = {
    username: 'John Doe',
    email: 'john@example.com'
    // Add more details as needed
  };

  return (
    <div>
      {/* Navbar */}
      <nav>
        <ul>
          <li>
            <Link to="/patient/register">Register Patient</Link> {/* Link to register patient */}
          </li>
          <li>
            <Link to="/user/logout">Logout</Link> {/* Link to register patient */}
          </li>
          {/* Add more navbar links as needed */}
        </ul>
      </nav>

      {/* User Details */}
      <div>
        <h2>User Details</h2>
        <p><strong>Username:</strong> {userDetails.username}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        {/* Display more user details as needed */}
      </div>
    </div>
  );
};

export default User;
