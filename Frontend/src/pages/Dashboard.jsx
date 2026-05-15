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
    <div className="container animate-fade">
      <header className="flex-between" style={{ background: "transparent", border: "none", padding: "0 0 3rem 0", width: '100%', margin: 0, top: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Dashboard</h1>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>Welcome to the command center of your events.</p>
        </div>
        <div className="flex-center" style={{ gap: "15px" }}>
           <Button variant="secondary" onClick={() => navigate("/profile")}>
              <Settings size={18} />
              <span>Settings</span>
           </Button>
        </div>
      </header>

      {profile && (
        <div className="card bg-grad-primary" style={{ marginBottom: "3rem", padding: '2.5rem' }}>
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', 
                background: 'rgba(255,255,255,0.2)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 800, color: 'white',
                border: '2px solid rgba(255,255,255,0.4)'
              }}>
                {profile.fullName.charAt(0)}
              </div>
              <div>
                <h2 style={{ color: "white", margin: 0, fontSize: '1.8rem' }}>
                  Hello, {profile.fullName.split(' ')[0]}!
                </h2>
                <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>{profile.email}</p>
              </div>
            </div>
            <div className="badge glass" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem' }}>
              {profile.role}
            </div>
          </div>
        </div>
      )}

      <section style={{ marginBottom: "4rem" }}>
        <div className="flex-between" style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: '1.5rem' }}>Quick Actions</h3>
        </div>
        <div className="grid-auto">
          {/* MANAGEMENT ZONE (Admin & Organizer) */}
          {(profile?.role === "ADMIN" || profile?.role === "ORGANIZER") && (
            <>
              <QuickAction 
                icon={Calendar} 
                title="Events" 
                actions={[
                  { label: "Create Event", path: "/create-event" },
                  { label: "Manage Events", path: "/manage-events" }
                ]} 
              />
              <QuickAction 
                icon={Megaphone} 
                title="Announcements" 
                actions={[
                  { label: "New Update", path: "/announcements/create" },
                  { label: "View Updates", path: "/announcements/view" }
                ]} 
              />
            </>
          )}

          {/* PARTICIPATION ZONE (Everyone) */}
          <QuickAction 
            icon={ClipboardCheck} 
            title="Attendance" 
            actions={[
              { label: "Check-In", path: "/checkin" },
              { label: "History", path: "/attendance" }
            ]} 
          />
          
          <QuickAction 
            icon={Building2} 
            title="Community" 
            actions={[
              { label: "Teams", path: "/teams/create" },
              { label: "Organizations", path: "/organizations/approved" }
            ]} 
          />
        </div>
      </section>

      <section className="animate-fade" style={{ animationDelay: '0.2s' }}>
        <div className="flex-between" style={{ marginBottom: "2rem" }}>
          <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Published Events</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate("/events")}>
            Explore All <ChevronRight size={18} />
          </Button>
        </div>

        {events.length === 0 ? (
          <Card className="flex-center" style={{ padding: "5rem 2rem", background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ textAlign: "center" }}>
              <PlusCircle size={48} style={{ color: "var(--primary)", marginBottom: "1.5rem", opacity: 0.5 }} />
              <p style={{ fontSize: '1.1rem' }}>No events are live yet.</p>
              <Button variant="primary" onClick={() => navigate("/create-event")}>Host an Event</Button>
            </div>
          </Card>
        ) : (
          <div className="grid-auto">
            {events.map((e, index) => (
              <Card key={e.id} className="animate-fade" style={{ animationDelay: `${0.1 * index + 0.3}s`, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div className="flex-between" style={{ marginBottom: "1rem" }}>
                    <span className="badge badge-primary">{e.organizationName}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{e.id}</span>
                  </div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{e.title}</h4>
                  <p style={{ fontSize: "0.95rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {e.description}
                  </p>
                </div>

                <div style={{ 
                  marginTop: "1rem", 
                  paddingTop: "1.5rem", 
                  borderTop: "1px solid var(--border-glass)",
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                    <span className="flex-center" style={{ gap: '6px', color: 'var(--text-muted)' }}>
                      <Calendar size={14} /> Start
                    </span>
                    <span style={{ fontWeight: 600 }}>{new Date(e.startTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                    <span className="flex-center" style={{ gap: '6px', color: 'var(--text-muted)' }}>
                      <Calendar size={14} /> End
                    </span>
                    <span style={{ fontWeight: 600 }}>{new Date(e.endTime).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="outline" style={{ width: "100%", marginTop: "1rem" }} onClick={() => navigate(`/events/${e.id}`)}>
                  Details
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
