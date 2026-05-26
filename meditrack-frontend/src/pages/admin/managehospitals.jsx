import React, { useEffect, useState } from "react";
import {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
} from "../../service/api";

const emptyHospital = {
  name: "",
  location: "",
  departments: "",
  contact: "",
  hours: "",
};

export default function ManageHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState(emptyHospital);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const res = await getHospitals();
      setHospitals(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load hospitals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  const resetForm = () => {
    setForm(emptyHospital);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim()) return;
    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      contact: form.contact.trim(),
      hours: form.hours.trim(),
      departments: form.departments
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) {
        await updateHospital(editingId, payload);
      } else {
        await createHospital(payload);
      }
      resetForm();
      await loadHospitals();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save hospital");
    }
  };

  const handleEdit = (h) => {
    setEditingId(h._id);
    setForm({
      name: h.name || "",
      location: h.location || "",
      departments: Array.isArray(h.departments) ? h.departments.join(", ") : "",
      contact: h.contact || "",
      hours: h.hours || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hospital?")) return;
    try {
      await deleteHospital(id);
      await loadHospitals();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete hospital");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Hospitals</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="border p-2"
          required
        />
        <input
          type="text"
          placeholder="Departments (comma separated)"
          value={form.departments}
          onChange={(e) => setForm({ ...form, departments: e.target.value })}
          className="border p-2 flex-1 min-w-[200px]"
        />
        <input
          type="text"
          placeholder="Contact"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Hours"
          value={form.hours}
          onChange={(e) => setForm({ ...form, hours: e.target.value })}
          className="border p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Hospital" : "Add Hospital"}
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
        <p>Loading hospitals...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Hospital ID</th>
              <th className="border p-2 text-left">Location</th>
              <th className="border p-2 text-left">Departments</th>
              <th className="border p-2 text-left">Contact</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.length === 0 ? (
              <tr>
                <td className="border p-2 text-center" colSpan={6}>
                  No hospitals yet.
                </td>
              </tr>
            ) : (
              hospitals.map((hosp) => (
                <tr key={hosp._id}>
                  <td className="border p-2">{hosp.name}</td>
                  <td className="border p-2 font-mono text-xs text-gray-600">{hosp._id}</td>
                  <td className="border p-2">{hosp.location}</td>
                  <td className="border p-2">
                    {Array.isArray(hosp.departments)
                      ? hosp.departments.join(", ")
                      : "-"}
                  </td>
                  <td className="border p-2">{hosp.contact || "-"}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(hosp)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hosp._id)}
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
