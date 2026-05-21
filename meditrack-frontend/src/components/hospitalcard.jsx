import React from "react";

export default function HospitalCard({ hospital }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-bold">{hospital.name}</h3>
      <p className="text-gray-600">{hospital.location}</p>
      <p className="text-gray-500">{hospital.description}</p>
      <ul className="mt-2">
        {hospital.departments.map((dept, idx) => (
          <li key={idx} className="text-sm text-gray-700">• {dept}</li>
        ))}
      </ul>
    </div>
  );
}
