import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom to create links

const User = () => {
 

  const [name , setName] = useState('')
  const navigate = useNavigate()
  axios.defaults.withCredentials = true;
  useEffect(()=> {
    axios.get('http://localhost:3001/user')
    .then( res => {
      if(res.data.valid){
        setName(res.data.userName);
      }else{
        //navigate('/user/login')
      }
    })
    .catch(err => console.log(err))
  }, [])

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
        <h2>Welcome {name}</h2>
        
        {/* Display more user details as needed */}
      </div>
    </div>
  );
};

export default User;
