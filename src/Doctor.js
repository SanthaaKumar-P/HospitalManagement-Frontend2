import React, { useState } from "react";
import {
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidNumber
} from "./Validation";

const BASE_URL = "http://localhost:8080";

/* ========= JWT HELPER ========= */
const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(BASE_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers
    }
  });
};

export default function Doctor() {

  const emptyDoctor = {
    name: "",
    email: "",
    phone: "",
    specialization: "",
    roomNumber: ""
  };

  const [doctor, setDoctor] = useState(emptyDoctor);
  const [doctors, setDoctors] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [specialization, setSpecialization] = useState("");
const [recommendedDoctor, setRecommendedDoctor] = useState(null);
const recommendDoctor = async () => {
    if (!specialization) {
      setMsg("Enter specialization");
      return;
    }

    const res = await fetchWithAuth(`/doctors/ai-recommend/${specialization}`);
    if (!res.ok) {
      setMsg("No doctor found");
      return;
    }

    const data = await res.json();
    setRecommendedDoctor(data);
    setMsg("AI Doctor Recommendation Generated");
  };

  /* ========= ADD / UPDATE ========= */
  const saveDoctor = async () => {

    let newErrors = {};

    if (!isValidName(doctor.name)) {
      newErrors.name = "Name should contain only letters";
    }

    if (!isValidEmail(doctor.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!isValidPhone(doctor.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!isValidName(doctor.specialization)) {
      newErrors.specialization = "Specialization should contain only letters";
    }

    if (!isValidNumber(doctor.roomNumber)) {
      newErrors.roomNumber = "Invalid room number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const url = editId ? `/doctors/${editId}` : "/doctors";
    const method = editId ? "PUT" : "POST";

    const res = await fetchWithAuth(url, {
      method,
      body: JSON.stringify({
        ...doctor,
        roomNumber: Number(doctor.roomNumber)
      })
    });

    if (!res.ok) {
      setMsg("Error saving doctor");
      return;
    }

    setMsg(editId ? "Doctor Updated Successfully" : "Doctor Added Successfully");
    setDoctor(emptyDoctor);
    setEditId(null);
  };

  /* ========= GET ALL ========= */
  const getAllDoctors = async () => {
    const res = await fetchWithAuth("/doctors");
    if (!res.ok) return;
    const data = await res.json();
    setDoctors(data);
  };

  /* ========= GET BY ID ========= */
  const getDoctorById = async () => {
    const res = await fetchWithAuth(`/doctors/${searchId}`);
    if (!res.ok) {
      setMsg("Doctor Not Found");
      return;
    }
    const data = await res.json();
    setDoctors([data]);
  };

  /* ========= DELETE ========= */
  const deleteDoctor = async (id) => {
    await fetchWithAuth(`/doctors/${id}`, { method: "DELETE" });
    setDoctors(doctors.filter(d => (d.id ?? d.doctorId) !== id));
  };

  /* ========= UI ========= */
  return (
    <div>

      <h2>{editId ? "Update Doctor" : "Add Doctor"}</h2>

      {/* NAME */}
      <input
        placeholder="Name"
        value={doctor.name}
        onChange={e => {
          setDoctor({ ...doctor, name: e.target.value });
          setErrors({ ...errors, name: "" });
        }}
      />
      {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

      {/* EMAIL */}
      <input
        placeholder="Email"
        value={doctor.email}
        onChange={e => {
          setDoctor({ ...doctor, email: e.target.value });
          setErrors({ ...errors, email: "" });
        }}
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

      {/* PHONE */}
      <input
        placeholder="Phone"
        value={doctor.phone}
        onChange={e => {
          setDoctor({ ...doctor, phone: e.target.value });
          setErrors({ ...errors, phone: "" });
        }}
      />
      {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}

      {/* SPECIALIZATION */}
      <input
        placeholder="Specialization"
        value={doctor.specialization}
        onChange={e => {
          setDoctor({ ...doctor, specialization: e.target.value });
          setErrors({ ...errors, specialization: "" });
        }}
      />
      {errors.specialization && (
        <p style={{ color: "red" }}>{errors.specialization}</p>
      )}

      {/* ROOM NUMBER */}
      <input
        type="number"
        placeholder="Room Number"
        value={doctor.roomNumber}
        onChange={e => {
          setDoctor({ ...doctor, roomNumber: e.target.value });
          setErrors({ ...errors, roomNumber: "" });
        }}
      />
      {errors.roomNumber && (
        <p style={{ color: "red" }}>{errors.roomNumber}</p>
      )}

      <button onClick={saveDoctor}>
        {editId ? "Update Doctor" : "Save Doctor"}
      </button>

      <hr />

      <h3>Search Doctor</h3>
      <input placeholder="Doctor ID" onChange={e => setSearchId(e.target.value)} />
      <button onClick={getDoctorById}>Search</button>

      <hr />

     {/* AI RECOMMEND UI */}
      <h3>AI Doctor Recommendation</h3>
      <input
        placeholder="Required Specialization"
        onChange={e => setSpecialization(e.target.value)}
      />
      <button onClick={recommendDoctor}>AI Recommend Doctor</button>

      {recommendedDoctor && (
        <p>
          AI Suggested Doctor: <b>{recommendedDoctor.name}</b> (
          {recommendedDoctor.specialization})
        </p>
      )}

      <h3>Doctors</h3>
      <button onClick={getAllDoctors}>Load All</button>
      <ul>
        {doctors.map(d => (
          <li key={d.id ?? d.doctorId}>
            {d.name} – {d.specialization} – Room {d.roomNumber}
            <button onClick={() => {
              setDoctor(d);
              setEditId(d.id ?? d.doctorId);
            }}>
              Edit
            </button>
            <button onClick={() => deleteDoctor(d.id ?? d.doctorId)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {msg && <p>{msg}</p>}
    </div>
  );
}
