import React from "react";
import { Link } from "react-router-dom";

const ALERTS = [
  {
    id: "alert1",
    message: "Critical potassium level detected for patient Maria Kim.",
    patient: "Maria Kim",
    severity: "Critical",
    time: "10 minutes ago",
  },
  {
    id: "alert2",
    message: "New high-sensitivity troponin result needs review.",
    patient: "Derek Shaw",
    severity: "Urgent",
    time: "35 minutes ago",
  },
  {
    id: "alert3",
    message: "Abnormal thyroid panel received for Asha Patel.",
    patient: "Asha Patel",
    severity: "Urgent",
    time: "1 hour ago",
  },
];

export default function DoctorAlerts() {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Alerts</h1>
          <p className="text-gray-600 mt-1">
            Critical lab values and urgent patient notifications are shown here so you can act quickly.
          </p>
        </div>
        <Link
          to="/doctor/clinical-dashboard"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          Back to clinical dashboard
        </Link>
      </div>

      <div className="space-y-4">
        {ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-xl shadow p-5 border-l-4 border-red-500"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">{alert.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {alert.patient} · {alert.time}
                </p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-red-700 bg-red-100 rounded-full px-3 py-1">
                {alert.severity}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">
                Review result
              </button>
              <button className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm hover:bg-slate-200">
                Mark as acknowledged
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
