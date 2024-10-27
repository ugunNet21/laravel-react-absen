// src/App.jsx
import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios"; // Import axios for API requests
import {
    BrowserRouter as Router,
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
            navigate('/login'); // Redirect to login page after logout
        } catch (err) {
            console.error('Logout failed', err);
        }
    };
    const handleAttendanceUpdate = () => {
        setRefresh(prev => !prev); // Toggle refresh state
    };
    return (
        <Router>
            <div>
                <nav>
                    {token && <button onClick={handleLogout}>Logout</button>}
                </nav>
                <Routes>
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/attendance" element={token ? (
                        <div>
                            <AttendanceForm token={token} onAttendanceUpdate={handleAttendanceUpdate} />
                            <AttendanceList token={token} refresh={refresh} />
                        </div>
                    ) : (
                        <div>Please log in to access this page.</div>
                    )} />
                    <Route path="/" element={
                        <div>
                            <h1>Welcome to the Attendance App</h1>
                            <a href="/login">Login</a> | <a href="/register">Register</a>
                        </div>
                    } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
