import React, { useState } from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const vitalsList = [
  { key: "bp", label: "Blood Pressure" },
  { key: "hr", label: "Heart Rate" },
  { key: "oxygen", label: "O₂ Saturation" },
  { key: "temperature", label: "Temperature" },
];

const monitoringTasks = [
  { id: "task-1", patient: "Patient X", note: "Check vitals every 2 hours.", due: "Tonight 11:00 PM" },
  { id: "task-2", patient: "Patient Y", note: "Review fluid balance before shift end.", due: "Today 03:00 PM" },
];

export default function NursePatientMonitoring() {
  const [patientName, setPatientName] = useState("");
  const [vitals, setVitals] = useState({ bp: "", hr: "", oxygen: "", temperature: "" });
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(`Recorded monitoring update for ${patientName || "the patient"}.`);
    setPatientName("");
    setVitals({ bp: "", hr: "", oxygen: "", temperature: "" });
    setNotes("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeBanner subtitle="Record vitals, update monitoring notes, and follow doctor-assigned monitoring tasks." />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Patient Monitoring</h1>
            <p className="mt-2 text-slate-600">Capture BP, heart rate, oxygen, and temperature with a monitoring workflow designed for nursing care.</p>
          </div>
          <Link to="/nurse" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to nurse dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm xl:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">Patient name</label>
                <input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3"
                  placeholder="Enter patient name"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {vitalsList.map((item) => (
                  <div key={item.key}>
                    <label className="block text-sm font-medium text-slate-700">{item.label}</label>
                    <input
                      value={vitals[item.key]}
                      onChange={(e) => setVitals({ ...vitals, [item.key]: e.target.value })}
                      className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Observation notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3"
                  placeholder="Enter any observation or handover note"
                />
              </div>

              <button className="rounded-2xl bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700">Save monitoring update</button>
              {message && <p className="text-sm text-emerald-700">{message}</p>}
            </form>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Doctor-assigned monitoring tasks</h2>
            <ul className="space-y-4 text-sm text-slate-700">
              {monitoringTasks.map((task) => (
                <li key={task.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900">{task.patient}</div>
                  <p className="mt-1 text-slate-600">{task.note}</p>
                  <div className="mt-2 text-xs uppercase tracking-wide text-slate-500">Due: {task.due}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
