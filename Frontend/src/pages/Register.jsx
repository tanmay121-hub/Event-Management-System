import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARTICIPANT"); // default role
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        fullName,
        email,
        password,
        role,
      });

      navigate("/");
    } catch {
      alert("Registration failed");
    }
  }

  return (
    <div className="app-container">
      <h2>Register</h2>

      <form onSubmit={handleRegister} className="card">
        <input
          placeholder="Full Name"
          onChange={(e) => setFullName(e.target.value)}
        />

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select onChange={(e) => setRole(e.target.value)}>
          <option value="PARTICIPANT">Participant</option>
          <option value="ORGANIZER">Organizer</option>
        </select>

        <button>Create Account</button>
      </form>

      <p>
        Already have one? <Link to="/">Login</Link>
      </p>
    </div>
  );
}
