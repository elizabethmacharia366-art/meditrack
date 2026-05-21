import React, { useState } from "react";

export default function ManageHospitals() {
  const [hospitals, setHospitals] = useState([
    { id: 1, name: "Nairobi General Hospital", location: "Nairobi, Kenya", departments: ["Cardiology", "Pediatrics"] }
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Hospitals</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Departments</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map((hosp) => (
            <tr key={hosp.id}>
              <td className="border p-2">{hosp.name}</td>
              <td className="border p-2">{hosp.location}</td>
              <td className="border p-2">{hosp.departments.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
