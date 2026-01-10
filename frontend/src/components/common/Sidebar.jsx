import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <aside className="w-72 min-h-screen bg-white shadow-lg rounded-r-2xl p-6 hidden md:block animate__fade-in">
      <div className="flex items-center gap-3 mb-8">
        {user?.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
            {getInitials(user?.username)}
          </div>
        )}
        <div>
          <div className="font-semibold">User</div>
          <div className="text-xs text-gray-500">{user?.username || 'Guest'}</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2 text-sm text-gray-700">
        <Link to="/dashboard" className="px-3 py-2 rounded-lg hover:bg-gray-100">Dashboard</Link>
        <Link to="/customers" className="px-3 py-2 rounded-lg hover:bg-gray-100">Customers</Link>
        <Link to="/reports" className="px-3 py-2 rounded-lg hover:bg-gray-100">All reports</Link>
        <Link to="/export" className="px-3 py-2 rounded-lg hover:bg-gray-100">Export</Link>

        <div className="border-t mt-4 pt-4" />

        <Link to="/profile" className="px-3 py-2 rounded-lg hover:bg-gray-100">Profile</Link>
        <Link to="/settings" className="px-3 py-2 rounded-lg hover:bg-gray-100">Settings</Link>
        <button onClick={handleLogout} className="text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600">Log out</button>
      </nav>
    </aside>
  );
}
