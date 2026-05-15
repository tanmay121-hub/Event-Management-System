import React from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../api";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Calendar, ChevronRight } from "lucide-react";

export default function EventList() {
  const navigate = useNavigate();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["all-published-events"],
    queryFn: () => API.get("/events/published").then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: "60vh" }}>
        <div className="loader">Loading Events...</div>
      </div>
    );
  }

  return (
    <div className="container animate-fade">
      <header style={{ marginBottom: "4rem" }}>
        <h1 className="text-grad">Published Events</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Explore upcoming and ongoing events from various organizations.</p>
      </header>

      {events.length === 0 ? (
        <Card className="flex-center glass" style={{ padding: "5rem 2rem", background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ textAlign: 'center' }}>
            <Calendar size={48} style={{ color: "var(--primary)", marginBottom: "1.5rem", opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem' }}>No events are live at the moment. Check back soon!</p>
          </div>
        </Card>
      ) : (
        <div className="grid-auto">
          {events.map((e, index) => (
            <Card key={e.id} className="animate-fade" style={{ animationDelay: `${0.1 * index}s`, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ flex: 1 }}>
                <div className="flex-between" style={{ marginBottom: "1.2rem" }}>
                  <span className="badge badge-primary">{e.organizationName}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{e.id}</span>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontWeight: 800 }}>{e.title}</h3>
                <p style={{ fontSize: "0.95rem", color: 'var(--text-muted)', display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {e.description}
                </p>
              </div>

              <div style={{ 
                marginTop: "1rem", 
                paddingTop: "1.5rem", 
                borderTop: "1px solid var(--border-glass)",
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                  <span className="flex-center" style={{ gap: '8px', color: 'var(--text-muted)' }}>
                    <Calendar size={16} /> Starts
                  </span>
                  <span style={{ fontWeight: 600 }}>{new Date(e.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                  <span className="flex-center" style={{ gap: '8px', color: 'var(--text-muted)' }}>
                    <Calendar size={16} /> Ends
                  </span>
                  <span style={{ fontWeight: 600 }}>{new Date(e.endTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <Button variant="primary" style={{ width: "100%", marginTop: "0.5rem" }} onClick={() => navigate(`/events/${e.id}`)}>
                Explore Details
                <ChevronRight size={18} />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
