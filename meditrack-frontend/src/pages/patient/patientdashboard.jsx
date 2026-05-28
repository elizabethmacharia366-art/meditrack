import React from "react";
import { Link } from "react-router-dom";
import WelcomeBanner from "../../components/welcomebanner";

export default function PatientDashboard() {
  return (
    <div className="p-6">
      <WelcomeBanner subtitle="Here's what's available in your patient portal." />
      <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Link
          to="/patient/lab-results"
          className="bg-white rounded-xl shadow p-5 hover:border-blue-400 border border-transparent transition"
        >
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Lab results</div>
          <h2 className="mt-3 text-2xl font-bold text-green-700">Downloadable reports</h2>
          <p className="mt-2 text-gray-600">Access all lab results from your care team, including PDF scans, images, and charts.</p>
        </Link>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-xl shadow p-5">
            <div className="font-semibold text-gray-800">Doctor access</div>
            <p className="mt-2 text-gray-600">Doctors can view all lab results linked to their assigned patients, keeping care aligned.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <div className="font-semibold text-gray-800">Automatic alerts</div>
            <p className="mt-2 text-gray-600">Abnormal values are flagged automatically so you and your doctor can take quick action.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/patient/profile" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">My Profile</h2>
          <p className="text-gray-600">Update personal info and medical history.</p>
        </Link>
        <Link to="/patient/appointments" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Appointments</h2>
          <p className="text-gray-600">Book and manage appointments.</p>
        </Link>
        <Link to="/patient/prescriptions" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Prescriptions</h2>
          <p className="text-gray-600">View prescriptions issued by doctors.</p>
        </Link>
        <Link to="/patient/history" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">My History</h2>
          <p className="text-gray-600">Past appointments and prescriptions.</p>
        </Link>
        <Link to="/patient/hospitals" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">Hospitals</h2>
          <p className="text-gray-600">Browse hospitals and available doctors.</p>
        </Link>
        <Link to="/patient/faq" className="bg-white shadow-md rounded-lg p-4 hover:bg-blue-50">
          <h2 className="text-lg font-semibold">FAQ & Support</h2>
          <p className="text-gray-600">Insurance, wait times, telehealth guidance.</p>
        </Link>
      </div>
    </div>
  );
}
