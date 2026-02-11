import { useEffect, useState } from "react";
import API from "../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => alert("Admin access denied."));
  }, []);

  async function toggleUser(id, currentStatus) {
    try {
      await API.post(`/admin/users/${id}/status`, null, {
        params: { enabled: !currentStatus },
      });
      setUsers(
        users.map((u) => (u.id === id ? { ...u, enabled: !currentStatus } : u)),
      );
    } catch {
      alert("Backend said no.");
    }
  }
  return (
    <div>
      <h2>Admin: User Management</h2>

      {users.map((user) => (
        <div key={user.id}>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role :</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> {user.enabled ? "Active" : "Disabled"}
          </p>

          <button onClick={() => toggleUser(user.id, user.enabled)}>
            {user.enabled ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </div>
  );
}
