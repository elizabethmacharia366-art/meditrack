import React, { useEffect, useState } from "react";
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../../service/api";

const emptyPatient = { fullName: "", age: "", gender: "", contact: "" };

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
      setError(err?.response?.data?.message || "Failed to load patients");
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
    const payload = {
      fullName: form.fullName.trim(),
      age: form.age === "" ? undefined : Number(form.age),
      gender: form.gender.trim(),
      contact: form.contact.trim(),
    };
    try {
      if (editingId) {
        await updatePatient(editingId, payload);
      } else {
        await createPatient(payload);
      }
      resetForm();
      await loadPatients();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save patient");
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      fullName: p.fullName || "",
      age: p.age ?? "",
      gender: p.gender || "",
      contact: p.contact || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await deletePatient(id);
      await loadPatients();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete patient");
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
        <input
          type="text"
          placeholder="Gender"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="border p-2"
        />
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
              <th className="border p-2 text-left">Contact</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td className="border p-2 text-center" colSpan={5}>
                  No patients yet.
                </td>
              </tr>
            ) : (
              patients.map((pat) => (
                <tr key={pat._id}>
                  <td className="border p-2">{pat.fullName}</td>
                  <td className="border p-2">{pat.age ?? "-"}</td>
                  <td className="border p-2">{pat.gender || "-"}</td>
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
