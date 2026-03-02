import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./components/SupaCon";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Home from "./components/Home";
import WorkoutPage from "./components/WorkoutPage";
import WorkoutDetail from "./components/WorkoutDetail";
import CreateGoal from "./components/CreateGoal";
import ProgressChart from "./components/ProgressChart";
import Fitness from "./components/Fitness";
import HealthMetrics from "./components/HealthMetrics";

const App = () => {

  const [session, setSession] = useState(null);

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };

  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={session ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={session ? <Navigate to="/home" /> : <LoginPage />}
        />

        <Route
          path="/signup"
          element={session ? <Navigate to="/home" /> : <SignupPage />}
        />

        <Route
          path="/dashboard"
          element={session ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={session ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/workout"
          element={session ? <WorkoutPage /> : <Navigate to="/" />}
        />
        <Route
          path="/workout/:id"
          element={session ? <WorkoutDetail /> : <Navigate to="/" />}
        />
        <Route
          path="/create-goal"
          element={session ? <CreateGoal /> : <Navigate to="/" />}
        />
        <Route
          path="/progress"
          element={session ? <ProgressChart /> : <Navigate to="/" />}
        />
        <Route
          path="/fitness"
          element={session ? <Fitness /> : <Navigate to="/" />}
        />
        <Route
          path="/health-metrics"
          element={session ? <HealthMetrics /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;