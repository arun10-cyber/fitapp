import React from "react";
import Navbar from "./Navbar";
import "./Suggestions.css";

const suggestionsData = [
    {
        id: 1,
        title: "Children",
        ageGroup: "Ages 5–12",
        icon: "👦👧",
        focus: "Fun, movement, and basic fitness",
        suggestions: [
            "Outdoor games (football, cycling, skipping)",
            "Light stretching and basic exercises",
            "Limit screen time",
        ],
        healthTips: ["Balanced diet (milk, fruits, vegetables)", "Avoid junk food"],
        note: "Avoid heavy workouts or strict routines",
        color: "rgba(58, 123, 213, 0.8)",
    },
    {
        id: 2,
        title: "Teenagers",
        ageGroup: "Ages 13–19",
        icon: "🧑‍🎓",
        focus: "Strength building + discipline",
        suggestions: [
            "Beginner gym workouts or bodyweight exercises",
            "Sports (running, football, basketball)",
            "Yoga for flexibility",
        ],
        healthTips: ["High protein foods (eggs, milk, pulses)", "Avoid excessive junk & sugary drinks"],
        note: "Proper guidance needed (avoid injury)",
        color: "rgba(168, 85, 247, 0.8)",
    },
    {
        id: 3,
        title: "Young Adults",
        ageGroup: "Ages 20–35",
        icon: "🧑",
        focus: "Goal-based fitness (fat loss / muscle gain)",
        suggestions: [
            "HIIT, strength training, cardio",
            "Gym or home workout plans",
            "Consistent weekly routines",
        ],
        healthTips: ["Protein-rich diet + hydration", "Meal timing and calorie control"],
        note: "Avoid overtraining & burnout",
        color: "rgba(6, 182, 212, 0.8)",
    },
    {
        id: 4,
        title: "Adults",
        ageGroup: "Ages 36–55",
        icon: "👨‍💼",
        focus: "Health maintenance + stress control",
        suggestions: [
            "Brisk walking, cycling, yoga",
            "Light strength training",
            "Regular stretching",
        ],
        healthTips: ["Low sugar & balanced meals", "Monitor cholesterol & BP"],
        note: "Avoid high-intensity sudden workouts",
        color: "rgba(249, 115, 22, 0.8)",
    },
    {
        id: 5,
        title: "Seniors",
        ageGroup: "Ages 55+",
        icon: "👴",
        focus: "Mobility, balance, and safety",
        suggestions: [
            "Walking, light yoga, chair exercises",
            "Breathing exercises",
        ],
        healthTips: ["Easy-to-digest foods", "Stay hydrated"],
        note: "Medical consultation recommended",
        color: "rgba(34, 197, 94, 0.8)",
    },
];

const Suggestions = () => {
    return (
        <div className="suggestions-page">
            <Navbar />

            {/* Animated background blobs for aesthetic */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            <div className="suggestions-container">
                <header className="suggestions-header">
                    <h1 className="suggestions-title">
                        <span className="title-accent">Fitness</span> Suggestions
                    </h1>
                    <p className="suggestions-subtitle">
                        Age-based recommendations to help you stay healthy and active.
                    </p>
                </header>

                <div className="suggestions-grid">
                    {suggestionsData.map((item) => (
                        <div className="glass-card suggestion-card" key={item.id}>
                            <div className="card-header" style={{ borderBottomColor: item.color }}>
                                <span className="card-icon-large">{item.icon}</span>
                                <div className="header-text">
                                    <h2>{item.title}</h2>
                                    <span className="age-group">{item.ageGroup}</span>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="section">
                                    <h4 className="section-title">🎯 Focus:</h4>
                                    <p>{item.focus}</p>
                                </div>

                                <div className="section">
                                    <h4 className="section-title">💪 Suggestions:</h4>
                                    <ul className="custom-list">
                                        {item.suggestions.map((sug, i) => (
                                            <li key={i}>{sug}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="section">
                                    <h4 className="section-title">🥗 Health Tips:</h4>
                                    <ul className="custom-list">
                                        {item.healthTips.map((tip, i) => (
                                            <li key={i}>{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="card-footer" style={{ borderTop: `1px solid rgba(255, 255, 255, 0.1)` }}>
                                <div className="note-alert">
                                    <strong>⚠️ Note:</strong> {item.note}
                                </div>
                            </div>
                            <div className="card-glow" style={{ background: `radial-gradient(circle at top right, ${item.color}, transparent 60%)` }}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Suggestions;
