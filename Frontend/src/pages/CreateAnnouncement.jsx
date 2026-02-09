import { useState } from "react";
import API from "../api";

export default function CreateAnnouncement() {
  const [eventId, setEventId] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await API.post("/announcements", {
        eventId: Number(eventId),
        message,
      });

      alert("Announcement sent. Suddenly you’re very official.");
    } catch {
      alert("Failed. The announcement remains in your head only.");
    }
  }

  return (
    <div>
      <h2>Create Announcement</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Event ID"
          onChange={(e) => setEventId(e.target.value)}
        />
        <br />

        <textarea
          placeholder="Your announcement..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />

        <button>Post Announcement</button>
      </form>
    </div>
  );
}
