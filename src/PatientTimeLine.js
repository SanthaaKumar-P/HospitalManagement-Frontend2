import React, { useState } from "react";

export default function PatientTimeline() {

  const [patientId, setPatientId] = useState("");
  const [timeline, setTimeline] = useState([]);

  const load = async () => {
    const res = await fetch(
      `http://localhost:8080/ai/timeline/${patientId}`
    );
    setTimeline(await res.json());
  };

  return (
    <div className="card">
      <h2>🕒 Patient Timeline</h2>

      <input
        placeholder="Patient ID"
        onChange={e => setPatientId(e.target.value)}
      />

      <button onClick={load}>Generate Timeline</button>

      <ul>
        {timeline.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
