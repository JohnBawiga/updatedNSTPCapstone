import React, { useState, useEffect } from 'react';
import './AdminEvents.css';
import axios from 'axios';
import Modal from 'react-modal'; // Import modal component

const AdminEventContent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventTeachers, setSelectedEventTeachers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal visibility
  
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

  const handleEventClick = (eventId) => {
    // Open the modal
    setModalIsOpen(true);
    
    // Fetch event teachers for the clicked event
    axios.get(`http://localhost:8080/event/${eventId}`)
      .then(response => {
        setSelectedEventTeachers(response.data);
      })
      .catch(error => {
        console.error('Error fetching event teachers:', error);
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

      {/* Modal for Assigned Teachers */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Assigned Teachers Modal"
      >
        <div>
          <h2>Assigned Teachers</h2>
          <p>
            {selectedEventTeachers.map(eventTeacher => (
              `${eventTeacher.teacher.firstName} ${eventTeacher.teacher.lastName}`
            )).join(', ')}
          </p>
        </div>
      </Modal>
    </div>
    </section>
  );
};

export default AdminEventContent;
