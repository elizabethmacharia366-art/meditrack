import React, { useState } from "react";

export default function Patients() {
  const [patients] = useState([
    { id: 1, fullName: "Elizabeth Njeri", age: 32, gender: "Female", contact: "+254711987654", medicalHistory: ["Asthma"] },
    { id: 2, fullName: "James Otieno", age: 45, gender: "Male", contact: "+254700111222", medicalHistory: ["Diabetes"] }
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Patients</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patients.map((pat) => (
          <div key={pat.id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold">{pat.fullName}</h3>
            <p className="text-gray-600">Age: {pat.age}</p>
            <p className="text-gray-600">Gender: {pat.gender}</p>
            <p className="text-gray-500">Contact: {pat.contact}</p>
            <ul className="mt-2">
              {pat.medicalHistory.map((history, idx) => (
                <li key={idx} className="text-sm text-gray-700">• {history}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
