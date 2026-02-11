import { useEffect, useState } from "react";
import API from "../api";

export default function ApprovedOrganizations() {
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    API.get("/organizations/approved")
      .then((res) => setOrgs(res.data))
      .catch(() => alert("No approved orgs, or backend is napping."));
  }, []);

  return (
    <div>
      <h2>Approved Organizations</h2>

      {orgs.map((o) => (
        <div key={o.id}>
          <h4>{o.name}</h4>
          <p>{o.description}</p>
          <small>Status: {o.status}</small>
        </div>
      ))}
    </div>
  );
}
