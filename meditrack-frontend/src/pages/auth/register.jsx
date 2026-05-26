import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";
import { getRoleHomePath } from "../../utils/roleRoutes";

export default function Register() {
  const { register, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    // Clear any previous role session before a new registration attempt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo(null);
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError("All fields are required.");
      return;
    }
    if (formData.role === "hospital" && !formData.location.trim()) {
      setError("Hospital registrations need a facility location.");
      return;
    }
    try {
      setSubmitting(true);
      const u = await register(formData);
      if (u?.pending) {
        setInfo({
          message:
            u.message ||
            "Your account has been created. Please wait for approval from the admin before signing in.",
        });
        setSubmitting(false);
        return;
      }
      sessionStorage.setItem("greet", "new");
      navigate(getRoleHomePath(u.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Full name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>

          {formData.role && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded p-3 text-sm">
              Accounts are reviewed by an admin before access is enabled.
            </div>
          )}

          {formData.role === "hospital" && (
            <div>
              <label className="block mb-2 font-medium text-gray-700">Facility location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="City, state, or address"
              />
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          {info && (
            <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded p-3 text-sm">
              <div className="font-medium">{info.message}</div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !!info}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg shadow-md transition"
          >
            {submitting ? "Creating..." : info ? "Done" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
