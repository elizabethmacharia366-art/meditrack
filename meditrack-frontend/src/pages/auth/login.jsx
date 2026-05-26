import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [welcome, setWelcome] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email || !formData.password || !formData.role) {
      setError("Email, password and role are required.");
      return;
    }
    try {
      setSubmitting(true);
      const u = await login(formData);
      setWelcome(`Welcome back, ${u.name || u.email}!`);
      setTimeout(() => navigate(`/${u.role}`), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          {welcome && (
            <div className="text-green-700 text-sm bg-green-50 border border-green-200 rounded p-3 text-center font-medium">
              {welcome}
              <div className="text-xs text-green-600 mt-1">Redirecting to your dashboard…</div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !!welcome}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg shadow transition"
          >
            {welcome ? "Signed in" : submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
