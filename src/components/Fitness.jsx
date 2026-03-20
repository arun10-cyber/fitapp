import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { supabase } from "./SupaCon";
import { useNavigate } from "react-router-dom";
import "./FormInput.css";

const Fitness = () => {
  const navigate = useNavigate();

  const [steps, setSteps] = useState("");
  const [distance, setDistance] = useState("");
  const [water, setWater] = useState("");
  const [sleep, setSleep] = useState("");

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
      .from("fitness")
      .select("*")
      .eq("profile_id", profile.profile_id)
      .eq("date", today)
      .maybeSingle();

    if (data) {
      setSteps(data.steps_count || "");
      setDistance(data.distance_travelled || "");
      setWater(data.water_intake || "");
      setSleep(data.sleep_duration || "");
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

    // Check existing
    const { data: existing } = await supabase
      .from("fitness")
      .select("*")
      .eq("profile_id", profile.profile_id)
      .eq("date", today)
      .maybeSingle();

    let error;

    if (existing) {
      ({ error } = await supabase
        .from("fitness")
        .update({
          steps_count: parseInt(steps),
          distance_travelled: parseFloat(distance),
          water_intake: parseFloat(water),
          sleep_duration: parseFloat(sleep),
        })
        .eq("profile_id", profile.profile_id)
        .eq("date", today));
    } else {
      ({ error } = await supabase.from("fitness").insert([
        {
          steps_count: parseInt(steps),
          distance_travelled: parseFloat(distance),
          water_intake: parseFloat(water),
          sleep_duration: parseFloat(sleep),
          date: today,
          profile_id: profile.profile_id,
        },
      ]));
    }

    if (error) {
      alert(error.message);
    } else {
      alert("Saved successfully!");
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="natural-form-wrapper" style={{ padding: "100px 20px", textAlign: "center" }}>
        <div className="natural-form-container">
          <h2>Today's Fitness</h2>

          <form onSubmit={handleSubmit} className="natural-form">
            <input type="number" placeholder="Steps"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              required className="natural-input" /><br /><br />

            <input type="number" step="0.1" placeholder="Distance (km)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required className="natural-input" /><br /><br />

            <input type="number" step="0.1" placeholder="Water Intake (L)"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              required className="natural-input" /><br /><br />

            <input type="number" step="0.1" placeholder="Sleep (hours)"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              required className="natural-input" /><br /><br />

            <button type="submit" className="natural-btn">Save / Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Fitness;