import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTasks, updateTask, addTaskNote } from "../../service/api";
import WelcomeBanner from "../../components/welcomebanner";

export default function NurseTasks() {
  const [tasks, setTasks] = useState([]);
  const [taskNotes, setTaskNotes] = useState({});
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState("");
  const [taskActionLoading, setTaskActionLoading] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setTaskLoading(true);
        const { data } = await getTasks();
        setTasks(Array.isArray(data) ? data : []);
        setTaskError("");
      } catch (err) {
        setTasks([]);
        setTaskError(err.response?.data?.error || "Unable to load assigned tasks.");
      } finally {
        setTaskLoading(false);
      }
    };

    loadTasks();
  }, []);

  const updateTaskStatus = async (taskId, status) => {
    try {
      setTaskActionLoading(true);
      const normalizedStatus = status;
      const { data } = await updateTask(taskId, { status: normalizedStatus });
      setTasks((prev) => prev.map((task) => (task._id === taskId ? data : task)));
      setTaskError("");
    } catch (err) {
      setTaskError(err.response?.data?.error || "Unable to update task status.");
    } finally {
      setTaskActionLoading(false);
    }
  };

  const handleNoteChange = (taskId, value) => {
    setTaskNotes((prev) => ({ ...prev, [taskId]: value }));
  };

  const submitNote = async (taskId) => {
    const note = taskNotes[taskId]?.trim();
    if (!note) return;

    try {
      setTaskActionLoading(true);
      const { data } = await addTaskNote(taskId, { message: note });
      setTasks((prev) => prev.map((task) => (task._id === taskId ? data : task)));
      setTaskNotes((prev) => ({ ...prev, [taskId]: "" }));
      setTaskError("");
    } catch (err) {
      setTaskError(err.response?.data?.error || "Unable to save task note.");
    } finally {
      setTaskActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <WelcomeBanner subtitle="View doctor-created tasks, update progress, and leave notes for physician review." />

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Assigned Tasks</h1>
            <p className="mt-2 text-slate-600">See all tasks created by doctors and update status as you work.</p>
          </div>
          <Link to="/nurse" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Back to nurse dashboard
          </Link>
        </div>

        <div className="mt-8 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          {taskLoading ? (
            <p className="text-slate-500">Loading tasks…</p>
          ) : taskError ? (
            <p className="text-red-600">{taskError}</p>
          ) : tasks.length === 0 ? (
            <p className="text-slate-600">No assigned tasks yet.</p>
          ) : (
            <div className="space-y-5">
              {tasks.map((task) => (
                <div key={task._id} className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-xl font-semibold text-slate-900">{task.title}</div>
                      <p className="mt-2 text-slate-600">{task.description || "No additional instructions."}</p>
                      <p className="mt-2 text-sm text-slate-600">Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : "N/A"}</p>
                      <p className="mt-1 text-sm text-slate-600">Assigned by {task.createdBy?.name || "Doctor"}</p>
                    </div>
                    <div className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">{task.status}</div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateTaskStatus(task._id, "pending")}
                      className="rounded-full bg-slate-200 px-3 py-1 text-slate-800 hover:bg-slate-300"
                    >
                      pending
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTaskStatus(task._id, "in-progress")}
                      className="rounded-full bg-amber-200 px-3 py-1 text-slate-900 hover:bg-amber-300"
                    >
                      in-progress
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTaskStatus(task._id, "completed")}
                      className="rounded-full bg-emerald-200 px-3 py-1 text-emerald-900 hover:bg-emerald-300"
                    >
                      completed
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <textarea
                      value={taskNotes[task._id] || ""}
                      onChange={(e) => handleNoteChange(task._id, e.target.value)}
                      rows={3}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                      placeholder="Leave a note for the doctor"
                    />
                    <button
                      type="button"
                      onClick={() => submitNote(task._id)}
                      className="rounded-2xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
                    >
                      Add note
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
