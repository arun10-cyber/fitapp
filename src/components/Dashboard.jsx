import React, { useEffect, useState } from "react";
import { supabase } from "./SupaCon";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Dashboard = () => {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [loading, setLoading] = useState(true);

  const getProfileData = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.log(error.message);
    } else {
      setName(data.name || "");
      setAge(data.age || "");
      setGender(data.gender || "");
      setHeight(data.height || "");
      setWeight(data.weight || "");
    }

    setLoading(false);
  };

  useEffect(() => {
    getProfileData();
  }, []);

 const updateProfile = async () => {

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("profile")
    .update({
      name,
      age,
      gender,
      height,
      weight
    })
    .eq("user_id", user.id);

  if (!error) {
    navigate("/profile");   
  } else {
    alert(error.message);
  }
};

  if (loading) return <p>Loading...</p>;

 return (
  <div>
    
   
    <Navbar/>

    <div className="dashboard-container">

     
      <div className="dashboard">
        <h1>Welcome Back!</h1>
        <p>Track your fitness progress and stay motivated!</p>

        <div className="card-container">

          <div className="card">
            <h3>Today's Workouts</h3>
            <p>2 Workouts</p>
          </div>

          <div className="card">
            <h3>Calories Burned</h3>
            <p>650 kcal</p>
          </div>

          <div className="card">
            <h3>Water Intake</h3>
            <p>1.8 L</p>
          </div>

          <div className="card">
            <h3>Current Weight</h3>
            <p>{weight} kg</p>
          </div>

        </div>
      </div>


    
      <div className="profile-card">
        <h2>Update Profile</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />

        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <button onClick={updateProfile}>
          Save Profile
        </button>

      </div>

    </div>
    
  </div>
);
};

export default Dashboard;