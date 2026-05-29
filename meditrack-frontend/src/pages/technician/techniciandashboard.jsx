import React, { useMemo, useState } from "react";

const tasks = [
  { title: "Check infusion pump", assigned: "Ward 2B", status: "Scheduled" },
  { title: "Inspect telemetry monitors", assigned: "ICU", status: "In progress" },
  { title: "Verify imaging equipment", assigned: "Radiology", status: "Pending" },
];

const reminderList = [
  { item: "Ventilator calibration", time: "08:00", status: "Due" },
  { item: "X-ray machine check", time: "11:00", status: "Complete" },
  { item: "Patient monitor review", time: "14:00", status: "Missed" },
];

export default function TechnicianDashboard() {
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState([
    "Updated ICU monitor thresholds.",
    "Confirmed emergency lighting in Ward 3.",
  ]);

  const addNote = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLogs((prev) => [note.trim(), ...prev]);
    setNote("");
  };

  const upcoming = useMemo(() => reminderList.filter((item) => item.status !== "Complete"), []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900">Technician Dashboard</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Monitor equipment checks, follow maintenance protocols, and coordinate technical support across hospital wards.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3 mb-8">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Assigned tasks</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {tasks.map((task) => (
                <li key={task.title} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-slate-500">{task.assigned}</div>
                  <div className="mt-2 text-sm">{task.status}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm xl:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Equipment reminders</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {upcoming.map((item) => (
                <div key={item.item} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold">{item.item}</div>
                  <div className="text-sm text-slate-500">{item.time}</div>
                  <div className="mt-2 text-sm text-slate-700">Status: {item.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2 mb-8">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Log maintenance note</h2>
            <form onSubmit={addNote} className="space-y-4">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                placeholder="Record an equipment check, repair detail, or follow-up task"
              />
              <button className="rounded-2xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
                Save note
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent maintenance logs</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {logs.map((entry, idx) => (
                <li key={idx} className="rounded-2xl bg-slate-50 p-4">
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
