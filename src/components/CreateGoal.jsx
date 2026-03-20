import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./SupaCon";
import Navbar from "./Navbar";
import "./CreateGoal.css";

const CreateGoal = () => {
    const navigate = useNavigate();
    const [goalType, setGoalType] = useState("Weight loss");
    const [targetValue, setTargetValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [profileId, setProfileId] = useState(null);

   useEffect(() => {
    const fetchProfileId = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        console.log("Logged user id:", user.id);

        const { data, error } = await supabase
            .from("profile")
            .select("profile_id")
            .eq("user_id", user.id)
            .single();

        if (error) {
            console.log("Profile fetch error:", error);
        }

        if (data) {
            console.log("Profile found:", data);
            setProfileId(data.profile_id);
        }
    };

    fetchProfileId();
}, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profileId) {
            alert("Profile not found. Please create or update your profile first.");
            return;
        }
        const { data: { user } } = await supabase.auth.getUser();

console.log("Logged user id:", user.id);

        setLoading(true);
        const { data, error } = await supabase.from("goals").insert([
            {
                goal_type: goalType,
                target_value: parseFloat(targetValue),
                start_date: startDate,
                end_date: endDate,
                profile_id: profileId,
            }
        ]);

        setLoading(false);
        if (error) {
            alert(error.message);
        } else {
            alert("Goal created successfully!");
            navigate("/dashboard");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="create-goal-container">
                <div className="create-goal-card">
                    <h2>Create a New Goal</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Goal Type</label>
                            <select value={goalType} onChange={(e) => setGoalType(e.target.value)}>
                                <option value="Weight loss">Weight loss</option>
                                <option value="Steps">Steps</option>
                                <option value="Calories">Calories</option>
                                <option value="Water intake">Water intake</option>
                                <option value="Muscle gain">Muscle gain</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Target Value</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <input
                                    type="number"
                                    placeholder={`e.g. ${goalType === "Weight loss" ? "60" :
                                            goalType === "Steps" ? "10000" :
                                                goalType === "Calories" ? "500" :
                                                    goalType === "Water intake" ? "3" :
                                                        goalType === "Muscle gain" ? "2" : "10"
                                        }`}
                                    value={targetValue}
                                    onChange={(e) => setTargetValue(e.target.value)}
                                    required
                                    style={{ flex: 1 }}
                                />
                                <span style={{ fontWeight: "bold", color: "#e63946" }}>
                                    {goalType === "Weight loss" ? "kg" :
                                        goalType === "Steps" ? "steps/day" :
                                            goalType === "Calories" ? "kcal/day" :
                                                goalType === "Water intake" ? "L/day" :
                                                    goalType === "Muscle gain" ? "kg" : ""}
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Create Goal"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateGoal;
