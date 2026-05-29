import React from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const careNotes = [
  { id: "note-1", patient: "Maria J.", note: "BP stable, continue IV fluids.", doctorTask: "Update post-surgery notes for Patient Z." },
  { id: "note-2", patient: "Robert K.", note: "Oxygen support maintained. Reassess in 2 hours.", doctorTask: "Monitor overnight respiratory status." },
];

export default function NurseCareNotes() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeBanner subtitle="Capture patient progress notes, summaries, and follow doctor-assigned care instructions." />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Care Notes</h1>
            <p className="mt-2 text-slate-600">Document daily observations, handover summaries, and notes requested by physicians.</p>
          </div>
          <Link to="/nurse" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to nurse dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {careNotes.map((entry) => (
            <div key={entry.id} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="font-semibold text-slate-900">{entry.patient}</div>
              <p className="mt-3 text-slate-600">{entry.note}</p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Doctor task</div>
                <p className="mt-2">{entry.doctorTask}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
