import React from "react";
import { Link } from "react-router-dom";

const NOTIFICATIONS = [
  {
    id: "note1",
    title: "New lab result available",
    text: "Your recent blood test results are ready for review.",
    date: "Today, 09:15 AM",
    path: "/patient/lab-results",
  },
  {
    id: "note2",
    title: "Appointment confirmed",
    text: "Your upcoming visit with Dr. Jackson is confirmed for June 8.",
    date: "Yesterday, 04:22 PM",
    path: "/patient/appointments",
  },
  {
    id: "note3",
    title: "Follow-up lab order",
    text: "Your doctor ordered a follow-up lipid panel.",
    date: "2 days ago",
    path: "/patient/lab-results",
  },
];

export default function PatientNotifications() {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Stay current with your lab results, appointments, and doctor messages.
          </p>
        </div>
        <Link
          to="/patient"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="space-y-4">
        {NOTIFICATIONS.map((note) => (
          <Link
            key={note.id}
            to={note.path}
            className="block bg-white border rounded-xl shadow hover:shadow-lg transition p-5"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{note.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{note.text}</p>
              </div>
              <span className="text-xs text-gray-500">{note.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
