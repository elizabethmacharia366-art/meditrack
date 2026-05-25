import React, { useEffect, useState } from "react";
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getHospitals,
} from "../../service/api";

const emptyDoctor = { fullName: "", specialty: "", contact: "", hospitalId: "" };

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState(emptyDoctor);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAll = async () => {
    try {
      setLoading(true);
      const [docRes, hospRes] = await Promise.all([getDoctors(), getHospitals()]);
      setDoctors(Array.isArray(docRes.data) ? docRes.data : []);
      setHospitals(Array.isArray(hospRes.data) ? hospRes.data : []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const resetForm = () => {
    setForm(emptyDoctor);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    const payload = {
      fullName: form.fullName.trim(),
      specialty: form.specialty.trim(),
      contact: form.contact.trim(),
    };
    if (form.hospitalId) payload.hospitalId = form.hospitalId;
    try {
      if (editingId) {
        await updateDoctor(editingId, payload);
      } else {
        await createDoctor(payload);
      }
      resetForm();
      await loadAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save doctor");
    }
  };

  const handleEdit = (d) => {
    setEditingId(d._id);
    setForm({
      fullName: d.fullName || "",
      specialty: d.specialty || "",
      contact: d.contact || "",
      hospitalId: d.hospitalId?._id || d.hospitalId || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await deleteDoctor(id);
      await loadAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete doctor");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Doctors</h1>

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
          type="text"
          placeholder="Specialty"
          value={form.specialty}
          onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Contact"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="border p-2"
        />
        <select
          value={form.hospitalId}
          onChange={(e) => setForm({ ...form, hospitalId: e.target.value })}
          className="border p-2"
        >
          <option value="">-- Select Hospital --</option>
          {hospitals.map((h) => (
            <option key={h._id} value={h._id}>
              {h.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Doctor" : "Add Doctor"}
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
        <p>Loading doctors...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Specialty</th>
              <th className="border p-2 text-left">Contact</th>
              <th className="border p-2 text-left">Hospital</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td className="border p-2 text-center" colSpan={5}>
                  No doctors yet.
                </td>
              </tr>
            ) : (
              doctors.map((doc) => (
                <tr key={doc._id}>
                  <td className="border p-2">{doc.fullName}</td>
                  <td className="border p-2">{doc.specialty || "-"}</td>
                  <td className="border p-2">{doc.contact || "-"}</td>
                  <td className="border p-2">
                    {doc.hospitalId?.name || "-"}
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
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
