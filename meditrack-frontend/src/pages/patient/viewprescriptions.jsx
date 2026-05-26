import React, { useEffect, useState } from "react";
import { getPrescriptions } from "../../service/api";

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "" : dt.toLocaleDateString();
};

export default function ViewPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await getPrescriptions();
        if (alive) setPrescriptions(Array.isArray(data) ? data : []);
      } catch (err) {
        if (alive) setError(err.response?.data?.error || "Failed to load prescriptions");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>

      {loading && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          Loading…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && prescriptions.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
          You don't have any prescriptions yet.
        </div>
      )}

      {!loading && !error && prescriptions.map((pres) => {
        const doctorName = pres.doctorId?.fullName || pres.doctorId?.name || "Doctor";
        return (
          <div key={pres._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <p className="font-bold">Diagnosis: {pres.diagnosis || "—"}</p>
              <span className="text-xs text-gray-500">{fmtDate(pres.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Issued by: {doctorName}</p>
            {Array.isArray(pres.medicines) && pres.medicines.length > 0 && (
              <ul className="mt-2 list-disc list-inside">
                {pres.medicines.map((med, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {med.name}
                    {med.dosage ? ` - ${med.dosage}` : ""}
                    {med.frequency ? ` (${med.frequency})` : ""}
                  </li>
                ))}
              </ul>
            )}
            {pres.notes && <p className="text-gray-600 mt-2">Notes: {pres.notes}</p>}
          </div>
        );
      })}
    </div>
  );
}
