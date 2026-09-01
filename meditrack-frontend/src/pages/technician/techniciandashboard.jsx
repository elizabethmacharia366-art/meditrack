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
