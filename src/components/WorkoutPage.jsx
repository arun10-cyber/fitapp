import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./SupaCon";
import Navbar from "./Navbar";
import "./WorkoutPage.css";

const WorkoutPage = () => {
    const navigate = useNavigate();
    
    // Extracted default map safely outside to be utilized during initial rendering
    const defaultDurationsMap = {
        "Cardio": { "Low": 20, "Medium": 30, "High": 45 },
        "Yoga": { "Low": 15, "Medium": 25, "High": 35 },
        "Strength Training": { "Low": 25, "Medium": 40, "High": 60 }
    };
    
    const [workoutType, setWorkoutType] = useState("Cardio");
    const [intensity, setIntensity] = useState("Medium");
    
    // Init intelligently matching our static fallback mapped layout
    const initialDuration = defaultDurationsMap["Cardio"]["Medium"];
    const [duration, setDuration] = useState(`${initialDuration} mins`);

    // Automatically calculate duration based on type and intensity
    useEffect(() => {
        const fetchDuration = async () => {
            // Optimistically update based on fallback map to remove loading phase 
            const optimisticDuration = defaultDurationsMap[workoutType]?.[intensity] || 20;
            setDuration(`${optimisticDuration} mins`);
            
            // Execute actual database check silently
            const { data, error } = await supabase
                .from("workout_recommendation")
                .select("duration")
                .eq("workout_type", workoutType)
                .eq("intensity", intensity)
                .maybeSingle();

            if (data && data.duration) {
                setDuration(`${data.duration} mins`);
            }
        };

        fetchDuration();
    }, [workoutType, intensity]);

    const handleConfirm = () => {
        // Navigate to details page based on type
        const typeSlug = workoutType.toLowerCase().replace(' ', '-');
        navigate(`/workout/${typeSlug}-${intensity.toLowerCase()}`);
    };

    const workoutTypes = ["Cardio", "Yoga", "Strength Training"];
    const intensities = ["Low", "Medium", "High"];

    return (
        <div className="clean-workout-layout">
            <Navbar />
            <div className="clean-dashboard-wrapper">
                <div className="clean-dashboard-panel">
                    
                    <header className="panel-header">
                        <h1 className="panel-title">Workout Configuration</h1>
                        <p className="panel-description">Select your preferences below to automatically generate your session details.</p>
                    </header>

                    <div className="configuration-section">
                        <div className="form-group">
                            <label className="input-label">Workout Type</label>
                            <div className="options-grid">
                                {workoutTypes.map(type => (
                                    <button 
                                        key={type}
                                        className={`option-btn ${workoutType === type ? 'selected' : ''}`}
                                        onClick={() => setWorkoutType(type)}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="input-label">Intensity Level</label>
                            <div className="intensity-selector">
                                {intensities.map(lvl => (
                                    <button 
                                        key={lvl}
                                        className={`intensity-btn ${intensity === lvl ? 'selected' : ''}`}
                                        onClick={() => setIntensity(lvl)}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="input-label">Estimated Duration</label>
                            <div className="duration-display-area">
                                <input 
                                    type="text" 
                                    className="duration-read-only" 
                                    value={duration} 
                                    readOnly 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="panel-footer">
                        <button className="confirm-btn" onClick={handleConfirm}>Confirm Workout</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WorkoutPage;
