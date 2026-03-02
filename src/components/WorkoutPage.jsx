import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./WorkoutPage.css";

const WorkoutPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Abs");

    const bodyFocusTabs = ["Abs", "Arm", "Chest", "Leg", "Shoulder"];

    const workoutsMap = {
        "Abs": [
            { id: "abs-beginner", title: "Abs Beginner", time: "15 mins", exercises: "16 Exercises", level: 1, img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200" },
            { id: "abs-intermediate", title: "Abs Intermediate", time: "24 mins", exercises: "21 Exercises", level: 2, img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200" },
            { id: "abs-advanced", title: "Abs Advanced", time: "27 mins", exercises: "21 Exercises", level: 3, img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200" }
        ],
        "Arm": [
            { id: "arm-beginner", title: "Arm Beginner", time: "12 mins", exercises: "14 Exercises", level: 1, img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200" },
            { id: "arm-intermediate", title: "Arm Intermediate", time: "20 mins", exercises: "18 Exercises", level: 2, img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200" },
            { id: "arm-advanced", title: "Arm Advanced", time: "25 mins", exercises: "22 Exercises", level: 3, img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200" }
        ],
        "Chest": [
            { id: "chest-beginner", title: "Chest Beginner", time: "15 mins", exercises: "12 Exercises", level: 1, img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200" },
            { id: "chest-intermediate", title: "Chest Intermediate", time: "22 mins", exercises: "18 Exercises", level: 2, img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200" },
            { id: "chest-advanced", title: "Chest Advanced", time: "28 mins", exercises: "24 Exercises", level: 3, img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200" }
        ],
        "Leg": [
            { id: "leg-beginner", title: "Leg Beginner", time: "16 mins", exercises: "15 Exercises", level: 1, img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200" },
            { id: "leg-intermediate", title: "Leg Intermediate", time: "26 mins", exercises: "20 Exercises", level: 2, img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200" },
            { id: "leg-advanced", title: "Leg Advanced", time: "32 mins", exercises: "25 Exercises", level: 3, img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200" }
        ],
        "Shoulder": [
            { id: "shoulder-beginner", title: "Shoulder Beginner", time: "14 mins", exercises: "12 Exercises", level: 1, img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=200" },
            { id: "shoulder-intermediate", title: "Shoulder Intermediate", time: "20 mins", exercises: "16 Exercises", level: 2, img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200" },
            { id: "shoulder-advanced", title: "Shoulder Advanced", time: "26 mins", exercises: "22 Exercises", level: 3, img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200" }
        ]
    };

    const workouts = workoutsMap[activeTab] || [];

    const tags = ["⏱ Recent", "🕒 7-15 mins", "🔥 Burn Fat", "💪 Build Muscle", "⚡ Beginner", "🚀 Advanced"];

    return (
        <div className="workout-layout">
            <Navbar />
            <div className="workout-container">

                <header className="workout-header">
                    <h1>HOME WORKOUT</h1>

                </header>

                <section className="body-focus-section">
                    <h2>Body Focus</h2>
                    <div className="tabs-container">
                        {bodyFocusTabs.map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="workout-list">
                    {workouts.map(w => (
                        <div className="workout-card" key={w.id} onClick={() => navigate(`/workout/${w.id}`)}>
                            <img src={w.img} alt={w.title} className="workout-img" />
                            <div className="workout-info">
                                <h3>{w.title}</h3>
                                <p className="workout-meta">{w.time} • {w.exercises}</p>
                                <div className="level-indicator">
                                    {[1, 2, 3].map(lvl => (
                                        <span key={lvl} className={`bolt ${w.level >= lvl ? "blue" : "grey"}`}>⚡</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="tags-section">
                    <div className="tags-container">
                        {tags.map((tag, idx) => (
                            <span key={idx} className="tag-chip">{tag}</span>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default WorkoutPage;
