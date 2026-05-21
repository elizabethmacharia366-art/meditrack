import React from "react";
import { useParams } from "react-router-dom";

export default function HospitalDetail() {
  const { id } = useParams();

  // Example data (replace with API call)
  const hospital = {
    id,
    name: "Nairobi General Hospital",
    location: "Nairobi, Kenya",
    description: "Multi-specialty hospital serving Nairobi.",
    departments: ["Cardiology", "Pediatrics", "Orthopedics"],
    doctors: [
      { id: 1, fullName: "Dr. John Mwangi", specialty: "Cardiology" },
      { id: 2, fullName: "Dr. Aisha Hassan", specialty: "Pediatrics" }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{hospital.name}</h1>
      <p className="text-gray-600">{hospital.location}</p>
      <p className="text-gray-500 mb-4">{hospital.description}</p>

      <h2 className="text-xl font-semibold mb-2">Departments</h2>
      <ul className="list-disc list-inside mb-6">
        {hospital.departments.map((dept, idx) => (
          <li key={idx} className="text-gray-700">{dept}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Doctors</h2>
      <ul className="space-y-2">
        {hospital.doctors.map((doc) => (
          <li key={doc.id} className="bg-white shadow-md rounded-lg p-3">
            <p className="font-bold">{doc.fullName}</p>
            <p className="text-gray-600">{doc.specialty}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
