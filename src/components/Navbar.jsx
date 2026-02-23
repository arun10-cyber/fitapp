import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./SupaCon";
import "./Navbar.css";

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="navbar">
      <h2 className="logo">Fitness Tracker</h2>

      <div className="nav-links">
        <button onClick={()=>navigate("/dashboard")}>Dashboard</button>
        <button onClick={()=>navigate("/workout")}>Workouts</button>
        <button onClick={()=>navigate("/goals")}>Goals</button>
        <button onClick={()=>navigate("/profile")}>Profile</button>
        <button className="logout" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default Navbar;