import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import { Building2, FileText, ArrowLeft } from "lucide-react";

export default function CreateOrganization() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = React.useState({ name: "", description: "" });
  const [error, setError] = React.useState("");

  const mutation = useMutation({
    mutationFn: (data) => API.post("/organizations", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["organizations"]);
      navigate("/dashboard");
      alert("Application submitted! An admin will review your organization soon.");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to create organization. Please try again.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.description) {
      setError("Please fill in all fields.");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="flex-center" style={{ minHeight: "80vh", padding: "20px" }}>
      <Card className="glass" style={{ width: "100%", maxWidth: "500px" }}>
        <header style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="flex-center" style={{ 
            width: "60px", 
            height: "60px", 
            background: "var(--primary-light)", 
            borderRadius: "15px", 
            margin: "0 auto 1rem",
            color: "white" 
          }}>
            <Building2 size={32} />
          </div>
          <h2 style={{ margin: 0 }}>Register Organization</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Create an organization to start hosting your own events.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Organization Name"
            icon={Building2}
            placeholder="e.g. Tech Community, Sports Club"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: 500 }}>
              <div className="flex-center" style={{ justifyContent: "flex-start", gap: "8px" }}>
                <FileText size={16} /> Description
              </div>
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "rgba(255,255,255,0.8)",
                minHeight: "120px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              placeholder="Tell us about your organization's mission and goals..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {error && <p style={{ color: "var(--accent-red)", fontSize: "0.85rem", marginBottom: "1rem", textAlign: "center" }}>{error}</p>}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Button 
              type="submit" 
              loading={mutation.isPending}
              style={{ width: "100%" }}
            >
              Submit Application
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
              style={{ width: "100%" }}
            >
              <ArrowLeft size={16} style={{ marginRight: "8px" }} />
              Back to Dashboard
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
