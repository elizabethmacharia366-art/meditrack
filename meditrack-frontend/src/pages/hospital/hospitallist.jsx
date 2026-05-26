import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHospitals } from "../../service/api";

export default function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Hospitals</h1>

      {loading && <p className="text-gray-500">Loading hospitals…</p>}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && hospitals.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
          No hospitals available yet.
        </div>
      )}

      {!loading && !error && hospitals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hospitals.map((hosp) => (
            <div key={hosp._id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-bold">{hosp.name}</h3>
              <p className="text-gray-600">{hosp.location}</p>
              {hosp.description && (
                <p className="text-gray-500 text-sm mt-1">{hosp.description}</p>
              )}
              <Link
                to={`/hospital/${hosp._id}`}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
