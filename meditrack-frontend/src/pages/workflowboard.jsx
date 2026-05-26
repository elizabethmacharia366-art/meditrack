import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAppointments, updateAppointment } from "../service/api";

// Map UI columns to appointment status values.
const COLUMNS = [
  { id: "Scheduled", label: "Waiting", color: "border-blue-400" },
  { id: "In Treatment", label: "In Treatment", color: "border-yellow-400" },
  { id: "Completed", label: "Discharged", color: "border-green-400" },
];

const fmt = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "—" : dt.toLocaleString();
};

export default function WorkflowBoard({ backTo = "/" }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load board");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns = useMemo(() => {
    const map = { Scheduled: [], "In Treatment": [], Completed: [] };
    appointments.forEach((a) => {
      const s = a.status || "Scheduled";
      if (map[s]) map[s].push(a);
    });
    Object.values(map).forEach((list) =>
      list.sort((x, y) => new Date(x.date || 0) - new Date(y.date || 0)),
    );
    return map;
  }, [appointments]);

  const move = async (id, status) => {
    try {
      setSavingId(id);
      await updateAppointment(id, { status });
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Workflow Board</h1>
          <p className="text-gray-600 text-sm">
            Patient flow: Waiting → In Treatment → Discharged.
          </p>
        </div>
        <Link to={backTo} className="text-blue-600 hover:underline text-sm">
          ← Back
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}
      {loading && <p className="text-gray-500 mb-4">Loading…</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.id} className={`bg-white shadow rounded-lg p-3 border-t-4 ${col.color}`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-gray-800">{col.label}</h2>
              <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                {columns[col.id]?.length || 0}
              </span>
            </div>

            <ul className="space-y-2">
              {(columns[col.id] || []).map((a) => (
                <li key={a._id} className="border rounded-lg p-3 text-sm bg-gray-50">
                  <div className="font-medium">
                    {a.patientId?.fullName || "Patient"}
                  </div>
                  <div className="text-gray-600 text-xs mt-0.5">
                    {a.doctorId?.fullName || "Doctor"}
                    {a.hospitalId?.name ? ` @ ${a.hospitalId.name}` : ""}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">{fmt(a.date)}</div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {COLUMNS.filter((c) => c.id !== col.id).map((target) => (
                      <button
                        key={target.id}
                        onClick={() => move(a._id, target.id)}
                        disabled={savingId === a._id}
                        className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50"
                      >
                        → {target.label}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
              {(columns[col.id] || []).length === 0 && !loading && (
                <li className="text-xs text-gray-400 text-center py-4">No items</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
