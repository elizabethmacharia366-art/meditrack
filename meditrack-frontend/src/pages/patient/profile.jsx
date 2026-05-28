import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyPatient, getMyLabResults, updateMyPatient } from "../../service/api";

const GENDERS = ["", "Male", "Female", "Other"];
const BLOOD_GROUPS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const [labResults, setLabResults] = useState([]);
  const [labLoading, setLabLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "",
    contact: "",
    bloodGroup: "",
    medicalHistory: "",
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setLabLoading(true);
        const [profileResponse, labResponse] = await Promise.all([getMyPatient(), getMyLabResults()]);
        if (!alive) return;
        const data = profileResponse.data;
        const labs = Array.isArray(labResponse.data) ? labResponse.data : [];
        setProfile(data);
        setLabResults(labs.map((item) => ({
          id: item._id || item.id,
          title: item.type || "Lab result",
          summary: item.summary || "No summary available",
          status: item.status || "Completed",
          date: item.date ? new Date(item.date).toLocaleDateString() : "Unknown",
          fileUrl: item.fileUrl,
          abnormal: item.abnormal,
        })));
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
        if (!alive) setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        if (alive) {
          setLoading(false);
          setLabLoading(false);
        }
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
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-500 mt-1">Access your personal details and lab result history.</p>
        </div>
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

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === "profile"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("lab-results")}
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === "lab-results"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Lab Results
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : activeTab === "lab-results" ? (
        labLoading ? (
          <p className="text-gray-500">Loading lab results…</p>
        ) : labResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-700">
            <div className="text-2xl font-semibold">No lab results yet</div>
            <p className="mt-3 text-gray-600">
              You have not received any lab test results yet. Check back after your next appointment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {labResults.map((result) => (
              <div key={result.id} className="bg-white shadow rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{result.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{result.summary}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-semibold tracking-wide text-slate-600 bg-slate-100 rounded-full px-3 py-1">
                      {result.status}
                    </span>
                    <span className="text-sm text-gray-500">{result.date}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.fileUrl ? (
                    <a
                      href={result.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                    >
                      Download report
                    </a>
                  ) : (
                    <button className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm" disabled>
                      No report available
                    </button>
                  )}
                  <button className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm hover:bg-slate-200">
                    Ask your doctor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <>
          {profile && (
            <div className="mb-6 bg-white shadow rounded-lg p-5">
              <h2 className="text-lg font-semibold mb-4">Saved profile details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div>
                  <div className="font-medium">Full name</div>
                  <div>{profile.fullName || "—"}</div>
                </div>
                <div>
                  <div className="font-medium">Age</div>
                  <div>{profile.age ?? "—"}</div>
                </div>
                <div>
                  <div className="font-medium">Gender</div>
                  <div>{profile.gender || "—"}</div>
                </div>
                <div>
                  <div className="font-medium">Blood group</div>
                  <div>{profile.bloodGroup || "—"}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="font-medium">Contact</div>
                  <div>{profile.contact || "—"}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="font-medium">Medical history</div>
                  <div>
                    {Array.isArray(profile.medicalHistory)
                      ? profile.medicalHistory.join(", ") || "—"
                      : profile.medicalHistory || "—"}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    <option key={g} value={g}>
                      {g || "—"}
                    </option>
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
                    <option key={b} value={b}>
                      {b || "—"}
                    </option>
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
        </>
      )}
    </div>
  );
}
