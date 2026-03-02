import React, { useEffect, useState } from "react";
import { supabase } from "./SupaCon";
import "./Dashboard.css";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [goals, setGoals] = useState([]);
  const [todayFitness, setTodayFitness] = useState(null);
  const [todayHealth, setTodayHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 🔹 Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);

      // 🔹 Fetch Goals
      const { data: goalsData } = await supabase
        .from("goals")
        .select("*")
        .eq("profile_id", profileData.profile_id);

      setGoals(goalsData || []);

      const today = new Date().toISOString().split("T")[0];

      // 🔹 Fetch Today Fitness
      const { data: fitnessData } = await supabase
        .from("fitness")
        .select("*")
        .eq("profile_id", profileData.profile_id)
        .eq("date", today)
        .maybeSingle();

      setTodayFitness(fitnessData);

      // 🔹 Fetch Today Health Metrics
      const { data: healthData } = await supabase
        .from("health_metrics")
        .select("*")
        .eq("profile_id", profileData.profile_id)
        .eq("recorded_date", today)
        .maybeSingle();

      setTodayHealth(healthData);

    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !profile) return;

    const { error } = await supabase
      .from("profile")
      .update({
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight
      })
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
    } else {
      alert("Profile Updated Successfully!");
    }
  };

  const calculateProgress = (goal) => {
    if (!todayFitness) return 0;

    let currentValue = 0;

    if (goal.goal_type === "Steps") {
      currentValue = todayFitness.steps_count || 0;
    }

    if (goal.goal_type === "Calories") {
      currentValue = todayFitness.calories_burned || 0;
    }

    if (goal.goal_type === "Water intake") {
      currentValue = todayFitness.water_intake || 0;
    }

    if (!goal.target_value) return 0;

    const progress = (currentValue / goal.target_value) * 100;
    return Math.min(progress, 100);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />

      <div className="dashboard-container">

        {/* 🔹 MAIN DASHBOARD */}
        <div className="dashboard">
          <h1>Welcome Back!</h1>
          <p>Track your fitness progress and stay motivated!</p>

          {/* FITNESS CARDS */}
          <div className="card-container">

            <div className="card">
              <h3>Calories Burned Today</h3>
              <p>{todayFitness?.calories_burned?.toFixed(2) || 0} kcal</p>
            </div>

            <div className="card">
              <h3>Steps Today</h3>
              <p>{todayFitness?.steps_count || 0}</p>
            </div>

            <div className="card">
              <h3>Water Intake</h3>
              <p>{todayFitness?.water_intake || 0} L</p>
            </div>

            <div className="card">
              <h3>Current Weight</h3>
              <p>{profile?.weight || 0} kg</p>
            </div>

          </div>

          {/* 🔹 HEALTH METRICS CARDS */}
          <div className="card-container" style={{ marginTop: "20px" }}>

            <div className="card">
              <h3>BMI</h3>
              <p>{todayHealth?.bmi?.toFixed(2) || 0}</p>
            </div>

            <div className="card">
              <h3>Metabolic Rate</h3>
              <p>{todayHealth?.metabolic_rate?.toFixed(2) || 0} kcal/day</p>
            </div>

          </div>

          {/* 🔹 GOALS SECTION */}
          <h2 style={{ marginTop: "30px" }}>My Goals</h2>

          {goals.length === 0 && <p>No goals created yet.</p>}

          {goals.map((goal) => {
            const progress = calculateProgress(goal);

            return (
              <div key={goal.goal_id} className="goal-card">
                <h3>{goal.goal_type}</h3>
                <p>Target: {goal.target_value}</p>
                <p>Progress: {progress.toFixed(1)}%</p>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                      background: progress >= 100 ? "green" : "#007bff"
                    }}
                  ></div>
                </div>

                <p>Status: {progress >= 100 ? "Completed" : "Active"}</p>
              </div>
            );
          })}

        </div>

        {/* 🔹 PROFILE UPDATE */}
        <div className="profile-card">
          <h2>Update Profile</h2>

          <input
            type="text"
            placeholder="Name"
            value={profile?.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="Age"
            value={profile?.age || ""}
            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
          />

          <input
            type="text"
            placeholder="Gender"
            value={profile?.gender || ""}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
          />

          <input
            type="number"
            placeholder="Height (cm)"
            value={profile?.height || ""}
            onChange={(e) => setProfile({ ...profile, height: e.target.value })}
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            value={profile?.weight || ""}
            onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
          />

          <button onClick={updateProfile}>
            Save Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;