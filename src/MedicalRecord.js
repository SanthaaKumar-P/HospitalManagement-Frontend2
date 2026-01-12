import React, { useState } from "react";
import { isValidNumber, isValidText } from "./Validation";

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

export default function MedicalRecord() {

  const emptyRecord = {
    diagnosis: "",
    prescription: "",
    patientId: ""
  };

  const [record, setRecord] = useState(emptyRecord);
  const [records, setRecords] = useState([]);
  const [recordId, setRecordId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [aiSummary, setAiSummary] = useState("");

  /* ===== AI MEDICAL SUMMARY ===== */
  const getAiSummary = async () => {
    if (!isValidNumber(patientId)) {
      setMsg("Please enter valid Patient ID");
      return;
    }

    const res = await fetchWithAuth(`/medicalrecords/ai-summary/${patientId}`);
    if (!res.ok) {
      setMsg("Unable to generate AI summary");
      return;
    }

    const text = await res.text();
    setAiSummary(text);
  };

  /* ========= ADD / UPDATE ========= */
  const saveRecord = async () => {

    let newErrors = {};

    if (!isValidText(record.diagnosis)) {
      newErrors.diagnosis = "Invalid diagnosis text";
    }

    if (!isValidText(record.prescription)) {
      newErrors.prescription = "Invalid prescription text";
    }

    if (!isValidNumber(record.patientId)) {
      newErrors.patientId = "Invalid patient ID";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const url = editId ? `/medicalrecords/${editId}` : "/medicalrecords";
    const method = editId ? "PUT" : "POST";

    const res = await fetchWithAuth(url, {
      method,
      body: JSON.stringify({
        ...record,
        patientId: Number(record.patientId)
      })
    });

    if (!res.ok) {
      setMsg("Error saving medical record");
      return;
    }

    const data = await res.json();
    setRecords(data ? [data] : []);
    setRecord(emptyRecord);
    setEditId(null);
    setMsg(editId ? "Medical Record Updated" : "Medical Record Added");
  };

  /* ========= SEARCH BY RECORD ID ========= */
  const getByRecordId = async () => {
    const res = await fetchWithAuth(`/medicalrecords/${recordId}`);
    if (!res.ok) {
      setMsg("Record Not Found");
      return;
    }
    const data = await res.json();
    setRecords([data]);
  };

  /* ========= SEARCH BY PATIENT ID ========= */
  const getByPatientId = async () => {
    const res = await fetchWithAuth(`/medicalrecords/patient/${patientId}`);
    if (res.status === 204) {
      setRecords([]);
      setMsg("No records found");
      return;
    }
    const data = await res.json();
    setRecords(data);
  };

  /* ========= UI ========= */
  return (
    <div>

      <h2>{editId ? "Update Medical Record" : "Add Medical Record"}</h2>

      {/* DIAGNOSIS */}
      <input
        placeholder="Diagnosis"
        value={record.diagnosis}
        onChange={e => {
          setRecord({ ...record, diagnosis: e.target.value });
          setErrors({ ...errors, diagnosis: "" });
        }}
      />
      {errors.diagnosis && <p style={{ color: "red" }}>{errors.diagnosis}</p>}

      {/* PRESCRIPTION */}
      <input
        placeholder="Prescription"
        value={record.prescription}
        onChange={e => {
          setRecord({ ...record, prescription: e.target.value });
          setErrors({ ...errors, prescription: "" });
        }}
      />
      {errors.prescription && <p style={{ color: "red" }}>{errors.prescription}</p>}

      {/* PATIENT ID */}
      <input
        type="number"
        placeholder="Patient ID"
        value={record.patientId}
        onChange={e => {
          setRecord({ ...record, patientId: e.target.value });
          setErrors({ ...errors, patientId: "" });
        }}
      />
      {errors.patientId && <p style={{ color: "red" }}>{errors.patientId}</p>}

      <button onClick={saveRecord}>
        {editId ? "Update Record" : "Save Record"}
      </button>

      <hr />

      {/* SEARCH BY RECORD ID */}
      <h3>Search Record by ID</h3>
      <input placeholder="Record ID" onChange={e => setRecordId(e.target.value)} />
      <button onClick={getByRecordId}>Search</button>

      <hr />

      {/* SEARCH BY PATIENT ID */}
      <h3>Search Records by Patient ID</h3>
      <input placeholder="Patient ID" onChange={e => setPatientId(e.target.value)} />
      <button onClick={getByPatientId}>Search</button>

      <hr />

      {/* AI SUMMARY */}
      <h3>AI Medical Summary</h3>
      <button onClick={getAiSummary}>Generate AI Medical Summary</button>

      {aiSummary && (
        <p style={{ marginTop: "15px", fontWeight: "bold" }}>
          {aiSummary}
        </p>
      )}

      <ul>
        {records.map(r => (
          <li key={r.id ?? r.recordId}>
            Diagnosis: {r.diagnosis} | Prescription: {r.prescription}
            <button onClick={() => {
              setRecord({
                diagnosis: r.diagnosis,
                prescription: r.prescription,
                patientId: r.patientId
              });
              setEditId(r.id ?? r.recordId);
            }}>
              Edit
            </button>
          </li>
        ))}
      </ul>

      {msg && <p>{msg}</p>}
    </div>
  );
}
