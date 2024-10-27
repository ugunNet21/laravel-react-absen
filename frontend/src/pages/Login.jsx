import "../styles/LoginRegister.css";

import React, { useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, password });
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            setError('');
            navigate('/attendance');
        } catch (err) {
            setError('Login failed');
        }
    };

    return (
        <div className="container">
            <h2 className="header">Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
