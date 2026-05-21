import React, { useState } from "react";

export default function ManagePatients() {
  const [patients, setPatients] = useState([
    { id: 1, fullName: "Elizabeth Njeri", age: 32, gender: "Female", contact: "+254711987654" }
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Patients</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Contact</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((pat) => (
            <tr key={pat.id}>
              <td className="border p-2">{pat.fullName}</td>
              <td className="border p-2">{pat.age}</td>
              <td className="border p-2">{pat.gender}</td>
              <td className="border p-2">{pat.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
