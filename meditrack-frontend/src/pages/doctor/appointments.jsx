import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAppointments, updateAppointment } from "../../service/api";

const fmt = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "—" : dt.toLocaleString();
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setSavingId(id);
      await updateAppointment(id, { status });
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update appointment");
    } finally {
      setSavingId(null);
    }
  };

  const filtered = useMemo(() => {
    if (filter === "all") return appointments;
    return appointments.filter((a) => a.status === filter);
  }, [appointments, filter]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-gray-600 text-sm">Your scheduled patient appointments.</p>
        </div>
        <Link to="/doctor" className="text-blue-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "Scheduled", "In Treatment", "Completed", "Cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={
              "px-3 py-1.5 rounded-lg text-sm font-medium border " +
              (filter === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
            }
          >
            {s === "all" ? `All (${appointments.length})` : s}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
          No appointments to show.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3">Patient</th>
                <th className="p-3">Date</th>
                <th className="p-3">Hospital</th>
                <th className="p-3">Issue</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="p-3">{a.patientId?.fullName || "Unknown"}</td>
                  <td className="p-3">{fmt(a.date)}</td>
                  <td className="p-3">{a.hospitalId?.name || "—"}</td>
                  <td className="p-3 text-gray-700 max-w-xs">
                    {a.issue ? (
                      <>
                        <div className="truncate" title={a.issue}>{a.issue}</div>
                        {a.matchedSpecialty && (
                          <div className="text-xs text-blue-700 mt-0.5">
                            Routed: {a.matchedSpecialty}
                          </div>
                        )}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        "px-2 py-0.5 rounded-full text-xs font-semibold " +
                        (a.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : a.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700")
                      }
                    >
                      {a.status || "Scheduled"}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={a.status || "Scheduled"}
                      disabled={savingId === a._id}
                      onChange={(e) => updateStatus(a._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Treatment">In Treatment</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
