import React from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function Profile() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => API.get("/user/me").then((res) => res.data),
  });

  if (isLoading) return <div className="flex-center" style={{ minHeight: "60vh" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ marginBottom: "2rem" }}>Your Profile</h1>
      
      <Card className="glass" style={{ maxWidth: "100%", padding: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="flex-center" style={{ gap: "15px", justifyContent: "flex-start" }}>
            <div style={{ padding: "12px", background: "var(--primary)", borderRadius: "50%", color: "white" }}>
              <User size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Full Name</div>
              <strong style={{ fontSize: "1.2rem" }}>{user.fullName}</strong>
            </div>
          </div>

          <div className="flex-center" style={{ gap: "15px", justifyContent: "flex-start" }}>
            <div style={{ padding: "12px", background: "var(--primary-light)", borderRadius: "50%", color: "white" }}>
              <Mail size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Email Address</div>
              <strong>{user.email}</strong>
            </div>
          </div>

          <div className="flex-center" style={{ gap: "15px", justifyContent: "flex-start" }}>
            <div style={{ padding: "12px", background: "var(--accent)", borderRadius: "50%", color: "white" }}>
              <Shield size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>System Role</div>
              <span className="badge badge-primary">{user.role}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)" }}>
           <Button variant="outline" style={{ width: "100%" }} onClick={() => {
             localStorage.removeItem("token");
             window.location.href = "/";
           }}>
             Logout
           </Button>
        </div>
      </Card>
    </div>
  );
}
