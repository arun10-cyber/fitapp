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
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Daily goals used to calculate progress %
const GOALS = {
  steps: 10000,
  sleep: 8, // hours
  water: 3, // litres
  distance: 5, // km
};

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

  // Calculate average progress percentages for the pie chart
  const calcAverageProgress = () => {
    if (!fitnessData) return null;

    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const stepsAvg = avg(fitnessData.map((d) => d.steps_count || 0));
    const sleepAvg = avg(fitnessData.map((d) => d.sleep_duration || 0));
    const waterAvg = avg(fitnessData.map((d) => d.water_intake || 0));
    const distAvg = avg(fitnessData.map((d) => d.distance_travelled || 0));

    return {
      steps: Math.min((stepsAvg / GOALS.steps) * 100, 100),
      sleep: Math.min((sleepAvg / GOALS.sleep) * 100, 100),
      water: Math.min((waterAvg / GOALS.water) * 100, 100),
      distance: Math.min((distAvg / GOALS.distance) * 100, 100),
    };
  };

  const progress = calcAverageProgress();

  const labels = fitnessData?.map((d) => d.date) || [];

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

  const pieData = progress
    ? {
      labels: ["Steps", "Sleep", "Water Intake", "Distance"],
      datasets: [
        {
          data: [
            progress.steps.toFixed(1),
            progress.sleep.toFixed(1),
            progress.water.toFixed(1),
            progress.distance.toFixed(1),
          ],
          backgroundColor: [
            "rgba(58,123,213,0.85)",
            "rgba(168,85,247,0.85)",
            "rgba(6,182,212,0.85)",
            "rgba(249,115,22,0.85)",
          ],
          borderColor: [
            "#3a7bd5",
            "#a855f7",
            "#06b6d4",
            "#f97316",
          ],
          borderWidth: 2,
          hoverOffset: 14,
        },
      ],
    }
    : null;

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ddd",
          font: { size: 13, weight: "bold" },
          padding: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
  };

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

            {/* Pie Chart */}
            <div className="pie-section">
              <h2>🥧 Total Progress</h2>
              <div className="pie-card">
                {pieData && <Pie data={pieData} options={pieOptions} />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;