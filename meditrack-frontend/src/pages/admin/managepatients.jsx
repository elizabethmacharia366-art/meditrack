import React, { useEffect, useState } from "react";
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../../service/api";

const emptyPatient = { fullName: "", age: "", gender: "", contact: "", bloodGroup: "" };

// Build a payload that omits empty fields so we don't trip Mongoose enum
// validation on `gender` / `bloodGroup`.
const buildPayload = (form) => {
  const out = { fullName: form.fullName.trim() };
  if (form.age !== "" && form.age !== null) out.age = Number(form.age);
  if (form.gender) out.gender = form.gender;
  if (form.contact?.trim()) out.contact = form.contact.trim();
  if (form.bloodGroup) out.bloodGroup = form.bloodGroup;
  return out;
};

// Format a backend error response (which uses { error, details? }) for display.
const formatError = (err, fallback) => {
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;
  if (data.details?.length) return `${data.error}: ${data.details.join(", ")}`;
  return data.error || data.message || fallback;
};

export default function Managepatients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyPatient);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await getPatients();
      setPatients(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      setError(formatError(err, "Failed to load patients"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const resetForm = () => {
    setForm(emptyPatient);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    const payload = buildPayload(form);
    try {
      if (editingId) {
        await updatePatient(editingId, payload);
      } else {
        await createPatient(payload);
      }
      resetForm();
      setError("");
      await loadPatients();
    } catch (err) {
      setError(formatError(err, "Failed to save patient"));
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      fullName: p.fullName || "",
      age: p.age ?? "",
      gender: p.gender || "",
      contact: p.contact || "",
      bloodGroup: p.bloodGroup || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await deletePatient(id);
      await loadPatients();
    } catch (err) {
      setError(formatError(err, "Failed to delete patient"));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Patients</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="border p-2"
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          className="border p-2 w-24"
        />
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="border p-2"
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={form.bloodGroup}
          onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
          className="border p-2"
        >
          <option value="">Blood group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Contact"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="border p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Patient" : "Add Patient"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading patients...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Age</th>
              <th className="border p-2 text-left">Gender</th>
              <th className="border p-2 text-left">Blood</th>
              <th className="border p-2 text-left">Contact</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td className="border p-2 text-center" colSpan={6}>
                  No patients yet.
                </td>
              </tr>
            ) : (
              patients.map((pat) => (
                <tr key={pat._id}>
                  <td className="border p-2">{pat.fullName}</td>
                  <td className="border p-2">{pat.age ?? "-"}</td>
                  <td className="border p-2">{pat.gender || "-"}</td>
                  <td className="border p-2">{pat.bloodGroup || "-"}</td>
                  <td className="border p-2">{pat.contact || "-"}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(pat)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pat._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
