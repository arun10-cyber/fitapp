import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { supabase } from "./SupaCon";
import { useNavigate } from "react-router-dom";
import "./FormInput.css";

const HealthMetrics = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState("");
  const [todayRecord, setTodayRecord] = useState(null);

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profile")
      .select("profile_id")
      .eq("user_id", user.id)
      .single();

    if (!profile) return;

    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("health_metrics")
      .select("*")
      .eq("profile_id", profile.profile_id)
      .eq("recorded_date", today)
      .maybeSingle();

    if (data) {
      setTodayRecord(data);
      setWeight(data.weight);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profile")
      .select("profile_id")
      .eq("user_id", user.id)
      .single();

    if (!profile) return;

    const today = new Date().toISOString().split("T")[0];

    const { data: existing } = await supabase
      .from("health_metrics")
      .select("*")
      .eq("profile_id", profile.profile_id)
      .eq("recorded_date", today)
      .maybeSingle();

    let error;

    // Only send weight - DB trigger calculates BMI & metabolic_rate automatically
    const parsedWeight = parseFloat(weight);

    if (existing) {
      ({ error } = await supabase
        .from("health_metrics")
        .update({ weight: parsedWeight })
        .eq("profile_id", profile.profile_id)
        .eq("recorded_date", today));
    } else {
      ({ error } = await supabase
        .from("health_metrics")
        .insert([{
          weight: parsedWeight,
          recorded_date: today,
          profile_id: profile.profile_id
        }]));
    }

    
    await supabase
      .from("profile")
      .update({ weight: parseFloat(weight) })
      .eq("profile_id", profile.profile_id);

    if (error) {
      alert(error.message);
    } else {
      alert("Health data saved!");
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="natural-form-wrapper" style={{ padding: "100px 20px", textAlign: "center" }}>
        <div className="natural-form-container">
          <h2>Today's Health Metrics</h2>

          <form onSubmit={handleSubmit} className="natural-form">
            <input
              type="number"
              step="0.1"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              className="natural-input"
            />
            <br /><br />
            <button type="submit" className="natural-btn">Save / Update</button>
          </form>


        </div>
      </div>
    </div>
  );
};

export default HealthMetrics;