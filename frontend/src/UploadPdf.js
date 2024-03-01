import React, { useState } from 'react';
import axios from 'axios';

const UploadPdf = () => {
  const [file, setFile] = useState(null);
  const [patientEmail, setPatientEmail] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePatientEmailChange = (e) => {
    setPatientEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('pdfFile', file);
    formData.append('email', patientEmail);
    formData.append('username', username);

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

  return (
    <div>
      <h2>Upload Medical Report</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="patientEmail">Patient Email:</label>
          <input
            type="email"
            id="patientEmail"
            value={patientEmail}
            onChange={handlePatientEmailChange}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
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
