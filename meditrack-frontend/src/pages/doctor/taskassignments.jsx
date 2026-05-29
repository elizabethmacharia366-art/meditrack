import React, { useEffect, useState } from 'react';
import { getAssignableStaff, getTasks, createTask } from '../../service/api';
import WelcomeBanner from '../../components/welcomebanner';

export default function TaskAssignments() {
  const [staff, setStaff] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    department: '',
    ward: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [staffRes, tasksRes] = await Promise.all([getAssignableStaff(), getTasks()]);
      setStaff(staffRes.data);
      setTasks(tasksRes.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load task data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!form.title || !form.assignedTo) {
      setError('Task title and assignee are required.');
      return;
    }

    try {
      setSaving(true);
      await createTask(form);
      setMessage('Task assigned successfully.');
      setForm({ title: '', description: '', assignedTo: '', department: '', ward: '' });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to assign task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <WelcomeBanner subtitle="Assign nursing and technical work directly from your doctor workspace." />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Assignment</h1>
            <p className="text-gray-600 mt-1">
              Send work orders to nurses and technicians, and review tasks you have assigned.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Create a new task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Task title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2"
                  placeholder="Example: Review post-op vitals"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Assignee</label>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2"
                >
                  <option value="">Select nurse or technician</option>
                  {staff.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.role}) {user.department ? `- ${user.department}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Department</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2"
                  placeholder="Cardiology, Radiology, ICU"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Ward</label>
                <input
                  name="ward"
                  value={form.ward}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2"
                  placeholder="Ward 4A, ICU, ER"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Task details</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2"
                  placeholder="Describe the task and any important notes."
                />
              </div>
              {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
              {message && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">{message}</div>}
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-70"
              >
                {saving ? 'Assigning…' : 'Assign task'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Tasks assigned by you</h2>
            {loading ? (
              <p className="text-slate-500">Loading tasks…</p>
            ) : tasks.length === 0 ? (
              <p className="text-slate-600">No tasks assigned yet.</p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task._id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">{task.title}</h3>
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                        {task.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{task.description || 'No additional instructions.'}</p>
                    <div className="mt-3 text-sm text-slate-600">
                      Assigned to {task.assignedTo?.name} ({task.assignedRole})
                      {task.department ? ` · ${task.department}` : ''}
                      {task.ward ? ` · ${task.ward}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
