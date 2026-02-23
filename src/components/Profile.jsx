import React, { useEffect, useState } from "react";
import { supabase } from "./SupaCon";
import "./Profile.css";

const Profile = () => {

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const getProfileData = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error) {
      setName(data.name);
      setAge(data.age);
      setGender(data.gender);
      setHeight(data.height);
      setWeight(data.weight);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">

        <h2>My Profile</h2>

        <p><b>Name:</b> {name}</p>
        <p><b>Age:</b> {age}</p>
        <p><b>Gender:</b> {gender}</p>
        <p><b>Height:</b> {height} cm</p>
        <p><b>Weight:</b> {weight} kg</p>

      </div>
    </div>
  );
};

export default Profile;