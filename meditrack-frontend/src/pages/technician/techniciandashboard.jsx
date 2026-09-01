import React from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const panels = [
  { title: "Pending Lab Tests", description: "Shows doctor-ordered lab tests and urgent cases.", to: "/technician/pending-lab-tests" },
  { title: "Upload Results", description: "Attach files or enter numeric values for lab work.", to: "/technician/upload-results" },
  { title: "Quality Checks", description: "Flag invalid samples and request re-collection.", to: "/technician/quality-checks" },
  { title: "Equipment Status", description: "Monitor calibration and machine availability.", to: "/technician/equipment-status" },
  { title: "Alerts", description: "See priority tests and emergency lab notifications.", to: "/technician/alerts" },
  { title: "Assigned Tasks", description: "Manage doctor-created technical tasks with status updates.", to: "/technician/tasks" },
];

export default function TechnicianDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <WelcomeBanner subtitle="Technician workspace with dedicated pages for lab tests, uploads, quality control, equipment, alerts, and tasks." />

        <div className="mt-8">
          <h1 className="text-3xl font-bold text-slate-900">Technician Dashboard</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">Select the section you need to work through doctor-assigned technical workflows.</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {panels.map((panel) => (
            <Link
              key={panel.title}
              to={panel.to}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300"
            >
              <h2 className="text-xl font-semibold text-slate-900">{panel.title}</h2>
              <p className="mt-3 text-sm text-slate-600">{panel.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

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
