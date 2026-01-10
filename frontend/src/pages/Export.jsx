import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { todoAPI } from '../services/api';
import '../styles/animations.css';

export default function Export() {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await todoAPI.getAllTasks();
      setTasks(data);
    } catch (err) {
      alert('Failed to load tasks');
    }
  };

  const toggleSelect = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const selectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map(t => t.id)));
    }
  };

  const exportPDF = async () => {
    setLoading(true);
    try {
      const blob = await todoAPI.exportPDF(Array.from(selectedTasks));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tasks_report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export PDF');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex gap-6">
        <Sidebar />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate__fade-in">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Export Tasks</h2>
            <p className="text-gray-600 mb-6">Select tasks to export as PDF report.</p>

            <div className="mb-4 flex gap-2">
              <button onClick={selectAll} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                {selectedTasks.size === tasks.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={exportPDF}
                disabled={selectedTasks.size === 0 || loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? 'Exporting...' : 'Export Selected as PDF'}
              </button>
            </div>

            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedTasks.has(task.id)}
                      onChange={() => toggleSelect(task.id)}
                    />
                    <span className={task.completed ? 'line-through text-gray-500' : ''}>
                      {task.title}
                    </span>
                    <span className="text-sm text-gray-500">({task.customer_name})</span>
                  </div>
                  {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}