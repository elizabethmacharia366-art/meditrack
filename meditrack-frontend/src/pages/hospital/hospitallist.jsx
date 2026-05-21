import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function HospitalList() {
  const [hospitals] = useState([
    { id: 1, name: "Nairobi General Hospital", location: "Nairobi, Kenya", description: "Multi-specialty hospital", departments: ["Cardiology", "Pediatrics"] },
    { id: 2, name: "Mombasa Medical Center", location: "Mombasa, Kenya", description: "Coastal healthcare facility", departments: ["Orthopedics", "Dermatology"] }
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hospitals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hospitals.map((hosp) => (
          <div key={hosp.id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold">{hosp.name}</h3>
            <p className="text-gray-600">{hosp.location}</p>
            <p className="text-gray-500">{hosp.description}</p>
            <Link to={`/hospital/${hosp.id}`} className="text-blue-600 hover:underline mt-2 block">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
