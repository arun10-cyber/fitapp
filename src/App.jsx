import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./components/SupaCon";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";

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
          path="/"
          element={session ? <Navigate to="/dashboard" /> : <LoginPage />}
        />

        <Route
          path="/signup"
          element={session ? <Navigate to="/dashboard" /> : <SignupPage />}
        />

        <Route
          path="/dashboard"
          element={session ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
        path="/profile"
        element={session ? <Profile /> : <Navigate to="/" />}
        />

      </Routes>
    </Router>
  );
};

export default App;