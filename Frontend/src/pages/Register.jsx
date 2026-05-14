import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import { UserPlus, Mail, Lock, User, Briefcase, AlertCircle } from "lucide-react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARTICIPANT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", {
        fullName,
        email,
        password,
        role,
      });

      // After registration, we can automatically log them in or redirect to login
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-center" style={{ minHeight: "90vh", padding: "20px" }}>
      <Card className="glass" style={{ maxWidth: "500px", padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ 
            display: "inline-flex", 
            padding: "12px", 
            background: "var(--grad-primary)", 
            borderRadius: "15px", 
            color: "white",
            marginBottom: "1rem"
          }}>
            <UserPlus size={32} />
          </div>
          <h2 style={{ marginBottom: "0.5rem" }}>Create Account</h2>
          <p style={{ margin: 0 }}>Join EventPulse to manage and discover events</p>
        </div>

        {error && (
          <div className="badge" style={{ 
            background: "#fee2e2", 
            color: "#b91c1c", 
            padding: "12px", 
            width: "100%", 
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "8px",
            textTransform: "none"
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <InputField 
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <InputField 
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <InputField 
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label>I want to be an:</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ marginBottom: 0 }}
            >
              <option value="PARTICIPANT">Participant (Join Events)</option>
              <option value="ORGANIZER">Organizer (Host Events)</option>
            </select>
          </div>

          <Button 
            type="submit" 
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
          <p style={{ margin: 0 }}>
            Already have an account?{" "}
            <Link to="/" style={{ fontWeight: "600" }}>
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
