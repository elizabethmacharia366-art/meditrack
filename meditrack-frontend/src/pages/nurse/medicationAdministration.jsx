import React from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const medicationAdministration = [
  { id: "med-1", med: "Acetaminophen", dose: "500mg", schedule: "09:00", status: "On track", doctorTask: "Administer antibiotic to Patient Y at 20:00." },
  { id: "med-2", med: "Insulin", dose: "10 units", schedule: "12:00", status: "Pending", doctorTask: "Prepare insulin dose for Patient Z." },
  { id: "med-3", med: "Amoxicillin", dose: "250mg", schedule: "18:00", status: "Missed", doctorTask: "Restart missed dose and record in chart." },
];

export default function NurseMedicationAdministration() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeBanner subtitle="Review medication logs, reminders, and doctor-assigned medication tasks." />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Medication Administration</h1>
            <p className="mt-2 text-slate-600">Track dosage schedules and complete medication tasks assigned by doctors.</p>
          </div>
          <Link to="/nurse" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to nurse dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6">
          {medicationAdministration.map((item) => (
            <div key={item.id} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-slate-900">{item.med}</div>
                  <p className="text-slate-600">{item.dose} • {item.schedule}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{item.status}</span>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Doctor task</div>
                <p className="mt-2">{item.doctorTask}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
