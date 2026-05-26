import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPatients, getAppointments, getPrescriptions } from "../../service/api";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [linkedIds, setLinkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [onlyMine, setOnlyMine] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [pRes, aRes, rxRes] = await Promise.all([
          getPatients(),
          getAppointments(),
          getPrescriptions(),
        ]);
        if (!alive) return;
        setPatients(Array.isArray(pRes.data) ? pRes.data : []);
        const ids = new Set();
        (aRes.data || []).forEach((a) =>
          ids.add(String(a.patientId?._id || a.patientId)),
        );
        (rxRes.data || []).forEach((r) =>
          ids.add(String(r.patientId?._id || r.patientId)),
        );
        setLinkedIds(ids);
      } catch (err) {
        if (alive) setError(err.response?.data?.error || "Failed to load patients");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = patients;
    if (onlyMine) list = list.filter((p) => linkedIds.has(String(p._id)));
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.fullName, p.contact, p.bloodGroup, p.gender]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    return list;
  }, [patients, linkedIds, onlyMine, query]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-gray-600 text-sm">
            Select a patient to view their appointment & prescription history with you.
          </p>
        </div>
        <Link to="/doctor" className="text-blue-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, contact, gender…"
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="inline-flex items-center gap-2 text-sm text-gray-700 select-none">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
            className="h-4 w-4"
          />
          Only show my patients
        </label>
      </div>

      {loading && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          Loading patients…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
          {onlyMine
            ? "You don't have any patients linked yet. Once you have an appointment or issue a prescription, they'll appear here."
            : "No patients match your search."}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((pat) => (
            <Link
              key={pat._id}
              to={`/doctor/patients/${pat._id}`}
              className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50 transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{pat.fullName || "Unnamed patient"}</h3>
                {linkedIds.has(String(pat._id)) && (
                  <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                    Mine
                  </span>
                )}
              </div>
              {pat.age != null && <p className="text-gray-600">Age: {pat.age}</p>}
              {pat.gender && <p className="text-gray-600">Gender: {pat.gender}</p>}
              {pat.contact && <p className="text-gray-500">Contact: {pat.contact}</p>}
              {Array.isArray(pat.medicalHistory) && pat.medicalHistory.length > 0 && (
                <ul className="mt-2">
                  {pat.medicalHistory.map((history, idx) => (
                    <li key={idx} className="text-sm text-gray-700">• {history}</li>
                  ))}
                </ul>
              )}
              <span className="text-blue-600 text-sm font-medium mt-3 inline-block">
                View history →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
