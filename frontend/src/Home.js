import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import CSS file

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>HEALTH-LENS</h1>
      <button className="button">
        <Link to="/admin/login" className="button-link">ADMIN</Link>
      </button>
      <h4>OR</h4>
      <button className="button">
        <Link to="/user/login" className="button-link">DOCTOR</Link>
      </button>
    </div>
  );
};

export default Home;
