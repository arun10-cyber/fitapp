import React, { useState } from "react";
import { supabase } from "./SupaCon";
import { Link, useNavigate } from "react-router-dom";
import "./SignupPage.css";

function SignupPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful!");
      navigate("/");
    }
  };

  return (
  <div className="signup-container">

    {/* APP NAME */}
    <h1 className="app-title">Fitness Tracker</h1>

    <div className="signup-card">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account?
        <Link to="/"> Login</Link>
      </p>

    </div>
  </div>
);
}

export default SignupPage;