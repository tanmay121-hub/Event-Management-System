import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import { Calendar, FileText, Building, ArrowLeft, Clock } from "lucide-react";

export default function CreateEvent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    organizationId: ""
  });
  const [error, setError] = React.useState("");

  const { data: orgs = [] } = useQuery({
    queryKey: ["approved-organizations"],
    queryFn: () => API.get("/organizations/approved").then(res => res.data)
  });

  const mutation = useMutation({
    mutationFn: (data) => API.post("/events", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      navigate("/dashboard");
      alert("Event created successfully! You can now publish it.");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to create event. Please check your inputs.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!formData.organizationId) {
      setError("Please select an approved organization.");
      return;
    }
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex-center" style={{ minHeight: "90vh", padding: "40px 20px" }}>
      <Card className="glass" style={{ width: "100%", maxWidth: "600px" }}>
        <header style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="flex-center" style={{ 
            width: "60px", 
            height: "60px", 
            background: "var(--primary-light)", 
            borderRadius: "15px", 
            margin: "0 auto 1rem",
            color: "white" 
          }}>
            <Calendar size={32} />
          </div>
          <h2 style={{ margin: 0 }}>Create New Event</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Draft your event details. You can publish it once it's ready.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Event Title"
            name="title"
            icon={FileText}
            placeholder="e.g. Annual Hackathon 2024"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: 500 }}>
              <div className="flex-center" style={{ justifyContent: "flex-start", gap: "8px" }}>
                <Building size={16} /> Hosting Organization
              </div>
            </label>
            <select
              name="organizationId"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "rgba(255,255,255,0.8)",
                fontSize: "1rem",
                outline: "none",
                cursor: "pointer"
              }}
              value={formData.organizationId}
              onChange={handleChange}
              required
            >
              <option value="">Select an organization...</option>
              {orgs.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            {orgs.length === 0 && (
              <p style={{ fontSize: "0.8rem", color: "var(--accent-red)", marginTop: "5px" }}>
                You must have an approved organization to create events.
              </p>
            )}
          </div>

          <div className="grid-cols-auto" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <InputField
              label="Start Time"
              name="startTime"
              type="datetime-local"
              icon={Clock}
              value={formData.startTime}
              onChange={handleChange}
              required
            />
            <InputField
              label="End Time"
              name="endTime"
              type="datetime-local"
              icon={Clock}
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: 500 }}>
              Description
            </label>
            <textarea
              name="description"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "rgba(255,255,255,0.8)",
                minHeight: "100px",
                fontSize: "1rem",
                outline: "none"
              }}
              placeholder="What is this event about?"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p style={{ color: "var(--accent-red)", fontSize: "0.85rem", marginBottom: "1rem", textAlign: "center" }}>{error}</p>}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Button 
              type="submit" 
              loading={mutation.isPending}
              disabled={orgs.length === 0}
              style={{ width: "100%" }}
            >
              Create Draft Event
            </Button>
            <Button 
              variant="outline" 
              type="button"
              onClick={() => navigate("/dashboard")}
              style={{ width: "100%" }}
            >
              <ArrowLeft size={16} style={{ marginRight: "8px" }} />
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
