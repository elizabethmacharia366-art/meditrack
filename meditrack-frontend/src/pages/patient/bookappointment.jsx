import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
<<<<<<< ours
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
=======
  createAppointment,
  deleteAppointment,
  getAppointments,
  getDoctors,
  getHospitals,
  getMyPatient,
  updateAppointment,
} from "../../service/api";

const fmt = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const emptyForm = {
  doctorId: "",
  hospitalId: "",
  date: "",
  time: "",
  issue: "",
  autoAssign: true,
>>>>>>> theirs
};

export default function BookAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< ours
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    doctorId: "",
    hospitalId: "",
    date: "",
    time: "",
    issue: "",
    autoAssign: true,
  });
=======
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(emptyForm);
>>>>>>> theirs

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
<<<<<<< ours
      (d) => String(d.hospitalId?._id || d.hospitalId || "") === String(form.hospitalId),
=======
      (doctor) =>
        String(doctor.hospitalId?._id || doctor.hospitalId || "") === String(form.hospitalId),
>>>>>>> theirs
    );
  }, [doctors, form.hospitalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< ours
    setSuccess("");
    setError("");
=======
    setError("");
    setSuccess("");

>>>>>>> theirs
    if (!patientId) {
      setError("Your patient profile is not set up. Please contact support.");
      return;
    }
    if (!form.date || !form.time) {
      setError("Date and time are required.");
      return;
    }
<<<<<<< ours
    if (form.autoAssign) {
      if (!form.hospitalId) {
        setError("Pick a hospital so we can auto-assign a doctor.");
        return;
      }
      if (!form.issue.trim()) {
        setError("Please describe your issue so we can match the right doctor.");
        return;
      }
    } else if (!form.doctorId) {
=======
    if (form.autoAssign && !form.hospitalId) {
      setError("Pick a hospital so we can auto-assign a doctor.");
      return;
    }
    if (form.autoAssign && !form.issue.trim()) {
      setError("Please describe your issue so we can match the right doctor.");
      return;
    }
    if (!form.autoAssign && !form.doctorId) {
>>>>>>> theirs
      setError("Please select a doctor or switch to auto-assign.");
      return;
    }

<<<<<<< ours
    const when = new Date(`${form.date}T${form.time}`);
    if (Number.isNaN(when.getTime())) {
=======
    const date = new Date(`${form.date}T${form.time}`);
    if (Number.isNaN(date.getTime())) {
>>>>>>> theirs
      setError("Please enter a valid date and time.");
      return;
    }

    const payload = {
      patientId,
<<<<<<< ours
      date: when.toISOString(),
    };
    if (form.hospitalId) payload.hospitalId = form.hospitalId;
    if (form.issue.trim()) payload.issue = form.issue.trim();
    if (!form.autoAssign && form.doctorId) payload.doctorId = form.doctorId;
=======
      date: date.toISOString(),
    };
    if (form.hospitalId) payload.hospitalId = form.hospitalId;
    if (form.issue.trim()) payload.issue = form.issue.trim();
    if (!form.autoAssign) payload.doctorId = form.doctorId;
>>>>>>> theirs

    try {
      setSaving(true);
      const { data } = await createAppointment(payload);
<<<<<<< ours
      const docName = data?.doctorId?.fullName || "your doctor";
      const spec = data?.matchedSpecialty
        ? ` (${data.matchedSpecialty})`
        : data?.doctorId?.specialty
        ? ` (${data.doctorId.specialty})`
        : "";
      setSuccess(
        form.autoAssign
          ? `You've been assigned to ${docName}${spec}.`
          : "Appointment booked successfully.",
      );
      setForm({
        doctorId: "",
        hospitalId: "",
        date: "",
        time: "",
        issue: "",
        autoAssign: true,
      });
=======
      const doctorName = data?.doctorId?.fullName || "your doctor";
      const specialty = data?.matchedSpecialty || data?.doctorId?.specialty;
      setSuccess(
        form.autoAssign
          ? `You've been assigned to ${doctorName}${specialty ? ` (${specialty})` : ""}.`
          : "Appointment booked successfully.",
      );
      setForm(emptyForm);
>>>>>>> theirs
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
<<<<<<< ours
    if (!win className="md:col-span-2 flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
=======
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete appointment");
    }
  };

  return (
    <div className="p-6">
      <Link to="/patient" className="text-blue-600 hover:underline text-sm">
        Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Book Appointment</h1>

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
        <div className="md:col-span-2 flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
>>>>>>> theirs
          <input
            id="autoAssign"
            type="checkbox"
            checked={form.autoAssign}
            onChange={(e) =>
              setForm({ ...form, autoAssign: e.target.checked, doctorId: "" })
            }
            className="h-4 w-4"
          />
          <label htmlFor="autoAssign" className="text-sm text-blue-900">
            Auto-assign me to the best available doctor based on my issue.
          </label>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Hospital{form.autoAssign ? "" : " (optional)"}
          </label>
          <select
            value={form.hospitalId}
            onChange={(e) => setForm({ ...form, hospitalId: e.target.value, doctorId: "" })}
            className="border rounded-lg w-full px-3 py-2"
            required={form.autoAssign}
          >
<<<<<<< ours
            <option value="">{form.autoAssign ? "Select a hospital…" : "Any hospital"}</option>
            {hospitals.map((h) => (
              <option key={h._id} value={h._id}>{h.name}</option>
=======
            <option value="">{form.autoAssign ? "Select a hospital..." : "Any hospital"}</option>
            {hospitals.map((hospital) => (
              <option key={hospital._id} value={hospital._id}>
                {hospital.name}
              </option>
>>>>>>> theirs
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Doctor {form.autoAssign && <span className="text-gray-400">(auto-assigned)</span>}
          </label>
          <select
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            className="border rounded-lg w-full px-3 py-2 disabled:bg-gray-100"
            disabled={form.autoAssign}
            required={!form.autoAssign}
          >
<<<<<<< ours
            <option value="">Select a doctor…</option>
            {filteredDoctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.fullName}{d.specialty ? ` — ${d.specialty}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            What's your issue or symptoms?
            {form.autoAssign && <span className="text-red-500"> *</span>}
          </label>
          <textarea
            value={form.issue}
            onChange={(e) => setForm({ ...form, issue: e.target.value })}
            rows={2}
            className="border rounded-lg w-full px-3 py-2"
            placeholder="e.g. Chest pain and shortness of breath for 2 days"
            required={form.autoAssign}
          />
          {form.autoAssign && (
            <p className="text-xs text-gray-500 mt-1">
              We'll match you to a specialist (cardiology, dermatology, pediatrics, etc.) at the selected hospital. If none match, we'll assign the least-busy available doctor.
            </p>
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
=======
            <option value="">Select a doctor...</option>
            {filteredDoctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.fullName}
                {doctor.specialty ? ` - ${doctor.specialty}` : ""}
>>>>>>> theirs
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
<<<<<<< ours
=======
          <label className="block mb-1 text-sm font-medium text-gray-700">
            What's your issue or symptoms?
            {form.autoAssign && <span className="text-red-500"> *</span>}
          </label>
          <textarea
            value={form.issue}
            onChange={(e) => setForm({ ...form, issue: e.target.value })}
            rows={2}
            className="border rounded-lg w-full px-3 py-2"
            placeholder="e.g. Chest pain and shortness of breath for 2 days"
            required={form.autoAssign}
          />
          {form.autoAssign && (
            <p className="text-xs text-gray-500 mt-1">
              We'll match you to a specialist at the selected hospital.
            </p>
          )}
        </div>

        <div className="md:col-span-2">
>>>>>>> theirs
          <button
            type="submit"
            disabled={saving || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-lg"
          >
<<<<<<< ours
            {saving ? "Booking…" : "Book Appointment"}
=======
            {saving ? "Booking..." : "Book Appointment"}
>>>>>>> theirs
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

<<<<<<< ours
      {loading && <p className="text-gray-500">Loading…</p>}
=======
      {loading && <p className="text-gray-500">Loading...</p>}
>>>>>>> theirs

      {!loading && appointments.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
          You have no appointments yet.
        </div>
      )}

      <ul className="space-y-3">
<<<<<<< ours
        {appointments.map((a) => (
          <li key={a._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-bold">
                  {a.doctorId?.fullName || "Doctor"}
                  {a.doctorId?.specialty ? ` — ${a.doctorId.specialty}` : ""}
                  {a.hospitalId?.name ? ` @ ${a.hospitalId.name}` : ""}
                </p>
                <p className="text-sm text-gray-600">{fmt(a.date)}</p>
                {a.issue && (
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Issue:</span> {a.issue}
=======
        {appointments.map((appointment) => (
          <li key={appointment._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-bold">
                  {appointment.doctorId?.fullName || "Doctor"}
                  {appointment.doctorId?.specialty ? ` - ${appointment.doctorId.specialty}` : ""}
                  {appointment.hospitalId?.name ? ` @ ${appointment.hospitalId.name}` : ""}
                </p>
                <p className="text-sm text-gray-600">{fmt(appointment.date)}</p>
                {appointment.issue && (
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Issue:</span> {appointment.issue}
>>>>>>> theirs
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={
                    "px-2 py-0.5 rounded-full text-xs font-semibold " +
<<<<<<< ours
                    (a.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : a.status === "Cancelled"
=======
                    (appointment.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : appointment.status === "Cancelled"
>>>>>>> theirs
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700")
                  }
                >
<<<<<<< ours
                  {a.status || "Scheduled"}
                </span>
                {a.status !== "Cancelled" && (
                  <button onClick={() => cancel(a._id)} className="text-yellow-700 hover:underline text-sm">
                    Cancel
                  </button>
                )}
                <button onClick={() => remove(a._id)} className="text-red-600 hover:underline text-sm">
=======
                  {appointment.status || "Scheduled"}
                </span>
                {appointment.status !== "Cancelled" && (
                  <button
                    type="button"
                    onClick={() => cancel(appointment._id)}
                    className="text-yellow-700 hover:underline text-sm"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(appointment._id)}
                  className="text-red-600 hover:underline text-sm"
                >
>>>>>>> theirs
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
