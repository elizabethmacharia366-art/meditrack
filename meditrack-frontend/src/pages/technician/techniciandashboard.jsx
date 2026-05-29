import React, { useEffect, useState } from "react";
import { getTasks } from "../../service/api";

const initialPendingLabTests = [
  { id: "lab-1", patientId: "PAT-1001", testType: "Blood", priority: "Urgent", status: "Ordered" },
  { id: "lab-2", patientId: "PAT-1005", testType: "Urine", priority: "Normal", status: "Awaiting sample" },
  { id: "lab-3", patientId: "PAT-1010", testType: "Imaging", priority: "High", status: "Scheduled" },
];

const initialQualityChecks = [
  { id: "qc-1", sample: "Blood tube", issue: "Incomplete label", status: "Open" },
  { id: "qc-2", sample: "Urine cup", issue: "Invalid container", status: "Open" },
  { id: "qc-3", sample: "Biopsy vial", issue: "Volume too low", status: "Closed" },
];

const initialEquipmentStatus = [
  { id: "eq-1", device: "MRI scanner", status: "Operational", calibrationDue: "2026-06-02" },
  { id: "eq-2", device: "CT unit", status: "Down", calibrationDue: "2026-05-28" },
  { id: "eq-3", device: "Blood analyzer", status: "Available", calibrationDue: "2026-06-10" },
];

const quickPanels = [
  { title: "Assigned tasks", description: "Track your doctor-assigned technical workflows.", accent: "bg-slate-100" },
  { title: "Lab results", description: "Upload and validate new patient test results.", accent: "bg-slate-100" },
  { title: "Equipment checks", description: "Monitor device readiness and calibration due dates.", accent: "bg-slate-100" },
  { title: "Quality control", description: "Resolve sample issues and request recollections.", accent: "bg-slate-100" },
];

const initialAlerts = [
  { id: "alert-1", message: "Urgent blood work requested for PAT-1001.", severity: "Critical", time: "09:12" },
  { id: "alert-2", message: "Priority imaging test marked for PAT-1010.", severity: "High", time: "09:40" },
];

export default function TechnicianDashboard() {
  const [patientId, setPatientId] = useState("");
  const [resultValue, setResultValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState([
    "Validated urgent lab panel for Ward 4.",
    "Re-routed CT unit calibration request to maintenance.",
  ]);
  const [pendingLabTests, setPendingLabTests] = useState(initialPendingLabTests);
  const [qualityChecks, setQualityChecks] = useState(initialQualityChecks);
  const [equipmentStatus, setEquipmentStatus] = useState(initialEquipmentStatus);
  const [alertsList, setAlertsList] = useState(initialAlerts);
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState("");

  const acceptedFileTypes = ["application/pdf", "image/png", "image/jpeg"];

  const handleUpload = (e) => {
    e.preventDefault();

    if (!patientId.trim()) {
      setUploadMessage("Patient ID is required.");
      return;
    }

    if (!selectedFile && !resultValue.trim()) {
      setUploadMessage("Please upload a file or enter a numeric result.");
      return;
    }

    if (selectedFile && !acceptedFileTypes.includes(selectedFile.type)) {
      setUploadMessage("Only PDF, PNG, and JPEG file formats are accepted.");
      return;
    }

    setUploadMessage(
      selectedFile
        ? `Uploaded ${selectedFile.name} for ${patientId}.`
        : `Recorded numeric result for ${patientId}: ${resultValue}`,
    );
    setSelectedFile(null);
    setResultValue("");
    setPatientId("");
  };

  const addNote = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLogs((prev) => [note.trim(), ...prev]);
    setNote("");
  };

  const requestRecollection = (id) => {
    setQualityChecks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Recollection requested" } : item,
      ),
    );
    setAlertsList((prev) => [
      {
        id: `alert-${prev.length + 1}`,
        message: "Recollection requested for an invalid sample.",
        severity: "High",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev,
    ]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task)),
    );
    setLogs((prev) => [`Updated task ${taskId} to ${newStatus}.`, ...prev]);
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
          <h1 className="text-3xl font-bold text-slate-900">Technician Dashboard</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Track lab tests, upload results, manage equipment status, and complete doctor-assigned tasks from a single technician view.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {quickPanels.map((panel) => (
            <div key={panel.title} className={`rounded-3xl p-6 shadow-sm border border-slate-200 ${panel.accent}`}>
              <h2 className="text-lg font-semibold text-slate-900">{panel.title}</h2>
              <p className="mt-3 text-sm text-slate-600">{panel.description}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3 mb-8">
          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Pending lab tests</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {pendingLabTests.map((item) => (
                <li
                  key={item.id}
                  className={`rounded-2xl p-4 ${item.priority === "Urgent" ? "bg-red-50 border border-red-200" : "bg-slate-50"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-slate-900">{item.testType} / {item.patientId}</div>
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${item.priority === "Urgent" ? "bg-red-600 text-white" : item.priority === "High" ? "bg-amber-500 text-slate-900" : "bg-slate-200 text-slate-700"}`}>
                      {item.priority}
                    </div>
                  </div>
                  <div className="mt-2 text-slate-600">Status: {item.status}</div>
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
                  accept=".pdf,image/png,image/jpeg"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="mt-1 w-full text-sm text-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Numeric result (optional)</label>
                <input
                  value={resultValue}
                  onChange={(e) => setResultValue(e.target.value)}
                  type="number"
                  step="any"
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2"
                  placeholder="Enter a value if no file is uploaded"
                />
              </div>
              <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
                Upload result
              </button>
              {uploadMessage && <p className="text-sm text-slate-600">{uploadMessage}</p>}
            </form>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Quality checks</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {qualityChecks.map((item) => (
                <li key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900">{item.sample}</div>
                  <div className="mt-1 text-slate-600">Issue: {item.issue}</div>
                  <div className="mt-2 text-xs uppercase tracking-wide text-slate-500">Status: {item.status}</div>
                  {item.status !== "Closed" && (
                    <button
                      type="button"
                      onClick={() => requestRecollection(item.id)}
                      className="mt-3 inline-flex rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-amber-600"
                    >
                      Request re-collection
                    </button>
                  )}
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
                <li key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="font-semibold text-slate-900">{item.device}</div>
                  <div className="mt-1 text-slate-600">Status: {item.status}</div>
                  <div className="mt-2 text-xs uppercase tracking-wide text-slate-500">Calibration due: {item.calibrationDue}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Alerts</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {alertsList.map((alert) => (
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

          <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
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
                  <div key={task._id} className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-slate-900">{task.title}</div>
                        <div className="mt-1 text-slate-600">{task.description || "No description provided."}</div>
                        <div className="mt-2 text-sm text-slate-600">Assigned by {task.createdBy?.name || "Doctor"}</div>
                      </div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">{task.status}</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                      <button
                        type="button"
                        onClick={() => updateTaskStatus(task._id, "Scheduled")}
                        className="rounded-full bg-slate-200 px-3 py-1 text-slate-800 hover:bg-slate-300"
                      >
                        Scheduled
                      </button>
                      <button
                        type="button"
                        onClick={() => updateTaskStatus(task._id, "In progress")}
                        className="rounded-full bg-amber-200 px-3 py-1 text-slate-900 hover:bg-amber-300"
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        onClick={() => updateTaskStatus(task._id, "Completed")}
                        className="rounded-full bg-emerald-200 px-3 py-1 text-emerald-900 hover:bg-emerald-300"
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent technician activity</h2>
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
