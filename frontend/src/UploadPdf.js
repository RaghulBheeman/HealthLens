import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadPdf = () => {
  const [file, setFile] = useState(null);
  //const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // const handleUsernameChange = (e) => {
  //   setUsername(e.target.value);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('pdfFile', file);
    //formData.append('username', username);

    try {
      const response = await axios.post('http://localhost:3001/patient/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage(response.data);
      setErrorMessage('');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage('Failed to upload file');
      }
      setSuccessMessage('');
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/patient/logout');
      navigate('/patient/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <h2>Upload Medical Report</h2>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleSubmit}>
        {/* <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div> */}
        <div>
          <label htmlFor="pdfFile">Select PDF File:</label>
          <input
            type="file"
            id="pdfFile"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadPdf;
