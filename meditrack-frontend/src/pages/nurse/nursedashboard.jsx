import React, { useEffect, useMemo, useState } from "react";
import { getTasks } from "../../service/api";

const initialSchedule = [
  {
    shift: "Morning",
    time: "07:00 - 15:00",
    ward: "Ward 4A",
    assignment: "General Medicine",
    doctorNote: "Cover Ward B evening shift if needed.",
  },
  {
    shift: "Evening",
    time: "15:00 - 23:00",
    ward: "Ward 4A",
    assignment: "Post-op care",
    doctorNote: "Assist Dr. Kim with extra patient rounds.",
  },
  {
    shift: "Night",
    time: "23:00 - 07:00",
    ward: "ICU",
    assignment: "Critical care",
    doctorNote: "Monitor Patient X vitals every 2 hours.",
  },
];

const vitalsList = [
  { key: "bp", label: "Blood Pressure" },
  { key: "hr", label: "Heart Rate" },
  { key: "oxygen", label: "O₂ Saturation" },
  { key: "temperature", label: "Temperature" },
];

const medicationAdministration = [
  { id: "med-1", med: "Acetaminophen", dose: "500mg", schedule: "09:00", status: "On track", doctorTask: "Administer antibiotic to Patient Y at 20:00." },
  { id: "med-2", med: "Insulin", dose: "10 units", schedule: "12:00", status: "Pending", doctorTask: "Prepare insulin dose for patient Z." },
  { id: "med-3", med: "Amoxicillin", dose: "250mg", schedule: "18:00", status: "Missed", doctorTask: "Restart missed dose and record in chart." },
];

const careNotes = [
  { id: "note-1", patient: "Maria J.", note: "BP stable, continue IV fluids.", doctorTask: "Update post-surgery notes for Patient Z." },
  { id: "note-2", patient: "Robert K.", note: "Oxygen support maintained. Reassess in 2 hours.", doctorTask: "Monitor overnight respiratory status." },
];

const initialAlerts = [
  { id: "alert-1", message: "Patient A abnormal BP reading detected.", severity: "Critical", time: "08:05" },
  { id: "alert-2", message: "Doctor request: attend Patient X for urgent vitals check.", severity: "High", time: "09:20" },
];

export default function NurseDashboard() {
  const [patientName, setPatientName] = useState("");
  const [vitals, setVitals] = useState({ bp: "", hr: "", oxygen: "", temperature: "" });
  const [notes, setNotes] = useState("");
  const [alerts, setAlerts] = useState(initialAlerts);
  const [tasks, setTasks] = useState([]);
  const [taskNotes, setTaskNotes] = useState({});
  const [activityLog, setActivityLog] = useState([
    "Started shift handover review.",
    "Noted urgent vitals check for Patient X.",
  ]);
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState("");

  const schedule = useMemo(() => initialSchedule, []);

  const submitVitals = (e) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    setAlerts((prev) => [
      {
        id: `alert-${prev.length + 1}`,
        message: `Vitals recorded for ${patientName}: ${vitals.bp}, ${vitals.hr} bpm, ${vitals.oxygen}% O₂, ${vitals.temperature}°C`,
        severity: "Normal",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev,
    ]);

    setActivityLog((prev) => [`Recorded vitals for ${patientName}.`, ...prev]);
    setPatientName("");
    setVitals({ bp: "", hr: "", oxygen: "", temperature: "" });
    setNotes("");
  };

  const handleTaskStatusUpdate = (taskId, newStatus) => {
    setTasks((prev) => prev.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task)));
    setActivityLog((prev) => [`Marked task ${taskId} ${newStatus}.`, ...prev]);
  };

  const handleTaskNoteChange = (taskId, value) => {
    setTaskNotes((prev) => ({ ...prev, [taskId]: value }));
  };

  const submitTaskNote = (taskId) => {
    const note = taskNotes[taskId]?.trim();
    if (!note) return;

    setActivityLog((prev) => [`Task ${taskId}: ${note}`, ...prev]);
    setTaskNotes((prev) => ({ ...prev, [taskId]: "" }));
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setTaskLoading(true);
        const { data } = await getTasks();
        setTasks(Array.isArray(data) ? data : []);
        setTaskError("");
      } catch (err) {
        setTasks([]);
        setTaskError(err.response?.data?.error || "Unable to load assigned tasks.");
      } finally {
        setTaskLoading(false);
      }
    };

    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900">Nurse Dashboard</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Manage shift duties, monitor patient vitals, administer medications, and complete doctor-assigned tasks.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3 mb-8">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Shift schedule</h2>
            <ul className="space-y-4 text-sm text-slate-700">
              {schedule.map((item) => (
                <li key={item.shift} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900">{item.shift}</div>
                  <div className="text-slate-700">{item.time}</div>
                  <div className="mt-1 text-slate-500">{item.ward} · {item.assignment}</div>
                  <div className="mt-3 rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">Doctor note: {item.doctorNote}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm xl:col-span-2">
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

              <div className="grid gap-4 md:grid-cols-2">
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
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2"
                  placeholder="Add patient observation or handover note"
                />
              </div>

              <button className="rounded-2xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                Save monitoring update
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3 mb-8">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Medication administration</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {medicationAdministration.map((item) => (
                <li key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900">{item.med}</div>
                  <div className="text-slate-600">{item.dose} • {item.schedule}</div>
                  <div className="mt-1 text-sm text-slate-700">Status: {item.status}</div>
                  <div className="mt-2 text-xs uppercase tracking-wide text-slate-500">Doctor task: {item.doctorTask}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Care notes</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {careNotes.map((entry) => (
                <li key={entry.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900">{entry.patient}</div>
                  <div className="mt-1 text-slate-600">{entry.note}</div>
                  <div className="mt-2 text-xs uppercase tracking-wide text-slate-500">Doctor task: {entry.doctorTask}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Alerts</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className={`rounded-2xl p-4 ${alert.severity === "Critical" ? "bg-red-50 border border-red-200" : "bg-slate-50"}`}>
                  <div className="font-semibold text-slate-900">{alert.severity}</div>
                  <div className="mt-1 text-slate-600">{alert.message}</div>
                  <div className="mt-2 text-xs uppercase tracking-wide text-slate-500">{alert.time}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Assigned tasks</h2>
          {taskLoading ? (
            <p className="text-slate-500">Loading tasks…</p>
          ) : taskError ? (
            <p className="text-red-600">{taskError}</p>
          ) : tasks.length === 0 ? (
            <p className="text-slate-600">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task._id} className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{task.title}</div>
                      <div className="text-slate-600 mt-1">{task.description || "No description provided."}</div>
                      <div className="mt-2 text-sm text-slate-700">Due: {task.dueDate || "N/A"}</div>
                    </div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">{task.status}</div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleTaskStatusUpdate(task._id, "pending")}
                      className="rounded-full bg-slate-200 px-3 py-1 text-slate-800 hover:bg-slate-300"
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTaskStatusUpdate(task._id, "in-progress")}
                      className="rounded-full bg-amber-200 px-3 py-1 text-slate-900 hover:bg-amber-300"
                    >
                      In progress
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTaskStatusUpdate(task._id, "completed")}
                      className="rounded-full bg-emerald-200 px-3 py-1 text-emerald-900 hover:bg-emerald-300"
                    >
                      Completed
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <textarea
                      value={taskNotes[task._id] || ""}
                      onChange={(e) => handleTaskNoteChange(task._id, e.target.value)}
                      rows={3}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                      placeholder="Leave a note for the doctor"
                    />
                    <button
                      type="button"
                      onClick={() => submitTaskNote(task._id)}
                      className="rounded-2xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
                    >
                      Add note
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent activity</h2>
          <ul className="space-y-3 text-sm text-slate-700">
            {activityLog.map((entry, idx) => (
              <li key={idx} className="rounded-2xl bg-slate-50 p-4">
                {entry}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
