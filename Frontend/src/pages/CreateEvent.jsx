import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function CreateEvent() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await API.post("/events", form);
      alert("Event created. Try not to break it.");
      navigate("/dashboard");
    } catch {
      alert("Backend said no. Shocking.");
    }
  }

  return (
    <div>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Event Name" onChange={handleChange} />
        <br />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <br />

        <input type="date" name="date" onChange={handleChange} />
        <br />

        <input name="location" placeholder="Location" onChange={handleChange} />
        <br />

        <button>Create Event</button>
      </form>
    </div>
  );
}
