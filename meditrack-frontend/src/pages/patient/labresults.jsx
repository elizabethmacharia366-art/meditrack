import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";
import { getMyLabResults } from "../../service/api";

const EMPTY_RESULTS = [];

const TrendBar = ({ value, max }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full bg-green-500" style={{ width: `${percent}%` }} />
    </div>
  );
};

export default function LabResults() {
  const [results, setResults] = useState(EMPTY_RESULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reportCount = useMemo(() => results.length, [results]);
  const abnormalCount = useMemo(
    () => results.filter((result) => result.abnormal).length,
    [results],
  );

  useEffect(() => {
    let alive = true;
    const loadLabResults = async () => {
      try {
        setIsLoading(true);
        const response = await getMyLabResults();
        if (!alive) return;
        const normalized = (response.data || []).map((item) => ({
          id: item._id || item.id,
          date: item.date ? new Date(item.date).toLocaleDateString() : "Unknown",
          type: item.type || "Lab result",
          summary: item.summary || item.details || "No summary available",
          abnormal: item.abnormal || false,
          file: item.fileUrl || null,
          trend: item.trend || [],
        }));
        setResults(normalized);
      } catch (err) {
        if (!alive) return;
        setError(err?.response?.data?.error || err.message || "Failed to load lab results");
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    };

    loadLabResults();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <WelcomeBanner subtitle="Review your lab reports, downloads, charts, and alerts." />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Lab Results</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            These are the lab tests associated with your patient account. If you have not been tested yet,
            this page will remain empty until your next lab order is completed.
          </p>
        </div>
        <Link
          to="/patient"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Reports</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{reportCount}</div>
          <p className="mt-2 text-sm text-gray-600">Downloadable PDFs, images, and scans.</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Abnormal alerts</div>
          <div className="mt-3 text-3xl font-bold text-red-600">{abnormalCount}</div>
          <p className="mt-2 text-sm text-gray-600">Flagged values for your doctor to review.</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Chart trends</div>
          <div className="mt-3 text-3xl font-bold text-green-700">{reportCount}</div>
          <p className="mt-2 text-sm text-gray-600">Trend views for completed lab tests.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-white p-10 shadow-sm border border-dashed border-gray-300 text-center text-gray-500">
          Loading your lab records...
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-50 p-10 shadow-sm border border-red-200 text-center text-red-700">
          {error}
        </div>
      ) : reportCount === 0 ? (
        <div className="rounded-2xl bg-white p-10 shadow-sm border border-dashed border-gray-300 text-center">
          <div className="text-2xl font-semibold text-slate-900">No lab tests yet</div>
          <p className="mt-3 text-gray-600">
            We do not have any completed lab test results for your account yet. Once your care team
            uploads a lab report, it will appear here.
          </p>
          <Link
            to="/patient/appointments"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Check appointment status
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((result) => (
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
      )}
    </div>
  );
}
