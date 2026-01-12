import React, { useState } from "react";

export default function HealthRisk() {
  const [age, setAge] = useState("");
  const [records, setRecords] = useState("");
  const [appointments, setAppointments] = useState("");
  const [risk, setRisk] = useState("");

  const predictRisk = async () => {
    const res = await fetch(
      `http://localhost:8080/ai/health/risk?age=${age}&records=${records}&appointments=${appointments}`
    );
    setRisk(await res.text());
  };

  return (
    <div>
      <h2>AI Health Risk Prediction</h2>

      <input placeholder="Age" onChange={e => setAge(e.target.value)} />
      <input placeholder="Medical Records Count" onChange={e => setRecords(e.target.value)} />
      <input placeholder="Recent Appointments" onChange={e => setAppointments(e.target.value)} />

      <button onClick={predictRisk}>Predict Risk</button>

      {risk && <h3>Risk Level: {risk}</h3>}
    </div>
  );
}
