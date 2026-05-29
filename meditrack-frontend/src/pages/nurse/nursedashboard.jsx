import React, { useMemo, useState } from "react";

const schedule = [
  { shift: "Morning", time: "07:00 - 15:00", ward: "Ward 4A", assignment: "General Medicine" },
  { shift: "Evening", time: "15:00 - 23:00", ward: "Ward 4A", assignment: "Post-op care" },
  { shift: "Night", time: "23:00 - 07:00", ward: "ICU", assignment: "Critical care" },
];

const vitalsList = [
  { key: "bp", label: "Blood Pressure" },
  { key: "hr", label: "Heart Rate" },
  { key: "oxygen", label: "O₂ Saturation" },
  { key: "temperature", label: "Temperature" },
];

export default function NurseDashboard() {
  const [patientName, setPatientName] = useState("");
  const [vitals, setVitals] = useState({ bp: "", hr: "", oxygen: "", temperature: "" });
  const [notes, setNotes] = useState("");
  const [alerts, setAlerts] = useState([]);

  const submitVitals = (e) => {
    e.preventDefault();
    setAlerts((prev) => [
      `Vitals recorded for ${patientName || "patient"}: ${vitals.bp}, ${vitals.hr} bpm, ${vitals.oxygen}% O₂, ${vitals.temperature}°C`,
      ...prev,
    ]);
    setPatientName("");
    setVitals({ bp: "", hr: "", oxygen: "", temperature: "" });
    setNotes("");
  };

  const reminderList = useMemo(
    () => [
      { med: "Acetaminophen", time: "09:00", status: "On track" },
      { med: "Insulin", time: "12:00", status: "Pending" },
      { med: "Amoxicillin", time: "18:00", status: "Missed" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900">Nurse Dashboard</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Access your shift schedule, patient monitoring tools, medication administration tasks, and care notes in one medical dashboard.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3 mb-8">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Shift schedule</h2>
            <ul className="space-y-4 text-sm text-slate-700">
              {schedule.map((item) => (
                <li key={item.shift} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold">{item.shift}</div>
                  <div>{item.time}</div>
                  <div className="text-slate-500">{item.ward} · {item.assignment}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm xl:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Medication reminders</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {reminderList.map((item) => (
                <div key={item.med} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold">{item.med}</div>
                  <div className="text-sm text-slate-500">{item.time}</div>
                  <div className="mt-2 text-sm text-slate-700">Status: {item.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2 mb-8">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Patient monitoring</h2>
            <form onSubmit={submitVitals} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Patient name</label>
                <input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2"
                  placeholder="Enter patient name"
                />
              </div>

              {vitalsList.map((item) => (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-slate-700">{item.label}</label>
                  <input
                    value={vitals[item.key]}
                    onChange={(e) => setVitals({ ...vitals, [item.key]: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-slate-700">Care notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2"
                  rows={4}
                  placeholder="Add quick notes about assessment, concerns, or follow-up"
                />
              </div>

              <button className="rounded-2xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                Save vitals and notes
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent care notes</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="rounded-2xl bg-slate-50 p-4">
                <div className="font-semibold">Patient: Maria J.</div>
                <div>BP stable, HR slightly elevated. Continue IV fluids.</div>
              </li>
              <li className="rounded-2xl bg-slate-50 p-4">
                <div className="font-semibold">Patient: Robert K.</div>
                <div>Oxygen support maintained at 2L/min. Continue pulse checks every 2 hours.</div>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-800 p-6 text-white shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Medical operations</h2>
          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-slate-900 p-4">
              <div className="font-semibold">Medication administration</div>
              <p className="mt-2 text-slate-300">Log doses, review reminders, and mark missed medication events.</p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-4">
              <div className="font-semibold">Shift handover</div>
              <p className="mt-2 text-slate-300">Quick access to ward assignments and handoff notes for the next team.</p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-4">
              <div className="font-semibold">Patient monitoring</div>
              <p className="mt-2 text-slate-300">Update readings for BP, HR, O₂, and temperature for each patient.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
