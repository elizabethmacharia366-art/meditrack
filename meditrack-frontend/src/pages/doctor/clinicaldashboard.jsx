import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const SAMPLE_RESULTS = [
  {
    id: "lr001",
    patient: "Maria Kim",
    department: "Cardiology",
    test: "ECG",
    urgency: "Urgent",
    status: "Pending",
    date: "2026-06-01",
  },
  {
    id: "lr002",
    patient: "Derek Shaw",
    department: "Hematology",
    test: "CBC",
    urgency: "Critical",
    status: "Review Needed",
    date: "2026-06-02",
  },
  {
    id: "lr003",
    patient: "Asha Patel",
    department: "Endocrinology",
    test: "Thyroid Panel",
    urgency: "Routine",
    status: "Completed",
    date: "2026-05-29",
  },
  {
    id: "lr004",
    patient: "Jose Alvarez",
    department: "General",
    test: "Metabolic Panel",
    urgency: "Urgent",
    status: "Pending",
    date: "2026-06-03",
  },
];

const departments = ["All", "Cardiology", "Endocrinology", "Hematology", "General"];
const urgencies = ["All", "Routine", "Urgent", "Critical"];

export default function DoctorClinicalDashboard() {
  const [department, setDepartment] = useState("All");
  const [urgency, setUrgency] = useState("All");

  const filteredResults = useMemo(() => {
    return SAMPLE_RESULTS.filter((result) => {
      const matchesDepartment = department === "All" || result.department === department;
      const matchesUrgency = urgency === "All" || result.urgency === urgency;
      return matchesDepartment && matchesUrgency;
    });
  }, [department, urgency]);

  const totalPending = SAMPLE_RESULTS.filter((item) => item.status !== "Completed").length;
  const totalCritical = SAMPLE_RESULTS.filter((item) => item.urgency === "Critical").length;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clinical Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor recent lab result activity across your patients and prioritize urgent reviews.
          </p>
        </div>
        <Link
          to="/doctor/alerts"
          className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
        >
          View critical alerts
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Pending lab results</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{totalPending}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Critical lab alerts</p>
          <p className="mt-3 text-3xl font-semibold text-red-600">{totalCritical}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Recent results</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{SAMPLE_RESULTS.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-semibold">Filter lab results</p>
            <p className="text-sm text-gray-500">Show results by department and urgency.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full md:w-auto">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
            >
              {departments.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
            >
              {urgencies.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Test</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Urgency</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredResults.map((result) => (
              <tr key={result.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.patient}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {result.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {result.test}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      result.urgency === "Critical"
                        ? "bg-red-100 text-red-700"
                        : result.urgency === "Urgent"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {result.urgency}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {result.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {result.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
