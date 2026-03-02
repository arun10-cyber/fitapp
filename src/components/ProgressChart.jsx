import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { supabase } from "./SupaCon";

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
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchFitnessData();
  }, []);

  const fetchFitnessData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get profile_id
    const { data: profileData } = await supabase
      .from("profile")
      .select("profile_id")
      .eq("user_id", user.id)
      .single();

    if (!profileData) return;

    // Fetch fitness records
    const { data, error } = await supabase
      .from("fitness")
      .select("steps_count, date")
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

    const labels = data.map((item) => item.date);
    const stepsData = data.map((item) => item.steps_count);

    setChartData({
      labels,
      datasets: [
        {
          label: "Daily Steps",
          data: stepsData,
          borderColor: "blue",
          backgroundColor: "lightblue",
          tension: 0.4,
        },
      ],
    });
  };

  return (
    <div>
      <Navbar />
      <div style={{ width: "80%", margin: "100px auto" }}>
        <h2 style={{ textAlign: "center" }}>Steps Progress</h2>

        {!chartData && (
          <p style={{ textAlign: "center" }}>No fitness data available</p>
        )}

        {chartData && <Line data={chartData} />}
      </div>
    </div>
  );
};

export default ProgressChart;