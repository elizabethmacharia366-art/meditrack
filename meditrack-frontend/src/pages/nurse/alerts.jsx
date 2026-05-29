import React from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const alerts = [
  { id: "alert-1", message: "Abnormal BP reading for Patient A.", severity: "Critical", time: "08:05" },
  { id: "alert-2", message: "Doctor request: attend Patient X for urgent vitals check.", severity: "High", time: "09:20" },
  { id: "alert-3", message: "Medication delay for Patient Y.", severity: "Normal", time: "09:55" },
];

export default function NurseAlerts() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeBanner subtitle="See critical patient warnings and doctor-assigned alerts that require immediate action." />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Alerts</h1>
            <p className="mt-2 text-slate-600">Monitor urgent alerts from doctors and clinical systems in one place.</p>
          </div>
          <Link to="/nurse" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to nurse dashboard
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
