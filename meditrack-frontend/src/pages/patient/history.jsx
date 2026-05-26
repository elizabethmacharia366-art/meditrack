import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAppointments, getPrescriptions } from "../../service/api";

const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString();
};

const statusBadge = (status) => {
  const base = "px-2 py-0.5 rounded-full text-xs font-semibold";
  switch (status) {
    case "Completed":
      return `${base} bg-green-100 text-green-700`;
    case "Cancelled":
      return `${base} bg-red-100 text-red-700`;
    case "Scheduled":
    default:
      return `${base} bg-blue-100 text-blue-700`;
  }
};

export default function PatientHistory() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [aRes, pRes] = await Promise.all([getAppointments(), getPrescriptions()]);
        if (!alive) return;
        setAppointments(Array.isArray(aRes.data) ? aRes.data : []);
        setPrescriptions(Array.isArray(pRes.data) ? pRes.data : []);
      } catch (err) {
        if (!alive) return;
        setError(err.response?.data?.error || "Failed to load history");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Combine into a single time-ordered feed
  const timeline = useMemo(() => {
    const items = [
      ...appointments.map((a) => ({
        kind: "appointment",
        id: `appt-${a._id}`,
        when: a.date || a.createdAt,
        data: a,
      })),
      ...prescriptions.map((p) => ({
        kind: "prescription",
        id: `pres-${p._id}`,
        when: p.createdAt || p.updatedAt,
        data: p,
      })),
    ];
    items.sort((x, y) => new Date(y.when || 0) - new Date(x.when || 0));
    if (tab === "appointments") return items.filter((i) => i.kind === "appointment");
    if (tab === "prescriptions") return items.filter((i) => i.kind === "prescription");
    return items;
  }, [appointments, prescriptions, tab]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Medical History</h1>
          <p className="text-gray-600 text-sm">
            All your appointments and prescriptions in one place.
          </p>
        </div>
        <Link to="/patient" className="text-blue-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { id: "all", label: `All (${appointments.length + prescriptions.length})` },
          { id: "appointments", label: `Appointments (${appointments.length})` },
          { id: "prescriptions", label: `Prescriptions (${prescriptions.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={
              "px-4 py-2 rounded-lg text-sm font-medium border transition " +
              (tab === t.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          Loading your history…
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && timeline.length === 0 && (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-700 font-medium">No history yet.</p>
          <p className="text-gray-500 text-sm mt-1">
            Once you book an appointment or receive a prescription, it will appear here.
          </p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link
              to="/patient/appointments"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
            >
              Book appointment
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && timeline.length > 0 && (
        <ul className="space-y-4">
          {timeline.map((item) => (
            <li key={item.id} className="bg-white shadow rounded-lg p-4">
              {item.kind === "appointment" ? (
                <AppointmentRow appt={item.data} />
              ) : (
                <PrescriptionRow pres={item.data} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AppointmentRow({ appt }) {
  const doctorName = appt.doctorId?.fullName || appt.doctorId?.name || "Doctor";
  const hospitalName = appt.hospitalId?.name || appt.hospitalId?.fullName;
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
            Appointment
          </span>
          <span className={statusBadge(appt.status)}>{appt.status || "Scheduled"}</span>
        </div>
        <span className="text-xs text-gray-500">{fmtDate(appt.date)}</span>
      </div>
      <div className="mt-2 text-sm text-gray-800">
        <div>
          <span className="font-medium">Doctor:</span> {doctorName}
        </div>
        {hospitalName && (
          <div>
            <span className="font-medium">Hospital:</span> {hospitalName}
          </div>
        )}
        {appt.reminderMessage && (
          <div className="text-gray-600 mt-1">
            <span className="font-medium">Note:</span> {appt.reminderMessage}
          </div>
        )}
      </div>
    </div>
  );
}

function PrescriptionRow({ pres }) {
  const doctorName = pres.doctorId?.fullName || pres.doctorId?.name || "Doctor";
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700">
          Prescription
        </span>
        <span className="text-xs text-gray-500">{fmtDate(pres.createdAt)}</span>
      </div>
      <div className="mt-2 text-sm text-gray-800">
        <div>
          <span className="font-medium">Issued by:</span> {doctorName}
        </div>
        {pres.diagnosis && (
          <div>
            <span className="font-medium">Diagnosis:</span> {pres.diagnosis}
          </div>
        )}
        {Array.isArray(pres.medicines) && pres.medicines.length > 0 && (
          <ul className="mt-2 list-disc list-inside text-gray-700">
            {pres.medicines.map((m, i) => (
              <li key={i}>
                {m.name}
                {m.dosage ? ` — ${m.dosage}` : ""}
                {m.frequency ? ` (${m.frequency})` : ""}
              </li>
            ))}
          </ul>
        )}
        {pres.notes && (
          <div className="text-gray-600 mt-2">
            <span className="font-medium">Notes:</span> {pres.notes}
          </div>
        )}
      </div>
    </div>
  );
}
