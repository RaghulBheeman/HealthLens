import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const response = await axios.get('http://localhost:3001/admin/details', {
          withCredentials: true, // Include credentials if required
        });
        setAdminData(response.data);
        setError(null); // Reset error if successful
      } catch (error) {
        console.error('Error fetching admin details:', error);
        setError('Failed to fetch admin details'); // Set user-friendly error message
      } finally {
        setIsLoading(false); // Set loading state to false regardless of success or error
      }
    };

    fetchAdminDetails();
  }, []);

  return (
    <div>
      <h2>Admin Details</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {adminData && (
        <div>
          <p>ID: {adminData._id}</p>
          <p>Username: {adminData.userName}</p>
          <p>Email: {adminData.email}</p>
          {/* Display other admin details as needed */}
        </div>
      )}
    </div>
  );
};

export default Admin;
