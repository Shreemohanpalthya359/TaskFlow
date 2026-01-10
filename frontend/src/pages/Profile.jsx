import React from 'react';
import Sidebar from '../components/common/Sidebar';
import '../styles/animations.css';

export default function Profile(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex gap-6">
        <Sidebar />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate__fade-in">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p className="text-gray-600">This is a simple profile page. Add fields as needed.</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">Name: Gustavo Xavier</div>
              <div className="p-4 bg-gray-50 rounded-lg">Email: gustavo@example.com</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
