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

export default function Patient() {

  const emptyPatient = {
    name: "",
    email: "",
    phone: "",
    address: "",
    age: ""
  };

  const [patient, setPatient] = useState(emptyPatient);
  const [searchId, setSearchId] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  /* ========= ADD / UPDATE ========= */
  const savePatient = async () => {

    let newErrors = {};

    if (!isValidName(patient.name)) {
      newErrors.name = "Name should contain only letters";
    }

    if (!isValidEmail(patient.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!isValidPhone(patient.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!patient.address) {
      newErrors.address = "Address cannot be empty";
    }

    if (!isValidNumber(patient.age)) {
      newErrors.age = "Invalid age";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const url = editId ? `/patients/${editId}` : "/patients";
    const method = editId ? "PUT" : "POST";

    const res = await fetchWithAuth(url, {
      method,
      body: JSON.stringify({
        ...patient,
        age: Number(patient.age)
      })
    });

    if (!res.ok) {
      setMsg("Error saving patient");
      return;
    }

    setMsg(editId ? "Patient Updated Successfully" : "Patient Added Successfully");
    setPatient(emptyPatient);
    setEditId(null);
  };

  /* ========= GET BY ID ========= */
  const getPatientById = async () => {
    const res = await fetchWithAuth(`/patients/${searchId}`);
    if (!res.ok) {
      setMsg("Patient Not Found");
      return;
    }
    const data = await res.json();
    setPatient(data);
    setEditId(data.patientId);
  };

  /* ========= UI ========= */
  return (
    <div>

      <h2>{editId ? "Update Patient" : "Add Patient"}</h2>

      <input
        placeholder="Name"
        value={patient.name}
        onChange={e => {
          setPatient({ ...patient, name: e.target.value });
          setErrors({ ...errors, name: "" });
        }}
      />
      {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

      <input
        placeholder="Email"
        value={patient.email}
        onChange={e => {
          setPatient({ ...patient, email: e.target.value });
          setErrors({ ...errors, email: "" });
        }}
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

      <input
        placeholder="Phone"
        value={patient.phone}
        onChange={e => {
          setPatient({ ...patient, phone: e.target.value });
          setErrors({ ...errors, phone: "" });
        }}
      />
      {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}

      <input
        placeholder="Address"
        value={patient.address}
        onChange={e => {
          setPatient({ ...patient, address: e.target.value });
          setErrors({ ...errors, address: "" });
        }}
      />
      {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}

      <input
        type="number"
        placeholder="Age"
        value={patient.age}
        onChange={e => {
          setPatient({ ...patient, age: e.target.value });
          setErrors({ ...errors, age: "" });
        }}
      />
      {errors.age && <p style={{ color: "red" }}>{errors.age}</p>}

      <button onClick={savePatient}>
        {editId ? "Update Patient" : "Save Patient"}
      </button>

      <hr />

      <h3>Search Patient</h3>
      <input placeholder="Patient ID" onChange={e => setSearchId(e.target.value)} />
      <button onClick={getPatientById}>Search</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}
