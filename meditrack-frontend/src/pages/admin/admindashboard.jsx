import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import WelcomeBanner from "../../components/welcomebanner";
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
import {
  getPatients,
  getDoctors,
  getHospitals,
  getAppointments,
  getPrescriptions,
} from "../../service/api";

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

const dayKey = (d) => new Date(d).toISOString().slice(0, 10);
const lastNDays = (n) => {
  const out = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(d);
  }
  return out;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [p, d, h, a, rx] = await Promise.all([
          getPatients(),
          getDoctors(),
          getHospitals(),
          getAppointments(),
          getPrescriptions(),
        ]);
        if (!alive) return;
        setPatients(p.data || []);
        setDoctors(d.data || []);
        setHospitals(h.data || []);
        setAppointments(a.data || []);
        setPrescriptions(rx.data || []);
        setError("");
      } catch (err) {
        if (alive) setError(err.response?.data?.error || "Failed to load dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const todayKey = useMemo(() => dayKey(new Date()), []);
  const appointmentsToday = useMemo(
    () => appointments.filter((a) => a.date && dayKey(a.date) === todayKey).length,
    [appointments, todayKey],
  );

  const statusCounts = useMemo(() => {
    const counts = { Scheduled: 0, Completed: 0, Cancelled: 0 };
    appointments.forEach((a) => {
      const s = a.status || "Scheduled";
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [appointments]);

  const volumeChart = useMemo(() => {
    const days = lastNDays(7);
    const labels = days.map((d) =>
      d.toLocaleDateString(undefined, { weekday: "short" }),
    );
    const data = days.map(
      (d) => appointments.filter((a) => a.date && dayKey(a.date) === dayKey(d)).length,
    );
    return {
      labels,
      datasets: [
        { label: "Appointments / day", data, backgroundColor: "#2563EB" },
      ],
    };
  }, [appointments]);

  const statusChart = useMemo(
    () => ({
      labels: ["Scheduled", "Completed", "Cancelled"],
      datasets: [
        {
          data: [
            statusCounts.Scheduled,
            statusCounts.Completed,
            statusCounts.Cancelled,
          ],
          backgroundColor: ["#2563EB", "#16A34A", "#DC2626"],
        },
      ],
    }),
    [statusCounts],
  );

  const recent = useMemo(() => {
    const items = [
      ...appointments.map((a) => ({
        when: a.createdAt || a.date,
        text: `Appointment ${a.status || "Scheduled"} for ${
          a.patientId?.fullName || "patient"
        } with ${a.doctorId?.fullName || "doctor"}`,
      })),
      ...prescriptions.map((p) => ({
        when: p.createdAt,
        text: `Prescription issued to ${p.patientId?.fullName || "patient"}${
          p.diagnosis ? ` (${p.diagnosis})` : ""
        }`,
      })),
    ];
    items.sort((x, y) => new Date(y.when || 0) - new Date(x.when || 0));
    return items.slice(0, 6);
  }, [appointments, prescriptions]);

  const kpis = [
    { label: "Patients", value: patients.length, color: "text-blue-600" },
    { label: "Doctors", value: doctors.length, color: "text-green-600" },
    { label: "Hospitals", value: hospitals.length, color: "text-teal-600" },
    { label: "Appointments Today", value: appointmentsToday, color: "text-yellow-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <WelcomeBanner subtitle="System overview and management tools." />
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Dashboard</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}
      {loading && <p className="text-gray-500 mb-4">Loading metrics…</p>}

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center">
            <h3 className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</h3>
            <p className="text-sm text-gray-600 text-center">{kpi.label}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Appointments — last 7 days</h3>
          <div className="h-56">
            <Bar data={volumeChart} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-4">Appointment Status</h3>
          <div className="h-56">
            <Doughnut data={statusChart} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <button onClick={() => navigate("/admin/manage-patients")} className="p-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">Manage Patients</button>
        <button onClick={() => navigate("/admin/manage-doctors")} className="p-6 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">Manage Doctors</button>
        <button onClick={() => navigate("/admin/manage-hospitals")} className="p-6 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700">Manage Hospitals</button>
        <button onClick={() => navigate("/admin/approvals")} className="p-6 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">User Approvals</button>
        <button onClick={() => navigate("/admin/workflow")} className="p-6 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700">Workflow Board</button>
      </section>

      <section className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Recent activity</h3>
        {recent.length === 0 ? (
          <p className="text-gray-500 text-sm">No activity yet.</p>
        ) : (
          <ul className="space-y-2 text-gray-700">
            {recent.map((item, i) => (
              <li key={i} className="border-b pb-2 text-sm">
                <span className="text-gray-500 mr-2">
                  {item.when ? new Date(item.when).toLocaleString() : ""}
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
