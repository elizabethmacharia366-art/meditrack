import React from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function MedicalLandingDashboard() {
  const navigate = useNavigate();

  // KPI data
  const kpis = [
    { label: "Patients Today", value: 120, color: "text-blue-600" },
    { label: "Avg Wait Time (min)", value: 18, color: "text-green-600" },
    { label: "Bed Occupancy (%)", value: 82, color: "text-teal-600" },
    { label: "Revenue ($)", value: "500k", color: "text-yellow-600" },
  ];

  // Charts
  const patientVolumeData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Patients per Day",
        data: [200, 250, 180, 300, 270],
        backgroundColor: "#2563EB",
      },
    ],
  };

  const infectionRateData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Infection Rate (%)",
        data: [2.5, 3.1, 2.8, 2.2, 1.9],
        borderColor: "#DC2626",
        backgroundColor: "#FCA5A5",
        fill: true,
      },
    ],
  };

  const revenueExpenseData = {
    labels: ["Revenue", "Expenses"],
    datasets: [
      {
        data: [500000, 350000],
        backgroundColor: ["#16A34A", "#F59E0B"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white text-center py-16 px-6">
        <h1 className="text-4xl font-bold mb-4">Get Care Now</h1>
        <p className="text-lg mb-6">
          Trusted healthcare services at your fingertips. Book appointments, consult doctors, and access hospitals seamlessly.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100"
          >
            Schedule Appointment
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 px-6">
        {[
          { title: "Telehealth Consultations", desc: "Connect with doctors online from anywhere." },
          { title: "Hospital Visits", desc: "Book and manage in-person appointments." },
          { title: "Prescription Management", desc: "View and renew prescriptions easily." },
        ].map((service) => (
          <div key={service.title} className="card bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.desc}</p>
          </div>
        ))}
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 px-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center">
            <h3 className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</h3>
            <p className="text-sm text-gray-600">{kpi.label}</p>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Patient Volume</h3>
          <div className="h-48">
            <Bar data={patientVolumeData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Infection Rates</h3>
          <div className="h-48">
            <Line data={infectionRateData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-4">Revenue vs Expenses</h3>
          <div className="h-48">
            <Doughnut data={revenueExpenseData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white shadow-lg rounded-lg p-6 mt-12 mx-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Frequently Asked Questions</h3>
        <ul className="space-y-4 text-gray-700">
          <li><strong>Do you accept insurance?</strong> Yes, we accept most major insurance providers.</li>
          <li><strong>How long is the wait time?</strong> Average wait time is under 20 minutes.</li>
          <li><strong>Can I consult online?</strong> Yes, telehealth consultations are available.</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} MediTrack. All rights reserved.
      </footer>
    </div>
  );
}
