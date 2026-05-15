import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import { LogIn, UserPlus, Lock, Mail, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-center animate-fade" style={{ minHeight: "85vh", padding: "20px", flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }} className="text-grad">Welcome Back</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Securely access your event management dashboard.</p>
      </div>

      <Card className="glass" style={{ maxWidth: "420px", padding: "3rem", width: '100%' }}>
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
            <LogIn size={28} />
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

        <form onSubmit={handleLogin} style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
          <InputField 
            label="Email Address"
            type="email"
            placeholder="name@example.com"
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

          <Button 
            type="submit" 
            variant="primary"
            style={{ width: "100%", marginTop: "1rem", height: '3.5rem', fontSize: '1.1rem' }}
            isLoading={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2.5rem", borderTop: "1px solid var(--border-glass)", paddingTop: "2rem" }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            New to EventPulse?{" "}
            <Link to="/register" className="text-grad" style={{ fontWeight: "700" }}>
              Create Account
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
