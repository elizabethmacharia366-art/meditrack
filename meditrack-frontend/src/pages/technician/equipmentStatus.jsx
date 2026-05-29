import React from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const equipmentStatus = [
  { id: "eq-1", device: "MRI scanner", status: "Operational", calibrationDue: "2026-06-02" },
  { id: "eq-2", device: "CT unit", status: "Down", calibrationDue: "2026-05-28" },
  { id: "eq-3", device: "Blood analyzer", status: "Available", calibrationDue: "2026-06-10" },
];

export default function TechnicianEquipmentStatus() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeBanner subtitle="Monitor machine readiness, calibration status, and maintenance alerts for lab equipment." />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Equipment Status</h1>
            <p className="mt-2 text-slate-600">See device availability and upcoming calibration deadlines at a glance.</p>
          </div>
          <Link to="/technician" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to technician dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {equipmentStatus.map((item) => (
            <div key={item.id} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="font-semibold text-slate-900">{item.device}</div>
              <p className="mt-2 text-slate-600">Status: {item.status}</p>
              <p className="mt-3 text-sm uppercase tracking-wide text-slate-500">Calibration due: {item.calibrationDue}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
