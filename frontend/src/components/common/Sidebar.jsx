import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const NAV = [
  { to: '/dashboard', label: 'Dashboard',    icon: '⚡' },
  { to: '/reports',   label: 'Analytics',    icon: '📊' },
  { to: '/export',    label: 'Export',       icon: '📤' },
  { to: '/profile',   label: 'Profile',      icon: '👤' },
  { to: '/settings',  label: 'Settings',     icon: '⚙️' },
];

export default function Sidebar({ karma = 0, level = 1, streak = 0 }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.username ? user.username[0].toUpperCase() : 'U';
  const xpToNext = 100;
  const xpPct = Math.min((karma % 100) / xpToNext * 100, 100);

  return (
    <aside style={{
      width: '260px', minHeight: '100vh', flexShrink: 0,
      background: 'rgba(5,8,17,0.9)', backdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      padding: '1.75rem 1.25rem', gap: '0.5rem', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
        <div style={{
          width:38, height:38, borderRadius:'0.75rem',
          background:'linear-gradient(135deg,#6366f1,#4f46e5)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1.1rem', fontWeight:900, color:'#fff', boxShadow:'0 4px 20px rgba(99,102,241,0.4)'
        }}>⚡</div>
        <span style={{ fontWeight:900, fontSize:'1.25rem', letterSpacing:'-0.02em', color:'#f1f5f9' }}>TaskFlow</span>
      </div>

      {/* User card */}
      <div className="glass" style={{ borderRadius:'1.25rem', padding:'1rem', marginBottom:'1rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem' }}>
          <div style={{
            width:40, height:40, borderRadius:'50%',
            background:'linear-gradient(135deg,#6366f1,#06b6d4)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, fontSize:'1rem', color:'#fff', flexShrink:0
          }}>{initials}</div>
          <div>
            <div style={{ fontWeight:700, fontSize:'0.875rem', color:'#f1f5f9' }}>{user?.username || 'User'}</div>
            <div style={{ fontSize:'0.7rem', color:'#6366f1', fontWeight:600 }}>Level {level} · {karma} XP</div>
          </div>
        </div>
        {/* XP bar */}
        <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ height:'100%', background:'linear-gradient(90deg,#6366f1,#06b6d4)', borderRadius:99 }}
          />
        </div>
        <div style={{ fontSize:'0.65rem', color:'#475569', marginTop:'0.35rem', textAlign:'right' }}>
          {karma % 100}/{xpToNext} XP to Level {level + 1}
        </div>
        {streak > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.2)', padding:'0.4rem 0.6rem', borderRadius:'0.5rem', marginTop:'0.75rem', justifyContent:'center' }}>
            <span style={{ fontSize:'1rem' }}>🔥</span>
            <span style={{ fontSize:'0.75rem', fontWeight:700, color:'#f43f5e' }}>{streak} Day Streak</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:'0.25rem' }}>
        {NAV.map(({ to, label, icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} style={{ textDecoration:'none' }}>
              <motion.div
                whileHover={{ x: 4 }}
                style={{
                  display:'flex', alignItems:'center', gap:'0.75rem',
                  padding:'0.7rem 1rem', borderRadius:'0.875rem',
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                  color: active ? '#818cf8' : '#64748b',
                  fontWeight: active ? 700 : 500,
                  fontSize:'0.875rem', transition:'all 0.15s',
                  cursor:'pointer',
                }}
              >
                <span style={{ fontSize:'1rem' }}>{icon}</span>
                {label}
                {active && (
                  <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'#6366f1' }} />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        style={{
          width:'100%', padding:'0.7rem', borderRadius:'0.875rem',
          background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.2)',
          color:'#f43f5e', fontWeight:700, fontSize:'0.875rem', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem',
          marginTop:'auto',
        }}
      >
        <span>🚪</span> Logout
      </motion.button>
    </aside>
  );
}
