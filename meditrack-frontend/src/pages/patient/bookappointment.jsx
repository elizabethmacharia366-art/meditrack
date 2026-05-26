import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDoctors,
  getHospitals,
  getMyPatient,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../service/api";

const fmt = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "—" : dt.toLocaleString();
};

export default function BookAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    doctorId: "",
    hospitalId: "",
    date: "",
    time: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      const [dRes, hRes, meRes, aRes] = await Promise.all([
        getDoctors(),
        getHospitals(),
        getMyPatient(),
        getAppointments(),
      ]);
      setDoctors(Array.isArray(dRes.data) ? dRes.data : []);
      setHospitals(Array.isArray(hRes.data) ? hRes.data : []);
      setPatientId(meRes.data?._id || null);
      setAppointments(Array.isArray(aRes.data) ? aRes.data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load booking page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredDoctors = useMemo(() => {
    if (!form.hospitalId) return doctors;
    return doctors.filter(
      (d) => String(d.hospitalId?._id || d.hospitalId || "") === String(form.hospitalId),
    );
  }, [doctors, form.hospitalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!patientId) {
      setError("Your patient profile is not set up. Please contact support.");
      return;
    }
    if (!form.doctorId || !form.date || !form.time) {
      setError("Doctor, date, and time are required.");
      return;
    }
    const when = new Date(`${form.date}T${form.time}`);
    if (Number.isNaN(when.getTime())) {
      setError("Please enter a valid date and time.");
      return;
    }
    const payload = {
      patientId,
      doctorId: form.doctorId,
      date: when.toISOString(),
    };
    if (form.hospitalId) payload.hospitalId = form.hospitalId;

    try {
      setSaving(true);
      await createAppointment(payload);
      setSuccess("Appointment booked successfully.");
      setForm({ doctorId: "", hospitalId: "", date: "", time: "" });
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to book appointment");
    } finally {
      setSaving(false);
    }
  };

  const cancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await updateAppointment(id, { status: "Cancelled" });
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to cancel appointment");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Permanently delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete appointment");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Book Appointment</h1>
        <Link to="/patient" className="text-blue-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Hospital (optional)</label>
          <select
            value={form.hospitalId}
            onChange={(e) => setForm({ ...form, hospitalId: e.target.value, doctorId: "" })}
            className="border rounded-lg w-full px-3 py-2"
          >
            <option value="">Any hospital</option>
            {hospitals.map((h) => (
              <option key={h._id} value={h._id}>{h.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Doctor</label>
          <select
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            className="border rounded-lg w-full px-3 py-2"
            required
          >
            <option value="">Select a doctor…</option>
            {filteredDoctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.fullName}{d.specialty ? ` — ${d.specialty}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={form.date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border rounded-lg w-full px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="border rounded-lg w-full px-3 py-2"
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={saving || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-lg"
          >
            {saving ? "Booking…" : "Book Appointment"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/patient/history")}
            className="ml-2 text-blue-600 hover:underline text-sm"
          >
            View full history
          </button>
        </div>
      </form>

      <h2 className="text-lg font-semibold mb-3">My appointments</h2>

      {loading && <p className="text-gray-500">Loading…</p>}

      {!loading && appointments.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
          You have no appointments yet.
        </div>
      )}

      <ul className="space-y-3">
        {appointments.map((a) => (
          <li key={a._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-bold">
                  {a.doctorId?.fullName || "Doctor"}
                  {a.hospitalId?.name ? ` @ ${a.hospitalId.name}` : ""}
                </p>
                <p className="text-sm text-gray-600">{fmt(a.date)}</p>
              </div>
              <div className="flex items-center gap-3">
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
                {a.status !== "Cancelled" && (
                  <button onClick={() => cancel(a._id)} className="text-yellow-700 hover:underline text-sm">
                    Cancel
                  </button>
                )}
                <button onClick={() => remove(a._id)} className="text-red-600 hover:underline text-sm">
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
