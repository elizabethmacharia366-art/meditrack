import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  adminCreateInvite,
  adminListInvites,
  adminRevokeInvite,
} from "../../service/api";

const fmt = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const inviteStatus = (invite) => {
  if (invite.used || invite.usedBy) return "Used";
  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) return "Expired";
  return "Active";
};

export default function AdminInvites() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    role: "doctor",
    email: "",
    expiresInDays: 14,
    note: "",
  });

  const loadInvites = async () => {
    try {
      setLoading(true);
      const { data } = await adminListInvites();
      setInvites(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load invite codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const createInvite = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await adminCreateInvite({
        role: form.role,
        email: form.email.trim() || undefined,
        expiresInDays: Number(form.expiresInDays) || undefined,
        note: form.note.trim() || undefined,
      });
      setForm({ role: form.role, email: "", expiresInDays: 14, note: "" });
      await loadInvites();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create invite code");
    } finally {
      setCreating(false);
    }
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setError("Could not copy code. Select it manually.");
    }
  };

  const revokeInvite = async (id) => {
    if (!window.confirm("Revoke this invite code?")) return;
    try {
      await adminRevokeInvite(id);
      await loadInvites();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to revoke invite code");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold">Invite Codes</h1>
          <p className="text-gray-600 text-sm">
            Generate one-time codes for doctor and hospital registration.
          </p>
        </div>
        <Link to="/admin" className="text-blue-600 hover:underline text-sm">
          Back to dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={createInvite}
        className="bg-white shadow rounded-lg p-5 mb-6 grid grid-cols-1 md:grid-cols-6 gap-3"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border rounded-lg w-full px-3 py-2"
          >
            <option value="doctor">Doctor</option>
            <option value="hospital">Hospital</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded-lg w-full px-3 py-2"
            placeholder="Optional email restriction"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expires</label>
          <input
            type="number"
            min="1"
            value={form.expiresInDays}
            onChange={(e) => setForm({ ...form, expiresInDays: e.target.value })}
            className="border rounded-lg w-full px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
          <input
            type="text"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="border rounded-lg w-full px-3 py-2"
            placeholder="Credential review note"
          />
        </div>

        <div className="md:col-span-6">
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-lg"
          >
            {creating ? "Generating..." : "Generate invite code"}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : invites.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
          No invite codes yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3">Code</th>
                <th className="p-3">Role</th>
                <th className="p-3">Email</th>
                <th className="p-3">Expires</th>
                <th className="p-3">Status</th>
                <th className="p-3">Used by</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((invite) => {
                const status = inviteStatus(invite);
                return (
                  <tr key={invite._id} className="border-t">
                    <td className="p-3">
                      <div className="font-mono font-semibold">{invite.code}</div>
                      {invite.note && (
                        <div className="text-xs text-gray-500 mt-0.5">{invite.note}</div>
                      )}
                    </td>
                    <td className="p-3 capitalize">{invite.role}</td>
                    <td className="p-3">{invite.email || "-"}</td>
                    <td className="p-3 text-gray-500">{fmt(invite.expiresAt)}</td>
                    <td className="p-3">
                      <span
                        className={
                          status === "Active"
                            ? "text-green-700"
                            : status === "Expired"
                            ? "text-red-700"
                            : "text-gray-600"
                        }
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-3">
                      {invite.usedBy ? `${invite.usedBy.name} (${invite.usedBy.email})` : "-"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => copyCode(invite.code)}
                        className="text-blue-700 hover:underline mr-4"
                      >
                        {copied === invite.code ? "Copied" : "Copy"}
                      </button>
                      {status === "Active" && (
                        <button
                          type="button"
                          onClick={() => revokeInvite(invite._id)}
                          className="text-red-700 hover:underline"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
