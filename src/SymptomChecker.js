import React, { useState } from "react";

export default function SymptomChecker() {

  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);

  const checkSymptoms = async () => {
    const res = await fetch("http://localhost:8080/ai/symptom/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(symptoms)
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>🤖 AI Symptom Checker</h2>

      <textarea
        placeholder="Enter symptoms (e.g. chest pain, dizziness, cough)..."
        rows="4"
        onChange={e => setSymptoms(e.target.value)}
      />

      <br />
      <button onClick={checkSymptoms}>Analyze Symptoms</button>

      {result && (
        <div style={{ marginTop: "15px" }}>
          <p><b>Recommended Department:</b> {result.department}</p>
          <p><b>Urgency Level:</b> {result.urgency}</p>
          <p><b>AI Explanation:</b> {result.explanation}</p>
        </div>
      )}
    </div>
  );
}
