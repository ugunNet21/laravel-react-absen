// src/components/AttendanceList.jsx
import "../styles/Attendance.css";

import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios";

const AttendanceList = ({ token, refresh }) => {
    const [attendances, setAttendances] = useState([]);

    useEffect(() => {
        const fetchAttendances = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/attendance', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAttendances(response.data);
            } catch (err) {
                console.error('Failed to fetch attendances');
            }
        };
        fetchAttendances();
    }, [token, refresh]);

    return (
        <div className="container">
            <h2 className="header">Attendance List</h2>
            {attendances.map((attendance) => (
                <div className="card" key={attendance.id}>
                    <p>Time: {new Date(attendance.attendance_time).toLocaleString()}</p>
                    <p>Location: {attendance.location}</p>
                    {attendance.photo_path && (
                        <img
                            src={`http://localhost:8000/storage/${attendance.photo_path}`}
                            alt="Attendance"
                            width="100"
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default AttendanceList;
