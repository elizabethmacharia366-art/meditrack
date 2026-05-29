import React from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const alerts = [
  { id: "alert-1", message: "Urgent trauma blood work requested for PAT-1012.", severity: "Critical", time: "09:12" },
  { id: "alert-2", message: "Priority imaging test marked for PAT-1010.", severity: "High", time: "09:40" },
  { id: "alert-3", message: "Routine calibration overdue for CT unit.", severity: "Normal", time: "10:15" },
];

export default function TechnicianAlerts() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeBanner subtitle="Watch urgent test notifications and priority alerts from doctors in real time." />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Alerts</h1>
            <p className="mt-2 text-slate-600">See priority cases and emergency lab notifications at a glance.</p>
          </div>
          <Link to="/technician" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to technician dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6">
          {alerts.map((alert) => (
            <div key={alert.id} className={`rounded-3xl border p-6 shadow-sm ${alert.severity === "Critical" ? "border-red-200 bg-red-50" : alert.severity === "High" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="text-lg font-semibold text-slate-900">{alert.severity}</div>
                <div className="text-xs uppercase tracking-wide text-slate-500">{alert.time}</div>
              </div>
              <p className="mt-4 text-slate-700">{alert.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
