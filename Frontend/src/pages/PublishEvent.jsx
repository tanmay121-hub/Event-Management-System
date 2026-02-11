import { useState } from "react";
import API from "../api";

export default function PublishEvent() {
  const [eventId, setEventId] = useState("");

  async function handlePublish() {
    try {
      await API.post(`/events/${eventId}/publish`);
      alert("Published.");
    } catch {
      alert("Failed. Backend ghosted you.");
    }
  }

  return (
    <div>
      <h2>Publish Event</h2>
      <input
        placeholder="Event ID"
        onChange={(e) => setEventId(e.target.value)}
      />
      <button onClick={handlePublish}>Publish</button>
    </div>
  );
}
