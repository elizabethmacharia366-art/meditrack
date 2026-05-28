import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPatientHistory, getPatientLabResults } from "../../service/api";

const fmt = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "—" : dt.toLocaleString();
};

const statusBadge = (status) => {
  const base = "px-2 py-0.5 rounded-full text-xs font-semibold";
  switch (status) {
    case "Completed":
      return `${base} bg-green-100 text-green-700`;
    case "Cancelled":
      return `${base} bg-red-100 text-red-700`;
    default:
      return `${base} bg-blue-100 text-blue-700`;
  }
};

export default function DoctorPatientDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [labLoading, setLabLoading] = useState(true);
  const [error, setError] = useState("");
  const [labError, setLabError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getPatientHistory(id);
        if (alive) setData(res.data);
      } catch (err) {
        if (alive) setError(err.response?.data?.error || "Failed to load patient");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLabLoading(true);
        const res = await getPatientLabResults(id);
        if (!alive) return;
        setLabResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!alive) return;
        setLabError(err.response?.data?.error || "Failed to load lab results");
      } finally {
        if (!alive) return;
        setLabLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const timeline = useMemo(() => {
    if (!data) return [];
    const items = [
      ...(data.appointments || []).map((a) => ({
        kind: "appointment",
        id: `appt-${a._id}`,
        when: a.date || a.createdAt,
        data: a,
      })),
      ...(data.prescriptions || []).map((p) => ({
        kind: "prescription",
        id: `pres-${p._id}`,
        when: p.createdAt,
        data: p,
      })),
    ];
    items.sort((x, y) => new Date(y.when || 0) - new Date(x.when || 0));
    return items;
  }, [data]);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading patient…</div>;
  }
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
        <Link to="/doctor/patients" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to patients
        </Link>
      </div>
    );
  }
  const patient = data?.patient;
  if (!patient) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link to="/doctor/patients" className="text-blue-600 hover:underline text-sm">
        ← Back to patients
      </Link>

      <div className="bg-white shadow rounded-lg p-5 mt-3 mb-6">
        <h1 className="text-2xl font-bold">{patient.fullName || "Unnamed patient"}</h1>
        <div className="text-sm text-gray-700 mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
          {patient.age != null && <div><span className="font-medium">Age:</span> {patient.age}</div>}
          {patient.gender && <div><span className="font-medium">Gender:</span> {patient.gender}</div>}
          {patient.bloodGroup && <div><span className="font-medium">Blood:</span> {patient.bloodGroup}</div>}
          {patient.contact && <div><span className="font-medium">Contact:</span> {patient.contact}</div>}
        </div>
        {Array.isArray(patient.medicalHistory) && patient.medicalHistory.length > 0 && (
          <div className="text-sm text-gray-700 mt-3">
            <div className="font-medium">Medical history:</div>
            <ul className="list-disc list-inside">
              {patient.medicalHistory.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Latest lab results</h2>
              <p className="text-sm text-gray-500">Quick view of the most recent patient lab activity.</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1">
              {labLoading ? "Loading…" : `${labResults.length} results`}
            </span>
          </div>
          {labLoading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Loading lab results…</div>
          ) : labError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{labError}</div>
          ) : labResults.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              No lab results available for this patient yet.
            </div>
          ) : (
            <div className="space-y-4">
              {labResults.map((result) => (
                <div key={result._id || result.id} className="border rounded-xl p-4 bg-slate-50">
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <div className="font-semibold">{result.type || "Lab result"}</div>
                      <div className="text-sm text-gray-600">{result.summary || "No summary available"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-700">{fmt(result.date)}</span>
                      {result.fileUrl ? (
                        <a
                          href={result.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-sm text-slate-500">No file</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-3">Alerts for this patient</h2>
          <div className="space-y-3">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="font-semibold text-red-700">Potassium level high — review required</p>
              <p className="text-sm text-red-600 mt-1">Patient needs medication adjustment and lab repeat.</p>
            </div>
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
              <p className="font-semibold text-orange-700">Elevated glucose detected</p>
              <p className="text-sm text-orange-600 mt-1">Consider follow-up diabetes assessment.</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Consultation history (with you)</h2>

      {timeline.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
          No appointments or prescriptions between you and this patient yet.
        </div>
      )}

      <ul className="space-y-4">
        {timeline.map((item) =>
          item.kind === "appointment" ? (
            <li key={item.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
                    Appointment
                  </span>
                  <span className={statusBadge(item.data.status)}>
                    {item.data.status || "Scheduled"}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{fmt(item.data.date)}</span>
              </div>
              {item.data.hospitalId?.name && (
                <div className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Hospital:</span> {item.data.hospitalId.name}
                </div>
              )}
              {item.data.reminderMessage && (
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Note:</span> {item.data.reminderMessage}
                </div>
              )}
            </li>
          ) : (
            <li key={item.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700">
                  Prescription
                </span>
                <span className="text-xs text-gray-500">{fmt(item.data.createdAt)}</span>
              </div>
              {item.data.diagnosis && (
                <div className="text-sm text-gray-800 mt-1">
                  <span className="font-medium">Diagnosis:</span> {item.data.diagnosis}
                </div>
              )}
              {Array.isArray(item.data.medicines) && item.data.medicines.length > 0 && (
                <ul className="text-sm text-gray-700 mt-2 list-disc list-inside">
                  {item.data.medicines.map((m, i) => (
                    <li key={i}>
                      {m.name}
                      {m.dosage ? ` — ${m.dosage}` : ""}
                      {m.frequency ? ` (${m.frequency})` : ""}
                    </li>
                  ))}
                </ul>
              )}
              {item.data.notes && (
                <div className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Notes:</span> {item.data.notes}
                </div>
              )}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
