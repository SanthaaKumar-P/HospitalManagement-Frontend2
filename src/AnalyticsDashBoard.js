import React, { useEffect, useState } from "react";

export default function AnalyticsDashboard() {

  const [data, setData] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/ai/analytics")
      .then(r => r.json())
      .then(setData);
  }, []);

  return (
    <div className="card">
      <h2>📊 AI Analytics Dashboard</h2>

      <p>Total Appointments: {data.totalAppointments}</p>
      <p>Completion Rate: {data.completionRate}</p>
      <p><b>AI Insight:</b> {data.aiInsight}</p>
    </div>
  );
}
