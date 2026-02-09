import { useState } from "react";
import API from "../api";

export default function CreateTeam() {
  const [eventId, setEventId] = useState("");
  const [teamName, setTeamName] = useState("");

  async function handleCreate(e) {
    e.preventDefault();

    try {
      await API.post("/teams", {
        eventId: Number(eventId),
        name: teamName,
      });

      alert("Team created. You are now a leader. Act like one.");
    } catch {
      alert("Team creation failed. Democracy is hard.");
    }
  }

  return (
    <div>
      <h2>Create Team</h2>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Event ID"
          onChange={(e) => setEventId(e.target.value)}
        />
        <br />

        <input
          placeholder="Team Name"
          onChange={(e) => setTeamName(e.target.value)}
        />
        <br />

        <button>Create Team</button>
      </form>
    </div>
  );
}
