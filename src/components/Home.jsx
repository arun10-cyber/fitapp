import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";

import runningImg from "../assets/running_athlete.png";
import yogaImg from "../assets/yoga_pose.png";
import bodybuildingImg from "../assets/bodybuilding.png";
import stretchingImg from "../assets/stretching.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Navbar />

      {/* Animated background blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>

      {/* Floating particles */}
      <div className="particle p1"></div>
      <div className="particle p2"></div>
      <div className="particle p3"></div>
      <div className="particle p4"></div>
      <div className="particle p5"></div>
      <div className="particle p6"></div>

      <div className="home-content">
        {/* LEFT SIDE — Header + Cards */}
        <div className="home-left">
          <div className="home-header">
            <h1 className="home-title">
              <span className="title-accent">Fitness</span> Dashboard
            </h1>
            <p className="home-subtitle">
              Track your progress, crush your goals, and stay motivated every day.
            </p>
          </div>

          <div className="cards-grid">
            {/* Workout Split Card */}
            <div
              className="glass-card card-workout"
              onClick={() => navigate("/workout")}
            >
              <div className="card-icon">🏋️</div>
              <div className="card-body">
                <h3>Workout Split</h3>
                <ul className="card-list">
                  <li>Yoga</li>
                  <li>Cardio</li>
                  <li>Strength Training</li>
                </ul>
              </div>
              <div className="card-glow"></div>
            </div>

            {/* Suggestions Card */}
            <div
              className="glass-card card-suggestions"
              onClick={() => navigate("/suggestions")}
              style={{ cursor: "pointer" }}
            >
              <div className="card-icon">💡</div>
              <div className="card-body">
                <h3>Suggestions</h3>
                <ul className="card-list">
                  <li>Drink more water 💧</li>
                  <li>Stretch before workout</li>
                  <li>Sleep 7–8 hrs</li>
                </ul>
              </div>
              <div className="card-glow"></div>
            </div>

            {/* Calories Burned Card */}
            <div
              className="glass-card card-burn"
              onClick={() => navigate("/fitness")}
              style={{ cursor: "pointer" }}
            >
              <div className="card-icon">🔥</div>
              <div className="card-body">
                <h3>Calculate Calories Burned</h3>
                <ul className="card-list">
                  <li>Running — 300 kcal</li>
                  <li>Cycling — 250 kcal</li>
                  <li>Skipping — 200 kcal</li>
                </ul>
              </div>
              <div className="card-glow"></div>
            </div>

            {/* Progress Chart Card */}
            <div
              className="glass-card card-progress"
              onClick={() => navigate("/progress")}
            >
              <div className="card-icon">📊</div>
              <div className="card-body">
                <h3>Progress Chart</h3>
                <ul className="card-list">
                  <li>Steps</li>
                  <li>Sleep</li>
                  <li>Water In-Take</li>
                  <li>Distance</li>
                </ul>
              </div>
              <div className="card-glow"></div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — Floating Illustrations */}
        <div className="home-right">
          <div className="floating-illustration float-anim-1">
            <img src={runningImg} alt="Running athlete" />
            <span className="illust-label">Running</span>
          </div>
          <div className="floating-illustration float-anim-2">
            <img src={yogaImg} alt="Yoga pose" />
            <span className="illust-label">Yoga</span>
          </div>
          <div className="floating-illustration float-anim-3">
            <img src={bodybuildingImg} alt="Bodybuilding" />
            <span className="illust-label">Training</span>
          </div>
          <div className="floating-illustration float-anim-4">
            <img src={stretchingImg} alt="Stretching" />
            <span className="illust-label">Stretching</span>
          </div>

          {/* Decorative ring */}
          <div className="deco-ring"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;