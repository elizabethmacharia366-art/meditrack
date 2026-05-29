import React from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const pendingLabTests = [
  { id: "lab-1", patientId: "PAT-1001", testType: "Blood", priority: "Urgent", status: "Ordered" },
  { id: "lab-2", patientId: "PAT-1005", testType: "Urine", priority: "Normal", status: "Awaiting sample" },
  { id: "lab-3", patientId: "PAT-1010", testType: "Imaging", priority: "High", status: "Scheduled" },
];

export default function TechnicianPendingLabTests() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeBanner subtitle="Review doctor-ordered lab tests and identify urgent cases that need immediate attention." />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pending Lab Tests</h1>
            <p className="mt-2 text-slate-600">See all lab tests ordered by doctors, along with patient IDs, test types, and priority levels.</p>
          </div>
          <Link to="/technician" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to technician dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6">
          {pendingLabTests.map((item) => (
            <div key={item.id} className={`rounded-3xl border p-6 shadow-sm ${item.priority === "Urgent" ? "border-red-200 bg-red-50" : item.priority === "High" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-slate-900">{item.testType}</div>
                  <p className="text-slate-600">Patient ID: {item.patientId}</p>
                </div>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">{item.priority}</span>
              </div>
              <p className="mt-4 text-slate-700">Status: {item.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
