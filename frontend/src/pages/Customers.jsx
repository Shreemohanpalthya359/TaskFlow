import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from '../components/common/Sidebar';
import { customerAPI, todoAPI } from '../services/api';
import '../styles/animations.css';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState([]);
  const [priority, setPriority] = useState("medium");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await customerAPI.list();
      setCustomers(data);
    } catch (err) {
      alert('Failed to load customers');
    }
  };

  const addCustomer = async () => {
    if (!newCustomerName.trim()) return;
    try {
      await customerAPI.create(newCustomerName);
      setNewCustomerName('');
      loadCustomers();
    } catch (err) {
      alert('Failed to add customer');
    }
  };

  const selectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    try {
      const data = await todoAPI.getTasksByCustomer(customer.id);
      setTasks(data);
    } catch (err) {
      alert('Failed to load tasks');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !selectedCustomer) return;
    try {
      await todoAPI.createTask(newTask.title, newTask.description, selectedCustomer.id);
      setNewTask({ title: '', description: '' });
      setPriority("medium");
      selectCustomer(selectedCustomer); // reload tasks
    } catch (err) {
      alert('Failed to add task');
    }
  };

  const toggleTask = async (taskId, completed) => {
    try {
      await todoAPI.updateTask(taskId, completed);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed } : t));
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await todoAPI.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const saveEdit = async () => {
    // For simplicity, not implementing full edit, just title
    // In real app, would need backend support for updating title/description
    setEditingId(null);
    setEditValue("");
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      if (filter === "pending") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });

    if (search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    filtered.sort((a, b) => {
      if (sort === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sort === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    });

    return filtered;
  }, [tasks, filter, search, sort]);

  const toggleSelect = (taskId) => {
    setSelected(selected.includes(taskId) ? selected.filter(id => id !== taskId) : [...selected, taskId]);
  };

  const selectAll = () => {
    setSelected(selected.length === filteredAndSortedTasks.length ? [] : filteredAndSortedTasks.map(t => t.id));
  };

  const bulkDelete = async () => {
    if (!selected.length) return;
    try {
      await Promise.all(selected.map(id => todoAPI.deleteTask(id)));
      setTasks(tasks.filter(t => !selected.includes(t.id)));
      setSelected([]);
    } catch (err) {
      alert('Failed to delete selected tasks');
    }
  };

  const bulkMarkComplete = async () => {
    try {
      await Promise.all(selected.map(id => todoAPI.updateTask(id, true)));
      setTasks(tasks.map(t => selected.includes(t.id) ? { ...t, completed: true } : t));
      setSelected([]);
    } catch (err) {
      alert('Failed to update tasks');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex gap-6">
        <Sidebar />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate__fade-in">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Customers</h2>

            {/* Add Customer */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Customer name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button onClick={addCustomer} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Add Customer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer List */}
              <div className="md:col-span-1">
                <h3 className="text-lg font-semibold mb-2">Customers</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {customers.map(customer => (
                    <div
                      key={customer.id}
                      onClick={() => selectCustomer(customer)}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedCustomer?.id === customer.id ? 'bg-blue-50 border-blue-300' : ''
                      }`}
                    >
                      {customer.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks for Selected Customer */}
              {selectedCustomer && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">Tasks for {selectedCustomer.name}</h3>

                  {/* Add Task Form */}
                  <form onSubmit={addTask} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <input
                        type="text"
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="md:col-span-2 px-3 py-2 border rounded-lg"
                        required
                      />
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="px-3 py-2 border rounded-lg"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg">
                        Add Task
                      </button>
                    </div>
                    <textarea
                      placeholder="Description (optional)"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg mt-2"
                      rows="2"
                    />
                  </form>

                  {/* Filters and Search */}
                  <div className="flex flex-wrap gap-2 items-center mb-4">
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 border rounded-lg">
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 border rounded-lg">
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="alphabetical">Alphabetical</option>
                    </select>
                  </div>

                  {/* Bulk Actions */}
                  {selected.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      <button onClick={bulkMarkComplete} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                        Mark Selected Complete
                      </button>
                      <button onClick={bulkDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                        Delete Selected
                      </button>
                    </div>
                  )}

                  {/* Task List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selected.length === filteredAndSortedTasks.length && filteredAndSortedTasks.length > 0}
                        onChange={selectAll}
                      />
                      <span>Select All</span>
                    </div>
                    {filteredAndSortedTasks.map(task => (
                      <div key={task.id} className="p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selected.includes(task.id)}
                            onChange={() => toggleSelect(task.id)}
                          />
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => toggleTask(task.id, e.target.checked)}
                          />
                          {editingId === task.id ? (
                            <input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={saveEdit}
                              onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                              className="flex-1 px-2 py-1 border rounded"
                              autoFocus
                            />
                          ) : (
                            <span
                              className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''} cursor-pointer`}
                              onClick={() => startEdit(task)}
                            >
                              {task.title}
                            </span>
                          )}
                          <button onClick={() => deleteTask(task.id)} className="px-2 py-1 bg-red-500 text-white rounded">
                            Delete
                          </button>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1 ml-8">{task.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}