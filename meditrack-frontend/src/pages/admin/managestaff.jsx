import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminListUsers, adminCreateStaff } from "../../service/api";

const roles = [
  { value: "nurse", label: "Nurse" },
  { value: "technician", label: "Technician" },
];

export default function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "nurse",
    department: "",
    ward: "",
  });

  const loadStaff = async () => {
    try {
      setLoading(true);
      const { data } = await adminListUsers();
      setStaff(Array.isArray(data) ? data.filter((u) => ["nurse", "technician"].includes(u.role)) : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!form.name || !form.email || !form.password || !form.role) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      await adminCreateStaff(form);
      setMessage("Staff account created successfully.");
      setForm({ name: "", email: "", password: "", role: "nurse", department: "", ward: "" });
      await loadStaff();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create staff account");
    }
  };

  const activeStaff = useMemo(
    () => staff.sort((a, b) => a.role.localeCompare(b.role) || a.name.localeCompare(b.name)),
    [staff],
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Nursing Staff</h1>
          <p className="text-gray-600 text-sm">
            Create nurse and technician accounts, assign them to departments and wards, and keep the medical team organized.
          </p>
        </div>
        <Link to="/admin" className="text-blue-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">Create staff account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {roles.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Cardiology, ER, Pediatrics"
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ward</label>
              <input
                name="ward"
                value={form.ward}
                onChange={handleChange}
                placeholder="Ward 4A, ICU, Step-down"
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                {message}
              </div>
            )}

            <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Create staff account
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">Staff guidance</h2>
          <p className="text-sm text-gray-600 mb-3">
            Nurses and technicians must be created by an admin or hospital HR. They cannot self-register.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Assign a role, department, and ward.</li>
            <li>Choose a strong password for the new account.</li>
            <li>New accounts are activated immediately for approved staff.</li>
          </ul>
        </div>
      </div>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-700 mb-4">Active nursing staff</h2>
        {loading ? (
          <p className="text-gray-500">Loading staff…</p>
        ) : staff.length === 0 ? (
          <p className="text-gray-600">No nurse or technician accounts have been created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Ward</th>
                </tr>
              </thead>
              <tbody>
                {activeStaff.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3 text-gray-700">{user.email}</td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3">{user.department || '—'}</td>
                    <td className="p-3">{user.ward || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
