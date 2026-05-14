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
    <div className="flex-center" style={{ minHeight: "80vh", padding: "20px" }}>
      <Card className="glass" style={{ maxWidth: "450px", padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ 
            display: "inline-flex", 
            padding: "12px", 
            background: "var(--grad-primary)", 
            borderRadius: "15px", 
            color: "white",
            marginBottom: "1rem"
          }}>
            <LogIn size={32} />
          </div>
          <h2 style={{ marginBottom: "0.5rem" }}>Welcome Back</h2>
          <p style={{ margin: 0 }}>Enter your credentials to access your account</p>
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

        <form onSubmit={handleLogin}>
          <InputField 
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          
          <InputField 
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button 
            type="submit" 
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
          <p style={{ margin: 0 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ fontWeight: "600" }}>
              Create Account
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
