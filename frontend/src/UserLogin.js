import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UserLogin = ({ setUserId }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3001/user')
            .then(res => {
                if (res.data.valid) {
                    navigate('/user');
                } else {
                    navigate('/user/login')
                }
            })
            .catch(err => console.log(err))
    }, []);

    const handleSubmit = (e) => {

        e.preventDefault();
        axios.post("http://localhost:3001/user/login", {
            email: email,
            password: password
        })
            .then((response) => {
                console.log(response.data)
                setEmail('');
                setPassword('');
                alert("Login Successful");
                setLoginSuccess(true);
                //setUserId(response.data._id ? response.data._id.toString() : ''); // Set userId from the server response
                console.log("User ID:", response.data._id);
                if (response.data.Login) {
                    navigate('/user');
                }

            })
            .catch((error) => {
                alert("Invalid Credentials")
                console.error("Error Logging:", error);
            });
    };

    return (
        <div>
            <h2>User Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off"/>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off"/>
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/user/register">Register here</Link></p>
        </div>
    )
}

export default UserLogin;
