import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyPatient, updateMyPatient } from "../../service/api";

const GENDERS = ["", "Male", "Female", "Other"];
const BLOOD_GROUPS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "",
    contact: "",
    bloodGroup: "",
    medicalHistory: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await getMyPatient();
        if (!alive) return;
        setProfile(data);
        setForm({
          fullName: data?.fullName || "",
          age: data?.age ?? "",
          gender: data?.gender || "",
          contact: data?.contact || "",
          bloodGroup: data?.bloodGroup || "",
          medicalHistory: Array.isArray(data?.medicalHistory)
            ? data.medicalHistory.join(", ")
            : "",
        });
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
    setSuccess("");
    setError("");
    if (!profile?._id) {
      setError("Profile not found.");
      return;
    }
    const payload = { fullName: form.fullName.trim() };
    if (form.age !== "" && form.age !== null) payload.age = Number(form.age);
    if (form.gender) payload.gender = form.gender;
    if (form.contact.trim()) payload.contact = form.contact.trim();
    if (form.bloodGroup) payload.bloodGroup = form.bloodGroup;
    payload.medicalHistory = form.medicalHistory
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      setSaving(true);
      const { data } = await updateMyPatient(profile._id, payload);
      setProfile(data);
      setSuccess("Profile updated.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Profile</h1>
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

      {loading ? (
        <p className="text-gray-500">Loading…</p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                min="0"
                max="150"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="border rounded-lg w-full px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="border rounded-lg w-full px-3 py-2"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g || "—"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood group</label>
              <select
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                className="border rounded-lg w-full px-3 py-2"
              >
                {BLOOD_GROUPS.map((b) => (
                  <option key={b} value={b}>{b || "—"}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="border rounded-lg w-full px-3 py-2"
              placeholder="Phone or email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medical history (comma separated)
            </label>
            <textarea
              value={form.medicalHistory}
              onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
              rows={3}
              className="border rounded-lg w-full px-3 py-2"
              placeholder="e.g. Asthma, Diabetes"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-lg"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}
