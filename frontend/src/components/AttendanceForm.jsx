// src/components/AttendanceForm.jsx
import React, { useState } from "react";

import axios from "axios";

const AttendanceForm = ({ token, onAttendanceUpdate }) => {
    const [error, setError] = useState('');
    const [location, setLocation] = useState(null);
    const [photo, setPhoto] = useState(null);

    const handleAttendance = async () => {
        if (!location || !photo) {
            setError('Location and photo are required');
            return;
        }

        const formData = new FormData();
        formData.append('location', JSON.stringify(location));
        formData.append('photo', photo);

        try {
            const response = await axios.post('http://localhost:8000/api/attendance', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                alert('Attendance recorded successfully!');
                onAttendanceUpdate(); // Update attendance list
                console.log('Attendance recorded:', response.data); // Log success
            } else {
                console.error('Failed to record attendance:', response.data);
            }

        } catch (err) {
            console.error('Error recording attendance:', err);
            setError('Failed to record attendance');
        }
    };

    const getLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setError('');
            },
            () => {
                setError('Unable to retrieve location');
            }
        );
    };

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
            setError('');
        }
    };

    return (
        <div>
            <h2>Record Attendance</h2>
            <button onClick={getLocation}>Get Location</button>
            <input type="file" onChange={handlePhotoChange} accept="image/*" required />
            <button onClick={handleAttendance}>Record Attendance</button>
            {error && <p>{error}</p>}
            {location && (
                <p>
                    Location: {location.latitude}, {location.longitude}
                </p>
            )}
        </div>
    );
};

export default AttendanceForm;
