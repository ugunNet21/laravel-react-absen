import "./styles/AppAttan.css";

// src/App.jsx
import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios";
import {
    BrowserRouter as Router,
    Link,
    Route,
    Routes,
} from "react-router-dom";

import AttendanceForm from "./components/AttendanceForm";
import AttendanceList from "./components/AttendanceList";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
    const [token, setToken] = useState('');
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setToken('');
            localStorage.removeItem('token');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const handleAttendanceUpdate = () => {
        setRefresh(prev => !prev);
    };

    return (
        <Router>
            <div className="app-container">
                <nav>
                    <Link to="/">Home</Link>
                    {token ? (
                        <button onClick={handleLogout}>Logout</button>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
                <Routes>
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/attendance" element={token ? (
                        <div className="attendance-container">
                            <AttendanceForm token={token} onAttendanceUpdate={handleAttendanceUpdate} />
                            <AttendanceList token={token} refresh={refresh} />
                        </div>
                    ) : (
                        <div className="login-required">Please log in to access this page.</div>
                    )} />
                    <Route path="/" element={
                        <div>
                            <h1>Welcome to the Attendance App</h1>
                            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                        </div>
                    } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
