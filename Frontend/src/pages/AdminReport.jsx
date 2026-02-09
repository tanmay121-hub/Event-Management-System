import { useEffect, useState } from "react";
import API from "../api";

export default function AdminReport() {
  const [summary, setSummary] = useState("");

  useEffect(() => {
    API.get("/admin/reports/summary")
      .then((res) => setSummary(res.data))
      .catch(() => setSummary("Report failed. Bureaucracy wins."));
  }, []);

  return (
    <div>
      <h2>Admin Summary</h2>
      <p>{summary}</p>
    </div>
  );
}
