import { useState } from "react";
import API from "../api";

export default function AttendanceCheckIn() {
  const [eventId, setEventId] = useState("");
  const [qrCode, setQrCode] = useState("");

  async function handleCheckIn() {
    try {
      await API.post("/attendance/checkin", {
        eventId: Number(eventId),
        qrCode: qrCode,
      });

      alert("Checked in. Congrats on existing at the right place.");
    } catch {
      alert("Check-in failed. Either wrong QR or your luck is cursed.");
    }
  }

  return (
    <div>
      <h2>Participant Check-In</h2>

      <input
        placeholder="Event ID"
        onChange={(e) => setEventId(e.target.value)}
      />
      <br />

      <input
        placeholder="Scan / Paste QR Code"
        onChange={(e) => setQrCode(e.target.value)}
      />
      <br />

      <button onClick={handleCheckIn}>Check In</button>
    </div>
  );
}
