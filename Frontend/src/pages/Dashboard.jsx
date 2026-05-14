import React from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../api";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { 
  Calendar, 
  Users, 
  Megaphone, 
  ShieldAlert, 
  PlusCircle, 
  Settings,
  ClipboardCheck,
  Building2,
  ChevronRight
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => API.get("/user/me").then((res) => res.data),
  });

  const { data: events = [], isLoading: isEventsLoading } = useQuery({
    queryKey: ["published-events"],
    queryFn: () => API.get("/events/published").then((res) => res.data),
  });

  if (isProfileLoading || isEventsLoading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <div className="loader">Loading Dashboard...</div>
      </div>
    );
  }

  const QuickAction = ({ icon: Icon, title, actions }) => (
    <Card className="glass" style={{ maxWidth: "100%", margin: 0 }}>
      <div className="flex-between" style={{ marginBottom: "1rem" }}>
        <div className="flex-center" style={{ gap: "10px" }}>
          <div style={{ padding: "8px", background: "var(--primary-light)", borderRadius: "8px", color: "white" }}>
            <Icon size={20} />
          </div>
          <h4 style={{ margin: 0 }}>{title}</h4>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {actions.map((action, i) => (
          <Button 
            key={i}
            variant="secondary" 
            size="sm" 
            className="flex-between"
            onClick={() => navigate(action.path)}
          >
            {action.label}
            <ChevronRight size={14} />
          </Button>
        ))}
      </div>
    </Card>
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <header className="flex-between" style={{ background: "transparent", border: "none", padding: "0 0 2rem 0" }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ margin: 0 }}>Manage your events and teams from one place.</p>
        </div>
        <div className="flex-center" style={{ gap: "15px" }}>
           <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
              <Settings size={16} style={{ marginRight: '8px' }} />
              Settings
           </Button>
        </div>
      </header>

      {profile && (
        <Card className="bg-grad-primary" style={{ marginBottom: "2.5rem", maxWidth: "100%", color: 'white' }}>
          <div className="flex-between">
            <div>
              <h2 style={{ color: "white", marginBottom: "0.5rem" }}>
                Welcome back, {profile.fullName.split(' ')[0]}!
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>{profile.email}</p>
            </div>
            <div className="badge glass" style={{ color: 'white' }}>
              {profile.role}
            </div>
          </div>
        </Card>
      )}

      <section style={{ marginBottom: "3.5rem" }}>
        <h3 style={{ marginBottom: "1.5rem" }}>Quick Actions</h3>
        <div className="grid-cols-auto" style={{ gap: "1.5rem" }}>
          {/* MANAGEMENT ZONE (Admin & Organizer) */}
          {(profile?.role === "ADMIN" || profile?.role === "ORGANIZER") && (
            <>
              <QuickAction 
                icon={Calendar} 
                title="Event Management" 
                actions={[
                  { label: "Create New Event", path: "/create-event" },
                  { label: "My Created Events", path: "/manage-events" }
                ]} 
              />
              <QuickAction 
                icon={Megaphone} 
                title="Announcements" 
                actions={[
                  { label: "Post Update", path: "/announcements/create" },
                  { label: "View All Updates", path: "/announcements/view" }
                ]} 
              />
            </>
          )}

          {/* PARTICIPATION ZONE (Everyone) */}
          <QuickAction 
            icon={ClipboardCheck} 
            title="Attendance" 
            actions={[
              { label: "Participant Check-In", path: "/checkin" },
              { label: "My Attendance History", path: "/attendance" }
            ]} 
          />
          
          <QuickAction 
            icon={Building2} 
            title="Teams & Organizations" 
            actions={[
              { label: "Create or Join Team", path: "/teams/create" },
              { label: "Browse Approved Orgs", path: "/organizations/approved" }
            ]} 
          />

          {/* ADMIN ONLY ZONE */}
          {profile?.role === "ADMIN" && (
            <QuickAction 
              icon={ShieldAlert} 
              title="Administration" 
              actions={[
                { label: "User Directory", path: "/admin/users" },
                { label: "Organization Approvals", path: "/admin/organizations" },
                { label: "System Reports", path: "/report" }
              ]} 
            />
          )}
        </div>
      </section>

      <section>
        <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ margin: 0 }}>Published Events</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate("/events")}>
            View All <ChevronRight size={16} />
          </Button>
        </div>

        {events.length === 0 ? (
          <Card className="flex-center" style={{ padding: "4rem", maxWidth: "100%", background: '#f1f5f9' }}>
            <div style={{ textAlign: "center" }}>
              <PlusCircle size={40} style={{ color: "var(--text-muted)", marginBottom: "1rem" }} />
              <p>No active events found. Be the first to create one!</p>
              <Button onClick={() => navigate("/create-event")}>Create New Event</Button>
            </div>
          </Card>
        ) : (
          <div className="grid-cols-auto">
            {events.map((e) => (
              <Card key={e.id} className="flex-between" style={{ maxWidth: "100%", flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ width: "100%" }}>
                  <div className="flex-between" style={{ marginBottom: "0.5rem" }}>
                    <h4 style={{ margin: 0, color: "var(--primary)" }}>{e.title}</h4>
                    <span className="badge badge-primary">#{e.id}</span>
                  </div>
                  <p style={{ fontSize: "0.9rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {e.description}
                  </p>
                </div>

                <div style={{ 
                  marginTop: "1.5rem", 
                  paddingTop: "1rem", 
                  borderTop: "1px solid var(--border-color)",
                  width: "100%",
                  fontSize: "0.85rem"
                }}>
                  <div className="flex-between" style={{ marginBottom: "5px" }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> Start
                    </span>
                    <strong>{new Date(e.startTime).toLocaleDateString()}</strong>
                  </div>
                  <div className="flex-between">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> End
                    </span>
                    <strong>{new Date(e.endTime).toLocaleDateString()}</strong>
                  </div>
                </div>
                <Button variant="outline" size="sm" style={{ width: "100%", marginTop: "1rem" }} onClick={() => navigate(`/events/${e.id}`)}>
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
