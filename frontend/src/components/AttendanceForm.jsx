// src/components/AttendanceForm.jsx
import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import axios from "axios";

const AttendanceForm = ({ token, onAttendanceUpdate }) => {
    const [error, setError] = useState('');
    const [location, setLocation] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [isPhotoTaken, setIsPhotoTaken] = useState(false); // Status foto diambil atau belum
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!isPhotoTaken) {
            startCamera(); // Mulai kamera saat komponen dimuat jika foto belum diambil
        }
    }, [isPhotoTaken]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
        } catch (err) {
            setError("Failed to access camera");
        }
    };

    const handleTakePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Ambil frame dari video
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Ubah canvas ke Blob untuk dikirim sebagai file
        canvas.toBlob((blob) => {
            setPhoto(blob);
            setIsPhotoTaken(true); // Set status foto diambil
            setError('');
        }, 'image/jpeg');
    };

    const handleRetakePhoto = () => {
        setPhoto(null);
        setIsPhotoTaken(false); // Reset status foto untuk memungkinkan pengambilan ulang
        startCamera(); // Mulai ulang kamera
    };

    const handleAttendance = async () => {
        if (!location || !photo) {
            setError('Location and photo are required');
            return;
        }

        const formData = new FormData();
        formData.append('location', JSON.stringify(location));
        formData.append('photo', photo, 'attendance_photo.jpg');

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

    return (
        <div>
            <h2>Record Attendance</h2>
            <button onClick={getLocation}>Get Location</button>

            <div>
                {!isPhotoTaken ? (
                    <div>
                        <video ref={videoRef} autoPlay style={{ width: "100%", maxWidth: "400px" }} />
                        <button onClick={handleTakePhoto}>Take Photo</button>
                    </div>
                ) : (
                    <div>
                        <img
                            src={URL.createObjectURL(photo)}
                            alt="Attendance"
                            style={{ width: "100%", maxWidth: "400px" }}
                        />
                        <button onClick={handleRetakePhoto}>Retake Photo</button>
                    </div>
                )}
                <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>

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
