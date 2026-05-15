import React from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import Button from "./ui/Button";
import { LogOut, CalendarDays } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.log("Logout API failed (safe to ignore)");
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="glass" style={{ marginBottom: '40px' }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          cursor: 'pointer' 
        }}
        onClick={() => navigate(token ? "/dashboard" : "/")}
      >
        <div style={{ 
          background: 'var(--grad-primary)', 
          padding: '10px', 
          borderRadius: '12px', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
        }}>
          <CalendarDays size={24} />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }} className="text-grad">
          EventPulse
        </h2>
      </div>

      {token && (
        <div className="flex-center" style={{ gap: '15px' }}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            style={{ color: '#f87171', fontWeight: '600', background: 'rgba(239, 68, 68, 0.05)' }}
          >
            <LogOut size={18} style={{ marginRight: '8px' }} />
            Sign Out
          </Button>
        </div>
      )}
    </header>
  );
}

export default Header;
