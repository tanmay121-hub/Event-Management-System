import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Users, UserX, UserCheck, Shield, Search, Mail } from "lucide-react";

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => API.get("/admin/users").then(res => res.data)
  });

  const mutation = useMutation({
    mutationFn: ({ id, enabled }) => API.post(`/admin/users/${id}/status?enabled=${enabled}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Action failed.");
    }
  });

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex-center" style={{ height: "60vh" }}>Loading Users...</div>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <header className="flex-between" style={{ marginBottom: "2.5rem" }}>
        <div>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={32} color="var(--primary)" />
            User Management
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "5px" }}>Control user access and review platform roles.</p>
        </div>
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input 
            type="text"
            placeholder="Search users..."
            className="input-field"
            style={{ 
              paddingLeft: "40px", 
              width: "300px",
              margin: 0
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid-cols-auto" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
        {filteredUsers.map(user => (
          <Card key={user.id} className="glass" style={{ borderLeft: user.enabled ? '4px solid #166534' : '4px solid #991b1b' }}>
            <div className="flex-between" style={{ marginBottom: "1rem" }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: 'var(--primary-light)', 
                  color: 'white' 
                }} className="flex-center">
                  <Users size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{user.fullName || "User #" + user.id}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Mail size={12} /> {user.email}
                  </div>
                </div>
              </div>
              <div className="badge" style={{ 
                background: user.role === 'ADMIN' ? '#eff6ff' : '#f1f5f9',
                color: user.role === 'ADMIN' ? '#1e40af' : '#475569'
              }}>
                {user.role}
              </div>
            </div>

            <div className="flex-between" style={{ marginTop: "1rem" }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <div style={{ 
                   width: '10px', 
                   height: '10px', 
                   borderRadius: '50%', 
                   background: user.enabled ? '#22c55e' : '#ef4444' 
                 }} />
                 <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                   {user.enabled ? "Active Account" : "Disabled"}
                 </span>
               </div>
               
               <Button 
                 variant={user.enabled ? "outline" : "primary"}
                 size="sm"
                 onClick={() => mutation.mutate({ id: user.id, enabled: !user.enabled })}
                 loading={mutation.isPending}
                 style={{ 
                   borderColor: user.enabled ? '#fee2e2' : 'var(--primary)',
                   color: user.enabled ? '#991b1b' : 'white'
                 }}
               >
                 {user.enabled ? (
                   <><UserX size={14} style={{ marginRight: '5px' }} /> Disable</>
                 ) : (
                   <><UserCheck size={14} style={{ marginRight: '5px' }} /> Enable</>
                 )}
               </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div style={{ textAlign: "center", padding: "100px", opacity: 0.5 }}>
          <Users size={48} style={{ marginBottom: "1rem" }} />
          <p>No users found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
