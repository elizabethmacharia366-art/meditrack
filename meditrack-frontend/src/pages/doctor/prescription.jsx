import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getPrescriptions,
  createPrescription,
  deletePrescription,
  getPatients,
} from "../../service/api";

const fmt = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString();
};

const emptyMedicine = () => ({ name: "", dosage: "", frequency: "" });

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patientId: "",
    diagnosis: "",
    notes: "",
    medicines: [emptyMedicine()],
  });

  const load = async () => {
    try {
      setLoading(true);
      const [pRes, patRes] = await Promise.all([getPrescriptions(), getPatients()]);
      setPrescriptions(Array.isArray(pRes.data) ? pRes.data : []);
      setPatients(Array.isArray(patRes.data) ? patRes.data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateMedicine = (idx, field, value) => {
    setForm((f) => {
      const meds = [...f.medicines];
      meds[idx] = { ...meds[idx], [field]: value };
      return { ...f, medicines: meds };
    });
  };

  const addMedicine = () =>
    setForm((f) => ({ ...f, medicines: [...f.medicines, emptyMedicine()] }));

  const removeMedicine = (idx) =>
    setForm((f) => ({
      ...f,
      medicines: f.medicines.filter((_, i) => i !== idx),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId) {
      setError("Please select a patient.");
      return;
    }
    const payload = {
      patientId: form.patientId,
      diagnosis: form.diagnosis.trim(),
      notes: form.notes.trim(),
      medicines: form.medicines
        .map((m) => ({
          name: m.name.trim(),
          dosage: m.dosage.trim(),
          frequency: m.frequency.trim(),
        }))
        .filter((m) => m.name),
    };
    try {
      setSaving(true);
      await createPrescription(payload);
      setForm({ patientId: "", diagnosis: "", notes: "", medicines: [emptyMedicine()] });
      setError("");
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to issue prescription");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prescription?")) return;
    try {
      await deletePrescription(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete prescription");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <Link to="/doctor" className="text-blue-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-5 mb-8">
        <h2 className="text-lg font-semibold mb-4">Issue new prescription</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
        <select
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          className="border rounded-lg w-full px-3 py-2 mb-4"
          required
        >
          <option value="">Select a patient…</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.fullName}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
        <input
          type="text"
          value={form.diagnosis}
          onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          className="border rounded-lg w-full px-3 py-2 mb-4"
          placeholder="e.g. Hypertension"
        />

        <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
        {form.medicines.map((m, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2">
            <input
              type="text"
              placeholder="Name"
              value={m.name}
              onChange={(e) => updateMedicine(idx, "name", e.target.value)}
              className="border rounded px-3 py-2 md:col-span-5"
            />
            <input
              type="text"
              placeholder="Dosage"
              value={m.dosage}
              onChange={(e) => updateMedicine(idx, "dosage", e.target.value)}
              className="border rounded px-3 py-2 md:col-span-3"
            />
            <input
              type="text"
              placeholder="Frequency"
              value={m.frequency}
              onChange={(e) => updateMedicine(idx, "frequency", e.target.value)}
              className="border rounded px-3 py-2 md:col-span-3"
            />
            <button
              type="button"
              onClick={() => removeMedicine(idx)}
              disabled={form.medicines.length === 1}
              className="text-red-600 text-sm md:col-span-1 disabled:opacity-40"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addMedicine}
          className="text-sm text-blue-600 hover:underline mb-4"
        >
          + Add medicine
        </button>

        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={2}
          className="border rounded-lg w-full px-3 py-2 mb-4"
          placeholder="Optional notes for the patient"
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-lg"
        >
          {saving ? "Saving…" : "Save prescription"}
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-3">Issued prescriptions</h2>

      {loading && <p className="text-gray-500">Loading…</p>}

      {!loading && prescriptions.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
          You haven't issued any prescriptions yet.
        </div>
      )}

      <ul className="space-y-3">
        {prescriptions.map((pres) => (
          <li key={pres._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold">
                  {pres.patientId?.fullName || "Patient"}
                  {pres.diagnosis ? ` — ${pres.diagnosis}` : ""}
                </p>
                <p className="text-xs text-gray-500">{fmt(pres.createdAt)}</p>
              </div>
              <button
                onClick={() => handleDelete(pres._id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
            {Array.isArray(pres.medicines) && pres.medicines.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                {pres.medicines.map((med, idx) => (
                  <li key={idx}>
                    {med.name}
                    {med.dosage ? ` — ${med.dosage}` : ""}
                    {med.frequency ? ` (${med.frequency})` : ""}
                  </li>
                ))}
              </ul>
            )}
            {pres.notes && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Notes:</span> {pres.notes}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
