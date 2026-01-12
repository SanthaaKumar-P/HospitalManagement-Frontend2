import React, { useState } from "react";

import Login from "./Login";
import Doctor from "./Doctor";
import Patient from "./Patient";
import Appointment from "./Appointment";
import MedicalRecord from "./MedicalRecord";

export default function App() {

  // Check token initially
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [page, setPage] = useState("doctor");

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // AFTER LOGIN
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div>

      {/* HEADER */}
      <h1>🏥 Hospital Management System</h1>

      {/* NAVIGATION */}
      <nav>
        <button onClick={() => setPage("doctor")}>Doctor</button>
        <button onClick={() => setPage("patient")}>Patient</button>
        <button onClick={() => setPage("appointment")}>Appointment</button>
        <button onClick={() => setPage("record")}>Medical Record</button>
        <button onClick={logout}>Logout</button>
      </nav>

      <hr />

      {/* PAGE CONTENT */}
      {page === "doctor" && <Doctor />}
      {page === "patient" && <Patient />}
      {page === "appointment" && <Appointment />}
      {page === "record" && <MedicalRecord />}



      <style>{`
/* ========== GLOBAL ========== */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f4f7fb;
}

h1, h2, h3 {
  margin-bottom: 15px;
}

/* ========== HERO / HEADER ========== */
.hero {
  background: linear-gradient(135deg, #1CB5E0, #000851);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.hero p {
  opacity: 0.9;
  font-size: 18px;
}

/* ========== SECTIONS ========== */
.section {
  padding: 50px 20px;
  text-align: center;
}

.blue {
  background: linear-gradient(120deg, #36D1DC, #5B86E5);
}

.green {
  background: linear-gradient(120deg, #11998e, #38ef7d);
}

.purple {
  background: linear-gradient(120deg, #8E2DE2, #4A00E0);
}

.orange {
  background: linear-gradient(120deg, #f7971e, #ffd200);
}

/* ========== CARD (FORMS) ========== */
.card {
  background: white;
  max-width: 420px;
  margin: 30px auto;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.25);
}

.card img {
  width: 90px;
  margin-bottom: 20px;
}

/* ========== INPUTS ========== */
input {
  width: 90%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 15px;
}

input:focus {
  outline: none;
  border-color: #1CB5E0;
}

/* ========== BUTTONS ========== */
button {
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  background: linear-gradient(45deg, #36D1DC, #5B86E5);
  font-size: 15px;
  transition: transform 0.2s, opacity 0.2s;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* ========== SEARCH BAR ========== */
.search-box {
  margin-top: 20px;
}

.search-box input {
  width: 250px;
}

/* ========== LOAD BUTTON ========== */
.load-btn {
  margin: 25px 0;
  background: #000;
}

/* ========== GRID (LIST VIEW) ========== */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  padding: 20px;
}

/* ========== ENTITY CARD (Doctor / Patient / Record) ========== */
.doctor-card,
.patient-card,
.record-card,
.appointment-card {
  background: white;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  text-align: center;
}

.doctor-card img,
.patient-card img,
.record-card img,
.appointment-card img {
  width: 70px;
  margin-bottom: 10px;
}

/* ========== ACTION BUTTONS ========== */
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.edit {
  background: #28a745;
}

.delete {
  background: #dc3545;
}

/* ========== TOAST MESSAGE ========== */
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0,0,0,0.85);
  color: white;
  padding: 12px 22px;
  border-radius: 25px;
  font-size: 15px;
  animation: fadeIn 0.4s ease;
}

/* ========== ANIMATION ========== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== RESPONSIVE ========== */
@media (max-width: 600px) {
  .card {
    width: 90%;
  }

  .search-box input {
    width: 90%;
  }

  .actions {
    flex-direction: column;
    gap: 10px;
  }
}
`}</style>

    </div>
  );
}
