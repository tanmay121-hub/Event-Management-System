import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function CreateOrganization() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await API.post("/organizations", {
        name,
        description,
      });

      alert("Organization created. Now wait for admin to Accept");
    } catch {
      alert("Creation failed.");
    }
  }

  return (
    <div>
      <h2>Create Organization</h2>

      <form>
        <input
          placeholder="Organization Name"
          onChange={(e) => setName(e.target.value)}
        />
        <br />

        <textarea
          placeholder="What is this organization about?"
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />

        <button onClick={handleSubmit}>Create</button>
        <button onClick={() => navigate("/dashboard")}>Profile</button>
      </form>
    </div>
  );
}
