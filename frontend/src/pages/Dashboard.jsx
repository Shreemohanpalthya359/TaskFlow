import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import "../styles/animations.css";
import { todoAPI, customerAPI } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================================
     Auth Guard + Initial Load
  ================================ */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  /* ================================
     Data Loaders
  ================================ */
  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchTasks(), loadCustomers()]);
      setError(null);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const data = await todoAPI.getAllTasks();
    setTasks(data);
  }, []);

  const loadCustomers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const data = await customerAPI.list();
    setCustomers(data);
  };

  /* ================================
     Task Actions
  ================================ */
  const addTask = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedCustomer) return;

    try {
      await todoAPI.createTask(input, "", selectedCustomer);
      setInput("");
      setSelectedCustomer("");
      await fetchTasks();
    } catch {
      setError("Failed to add task");
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await todoAPI.updateTask(id, !completed);
      await fetchTasks();
    } catch {
      setError("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await todoAPI.deleteTask(id);
      await fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  /* ================================
     Editing
  ================================ */
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = (id) => {
    if (!editValue.trim()) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, title: editValue } : t
      )
    );

    setEditingId(null);
    setEditValue("");
  };

  /* ================================
     UI
  ================================ */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex gap-6">
        <Sidebar />

        <main className="flex-1 max-w-5xl mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex justify-between">
              <span className="text-red-800">{error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          <h1 className="text-4xl font-bold mb-6">My Tasks</h1>

          {/* Add Task */}
          <form
            onSubmit={addTask}
            className="bg-white p-6 rounded-2xl mb-6 grid md:grid-cols-4 gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add task..."
              className="md:col-span-2 border rounded-xl px-4 py-3"
            />

            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="border rounded-xl px-3 py-2"
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-indigo-600 text-white rounded-xl px-6"
            >
              Add Task
            </button>
          </form>

          {/* Task List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-start"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id, task.completed)}
                />

                <div className="flex-1">
                  {editingId === task.id ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(task.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && saveEdit(task.id)
                      }
                      autoFocus
                      className="w-full border px-2 py-1"
                    />
                  ) : (
                    <h3
                      onDoubleClick={() =>
                        startEdit(task.id, task.title)
                      }
                      className={`font-semibold ${
                        task.completed
                          ? "line-through text-gray-400"
                          : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                  )}
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
