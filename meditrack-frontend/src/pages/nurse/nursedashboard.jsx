import React from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const panels = [
  { title: "Shift Schedule", description: "Duty roster with ward assignments and upcoming shifts.", to: "/nurse/shift-schedule" },
  { title: "Patient Monitoring", description: "Vitals dashboard with doctor-assigned monitoring tasks.", to: "/nurse/patient-monitoring" },
  { title: "Medication Administration", description: "Dosage logs, reminders, and medication tasks.", to: "/nurse/medication-administration" },
  { title: "Care Notes", description: "Daily observations, progress notes, and handover summaries.", to: "/nurse/care-notes" },
  { title: "Alerts", description: "Critical patient warnings and doctor-assigned alerts.", to: "/nurse/alerts" },
  { title: "Assigned Tasks", description: "Doctor-created tasks with due dates and status updates.", to: "/nurse/tasks" },
];

export default function NurseDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <WelcomeBanner subtitle="Nurse workspace with dedicated pages for monitoring, medication, care notes, alerts, and assigned tasks." />

        <div className="mt-8">
          <h1 className="text-3xl font-bold text-slate-900">Nurse Dashboard</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">Navigate to the page you need to complete your shift duties, manage patients, and respond to doctor-assigned tasks.</p>
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
