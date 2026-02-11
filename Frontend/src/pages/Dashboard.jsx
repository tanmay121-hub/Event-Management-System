import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/user/me").then((res) => setProfile(res.data));
    API.get("/events/published").then((res) => setEvents(res.data));
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Dashboard</h1>

      {profile && (
        <div
          className="card"
          style={{ marginBottom: "2rem", maxWidth: "100%" }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
            }}
          >
            Welcome, {profile.fullName}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>
                EMAIL
              </p>
              <p style={{ fontWeight: "500" }}>{profile.email}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>
                ROLE
              </p>
              <span
                style={{
                  background: "#e0e7ff",
                  color: "#4f46e5",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      )}

      <h3 style={{ marginTop: "2rem" }}>Quick Actions</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <div className="card" style={{ maxWidth: "100%" }}>
          <h4> Events</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button onClick={() => navigate("/create-event")}>
              Create Event
            </button>
            <button onClick={() => navigate("/manage-events")}>
              Manage Events
            </button>
          </div>
        </div>

        <div className="card" style={{ maxWidth: "100%" }}>
          <h4> Attendance</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button onClick={() => navigate("/checkin")}>
              Participant Check-In
            </button>
            <button onClick={() => navigate("/attendance")}>
              View Attendance
            </button>
          </div>
        </div>

        <div className="card" style={{ maxWidth: "100%" }}>
          <h4> Announcements</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button onClick={() => navigate("/announcements/create")}>
              Post Update
            </button>
            <button onClick={() => navigate("/announcements/view")}>
              View Updates
            </button>
          </div>
        </div>

        <div className="card" style={{ maxWidth: "100%" }}>
          <h4> Teams & Orgs</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button onClick={() => navigate("/teams/create")}>
              Create Team
            </button>
            <button onClick={() => navigate("/teams/join")}>Join Team</button>
            <button onClick={() => navigate("/organizations/create")}>
              Create Org
            </button>
            <button onClick={() => navigate("/organizations/approved")}>
              Browse Orgs
            </button>
          </div>
        </div>

        <div
          className="card"
          style={{ maxWidth: "100%", borderColor: "#ef4444" }}
        >
          <h4 style={{ color: "#ef4444" }}> Admin Zone</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              className="btn"
              style={{ background: "#ef4444" }}
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </button>
            <button
              className="btn"
              style={{ background: "#ef4444" }}
              onClick={() => navigate("/admin/organizations")}
            >
              Approve Orgs
            </button>
          </div>
        </div>
      </div>

      <h3 style={{ borderTop: "1px solid #e2e8f0", paddingTop: "2rem" }}>
        Published Events
      </h3>

      {events.length === 0 ? (
        <p>No active events found. Be the first to create one!</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {events.map((e) => (
            <div
              key={e.id}
              className="card"
              style={{
                maxWidth: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <h4 style={{ margin: "0 0 10px 0", color: "#4f46e5" }}>
                    {e.title}
                  </h4>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      background: "#dcfce7",
                      color: "#166534",
                      padding: "2px 8px",
                      borderRadius: "10px",
                    }}
                  >
                    #{e.id}
                  </span>
                </div>
                <p style={{ fontSize: "0.95rem", color: "#475569" }}>
                  {e.description}
                </p>
              </div>

              <div
                style={{
                  marginTop: "15px",
                  paddingTop: "15px",
                  borderTop: "1px solid #f1f5f9",
                  fontSize: "0.85rem",
                  color: "#64748b",
                }}
              >
                <p style={{ margin: "5px 0" }}>
                  <strong>Start:</strong>{" "}
                  {new Date(e.startTime).toLocaleDateString()}
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>End:</strong>{" "}
                  {new Date(e.endTime).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
