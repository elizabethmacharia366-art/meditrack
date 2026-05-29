import React, { useState } from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const initialQualityChecks = [
  { id: "qc-1", sample: "Blood tube", issue: "Incomplete label", status: "Open" },
  { id: "qc-2", sample: "Urine cup", issue: "Invalid container", status: "Open" },
  { id: "qc-3", sample: "Biopsy vial", issue: "Volume too low", status: "Closed" },
];

export default function TechnicianQualityChecks() {
  const [qualityChecks, setQualityChecks] = useState(initialQualityChecks);

  const requestRecollection = (id) => {
    setQualityChecks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Recollection requested" } : item,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <WelcomeBanner subtitle="Flag invalid samples, request re-collection, and keep lab quality checks up to date." />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Quality Checks</h1>
            <p className="mt-2 text-slate-600">Track rejected samples and follow up on re-collection requests.</p>
          </div>
          <Link to="/technician" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to technician dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6">
          {qualityChecks.map((item) => (
            <div key={item.id} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="font-semibold text-slate-900">{item.sample}</div>
              <p className="mt-2 text-slate-600">Issue: {item.issue}</p>
              <div className="mt-3 text-sm uppercase tracking-wide text-slate-500">Status: {item.status}</div>
              {item.status !== "Closed" && (
                <button
                  onClick={() => requestRecollection(item.id)}
                  className="mt-4 inline-flex rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-amber-600"
                >
                  Request re-collection
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
