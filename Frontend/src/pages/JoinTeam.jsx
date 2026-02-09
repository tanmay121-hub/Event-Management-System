import { useState } from "react";
import API from "../api";

export default function JoinTeam() {
  const [teamCode, setTeamCode] = useState("");

  async function handleJoin() {
    try {
      await API.post("/teams/join", {
        inviteCode: teamCode,
      });

      alert("Joined successfully. Welcome to group chaos.");
    } catch {
      alert("Join failed. Wrong code or destiny said no.");
    }
  }

  return (
    <div>
      <h2>Join Team</h2>

      <input
        placeholder="Team Invite Code"
        onChange={(e) => setTeamCode(e.target.value)}
      />
      <br />

      <button onClick={handleJoin}>Join Team</button>
    </div>
  );
}
