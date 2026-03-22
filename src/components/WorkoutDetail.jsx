import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./SupaCon";
import Navbar from "./Navbar";
import "./WorkoutDetail.css";

const WorkoutDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Setup and breakdown IDs
    const parts = id ? id.split("-") : ["cardio", "medium"];
    const intensitySlug = parts.pop(); 
    const typeSlug = parts.join("-");  

    const typeMapReverse = {
        "cardio": "Cardio",
        "yoga": "Yoga",
        "strength-training": "Strength Training"
    };

    const title = typeMapReverse[typeSlug] || "Workout Detail";
    const intensity = intensitySlug.charAt(0).toUpperCase() + intensitySlug.slice(1);

    // Provide immediate fallback without UI jitter
    const defaultDurationsMap = {
        "Cardio": { "Low": 20, "Medium": 30, "High": 45 },
        "Yoga": { "Low": 15, "Medium": 25, "High": 35 },
        "Strength Training": { "Low": 25, "Medium": 40, "High": 60 }
    };
    
    const initialFallback = defaultDurationsMap[title]?.[intensity] || 15;
    const [duration, setDuration] = useState(initialFallback);
    const [timeLeft, setTimeLeft] = useState(initialFallback * 60);
    const [isActive, setIsActive] = useState(false);
    const [profileId, setProfileId] = useState(null);
    const [workoutSaved, setWorkoutSaved] = useState(false);
    const workoutSavedRef = useRef(false);

    // Fetch profile_id on mount
    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.log("No authenticated user found");
                return;
            }

            const { data: profile, error } = await supabase
                .from("profile")
                .select("profile_id")
                .eq("user_id", user.id)
                .single();

            if (error) {
                console.log("Profile fetch error:", error);
            }
            if (profile) {
                console.log("Fetched profile_id:", profile.profile_id);
                setProfileId(profile.profile_id);
            }
        };
        fetchProfile();
    }, []);

    // Save workout to database
    const saveWorkout = async () => {
        if (workoutSavedRef.current) return;
        if (!profileId) {
            alert("Profile not loaded. Please wait and try again.");
            return;
        }
        workoutSavedRef.current = true;
        setWorkoutSaved(true);

        const today = new Date().toISOString().split("T")[0];

        const { error } = await supabase.from("workout").insert([{
            profile_id: profileId,
            workout_type: title,
            intensity: intensity,
            duration: duration,
            date: today
        }]);

        if (error) {
            console.log("Workout save error:", error);
            workoutSavedRef.current = false;
            setWorkoutSaved(false);
        } else {
            alert("Workout completed & saved!");
        }
    };

    // Fetch and sync timeline limits 
    useEffect(() => {
        const fetchDuration = async () => {
            if (!id) return;
            const { data } = await supabase
                .from("workout_recommendation")
                .select("duration")
                .eq("workout_type", title)
                .eq("intensity", intensity)
                .maybeSingle();

            if (data && data.duration) {
                setDuration(data.duration);
                // Synchronize countdown limit ONLY if workout hasn't actively begun
                if (!isActive) {
                    setTimeLeft(data.duration * 60);
                }
            }
        };
        fetchDuration();
    }, [title, intensity, id, isActive]);

    // Global countdown implementation hooked closely
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            clearInterval(interval);
            setIsActive(false);
            // Auto-save when timer completes
            saveWorkout();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const exercisesMap = {
        "cardio": [
            { name: "Jumping Jacks", amount: "00:30", img: "https://images.unsplash.com/photo-1598266663439-2056e6900339?auto=format&fit=crop&q=80&w=100" },
            { name: "High Knees", amount: "00:45", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=100" },
            { name: "Burpees", amount: "x15", img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=100" },
            { name: "Mountain Climbers", amount: "00:45", img: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=100" }
        ],
        "yoga": [
            { name: "Downward Dog", amount: "01:00", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=100" },
            { name: "Warrior Pose", amount: "01:00", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=100" },
            { name: "Child's Pose", amount: "01:30", img: "https://images.unsplash.com/photo-1599901860904-17e082fceae8?auto=format&fit=crop&q=80&w=100" },
            { name: "Tree Pose", amount: "01:00", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=100" }
        ],
        "strength-training": [
            { name: "Push-ups", amount: "x20", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=100" },
            { name: "Squats", amount: "x25", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=100" },
            { name: "Lunges", amount: "x20", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=100" },
            { name: "Plank", amount: "01:00", img: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=100" }
        ]
    };

    const exercises = exercisesMap[typeSlug] || exercisesMap["cardio"];

    return (
        <div className="modern-detail-layout">
            <Navbar />
            <div className="modern-detail-container">
                <header className="detail-top-nav">
                    <button className="icon-back-btn" onClick={() => navigate(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <h2 className="header-title">{title} - {intensity}</h2>
                </header>

                <div className="detail-hero">
                    <h1 className="hero-title">{title}</h1>
                    <div className="quick-stats">
                        <div className="stat-item">
                            {/* Render active timer over duration dynamically */}
                            <span className="stat-number">{isActive ? formatTime(timeLeft) : duration}</span>
                            <span className="stat-text">{isActive ? "Remaining" : "Mins"}</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">{exercises.length}</span>
                            <span className="stat-text">Exercises</span>
                        </div>
                    </div>
                </div>

                <div className="exercises-section">
                    <div className="section-header">
                        <h3>Exercises</h3>
                    </div>

                    <div className="exercise-list-wrapper">
                        {exercises.map((ex, idx) => (
                            <div className="exercise-row-card" key={idx}>
                                <div className="ex-number">{idx + 1}</div>
                                <div className="ex-thumbnail">
                                    <img src={ex.img} alt={ex.name} />
                                </div>
                                <div className="ex-details">
                                    <h4>{ex.name}</h4>
                                    <p>{ex.amount}</p>
                                </div>
                                <div className="ex-drag-handle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed-bottom-bar">
                {workoutSaved ? (
                    <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#22c55e' }}>✓ Workout Saved!</span>
                ) : isActive ? (
                    <div className="timer-controls" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#2563eb' }}>{formatTime(timeLeft)} Active</span>
                        <button 
                            className="primary-pause-btn" 
                            onClick={() => setIsActive(false)} 
                            style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', fontSize: '1.1rem' }}>
                            Pause
                        </button>
                        <button 
                            onClick={saveWorkout} 
                            style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', fontSize: '1.1rem' }}>
                            Complete
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <button className="primary-start-btn" onClick={() => setIsActive(true)}>
                            {timeLeft < duration * 60 && timeLeft > 0 ? "Resume Workout" : "Start Workout"}
                        </button>
                        {timeLeft < duration * 60 && (
                            <button 
                                onClick={saveWorkout} 
                                style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', fontSize: '1.1rem' }}>
                                Complete Workout
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutDetail;
