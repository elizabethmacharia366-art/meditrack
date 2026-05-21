import React, { useState } from "react";

export default function PrescriptionForm({ onSubmit }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", frequency: "" }]);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ diagnosis, medicines });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4">New Prescription</h3>
      <label className="block mb-2">Diagnosis</label>
      <input
        type="text"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        className="border rounded w-full p-2 mb-4"
      />

      {medicines.map((med, idx) => (
        <div key={idx} className="mb-4">
          <input
            type="text"
            placeholder="Medicine Name"
            value={med.name}
            onChange={(e) => handleChange(idx, "name", e.target.value)}
            className="border rounded w-full p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Dosage"
            value={med.dosage}
            onChange={(e) => handleChange(idx, "dosage", e.target.value)}
            className="border rounded w-full p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Frequency"
            value={med.frequency}
            onChange={(e) => handleChange(idx, "frequency", e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
      ))}

      <button type="button" onClick={handleAddMedicine} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
        Add Medicine
      </button>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Prescription
      </button>
    </form>
  );
}
