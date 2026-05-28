import React from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

const SAMPLE_RESULTS = [
  {
    id: "LR-1001",
    date: "2026-05-20",
    type: "Complete Blood Count",
    summary: "Hemoglobin is slightly low, platelets normal.",
    file: "CBC-report.pdf",
    abnormal: true,
    trend: [12.9, 12.5, 12.1],
  },
  {
    id: "LR-1002",
    date: "2026-05-10",
    type: "Fasting Blood Sugar",
    summary: "Blood sugar remains within normal range.",
    file: "FBS-report.pdf",
    abnormal: false,
    trend: [95, 98, 92],
  },
  {
    id: "LR-1003",
    date: "2026-04-28",
    type: "Lipid Panel",
    summary: "Cholesterol is borderline high; consider diet review.",
    file: "lipid-panel.pdf",
    abnormal: true,
    trend: [190, 202, 208],
  },
];

const TrendBar = ({ value, max }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full bg-green-500" style={{ width: `${percent}%` }} />
    </div>
  );
};

export default function LabResults() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <WelcomeBanner subtitle="Review your lab reports, downloads, charts, and alerts." />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Lab Results</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            All lab results linked to your patient account are available here, with downloadable reports,
            trend charts, and alerts for abnormal values.
          </p>
        </div>
        <Link
          to="/patient"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Reports</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">3</div>
          <p className="mt-2 text-sm text-gray-600">Downloadable PDFs, images, and scans.</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Abnormal alerts</div>
          <div className="mt-3 text-3xl font-bold text-red-600">2</div>
          <p className="mt-2 text-sm text-gray-600">Flagged values for your doctor to review.</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Chart trends</div>
          <div className="mt-3 text-3xl font-bold text-green-700">3</div>
          <p className="mt-2 text-sm text-gray-600">Trend views for key lab markers.</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Doctor access</div>
          <div className="mt-3 text-3xl font-bold text-blue-700">Yes</div>
          <p className="mt-2 text-sm text-gray-600">Your doctor can view lab results linked to you.</p>
        </div>
      </div>

      <div className="space-y-6">
        {SAMPLE_RESULTS.map((result) => (
          <div key={result.id} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">{result.type}</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{result.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    result.abnormal
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {result.abnormal ? "Abnormal" : "Normal"}
                </span>
                <button
                  type="button"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Download
                </button>
              </div>
            </div>

            <p className="mt-4 text-gray-600">{result.summary}</p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Trend graph</span>
                <span>{result.trend[result.trend.length - 1]}</span>
              </div>
              <div className="space-y-2">
                {result.trend.map((value, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Check {index + 1}</span>
                      <span>{value}</span>
                    </div>
                    <TrendBar value={value} max={220} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
