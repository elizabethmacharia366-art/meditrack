import React from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

export default function DoctorDashboard() {
  return (
    <div className="p-6">
      <WelcomeBanner subtitle="Manage your patients, prescriptions, and appointments." />
      <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/doctor/profile" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">My Profile</h2>
          <p className="text-gray-600">Set hospital, contact, specialty, and schedule.</p>
        </Link>
        <Link to="/doctor/patients" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Patients</h2>
          <p className="text-gray-600">View your patients & their history.</p>
        </Link>
        <Link to="/doctor/appointments" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Appointments</h2>
          <p className="text-gray-600">Manage your daily schedule.</p>
        </Link>
        <Link to="/doctor/prescriptions" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Prescriptions</h2>
          <p className="text-gray-600">Issue and manage prescriptions.</p>
        </Link>
        <Link to="/doctor/clinical-dashboard" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Clinical Dashboard</h2>
          <p className="text-gray-600">Monitor pending lab results and alerts across patients.</p>
        </Link>
        <Link to="/doctor/alerts" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Alerts</h2>
          <p className="text-gray-600">See critical lab notifications and act quickly.</p>
        </Link>
        <Link to="/doctor/workflow" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Workflow Board</h2>
          <p className="text-gray-600">Waiting → In Treatment → Discharged.</p>
        </Link>
      </div>
    </div>
  );
}
