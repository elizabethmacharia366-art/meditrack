import React, { useEffect, useState } from "react";
import { getTasks } from "../../service/api";

const pendingLabTests = [
  { patient: "Patient A", test: "CBC", due: "10:00" },
  { patient: "Patient B", test: "Blood glucose", due: "11:30" },
  { patient: "Patient C", test: "Urinalysis", due: "13:00" },
];

const qualityChecks = [
  { item: "Defibrillator battery", status: "Pending" },
  { item: "Infusion pump calibration", status: "In progress" },
  { item: "Sterile tray inspection", status: "Complete" },
];

const equipmentStatus = [
  { device: "MRI scanner", state: "Operational" },
  { device: "Ventilator #12", state: "Maintenance" },
  { device: "Ultrasound unit", state: "Available" },
];

const alertsList = [
  { message: "Patient D urgent sample needs pickup.", severity: "High", time: "09:10" },
  { message: "Test result upload delayed for Ward 2.", severity: "Normal", time: "09:55" },
];

export default function TechnicianDashboard() {
  const [patientId, setPatientId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState([
    "Updated ICU monitor thresholds.",
    "Confirmed emergency lighting in Ward 3.",
  ]);
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState("");

  const addNote = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLogs((prev) => [note.trim(), ...prev]);
    setNote("");
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!patientId || !selectedFile) {
      setUploadMessage("Please select a patient and a file before uploading.");
      return;
    }
    setUploadMessage(`Uploaded ${selectedFile.name} for ${patientId}.`);
    setSelectedFile(null);
    setPatientId("");
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900">Technician Dashboard</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Monitor equipment checks, follow maintenance protocols, and coordinate technical support across hospital wards.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3 mb-8">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Pending lab tests</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {pendingLabTests.map((item) => (
                <li key={`${item.patient}-${item.test}`} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold">{item.patient}</div>
                  <div className="text-slate-500">{item.test}</div>
                  <div className="mt-2 text-sm text-slate-700">Due: {item.due}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Upload results</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Patient ID</label>
                <input
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2"
                  placeholder="Enter patient ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Result file</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="mt-1 w-full text-sm text-slate-700"
                />
              </div>
              <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
                Upload
              </button>
              {uploadMessage && <p className="text-sm text-slate-600">{uploadMessage}</p>}
            </form>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Quality checks</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {qualityChecks.map((item) => (
                <li key={item.item} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold">{item.item}</div>
                  <div className="mt-1 text-slate-600">Status: {item.status}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3 mb-8">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Equipment status</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {equipmentStatus.map((item) => (
                <li key={item.device} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold">{item.device}</div>
                  <div className="mt-1 text-slate-600">{item.state}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Alerts</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {alertsList.map((alert, idx) => (
                <li key={idx} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold">{alert.severity}</div>
                  <div className="text-slate-600 mt-1">{alert.message}</div>
                  <div className="mt-2 text-xs uppercase tracking-wide text-slate-500">{alert.time}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Assigned tasks</h2>
            {taskLoading ? (
              <p className="text-slate-500">Loading tasks…</p>
            ) : taskError ? (
              <p className="text-red-600">{taskError}</p>
            ) : tasks.length === 0 ? (
              <p className="text-slate-600">No tasks assigned yet.</p>
            ) : (
              <ul className="space-y-3 text-sm text-slate-700">
                {tasks.map((task) => (
                  <li key={task._id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="font-semibold text-slate-900">{task.title}</div>
                    <div className="text-slate-500 mt-1">{task.description || 'No additional details.'}</div>
                    <div className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                      {task.ward ? `${task.ward} · ` : ''}{task.department || 'General'} · {task.status}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
  );
}
          </div>
        </div>
      </div>
    </div>
  );
}
