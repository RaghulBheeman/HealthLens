import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';

const Admin = () => {
  const [name , setName] = useState('')
  const navigate = useNavigate()
  axios.defaults.withCredentials = true;
  useEffect(()=> {
    axios.get('http://localhost:3001/admin')
    .then( res => {
      console.log(res.data)
      if(res.data.valid){
        console.log("bbb")
        setName(res.data.adminName);
      }else{
        navigate('/admin/login')
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
            <Link to="/admin/users">Doctors</Link> 
          </li>
          <li>
            <Link to="/admin/logout">Logout</Link> 
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

export default Admin;
