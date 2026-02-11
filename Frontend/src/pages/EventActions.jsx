import React, { useEffect, useState } from "react";
import API from "../api";

function EventDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await API.get("/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      const response = await API.post(`/events/${id}/publish`);

      setEvents(
        events.map((event) => (event.id === id ? response.data : event)),
      );
    } catch (error) {
      console.error("Publish failed", error);
      alert("Failed to publish event");
    }
  };

  const handleClose = async (id) => {
    try {
      const response = await API.post(`/events/${id}/close`);

      setEvents(
        events.map((event) => (event.id === id ? response.data : event)),
      );
    } catch (error) {
      console.error("Close failed", error);
      alert("Failed to close event");
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Event Dashboard</h2>

      {events.length === 0 && <p>No events found.</p>}

      {events.map((event) => (
        <div
          key={event.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>{event.title}</h3>
          <p>
            Status: <strong>{event.status}</strong>
          </p>

          {event.status === "DRAFT" && (
            <button onClick={() => handlePublish(event.id)}>Publish</button>
          )}

          {event.status === "PUBLISHED" && (
            <button
              onClick={() => handleClose(event.id)}
              style={{ marginLeft: "10px" }}
            >
              Close Registration
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default EventDashboard;
