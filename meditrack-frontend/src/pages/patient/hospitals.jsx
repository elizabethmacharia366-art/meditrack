import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getHospitals } from "../../service/api";

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await getHospitals();
        if (alive) setHospitals(Array.isArray(data) ? data : []);
      } catch (err) {
        if (alive) setError(err.response?.data?.error || "Failed to load hospitals");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hospitals;
    return hospitals.filter((h) => {
      const depts = Array.isArray(h.departments) ? h.departments.join(" ") : "";
      return (
        (h.name || "").toLowerCase().includes(q) ||
        (h.location || "").toLowerCase().includes(q) ||
        depts.toLowerCase().includes(q)
      );
    });
  }, [hospitals, query]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Available Hospitals</h1>
          <p className="text-gray-600 text-sm">Browse hospitals registered on MediTrack.</p>
        </div>
        <Link to="/patient" className="text-blue-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, location, or department…"
        className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          Loading hospitals…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
          {hospitals.length === 0
            ? "No hospitals available yet. Please check back later."
            : "No hospitals match your search."}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((hosp) => (
            <div key={hosp._id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-bold">{hosp.name}</h3>
              <p className="text-gray-600">{hosp.location}</p>
              {hosp.description && (
                <p className="text-gray-500 text-sm mt-1">{hosp.description}</p>
              )}
              {Array.isArray(hosp.departments) && hosp.departments.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-1">
                  {hosp.departments.map((dept, idx) => (
                    <li
                      key={idx}
                      className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5"
                    >
                      {dept}
                    </li>
                  ))}
                </ul>
              )}
              {(hosp.contact || hosp.hours) && (
                <div className="text-sm text-gray-600 mt-2 space-y-0.5">
                  {hosp.contact && <div>📞 {hosp.contact}</div>}
                  {hosp.hours && <div>🕒 {hosp.hours}</div>}
                </div>
              )}
              <Link
                to={`/hospital/${hosp._id}`}
                className="text-blue-600 hover:underline mt-3 inline-block"
              >
                View details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
