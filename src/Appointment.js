import React, { useState } from "react";

const BASE_URL = "http://localhost:8080";

/* ========= ONE-TIME JWT HELPER ========= */
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

export default function Appointment() {

  const emptyAppointment = {
    doctorId: "",
    patientId: "",
    appointmentTime: "",
    status: "",
    notes: ""
  };

  const [appointment, setAppointment] = useState(emptyAppointment);
  const [appointmentId, setAppointmentId] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");

  /* ========= ADD / UPDATE ========= */
  const saveAppointment = async () => {
    const url = editId ? `/appointments/${editId}` : "/appointments";
    const method = editId ? "PUT" : "POST";

    const res = await fetchWithAuth(url, {
      method,
      body: JSON.stringify({
        doctorId: Number(appointment.doctorId),
        patientId: Number(appointment.patientId),
        appointmentTime: appointment.appointmentTime,
        status: appointment.status,
        notes: appointment.notes
      })
    });

    if (!res.ok) {
      setMsg("Error saving appointment");
      return;
    }

    const data = await res.json();
    setMsg(editId ? "Appointment Updated Successfully" : "Appointment Added Successfully");
    setAppointment(emptyAppointment);
    setEditId(null);
    setAppointments(data ? [data] : []);
  };

  /* ========= GET BY ID ========= */
  const getById = async () => {
    const res = await fetchWithAuth(`/appointments/${appointmentId}`);

    if (!res.ok) {
      setMsg("Appointment Not Found");
      return;
    }

    const data = await res.json();
    setAppointments([data]);
    setMsg("Appointment Found");
  };

  /* ========= GET BY STATUS ========= */
  const getByStatus = async () => {
    const res = await fetchWithAuth(`/appointments/status/${statusSearch}`);

    if (res.status === 204) {
      setAppointments([]);
      setMsg("No appointments with this status");
      return;
    }

    if (!res.ok) {
      setMsg("Error fetching appointments");
      return;
    }

    const data = await res.json();
    setAppointments(data);
    setMsg("Appointments Loaded");
  };

  /* ========= UI ========= */
  return (
    <div>

      <h2>{editId ? "Update Appointment" : "Add Appointment"}</h2>

      <input
        type="number"
        placeholder="Doctor ID"
        value={appointment.doctorId}
        onChange={e => setAppointment({ ...appointment, doctorId: e.target.value })}
      />

      <input
        type="number"
        placeholder="Patient ID"
        value={appointment.patientId}
        onChange={e => setAppointment({ ...appointment, patientId: e.target.value })}
      />

      <input
        type="datetime-local"
        value={appointment.appointmentTime}
        onChange={e => setAppointment({ ...appointment, appointmentTime: e.target.value })}
      />

      <input
        placeholder="Status"
        value={appointment.status}
        onChange={e => setAppointment({ ...appointment, status: e.target.value })}
      />

      <input
        placeholder="Notes"
        value={appointment.notes}
        onChange={e => setAppointment({ ...appointment, notes: e.target.value })}
      />

      <button onClick={saveAppointment}>
        {editId ? "Update Appointment" : "Save Appointment"}
      </button>

      <hr />

      <h3>Search Appointment by ID</h3>
      <input
        placeholder="Appointment ID"
        onChange={e => setAppointmentId(e.target.value)}
      />
      <button onClick={getById}>Search</button>

      <hr />

      <h3>Search Appointments by Status</h3>
      <input
        placeholder="Status (Scheduled / Completed / Cancelled)"
        onChange={e => setStatusSearch(e.target.value)}
      />
      <button onClick={getByStatus}>Search by Status</button>

      <hr />

      <ul>
        {appointments.map(a => (
          <li key={a.id}>
            <b>Doctor ID:</b> {a.doctorId} <br />
            <b>Patient ID:</b> {a.patientId} <br />
            <b>Time:</b> {a.appointmentTime} <br />
            <b>Status:</b> {a.status} <br />
            <b>Notes:</b> {a.notes}

            <br />

            <button
              onClick={() => {
                setAppointment({
                  doctorId: a.doctorId,
                  patientId: a.patientId,
                  appointmentTime: a.appointmentTime,
                  status: a.status,
                  notes: a.notes
                });
                setEditId(a.id);
              }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      {msg && <p>{msg}</p>}
    </div>
  );
}
