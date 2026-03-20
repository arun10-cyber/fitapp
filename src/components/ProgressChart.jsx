import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { supabase } from "./SupaCon";
import "./ProgressChart.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);





const ProgressChart = () => {
  const [fitnessData, setFitnessData] = useState(null);

  useEffect(() => {
    fetchFitnessData();
  }, []);

  const fetchFitnessData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData } = await supabase
      .from("profile")
      .select("profile_id")
      .eq("user_id", user.id)
      .single();

    if (!profileData) return;

    const { data, error } = await supabase
      .from("fitness")
      .select("steps_count, sleep_duration, water_intake, distance_travelled, date")
      .eq("profile_id", profileData.profile_id)
      .order("date", { ascending: true });

    if (error) {
      console.log(error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("No fitness records found");
      return;
    }

    setFitnessData(data);
  };

  // Helper to build a line chart dataset
  const buildLineData = (labels, values, label, borderColor, bgColor) => ({
    labels,
    datasets: [
      {
        label,
        data: values,
        borderColor,
        backgroundColor: bgColor,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        fill: true,
      },
    ],
  });

  const lineOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#ccc", font: { size: 12 } },
      },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#aaa", font: { size: 10 } },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
      y: {
        ticks: { color: "#aaa", font: { size: 10 } },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
    },
  });



  const labels = fitnessData ? fitnessData.map((d) => d.date) : [];

  const stepsLineData = fitnessData
    ? buildLineData(
      labels,
      fitnessData.map((d) => d.steps_count || 0),
      "Daily Steps",
      "#3a7bd5",
      "rgba(58,123,213,0.15)"
    )
    : null;

  const sleepLineData = fitnessData
    ? buildLineData(
      labels,
      fitnessData.map((d) => d.sleep_duration || 0),
      "Sleep (hrs)",
      "#a855f7",
      "rgba(168,85,247,0.15)"
    )
    : null;

  const waterLineData = fitnessData
    ? buildLineData(
      labels,
      fitnessData.map((d) => d.water_intake || 0),
      "Water Intake (L)",
      "#06b6d4",
      "rgba(6,182,212,0.15)"
    )
    : null;

  const distanceLineData = fitnessData
    ? buildLineData(
      labels,
      fitnessData.map((d) => d.distance_travelled || 0),
      "Distance (km)",
      "#f97316",
      "rgba(249,115,22,0.15)"
    )
    : null;


  return (
    <div>
      <Navbar />
      <div className="progress-page">
        <h2 className="page-title">📊 Your Fitness Progress</h2>

        {!fitnessData && <p className="no-data">No fitness data available yet.</p>}

        {fitnessData && (
          <>
            {/* Line Charts Grid */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3>🏃 Steps</h3>
                <Line data={stepsLineData} options={lineOptions("Steps")} />
              </div>
              <div className="chart-card">
                <h3>😴 Sleep Duration</h3>
                <Line data={sleepLineData} options={lineOptions("Sleep")} />
              </div>
              <div className="chart-card">
                <h3>💧 Water Intake</h3>
                <Line data={waterLineData} options={lineOptions("Water")} />
              </div>
              <div className="chart-card">
                <h3>📍 Distance Travelled</h3>
                <Line data={distanceLineData} options={lineOptions("Distance")} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;