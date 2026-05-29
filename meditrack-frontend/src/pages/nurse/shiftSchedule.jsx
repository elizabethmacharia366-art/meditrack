import React from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const schedule = [
  {
    shift: "Morning",
    time: "07:00 - 15:00",
    ward: "Ward 4A",
    assignment: "General Medicine",
    doctorNote: "Cover Ward B evening shift if needed.",
  },
  {
    shift: "Evening",
    time: "15:00 - 23:00",
    ward: "Ward 4A",
    assignment: "Post-op care",
    doctorNote: "Assist Dr. Kim with extra patient rounds.",
  },
  {
    shift: "Night",
    time: "23:00 - 07:00",
    ward: "ICU",
    assignment: "Critical care",
    doctorNote: "Monitor Patient X vitals every 2 hours.",
  },
];

export default function NurseShiftSchedule() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeBanner subtitle="View your duty roster, ward assignments, and extra doctor-assigned shifts." />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Shift Schedule</h1>
            <p className="mt-2 text-slate-600">Track your schedule, upcoming ward assignments, and extra duty requests from doctors.</p>
          </div>
          <Link to="/nurse" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to nurse dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {schedule.map((item) => (
            <div key={item.shift} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-500">{item.shift}</div>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{item.time}</h2>
              <p className="mt-3 text-slate-600">{item.ward} · {item.assignment}</p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Doctor assigned extra duty</div>
                <p className="mt-2">{item.doctorNote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
