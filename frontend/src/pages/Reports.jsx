import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { customerAPI } from '../services/api';
import '../styles/animations.css';

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await customerAPI.reports();
      setReports(data);
    } catch (err) {
      alert('Failed to load reports');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex gap-6">
        <Sidebar />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate__fade-in">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">All Reports</h2>
            <p className="text-gray-600 mb-6">Task completion reports for each customer.</p>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Total Tasks</th>
                    <th className="px-4 py-2 text-left">Completed Tasks</th>
                    <th className="px-4 py-2 text-left">Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{report.name}</td>
                      <td className="px-4 py-2">{report.total_tasks}</td>
                      <td className="px-4 py-2">{report.completed_tasks}</td>
                      <td className="px-4 py-2">
                        {report.total_tasks > 0
                          ? `${Math.round((report.completed_tasks / report.total_tasks) * 100)}%`
                          : '0%'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}