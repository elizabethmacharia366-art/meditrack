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

export default function AdminDashboard() {
  const navigate = useNavigate();

  const kpis = [
    { label: "Patients", value: 1200, color: "text-blue-600" },
    { label: "Doctors", value: 85, color: "text-green-600" },
    { label: "Hospitals", value: 12, color: "text-teal-600" },
    { label: "Appointments Today", value: 240, color: "text-yellow-600" },
  ];

  const patientVolumeData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [{ label: "Patients per Day", data: [200, 250, 180, 300, 270], backgroundColor: "#2563EB" }],
  };

  const infectionRateData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [{ label: "Infection Rate (%)", data: [2.5, 3.1, 2.8, 2.2, 1.9], borderColor: "#DC2626", backgroundColor: "#FCA5A5", fill: true }],
  };

  const revenueExpenseData = {
    labels: ["Revenue", "Expenses"],
    datasets: [{ data: [500000, 350000], backgroundColor: ["#16A34A", "#F59E0B"] }],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Dashboard</h1>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center">
            <h3 className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</h3>
            <p className="text-sm text-gray-600">{kpi.label}</p>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Patient Volume</h3>
          <div className="h-48"><Bar data={patientVolumeData} options={{ maintainAspectRatio: false }} /></div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Infection Rates</h3>
          <div className="h-48"><Line data={infectionRateData} options={{ maintainAspectRatio: false }} /></div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-4">Revenue vs Expenses</h3>
          <div className="h-48"><Doughnut data={revenueExpenseData} options={{ maintainAspectRatio: false }} /></div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button onClick={() => navigate("/admin/manage-patients")} className="p-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">Manage Patients</button>
        <button onClick={() => navigate("/admin/manage-doctors")} className="p-6 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">Manage Doctors</button>
        <button onClick={() => navigate("/admin/manage-hospitals")} className="p-6 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700">Manage Hospitals</button>
      </section>

      {/* Notifications */}
      <section className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Recent Alerts</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="border-b pb-2">ICU occupancy has reached 90%.</li>
          <li className="border-b pb-2">Staff shortage reported in ER.</li>
          <li className="border-b pb-2">System maintenance scheduled for Sunday.</li>
        </ul>
      </section>
    </div>
  );
}
