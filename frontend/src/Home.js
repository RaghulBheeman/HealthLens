import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
        <h1>HEALTH-LENS</h1>
        <button><Link to="/admin/login">ADMIN</Link></button>
        <h4>OR</h4>
        <button><Link to="/user/login">DOCTOR</Link></button>
    </div>
  )
}

export default Home;
