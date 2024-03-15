import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import Admin from './Admin';


const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);


    const handleSubmit = (e) => {
      axios.post("http://localhost:3001/admin/login", {
          email: email,
          password: password
      })
      .then((response) => {

         console.log(response.data)
          e.preventDefault()
          setEmail('');
          setPassword('');
          alert("Login Successful")
          setLoginSuccess(true);
          console.log(response.data);

          
      })
      .catch((error) => {
        alert("Invalid Credentials")
          console.error("Error Logging:", error);
      });
  };

  if (loginSuccess) {
    return <Admin />;
}


  return (
    <div>
      <h2>Admin Login</h2>
      <div>
        <label>Email:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleSubmit}>Login</button>
      <p>Don't have an account? <Link to="/admin/register">Register here</Link></p>
      
    </div>
    
  );
}

export default AdminLogin;
