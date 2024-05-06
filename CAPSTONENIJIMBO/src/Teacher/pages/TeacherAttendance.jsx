import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QrReader from 'react-qr-scanner';
import axios from 'axios';
import './TeacherAttendance.css'
function TeacherAttendance() {
  const { eventID } = useParams();
  const [delay] = useState(100);
  const [result, setResult] = useState('No result');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch students when component mounts
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    // Make a request to your backend endpoint with the scanned event ID
    axios.get(`http://localhost:8080/Studentevent/${eventID}`)
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
        // Handle error if necessary
      });
  }

  const handleScan = (data) => {
    if (data) {
      setResult(data.text);
      // Fetch students again when a QR code is scanned
      fetchStudents();
    }
  }

  const handleError = (err) => {
    console.error(err);
  }

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
  };

  const thTdStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '8px',
  };

  return (
    <div>
      <QrReader
        delay={delay}
        onError={handleError}
        onScan={handleScan}
      />
      <p>{result}</p>

      <h2>Students:</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Student ID</th>
            <th style={thTdStyle}>Name</th>
            <th style={thTdStyle}>Time In</th>
            <th style={thTdStyle}>Time Out</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td style={thTdStyle}>{student.student.studentID}</td>
              <td style={thTdStyle}>{student.student.firstName} {student.student.lastName}</td>
              <td style={thTdStyle}>{student.timeIN}</td>
              <td style={thTdStyle}>{student.timeOUT}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherAttendance;