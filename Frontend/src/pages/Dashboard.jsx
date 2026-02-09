import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/users/me").then((res) => setProfile(res.data));
    API.get("/events/published").then((res) => setEvents(res.data));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {profile && (
        <div>
          <h3>My Profile</h3>
          <p>Email: {profile.email}</p>
        </div>
      )}

      <h3>Published Events</h3>
      {events.map((e) => (
        <div key={e.id}>
          <strong>{e.name}</strong>
        </div>
      ))}
      <button onClick={() => (window.location.href = "/create-event")}>
        Create Event
      </button>
      <button onClick={() => (window.location.href = "/admin/users")}>
        Admin: Manage Users
      </button>
      <button onClick={() => (window.location.href = "/checkin")}>
        Participant Check-In
      </button>

      <button onClick={() => (window.location.href = "/attendance")}>
        View Attendance (Organizer)
      </button>
      <button onClick={() => (window.location.href = "/announcements/create")}>
        Create Announcement
      </button>

      <button onClick={() => (window.location.href = "/announcements/view")}>
        View Announcements
      </button>
      <button onClick={() => (window.location.href = "/teams/create")}>
        Create Team
      </button>

      <button onClick={() => (window.location.href = "/teams/join")}>
        Join Team
      </button>

      <button onClick={() => (window.location.href = "/organizations/create")}>
        Create Organization
      </button>

      <button
        onClick={() => (window.location.href = "/organizations/approved")}
      >
        View Approved Orgs
      </button>

      <button onClick={() => (window.location.href = "/admin/organizations")}>
        Admin: Approve Orgs
      </button>
    </div>
  );
}
