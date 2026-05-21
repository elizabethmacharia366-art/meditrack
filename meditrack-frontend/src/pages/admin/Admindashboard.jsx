import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/manage-doctors" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Manage Doctors</h2>
          <p className="text-gray-600">Add, edit, or remove doctors.</p>
        </Link>
        <Link to="/admin/manage-patients" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Manage Patients</h2>
          <p className="text-gray-600">View and update patient records.</p>
        </Link>
        <Link to="/admin/manage-hospitals" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Manage Hospitals</h2>
          <p className="text-gray-600">Add or edit hospital details.</p>
        </Link>
        <Link to="/admin/manage-appointments" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Manage Appointments</h2>
          <p className="text-gray-600">View and control appointments.</p>
        </Link>
      </div>
    </div>
  );
}
