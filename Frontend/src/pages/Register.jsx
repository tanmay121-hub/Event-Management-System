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
    <div className="flex-center animate-fade" style={{ minHeight: "90vh", padding: "20px", flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }} className="text-grad">Join EventPulse</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Start your journey into the world of seamless events.</p>
      </div>

      <Card className="glass" style={{ maxWidth: "480px", padding: "3rem", width: '100%' }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ 
            display: "inline-flex", 
            padding: "15px", 
            background: "var(--grad-primary)", 
            borderRadius: "18px", 
            color: "white",
            marginBottom: "1rem",
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
          }}>
            <UserPlus size={28} />
          </div>
        </div>

        {error && (
          <div className="badge-danger" style={{ 
            padding: "12px", 
            width: "100%", 
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderRadius: "10px",
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
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

          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">Select Your Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
              style={{ marginBottom: 0 }}
            >
              <option value="PARTICIPANT">Participant (Discover Events)</option>
              <option value="ORGANIZER">Organizer (Create Events)</option>
            </select>
          </div>

          <Button 
            type="submit" 
            variant="primary"
            style={{ width: "100%", marginTop: "1rem", height: '3.5rem', fontSize: '1.1rem' }}
            isLoading={loading}
          >
            {loading ? "Creating Account..." : "Join Now"}
          </Button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2.5rem", borderTop: "1px solid var(--border-glass)", paddingTop: "2rem" }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            Already have an account?{" "}
            <Link to="/" className="text-grad" style={{ fontWeight: "700" }}>
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
