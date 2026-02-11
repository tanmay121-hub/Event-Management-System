import { useState } from "react";
import API from "../api";

export default function ViewAnnouncements() {
  const [eventId, setEventId] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  async function fetchAnnouncements() {
    try {
      const res = await API.get(`/announcements/event/${eventId}`);
      setAnnouncements(res.data);
    } catch {
      alert("No announcements.");
    }
  }

  return (
    <div>
      <h2>Event Announcements</h2>

      <input
        placeholder="Event ID"
        onChange={(e) => setEventId(e.target.value)}
      />

      <button onClick={fetchAnnouncements}>Load</button>

      {announcements.map((a) => (
        <div
          key={a.id}
          style={{ border: "1px solid gray", margin: "6px", padding: "6px" }}
        >
          <p>
            <strong>{a.title || "Announcement"}</strong>
          </p>
          <p>{a.message}</p>
          <small>{a.createdAt}</small>
        </div>
      ))}
    </div>
  );
}
