import { useState } from "react";
import API from "../api";

export default function CreateOrganization() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await API.post("/organizations", {
        name,
        description,
      });

      alert("Organization created. Now you wait for admin judgment.");
    } catch {
      alert("Creation failed. Bureaucracy already started.");
    }
  }

  return (
    <div>
      <h2>Create Organization</h2>

      <form onSubmit={handleSubmit}>
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

        <button>Create</button>
      </form>
    </div>
  );
}
