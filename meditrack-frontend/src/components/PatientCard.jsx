import React from "react";

export default function PatientCard({ patient }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-bold">{patient.fullName}</h3>
      <p className="text-gray-600">Age: {patient.age}</p>
      <p className="text-gray-600">Gender: {patient.gender}</p>
      <p className="text-gray-500">Contact: {patient.contact}</p>
      <p className="text-gray-500">Blood Group: {patient.bloodGroup}</p>
      <ul className="mt-2">
        {patient.medicalHistory.map((history, idx) => (
          <li key={idx} className="text-sm text-gray-700">• {history}</li>
        ))}
      </ul>
    </div>
  );
}
