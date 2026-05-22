import React, { useState } from "react";

export default function Managepatients() {
  const [patients, setPatients] = useState([
    { id: 1, fullName: "John Doe", age: 30, gender: "Male ", contact: "+254700123456" }
  ]);

  const [newPatient, setNewPatient] = useState({ fullName: "", age: "", gender: "", contact: "" });

  const handleAddPatient = () => {
    setPatients([...patients, { id: Date.now(), ...newPatient }]);
    setNewPatient({ fullName: "", age: "", gender: "", contact: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Patients</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Full Name"
          value={newPatient.fullName}
          onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Age"
          value={newPatient.age}
          onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Gender"
          value={newPatient.gender}
          onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
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
        <button onClick={handleAddPatient} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add patient
        </button>
      </div>

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
