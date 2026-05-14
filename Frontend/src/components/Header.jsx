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
    <header className="glass" style={{ marginBottom: '20px' }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          cursor: 'pointer' 
        }}
        onClick={() => navigate(token ? "/dashboard" : "/")}
      >
        <div style={{ 
          background: 'var(--grad-primary)', 
          padding: '8px', 
          borderRadius: '10px', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CalendarDays size={24} />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          EventPulse
        </h2>
      </div>

      {token && (
        <div className="flex-center" style={{ gap: '15px' }}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            style={{ color: 'var(--danger)', fontWeight: '600' }}
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
