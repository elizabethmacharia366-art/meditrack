import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  adminListInvites,
  adminCreateInvite,
  adminRevokeInvite,
} from "../../service/api";

const fmt = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "—" : dt.toLocaleString();
};

export default function AdminInvites() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", note: "", expiresInDays: 14 });
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await adminListInvites();
      setInvites(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load invites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await adminCreateInvite({
        role: "doctor",
        email: form.email.trim() || undefined,
        note: form.note.trim() || undefined,
        expiresInDays: Number(form.expiresInDays) || undefined,
      });
      setForm({ email: "", note: "", expiresInDays: 14 });
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create invite");
    } finally {
      setCreating(false);
    }
  };

  const revoke = async (id) => {
    if (!window.confirm("Revoke this invite?")) return;
    try {
      await adminRevokeInvite(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to revoke invite");
    }
  };

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Doctor Invites</h1>
          <p className="text-gray-600 text-sm">
            Generate invite codes to onboard doctors. Doctors who register with a valid invite are
            approved automatically.
          </p>
        </div>
        <Link to="/admin" className="text-blue-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={create}
        className="bg-white shadow rounded-lg p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (optional)
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded-lg w-full px-3 py-2"
            placeholder="Restrict to a specific doctor's email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expires (days)</label>
          <input
            type="number"
            min="1"
            value={form.expiresInDays}
            onChange={(e) => setForm({ ...form, expiresInDays: e.target.value })}
            className="border rounded-lg w-full px-3 py-2"
          />
        </div>
        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
          <input
            type="text"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="border rounded-lg w-full px-3 py-2"
            placeholder="e.g. Cardiology consultant onboarding"
          />
        </div>
        <div className="md:col-span-4">
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-lg"
          >
            {creating ? "Generating…" : "Generate invite code"}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : invites.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
          No invites yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3">Code</th>
                <th className="p-3">For email</th>
                <th className="p-3">Created</th>
                <th className="p-3">Expires</th>
                <th className="p-3">Status</th>
                <th className="p-3">Used by</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => {
                const used = !!inv.usedBy;
                const expired =
                  inv.expiresAt && new Date(inv.expiresAt) < new Date();
                return (
                  <tr key={inv._id} className="border-t">
                    <td className="p-3 font-mono">
                      <button
                        type="button"
                        onClick={() => copy(inv.code)}
                        className="hover:underline"
                        title="Copy"
                      >
                        {inv.code}
                      </button>
                      {copied === inv.code && (
                        <span className="ml-2 text-green-700 text-xs">copied</span>
                      )}
                      {inv.note && (
                        <div className="text-xs text-gray-500 mt-0.5">{inv.note}</div>
                      )}
                    </td>
                    <td className="p-3">{inv.email || "—"}</td>
                    <td className="p-3 text-gray-500">{fmt(inv.createdAt)}</td>
                    <td className="p-3 text-gray-500">{inv.expiresAt ? fmt(inv.expiresAt) : "—"}</td>
                    <td className="p-3">
                      {used ? (
                        <span className="text-gray-600 text-xs">Used</span>
                      ) : expired ? (
                        <span className="text-red-700 text-xs">Expired</span>
                      ) : (
                        <span className="text-green-700 text-xs">Active</span>
                      )}
                    </td>
                    <td className="p-3">
                      {inv.usedBy ? `${inv.usedBy.name} (${inv.usedBy.email})` : "—"}
                    </td>
                    <td className="p-3">
                      {!used && (
                        <button
                          onClick={() => revoke(inv._id)}
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
