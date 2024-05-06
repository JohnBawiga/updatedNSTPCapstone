import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './TeacherEvents.css';

const TeacherEvents = () => {
    const { teacherID } = useParams();
    const [events, setEvents] = useState([]);
    const [userid, setUserid] = useState(null);

    useEffect(() => {
        // Fetch userid from backend using teacherID
        axios.get(`http://localhost:8080/getbyTeacherID/${teacherID}`)
            .then(response => {
                setUserid(response.data.userid);
            })
            .catch(error => {
                console.error('Error fetching userid:', error);
            });
    }, [teacherID]);

    useEffect(() => {
        if (userid) {
            // Fetch events from backend API using userid
            axios.get(`http://localhost:8080/teacherevents/${userid}`)
                .then(response => {
                    setEvents(response.data);
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                });
        }
    }, [userid]);

    return (
        <div className="table-wrapper">
            <h1>Event List</h1>
            <table className="fl-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Description</th>
                        <th>Attendance</th>
                    </tr>
                </thead>
                <tbody>
                    {events.slice().reverse().map(event => (
                        <tr key={event.eventID}>
                            <td>{event.event.eventTitle}</td>
                            <td>{event.event.eventStart}</td>
                            <td>{event.event.eventEnd}</td>
                            <td>{event.event.description}</td>
                            <td>
                                {/* Link to TeacherAttendance with teacherID and eventID */}
                                <Link to={`/Teacher/Attendance/${teacherID}/${event.event.eventID}`}>
                                    View Attendance
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherEvents;