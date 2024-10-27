// src/components/AttendanceList.jsx
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
        <div>
            <h2>Attendance List</h2>
            <ul>
                {attendances.map((attendance) => (
                    <li key={attendance.id}>
                        <p>Time: {new Date(attendance.attendance_time).toLocaleString()}</p>
                        <p>Location: {attendance.location}</p>
                        {attendance.photo_path && (
                            <img
                                src={`http://localhost:8000/storage/${attendance.photo_path}`}
                                alt="Attendance"
                                width="100"
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AttendanceList;
