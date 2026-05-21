import React from "react";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/patient/prescriptions" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Prescriptions</h2>
          <p className="text-gray-600">View prescriptions issued by doctors.</p>
        </Link>
        <Link to="/patient/appointments" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Appointments</h2>
          <p className="text-gray-600">Book and manage appointments.</p>
        </Link>
        <Link to="/patient/hospitals" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Hospitals</h2>
          <p className="text-gray-600">Browse hospitals and available doctors.</p>
        </Link>
      </div>
    </div>
  );
}
