import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">HealthCare System</h1>
      <div className="space-x-4">
        <a href="/doctor" className="hover:underline">Doctor</a>
        <a href="/patient" className="hover:underline">Patient</a>
      </div>
    </nav>
  );
}

