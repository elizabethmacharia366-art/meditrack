import React, { useState } from "react";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([
    { id: 1, fullName: "Dr. John Mwangi", specialty: "Cardiology", contact: "+254700123456" }
  ]);

  const [newDoctor, setNewDoctor] = useState({ fullName: "", specialty: "", contact: "" });

  const handleAddDoctor = () => {
    setDoctors([...doctors, { id: Date.now(), ...newDoctor }]);
    setNewDoctor({ fullName: "", specialty: "", contact: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Doctors</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Full Name"
          value={newDoctor.fullName}
          onChange={(e) => setNewDoctor({ ...newDoctor, fullName: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Specialty"
          value={newDoctor.specialty}
          onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Contact"
          value={newDoctor.contact}
          onChange={(e) => setNewDoctor({ ...newDoctor, contact: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddDoctor} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Doctor
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Specialty</th>
            <th className="border p-2">Contact</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id}>
              <td className="border p-2">{doc.fullName}</td>
              <td className="border p-2">{doc.specialty}</td>
              <td className="border p-2">{doc.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
