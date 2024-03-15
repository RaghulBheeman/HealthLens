import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDoct = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch doctors list from backend when the component mounts
    const fetchDoctors = async () => {
      try {
        const response = await  axios.get('http://localhost:3001/admin/doctors');
        setDoctors(response.data); // Update state with the fetched doctors list
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors(); // Call the fetchDoctors function
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <div>
      <h2>Doctors List</h2>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor._id}>
            {doctor.userName} - {doctor.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDoct;
