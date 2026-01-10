import React, { useState, useContext } from 'react';
import Sidebar from '../components/common/Sidebar';
import { AuthContext } from '../context/AuthContext';
import '../styles/animations.css';

export default function Settings(){
  const { user, updateProfile } = useContext(AuthContext);
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    setLoading(true);
    try {
      await updateProfile(avatar);
      alert('Avatar updated successfully');
    } catch (err) {
      alert('Failed to update avatar');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex gap-6">
        <Sidebar />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate__fade-in">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-gray-600">Application and account settings will appear here.</p>
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Profile Avatar</h3>
                <div className="flex items-center gap-4">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleAvatarChange} />
                  <button onClick={handleSaveAvatar} disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    {loading ? 'Saving...' : 'Save Avatar'}
                  </button>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">Notification preferences</div>
              <div className="p-4 bg-gray-50 rounded-lg">Theme & display</div>
              <div className="p-4 bg-gray-50 rounded-lg">Security</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
