import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import API from "../api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Calendar, Building2, User, Clock, MapPin } from "lucide-react";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => API.get(`/events`).then((res) => res.data.find(e => e.id === parseInt(id))),
  });

  const registerMutation = useMutation({
    mutationFn: (data) => API.post("/registrations", data),
    onSuccess: () => {
      setMsg("Registration successful! Wait for approval.");
    },
    onError: (err) => {
      setMsg(err.response?.data?.message || "Registration failed");
    },
  });

  if (isLoading) return <div className="flex-center" style={{ minHeight: "60vh" }}>Loading...</div>;
  if (!event) return <div className="flex-center" style={{ minHeight: "60vh" }}>Event not found</div>;

  const handleRegister = (type) => {
    registerMutation.mutate({
      eventId: event.id,
      type: type // INDIVIDUAL or TEAM
    });
  };

  return (
    <div className="container animate-fade">
      <Button variant="ghost" onClick={() => navigate(-1)} style={{ marginBottom: "2rem" }}>
        ← Back to Events
      </Button>

      <Card className="glass" style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem" }}>
        <div className="flex-between" style={{ marginBottom: "2.5rem", alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>{event.organizationName}</span>
            <h1 style={{ margin: 0, fontSize: '3rem' }} className="text-grad">{event.title}</h1>
          </div>
          <div className="badge-success" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.9rem' }}>
            {event.status}
          </div>
        </div>

        <p style={{ fontSize: "1.15rem", color: 'var(--text-muted)', lineHeight: "1.8", marginBottom: "3rem" }}>
          {event.description}
        </p>

        <div className="grid-auto" style={{ gap: "1.5rem", marginBottom: "4rem" }}>
          <InfoCard icon={Building2} label="Organization" value={event.organizationName} />
          <InfoCard icon={User} label="Organizer" value={event.organizerEmail} />
          <InfoCard icon={Calendar} label="Starts" value={new Date(event.startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} />
          <InfoCard icon={Clock} label="Ends" value={new Date(event.endTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} />
        </div>

        {msg && (
          <div className={msg.includes("successful") ? "badge-success" : "badge-danger"} style={{ 
            width: "100%", padding: "1.2rem", marginBottom: "2.5rem", textAlign: "center", borderRadius: '12px', fontSize: '1rem' 
          }}>
            {msg}
          </div>
        )}

        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Button 
            variant="primary" 
            style={{ flex: 1, height: '4rem', fontSize: '1.1rem' }} 
            onClick={() => handleRegister("INDIVIDUAL")}
            isLoading={registerMutation.isPending}
          >
            Register as Individual
          </Button>
          <Button 
            variant="secondary" 
            style={{ flex: 1, height: '4rem', fontSize: '1.1rem' }} 
            onClick={() => navigate("/teams/create")}
          >
            Join with a Team
          </Button>
        </div>
      </Card>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div style={{ 
      padding: '1.5rem', 
      background: 'rgba(255,255,255,0.03)', 
      borderRadius: '16px', 
      border: '1px solid var(--border-glass)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    }}>
      <div style={{ 
        padding: '10px', 
        background: 'rgba(99, 102, 241, 0.1)', 
        borderRadius: '12px', 
        color: 'var(--primary)' 
      }}>
        <Icon size={20} />
      </div>
      <div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: '2px' }}>{label}</div>
        <div style={{ fontWeight: 600, fontSize: '1rem' }}>{value}</div>
      </div>
    </div>
  );
}
