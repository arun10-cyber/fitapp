import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./WorkoutDetail.css";

const WorkoutDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const titleMap = {
        "abs-beginner": "Abs Beginner", "abs-intermediate": "Abs Intermediate", "abs-advanced": "Abs Advanced",
        "arm-beginner": "Arm Beginner", "arm-intermediate": "Arm Intermediate", "arm-advanced": "Arm Advanced",
        "chest-beginner": "Chest Beginner", "chest-intermediate": "Chest Intermediate", "chest-advanced": "Chest Advanced",
        "leg-beginner": "Leg Beginner", "leg-intermediate": "Leg Intermediate", "leg-advanced": "Leg Advanced",
        "shoulder-beginner": "Shoulder Beginner", "shoulder-intermediate": "Shoulder Intermediate", "shoulder-advanced": "Shoulder Advanced"
    };

    const title = titleMap[id] || "Workout Detail";

    const exercisesMap = {
        "abs": [
            { name: "Jumping Jacks", amount: "00:20", img: "https://images.unsplash.com/photo-1598266663439-2056e6900339?auto=format&fit=crop&q=80&w=100" },
            { name: "Abdominal Crunches", amount: "x16", img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=100" },
            { name: "Russian Twist", amount: "x20", img: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=100" },
            { name: "Mountain Climber", amount: "x16", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=100" }
        ],
        "arm": [
            { name: "Arm Circles", amount: "00:30", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=100" },
            { name: "Push-ups", amount: "x10", img: "https://images.unsplash.com/photo-1598266663439-2056e6900339?auto=format&fit=crop&q=80&w=100" },
            { name: "Tricep Dips", amount: "x12", img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=100" },
            { name: "Diamond Push-ups", amount: "x8", img: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=100" }
        ],
        "chest": [
            { name: "Jumping Jacks", amount: "00:30", img: "https://images.unsplash.com/photo-1598266663439-2056e6900339?auto=format&fit=crop&q=80&w=100" },
            { name: "Knee Push-ups", amount: "x12", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=100" },
            { name: "Wide Arm Push-ups", amount: "x12", img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=100" },
            { name: "Incline Push-ups", amount: "x14", img: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=100" }
        ],
        "leg": [
            { name: "High Stepping", amount: "00:30", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=100" },
            { name: "Squats", amount: "x20", img: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=100" },
            { name: "Lunges", amount: "x14", img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=100" },
            { name: "Calf Raises", amount: "x20", img: "https://images.unsplash.com/photo-1598266663439-2056e6900339?auto=format&fit=crop&q=80&w=100" }
        ],
        "shoulder": [
            { name: "Arm Scissors", amount: "00:30", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=100" },
            { name: "Pike Push-ups", amount: "x10", img: "https://images.unsplash.com/photo-1598266663439-2056e6900339?auto=format&fit=crop&q=80&w=100" },
            { name: "Shoulder Stretch", amount: "00:20", img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=100" },
            { name: "Plank", amount: "00:30", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=100" }
        ]
    };

    const category = id ? id.split("-")[0] : "abs";
    const exercises = exercisesMap[category] || exercisesMap["abs"];

    return (
        <div className="detail-layout">
            <Navbar />
            <div className="detail-container">

                <header className="detail-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                    <h2>{title}</h2>
                    <button className="menu-btn">⋮</button>
                </header>

                <h1 className="main-title">{title}</h1>

                <div className="stats-row">
                    <div className="stat-box">
                        <span className="stat-val">15 mins</span>
                        <span className="stat-label">Duration</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-val">{exercises.length}</span>
                        <span className="stat-label">Exercises</span>
                    </div>
                </div>

                <div className="exercises-header">
                    <h3>Exercises</h3>
                    <span className="edit-link">Edit &rsaquo;</span>
                </div>

                <div className="exercises-list">
                    {exercises.map((ex, idx) => (
                        <div className="ex-row" key={idx}>
                            <span className="drag-handle">≡</span>
                            <img src={ex.img} alt={ex.name} className="ex-img" />
                            <div className="ex-info">
                                <h4>{ex.name}</h4>
                                <p>{ex.amount}</p>
                            </div>
                            <span className="swap-icon">⇌</span>
                        </div>
                    ))}
                </div>

            </div>

            <div className="bottom-bar">
                <button className="start-btn">Start</button>
            </div>

        </div>
    );
};

export default WorkoutDetail;
