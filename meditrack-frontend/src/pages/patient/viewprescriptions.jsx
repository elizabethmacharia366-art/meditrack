import React, { useState } from "react";

export default function ViewPrescriptions() {
  const [prescriptions] = useState([
    {
      id: 1,
      diagnosis: "Hypertension",
      medicines: [
        { name: "Amlodipine", dosage: "5mg", frequency: "Once daily" },
        { name: "Aspirin", dosage: "75mg", frequency: "Once daily" }
      ],
      notes: "Monitor blood pressure weekly."
    }
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>
      {prescriptions.map((pres) => (
        <div key={pres.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
          <p className="font-bold">Diagnosis: {pres.diagnosis}</p>
          <ul className="mt-2">
            {pres.medicines.map((med, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                {med.name} - {med.dosage} ({med.frequency})
              </li>
            ))}
          </ul>
          <p className="text-gray-600 mt-2">Notes: {pres.notes}</p>
        </div>
      ))}
    </div>
  );
}
