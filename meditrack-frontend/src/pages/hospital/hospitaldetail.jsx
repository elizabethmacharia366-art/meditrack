import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getHospital, getDoctors } from "../../service/api";

export default function HospitalDetail() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [hRes, dRes] = await Promise.all([getHospital(id), getDoctors()]);
        if (!alive) return;
        setHospital(hRes.data || null);
        const all = Array.isArray(dRes.data) ? dRes.data : [];
        // Filter doctors that belong to this hospital (if hospitalId is set).
        setDoctors(
          all.filter((d) => String(d.hospitalId?._id || d.hospitalId) === String(id)),
        );
      } catch (err) {
        if (alive) setError(err.response?.data?.error || "Failed to load hospital");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading hospital…</div>;
  }

  if (error || !hospital) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error || "Hospital not found."}
        </div>
        <Link to="/hospitals" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to hospitals
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link to="/hospitals" className="text-blue-600 hover:underline text-sm">
        ← Back to hospitals
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">{hospital.name}</h1>
      <p className="text-gray-600">{hospital.location}</p>
      {hospital.description && (
        <p className="text-gray-500 mt-2 mb-4">{hospital.description}</p>
      )}

      {(hospital.contact || hospital.hours) && (
        <div className="bg-white shadow rounded-lg p-4 mb-6 text-sm text-gray-700 space-y-1">
          {hospital.contact && <div>📞 {hospital.contact}</div>}
          {hospital.hours && <div>🕒 {hospital.hours}</div>}
        </div>
      )}

      {Array.isArray(hospital.departments) && hospital.departments.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Departments</h2>
          <ul className="list-disc list-inside mb-6">
            {hospital.departments.map((dept, idx) => (
              <li key={idx} className="text-gray-700">{dept}</li>
            ))}
          </ul>
        </>
      )}

      <h2 className="text-xl font-semibold mb-2">Doctors</h2>
      {doctors.length === 0 ? (
        <p className="text-gray-600 text-sm">No doctors listed for this hospital yet.</p>
      ) : (
        <ul className="space-y-2">
          {doctors.map((doc) => (
            <li key={doc._id} className="bg-white shadow-md rounded-lg p-3">
              <p className="font-bold">{doc.fullName || doc.name}</p>
              {doc.specialty && <p className="text-gray-600">{doc.specialty}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
