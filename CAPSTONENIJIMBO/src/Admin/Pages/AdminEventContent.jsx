import React, { useState, useEffect } from 'react';
import './AdminEvents.css';
import axios from 'axios';
import Modal from 'react-modal'; // Import modal component
import QrReader from 'react-qr-scanner';

const AdminEventContent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventTeachers, setSelectedEventTeachers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal visibility
  const [delay] = useState(100);
  const [result, setResult] = useState('No result');
  const [scannedData, setScannedData] = useState(''); // State for scanned data
  const [selectedEventId, setSelectedEventId] = useState(null); // State for selected event ID
  const [userId, setUserId] = useState(null); // State for user ID
  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
  };

  const thTdStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '8px',
  };

  const handleScan = (data) => {
    if (data) {
      setScannedData(data.text);
    }
  }

  const handleError = (err) => {
    console.error(err);
  }

  useEffect(() => {
    // Fetch events from backend API
    axios.get('http://localhost:8080/getEvents')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch user ID by student ID
    axios.get(`http://localhost:8080/getByStudentID/${scannedData}`)
      .then(response => {
        setUserId(response.data.userid);
      })
      .catch(error => {
        console.error('Error fetching user ID:', error);
      });
  }, [scannedData]);

  const handleEventClick = (eventId) => {
    // Open the modal
    setModalIsOpen(true);
    // Set the selected event ID
    setSelectedEventId(eventId);
    
    // Fetch event teachers for the clicked event
    axios.get(`http://localhost:8080/event/${eventId}`)
      .then(response => {
        setSelectedEventTeachers(response.data);
      })
      .catch(error => {
        console.error('Error fetching event teachers:', error);
      });
  };

  const handleUpdateTime = () => {
    // Send POST request to update timeIN or timeOUT
    axios.post(`http://localhost:8080/  ${selectedEventId}/${userId}/update-time`)
      .then(response => {
        console.log(response.data); // Log success message or handle response
      })
      .catch(error => {
        console.error('Error updating time:', error);
      });
  };

  return (
    <section>
    <div className="admin-events">
      <ul>
        {events.slice().reverse().map(event => (
          <article key={event.eventID} className="event" onClick={() => handleEventClick(event.eventID)}>
            <div className='event-image'>
            <img src={`data:image/png;base64,${event.image}`} alt={event.eventTitle} />
            </div>
          <div className='event-content'>
            <h2>{event.eventTitle}</h2>
            <p>Start Date: {event.eventStart}</p>
            <p>End Date: {event.eventEnd}</p>
            <p>Description: {event.description}</p>
            </div>
          </article>
        ))}
      </ul>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Assigned Teachers Modal"
      >
        <div>
          <QrReader
            delay={delay}
            onError={handleError}
            onScan={handleScan}
          />
          </div>
          <div>
          <input
            type="text"
            value={scannedData}
            onChange={(e) => setScannedData(e.target.value)}
            placeholder="Scanned Data"
          />
        </div>
        <button onClick={handleUpdateTime}>Update Time</button>
      </Modal>
    </div>
    </section>
  );
};

export default AdminEventContent;
