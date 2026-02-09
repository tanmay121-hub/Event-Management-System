import { useState } from "react";
import API from "../api";

export default function AttendanceViewer() {
  const [eventId, setEventId] = useState("");
  const [records, setRecords] = useState([]);

  async function fetchAttendance() {
    try {
      const res = await API.get(`/attendance/event/${eventId}`);
      setRecords(res.data);
    } catch {
      alert("Backend vanished. Happens to the best of us.");
    }
  }

  return (
    <div>
      <h2>View Attendance</h2>

      <input
        placeholder="Event ID"
        onChange={(e) => setEventId(e.target.value)}
      />

      <button onClick={fetchAttendance}>Get Attendance</button>

      {records.map((r) => (
        <div
          key={r.id}
          style={{ border: "1px solid gray", margin: "6px", padding: "6px" }}
        >
          <p>User: {r.userEmail}</p>
          <p>Status: {r.status}</p>
          <p>Time: {r.checkInTime}</p>
        </div>
      ))}
    </div>
  );
}
