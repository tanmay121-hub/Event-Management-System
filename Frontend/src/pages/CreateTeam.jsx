import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import API from "../api";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import { Users, ChevronLeft } from "lucide-react";

export default function CreateTeam() {
  const navigate = useNavigate();
  const [eventId, setEventId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [msg, setMsg] = useState("");

  const { data: events = [], isLoading: isEventsLoading } = useQuery({
    queryKey: ["published-events"],
    queryFn: () => API.get("/events/published").then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => API.post("/teams", data),
    onSuccess: (res) => {
      setMsg(`Team "${res.data.name}" created successfully! Join Code: ${res.data.joinCode}`);
    },
    onError: (err) => {
      setMsg(err.response?.data?.message || "Team creation failed.");
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!eventId || !teamName) {
      setMsg("Please fill in all fields.");
      return;
    }
    createMutation.mutate({
      eventId: Number(eventId),
      name: teamName,
    });
  };

  return (
    <div className="container animate-fade">
      <Button variant="ghost" onClick={() => navigate(-1)} style={{ marginBottom: "2rem" }}>
        <ChevronLeft size={18} /> Back
      </Button>

      <Card className="glass" style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem" }}>
        <div className="flex-center" style={{ gap: "15px", justifyContent: "flex-start", marginBottom: "3rem" }}>
          <div style={{ 
            padding: "12px", 
            background: "var(--grad-primary)", 
            borderRadius: "14px", 
            color: "white",
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Users size={28} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem' }} className="text-grad">Form Your Squad</h2>
        </div>

        <form onSubmit={handleCreate} style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
          <div className="input-group">
            <label className="input-label">Select Target Event</label>
            <select 
              className="input-field"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              disabled={isEventsLoading}
            >
              <option value="" disabled>-- Select a Published Event --</option>
              {events.map(e => (
                <option key={e.id} value={e.id} style={{ background: '#0f172a' }}>{e.title} (#{e.id})</option>
              ))}
            </select>
            {isEventsLoading && <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Syncing available events...</p>}
          </div>

          <InputField 
            label="Team Name"
            placeholder="e.g. Code Gladiators"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />

          {msg && (
            <div className={msg.includes("successfully") ? "badge-success" : "badge-danger"} style={{ 
              width: "100%", padding: "1.2rem", marginBottom: "2rem", textAlign: "center", borderRadius: '12px', fontSize: '0.95rem' 
            }}>
              {msg}
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            style={{ width: "100%", marginTop: "1rem", height: '3.5rem', fontSize: '1.1rem' }}
            isLoading={createMutation.isPending}
          >
            Launch Team
          </Button>
        </form>
      </Card>
    </div>
  );
}
