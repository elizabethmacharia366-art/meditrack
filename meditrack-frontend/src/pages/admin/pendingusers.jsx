import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  adminListUsers,
  adminApproveUser,
  adminRejectUser,
} from "../../service/api";

const fmt = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "—" : dt.toLocaleString();
};

export default function PendingUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("pending");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await adminListUsers({ status: tab });
      setUsers(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const approve = async (id) => {
    try {
      setBusyId(id);
      await adminApproveUser(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to approve user");
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id) => {
    const reason = window.prompt("Reason for rejection (optional):") ?? "";
    if (reason === null) return;
    try {
      setBusyId(id);
      await adminRejectUser(id, reason);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reject user");
    } finally {
      setBusyId(null);
    }
  };

  const counts = useMemo(() => ({ count: users.length }), [users]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">User Approvals</h1>
          <p className="text-gray-600 text-sm">
            Review patient, doctor, and hospital accounts before granting system access.
          </p>
        </div>
        <Link to="/admin" className="text-blue-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {["pending", "approved", "rejected"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "px-3 py-1.5 rounded-lg text-sm font-medium border capitalize " +
              (tab === t
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
            }
          >
            {t}
            {tab === t && counts.count != null ? ` (${counts.count})` : ""}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : users.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
          No users in this state.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 text-gray-700">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3 text-gray-500">{fmt(u.createdAt)}</td>
                  <td className="p-3 space-x-2">
                    {tab !== "approved" && (
                      <button
                        disabled={busyId === u.id}
                        onClick={() => approve(u.id)}
                        className="text-green-700 hover:underline disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}
                    {tab !== "rejected" && (
                      <button
                        disabled={busyId === u.id}
                        onClick={() => reject(u.id)}
                        className="text-red-700 hover:underline disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
