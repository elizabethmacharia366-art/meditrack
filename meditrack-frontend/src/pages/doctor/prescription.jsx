import React, { useState } from "react";
import PrescriptionForm from "../../components/PrescriptionForm";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);

  const handleAddPrescription = (newPrescription) => {
    setPrescriptions([...prescriptions, { id: Date.now(), ...newPrescription }]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Prescriptions</h1>
      <PrescriptionForm onSubmit={handleAddPrescription} />
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Issued Prescriptions</h2>
        <ul>
          {prescriptions.map((pres) => (
            <li key={pres.id} className="bg-white shadow-md rounded-lg p-4 mb-2">
              <p className="font-bold">Diagnosis: {pres.diagnosis}</p>
              <ul className="mt-2">
                {pres.medicines.map((med, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {med.name} - {med.dosage} ({med.frequency})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
