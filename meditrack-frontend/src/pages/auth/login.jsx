import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";
import { resendVerification } from "../../service/api";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [errorKind, setErrorKind] = useState(""); // 'pending' | 'unverified' | ''
  const [resendStatus, setResendStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrorKind("");
    setResendStatus("");
    if (!formData.email || !formData.password || !formData.role) {
      setError("Email, password and role are required.");
      return;
    }
    try {
      setSubmitting(true);
      const u = await login(formData);
      sessionStorage.setItem("greet", "back");
      navigate(`/${u.role}`);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.error || "Login failed");
      if (data?.status === "pending") setErrorKind("pending");
      else if (data?.emailVerified === false) setErrorKind("unverified");
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResendStatus("Sending…");
    try {
      const { data } = await resendVerification(formData.email);
      setResendStatus(data?.message || "If the account exists, a link was sent.");
    } catch {
      setResendStatus("Could not send right now. Try again later.");
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
            <div
              className={
                "text-sm rounded p-3 border " +
                (errorKind === "pending"
                  ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                  : errorKind === "unverified"
                  ? "bg-blue-50 border-blue-200 text-blue-800"
                  : "bg-red-50 border-red-200 text-red-600")
              }
            >
              <div>{error}</div>
              {errorKind === "unverified" && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="underline text-blue-700 text-xs"
                  >
                    Resend verification email
                  </button>
                  {resendStatus && (
                    <div className="text-xs text-gray-700 mt-1">{resendStatus}</div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg shadow transition"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
