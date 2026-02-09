import { useState } from "react";
import API from "../api";

export default function AdminOrganizations() {
  const [orgId, setOrgId] = useState("");

  async function updateStatus(status) {
    try {
      await API.patch(`/organizations/${orgId}/status?status=${status}`);
      alert(`Organization ${status}. Power feels heavy.`);
    } catch {
      alert("Update failed. Authority questioned.");
    }
  }

  return (
    <div>
      <h2>Admin: Organization Approval</h2>

      <input
        placeholder="Organization ID"
        onChange={(e) => setOrgId(e.target.value)}
      />
      <br />

      <button onClick={() => updateStatus("APPROVED")}>Approve</button>
      <button onClick={() => updateStatus("REJECTED")}>Reject</button>
    </div>
  );
}
