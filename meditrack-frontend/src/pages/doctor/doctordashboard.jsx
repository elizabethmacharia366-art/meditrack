import React from "react";
import { Link } from "react-router-dom";

export default function DoctorDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/doctor/patients" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Patients</h2>
          <p className="text-gray-600">View assigned patients and medical history.</p>
        </Link>
        <Link to="/doctor/prescriptions" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Prescriptions</h2>
          <p className="text-gray-600">Issue and manage prescriptions.</p>
        </Link>
        <Link to="/doctor/appointments" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Appointments</h2>
          <p className="text-gray-600">Manage upcoming appointments.</p>
        </Link>
      </div>
    </div>
  );
}
