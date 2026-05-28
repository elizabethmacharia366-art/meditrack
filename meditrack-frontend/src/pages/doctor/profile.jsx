import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHospitals, getMyDoctor, updateDoctor } from "../../service/api";

const blankForm = {
  fullName: "",
  specialty: "",
  contact: "",
  hospitalId: "",
  scheduleText: "",
};

const scheduleToText = (schedule) => (
  Array.isArray(schedule)
    ? schedule.map((item) => `${item.day || ""} ${item.time || ""}`.trim()).filter(Boolean).join("\n")
    : ""
);

const textToSchedule = (value) => (
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [day, ...rest] = line.split(/\s+/);
      return { day, time: rest.join(" ") };
    })
);

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedHospital = hospitals.find(
    (hospital) => String(hospital._id) === String(form.hospitalId),
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [doctorRes, hospitalRes] = await Promise.all([getMyDoctor(), getHospitals()]);
        if (!alive) return;
        const doctor = doctorRes.data;
        setProfile(doctor);
        setHospitals(Array.isArray(hospitalRes.data) ? hospitalRes.data : []);
        setForm({
          fullName: doctor.fullName || "",
          specialty: doctor.specialty || "",
          contact: doctor.contact || "",
          hospitalId: doctor.hospitalId?._id || doctor.hospitalId || "",
          scheduleText: scheduleToText(doctor.schedule),
        });
        setError("");
      } catch (err) {
        if (alive) setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!profile?._id) {
      setError("Doctor profile not found.");
      return;
    }
    if (!form.fullName.trim() || !form.specialty.trim() || !form.contact.trim() || !form.hospitalId) {
      setError("Full name, specialty, contact, and hospital are required.");
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      specialty: form.specialty.trim(),
      contact: form.contact.trim(),
      hospitalId: form.hospitalId,
      schedule: textToSchedule(form.scheduleText),
    };

    try {
      setSaving(true);
      const { data } = await updateDoctor(profile._id, payload);
      setProfile(data);
      setSuccess("Profile saved. Patients can now find you by hospital and specialty.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Doctor Profile</h1>
        <Link to="/doctor" className="text-blue-600 hover:underline text-sm">
          Back to dashboard
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

      {!loading && profile && (
        <div className="mb-6 bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Saved profile details</h2>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
            <div>
              <div className="font-medium">Full name</div>
              <div>{profile.fullName || "—"}</div>
            </div>
            <div>
              <div className="font-medium">Specialty</div>
              <div>{profile.specialty || "—"}</div>
            </div>
            <div>
              <div className="font-medium">Contact</div>
              <div>{profile.contact || "—"}</div>
            </div>
            <div>
              <div className="font-medium">Hospital</div>
              <div>{profile.hospitalId?.name || profile.hospitalId || "—"}</div>
            </div>
            <div>
              <div className="font-medium">Schedule</div>
              <div className="whitespace-pre-wrap">{scheduleToText(profile.schedule) || "—"}</div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="border rounded-lg w-full px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input
                type="text"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                className="border rounded-lg w-full px-3 py-2"
                placeholder="Cardiology, Pediatrics, General Practice"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className="border rounded-lg w-full px-3 py-2"
                placeholder="Phone or email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
            <select
              value={form.hospitalId}
              onChange={(e) => setForm({ ...form, hospitalId: e.target.value })}
              className="border rounded-lg w-full px-3 py-2"
              required
            >
              <option value="">Select hospital...</option>
              {hospitals.map((hospital) => (
                <option key={hospital._id} value={hospital._id}>
                  {hospital.name}
                  {hospital.location ? ` - ${hospital.location}` : ""} ({hospital._id})
                </option>
              ))}
            </select>
            {selectedHospital && (
              <div className="mt-2 text-xs text-gray-600">
                Hospital ID: <span className="font-mono">{selectedHospital._id}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
            <textarea
              value={form.scheduleText}
              onChange={(e) => setForm({ ...form, scheduleText: e.target.value })}
              rows={4}
              className="border rounded-lg w-full px-3 py-2"
              placeholder={"Monday 09:00-13:00\nWednesday 14:00-18:00"}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-lg"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      )}
    </div>
  );
}
