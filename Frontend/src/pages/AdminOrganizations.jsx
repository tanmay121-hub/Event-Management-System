import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Building2, CheckCircle, XCircle, Clock, Search } from "lucide-react";

export default function AdminOrganizations() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState("");

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ["admin-organizations"],
    queryFn: () => API.get("/organizations/directory").then(res => res.data)
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }) => API.post(`/organizations/${id}/status?status=${status}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-organizations"]);
      alert("Organization status updated successfully.");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  });

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex-center" style={{ height: "60vh" }}>Loading Directory...</div>;

  const StatusBadge = ({ status }) => {
    const styles = {
      APPROVED: { bg: "#dcfce7", color: "#166534", icon: CheckCircle },
      PENDING: { bg: "#fef9c3", color: "#854d0e", icon: Clock },
      REJECTED: { bg: "#fee2e2", color: "#991b1b", icon: XCircle }
    };
    const config = styles[status] || styles.PENDING;
    const Icon = config.icon;

    return (
      <span style={{ 
        display: "inline-flex", 
        alignItems: "center", 
        gap: "4px", 
        padding: "4px 10px", 
        borderRadius: "20px", 
        fontSize: "0.8rem", 
        fontWeight: 600,
        background: config.bg,
        color: config.color
      }}>
        <Icon size={14} /> {status}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      <header className="flex-between" style={{ marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>Organization Directory</h1>
          <p style={{ color: "var(--text-muted)" }}>Review and manage all registered organizations.</p>
        </div>
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input 
            type="text"
            placeholder="Search organizations..."
            style={{ 
              padding: "10px 10px 10px 40px", 
              borderRadius: "8px", 
              border: "1px solid var(--border-color)",
              outline: "none",
              width: "250px"
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid-cols-auto" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "1.5rem" }}>
        {filteredOrgs.map(org => (
          <Card key={org.id} className="glass flex-between" style={{ alignItems: "flex-start", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <div className="flex-between" style={{ marginBottom: "10px" }}>
                <h3 style={{ margin: 0, color: "var(--primary)" }}>{org.name}</h3>
                <StatusBadge status={org.status} />
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1rem" }}>{org.description}</p>
              <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                <strong>Creator:</strong> {org.creatorEmail || "N/A"}
              </div>
            </div>

            {org.status === "PENDING" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Button 
                  size="sm" 
                  onClick={() => mutation.mutate({ id: org.id, status: "APPROVED" })}
                  loading={mutation.isPending}
                  style={{ background: "#166534" }}
                >
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => mutation.mutate({ id: org.id, status: "REJECTED" })}
                  loading={mutation.isPending}
                  style={{ color: "#991b1b", borderColor: "#fee2e2" }}
                >
                  Reject
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredOrgs.length === 0 && (
        <div style={{ textAlign: "center", padding: "100px", opacity: 0.5 }}>
          <Building2 size={48} style={{ marginBottom: "1rem" }} />
          <p>No organizations found matching your search.</p>
        </div>
      )}
    </div>
  );
}
