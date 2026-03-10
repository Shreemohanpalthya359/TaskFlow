import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import { AuthContext } from '../context/AuthContext';

const SECTIONS = [
  { key:'account',  label:'Account',       icon:'👤' },
  { key:'display',  label:'Display',        icon:'🎨' },
  { key:'security', label:'Security',       icon:'🔒' },
];

export default function Settings() {
  const { user, updateProfile } = useContext(AuthContext);
  const [active, setActive]   = useState('account');
  const [avatar, setAvatar]   = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveAvatar = async () => {
    setLoading(true);
    try { await updateProfile(avatar); showToast('✅ Avatar updated!'); }
    catch { showToast('❌ Failed to update', false); }
    setLoading(false);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#050811', display:'flex', position:'relative' }}>
      <div className="orb orb-cyan" style={{ width:500,height:500,top:'-10%',right:'-5%',opacity:0.07 }} />
      <Sidebar />

      <main style={{ flex:1, overflowY:'auto', padding:'2.5rem 2rem' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:800, color:'#6366f1', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.4rem' }}>⚙️ Settings</div>
          <h1 style={{ fontSize:'2.5rem', fontWeight:900, color:'#f1f5f9', letterSpacing:'-0.04em', marginBottom:'2rem' }}>Settings</h1>

          <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:'1.5rem', alignItems:'start' }}>
            {/* Sidebar nav */}
            <div className="glass" style={{ borderRadius:'1.25rem', padding:'0.5rem' }}>
              {SECTIONS.map(s => (
                <button key={s.key} onClick={() => setActive(s.key)}
                  style={{ width:'100%', padding:'0.7rem 1rem', borderRadius:'0.875rem', textAlign:'left', display:'flex', alignItems:'center', gap:'0.6rem',
                    background: active === s.key ? 'rgba(99,102,241,0.15)' : 'transparent',
                    border: active === s.key ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                    color: active === s.key ? '#818cf8' : '#64748b', fontWeight: active === s.key ? 700 : 500,
                    fontSize:'0.875rem', cursor:'pointer', marginBottom:'0.15rem',
                  }}>
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>

            {/* Panel */}
            <div className="glass" style={{ borderRadius:'1.5rem', padding:'1.75rem' }}>
              {active === 'account' && (
                <div>
                  <h3 style={{ fontWeight:800, fontSize:'1rem', color:'#f1f5f9', marginBottom:'1.25rem' }}>Account Settings</h3>

                  {/* Current user info */}
                  <div style={{ marginBottom:'1.5rem', padding:'1rem', borderRadius:'1rem', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize:'0.75rem', color:'#64748b', marginBottom:'0.25rem' }}>Username</div>
                    <div style={{ fontWeight:700, color:'#f1f5f9' }}>{user?.username || '—'}</div>
                  </div>

                  {/* Avatar upload */}
                  <div>
                    <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.75rem' }}>Profile Avatar</div>
                    <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
                      <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0, overflow:'hidden' }}>
                        {avatar ? <img src={avatar} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : (user?.username?.[0]?.toUpperCase() || '⚡')}
                      </div>
                      <label style={{ padding:'0.6rem 1.25rem', borderRadius:'0.875rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>
                        📁 Choose Image
                        <input type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
                      </label>
                      <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={handleSaveAvatar} disabled={loading}
                        className="btn-primary" style={{ padding:'0.6rem 1.25rem', borderRadius:'0.875rem', fontSize:'0.8rem', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Saving…' : 'Save Avatar'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {active === 'display' && (
                <div>
                  <h3 style={{ fontWeight:800, fontSize:'1rem', color:'#f1f5f9', marginBottom:'1.25rem' }}>Display</h3>
                  {[
                    { label:'Theme', value:'Deep Space (Dark)', icon:'🌌' },
                    { label:'Language', value:'English', icon:'🌐' },
                    { label:'Date Format', value:'DD/MM/YYYY', icon:'📅' },
                  ].map(row => (
                    <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem', borderRadius:'1rem', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', marginBottom:'0.75rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                        <span>{row.icon}</span>
                        <span style={{ fontWeight:600, color:'#94a3b8', fontSize:'0.875rem' }}>{row.label}</span>
                      </div>
                      <span style={{ fontWeight:700, color:'#f1f5f9', fontSize:'0.875rem' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {active === 'security' && (
                <div>
                  <h3 style={{ fontWeight:800, fontSize:'1rem', color:'#f1f5f9', marginBottom:'1.25rem' }}>Security</h3>
                  {[
                    { label:'Two-Factor Auth', status:'Not configured', icon:'🔐', color:'#f59e0b' },
                    { label:'Active Sessions', status:'1 session', icon:'💻', color:'#10b981' },
                    { label:'Last Login', status:'Just now', icon:'🕐', color:'#6366f1' },
                  ].map(row => (
                    <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem', borderRadius:'1rem', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', marginBottom:'0.75rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                        <span>{row.icon}</span>
                        <span style={{ fontWeight:600, color:'#94a3b8', fontSize:'0.875rem' }}>{row.label}</span>
                      </div>
                      <span style={{ fontWeight:700, color:row.color, fontSize:'0.8rem' }}>{row.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:40 }}
            style={{ position:'fixed', bottom:'2rem', left:'50%', transform:'translateX(-50%)',
              background: toast.ok ? 'rgba(16,185,129,0.9)' : 'rgba(244,63,94,0.9)',
              backdropFilter:'blur(20px)', padding:'0.875rem 2rem', borderRadius:99, color:'#fff',
              fontWeight:700, fontSize:'0.875rem', zIndex:100, boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
