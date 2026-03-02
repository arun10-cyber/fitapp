import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      sliderRef.current?.scrollBy({ left: 320, behavior: "smooth" });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Navbar />

      <div className="home">
        <h1>Welcome Back!</h1>
        <p>Track your fitness progress and stay motivated!</p>

        <div className="slider-wrapper">
          <button className="arrow left" onClick={scrollLeft}>❮</button>

          <div className="home-cards" ref={sliderRef}>

            <div
              className="home-card card-workout"
              onClick={() => navigate('/workout')}
              style={{ cursor: "pointer" }}
            >
              <h3>Workout Split</h3>
              <p>Chest - Triceps</p>
              <p>Back - Biceps</p>
              <p>Leg Day</p>
            </div>

            <div className="home-card card-suggestions">
              <h3>Suggestions</h3>
              <p>Drink more water 💧</p>
              <p>Stretch before workout</p>
              <p>Sleep 7–8 hrs</p>
            </div>

            <div className="home-card card-burn">
              <h3>Burn Calories</h3>
              <p>Running - 300 kcal</p>
              <p>Cycling - 250 kcal</p>
              <p>Skipping - 200 kcal</p>
            </div>

            <div
              className="home-card card-progress"
              onClick={() => navigate('/progress')}
              style={{ cursor: "pointer" }}
            >
              <h3>Progress Chart</h3>
              <p>Weight Tracking</p>
              <p>BMI Monitor</p>
              <p>Daily Activity</p>
            </div>

          </div>

          <button className="arrow right" onClick={scrollRight}>❯</button>
        </div>
      </div>
    </div>
  );
};

export default Home;