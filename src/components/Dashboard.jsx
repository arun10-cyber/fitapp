import React, { useEffect, useState } from "react";
import { supabase } from "./SupaCon";
import "./Dashboard.css";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [goals, setGoals] = useState([]);
  const [todayFitness, setTodayFitness] = useState(null);
  const [todayHealth, setTodayHealth] = useState(null);
  const [allHealthMetrics, setAllHealthMetrics] = useState([]);
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

      // 🔹 Fetch All Health Metrics for Weight Tracking
      const { data: allHealthData } = await supabase
        .from("health_metrics")
        .select("weight, recorded_date")
        .eq("profile_id", profileData.profile_id)
        .order("recorded_date", { ascending: true });

      setAllHealthMetrics(allHealthData || []);

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
      // Upsert health metric for today - DB trigger calculates BMI & metabolic_rate
      const today = new Date().toISOString().split("T")[0];
      const { data: existingMetric } = await supabase
        .from("health_metrics")
        .select("metric_id")
        .eq("profile_id", profile.profile_id)
        .eq("recorded_date", today)
        .maybeSingle();

      if (existingMetric) {
        await supabase
          .from("health_metrics")
          .update({ weight: parseFloat(profile.weight) })
          .eq("metric_id", existingMetric.metric_id);
      } else {
        await supabase
          .from("health_metrics")
          .insert([{
            weight: parseFloat(profile.weight),
            recorded_date: today,
            profile_id: profile.profile_id
          }]);
      }

      alert("Profile Updated Successfully!");
      fetchAllData(); // Refresh data to update progress
    }
  };

  const deleteGoal = async (goalId) => {
    const { error } = await supabase.from("goals").delete().eq("goal_id", goalId);
    if (error) {
      alert(error.message);
    } else {
      setGoals(goals.filter((g) => g.goal_id !== goalId));
    }
  };

  const calculateProgress = (goal) => {
    if (!todayFitness && goal.goal_type !== "Weight loss") return 0;

    let currentValue = 0;

    if (goal.goal_type === "Weight loss") {
      // Find the most recent weight recorded on or before the start date
      const sortedMetrics = [...allHealthMetrics].sort((a, b) => new Date(b.recorded_date) - new Date(a.recorded_date));
      let startMetric = sortedMetrics.find(m => m.recorded_date <= goal.start_date);
      if (!startMetric && allHealthMetrics.length > 0) {
        startMetric = allHealthMetrics[0]; // fallback to oldest
      }

      let startWeight = startMetric && startMetric.weight ? startMetric.weight : (profile?.weight || 0);
      const currentWeight = profile?.weight || 0;
      let targetWeight = goal.target_value;

      // Handle cases where user entered amount to lose (e.g. 1kg) instead of target absolute weight (e.g. 60kg)
      if (targetWeight < 30) {
        targetWeight = startWeight - targetWeight;
      }

      if (startWeight <= targetWeight) {
        return currentWeight <= targetWeight ? 100 : 0;
      }

      const totalToLose = startWeight - targetWeight;
      const totalLost = startWeight - currentWeight;

      if (totalToLose <= 0) return 0;
      if (totalLost <= 0) return 0;

      const progress = (totalLost / totalToLose) * 100;
      return Math.min(Math.max(progress, 0), 100);
    }

    if (goal.goal_type === "Steps") {
      currentValue = todayFitness?.steps_count || 0;
    }

    if (goal.goal_type === "Calories") {
      currentValue = todayFitness?.calories_burned || 0;
    }

    if (goal.goal_type === "Water intake") {
      currentValue = todayFitness?.water_intake || 0;
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
              <p>{todayHealth?.bmi ? todayHealth.bmi.toFixed(2) : "0.00"}</p>
            </div>

            <div className="card">
              <h3>Metabolic Rate</h3>
              <p>{todayHealth?.metabolic_rate ? todayHealth.metabolic_rate.toFixed(2) : "0.00"} kcal/day</p>
            </div>

          </div>

          {/* 🔹 GOALS SECTION */}
          <h2 style={{ marginTop: "30px" }}>My Goals</h2>

          {goals.length === 0 && <p>No goals created yet.</p>}

          {goals.map((goal) => {
            const progress = calculateProgress(goal);
            const today = new Date().toISOString().split("T")[0];
            const isEnded = goal.end_date && goal.end_date < today;

            const unit = goal.goal_type === "Weight loss" ? "kg" :
              goal.goal_type === "Steps" ? "steps/day" :
                goal.goal_type === "Calories" ? "kcal/day" :
                  goal.goal_type === "Water intake" ? "L/day" :
                    goal.goal_type === "Muscle gain" ? "kg" : "";

            return (
              <div key={goal.goal_id} className="goal-card">
                <h3>{goal.goal_type}</h3>
                <p>Target: {goal.target_value} {unit}</p>
                <p>Start Date: {goal.start_date}</p>
                <p>End Date: {goal.end_date}</p>
                <p>Progress: {progress.toFixed(1)}%</p>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                      background: progress >= 100 ? "green" : isEnded ? "gray" : "#007bff"
                    }}
                  ></div>
                </div>

                <p>Status: {progress >= 100 ? "Completed" : isEnded ? "Ended" : "Active"}</p>
                <button
                  onClick={() => deleteGoal(goal.goal_id)}
                  style={{ marginTop: "10px", background: "#ef4444", color: "white", padding: "6px 12px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem" }}
                >
                  Delete Goal
                </button>
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