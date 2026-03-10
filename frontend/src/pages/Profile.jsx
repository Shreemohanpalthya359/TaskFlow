import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { todoAPI } from '../services/api';

const BADGES_META = {
  first_task:  { icon:'🌱', name:'First Step',  desc:'Complete your first task' },
  ten_tasks:   { icon:'⚡', name:'Momentum',    desc:'Complete 10 tasks' },
  fifty_tasks: { icon:'🏆', name:'Centurion',   desc:'Complete 50 tasks' },
  zen_master:  { icon:'🧘', name:'Zen Master',  desc:'10 Pomodoro sessions' },
  speed_demon: { icon:'🚀', name:'Speed Demon', desc:'5 tasks in one day' },
  level_5:     { icon:'⭐', name:'Rising Star', desc:'Reach Level 5' },
  level_10:    { icon:'👑', name:'Legend',      desc:'Reach Level 10' },
};

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = React.useState(null);

  React.useEffect(() => { todoAPI.getStats().then(setStats).catch(() => {}); }, []);

  const initials = user?.username ? user.username[0].toUpperCase() : 'U';
  const badges = stats?.badges || [];
  const karma = stats?.karma_points ?? 0;
  const level = stats?.level ?? 1;
  const xpPct = Math.min((karma % 100), 100);

  return (
    <div style={{ minHeight:'100vh', background:'#050811', display:'flex', position:'relative' }}>
      <div className="orb orb-indigo" style={{ width:600,height:600,top:'-15%',right:'-5%',opacity:0.1 }} />
      <Sidebar karma={karma} level={level} />

      <main style={{ flex:1, overflowY:'auto', padding:'2.5rem 2rem' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:800, color:'#6366f1', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'0.4rem' }}>👤 Profile</div>
          <h1 style={{ fontSize:'2.5rem', fontWeight:900, color:'#f1f5f9', letterSpacing:'-0.04em', marginBottom:'2rem' }}>Your Account</h1>

          {/* Avatar + Info card */}
          <div className="glass" style={{ borderRadius:'1.5rem', padding:'2rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'2rem' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', fontWeight:900, color:'#fff', flexShrink:0 }}>
              {initials}
            </div>
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:'1.5rem', fontWeight:900, color:'#f1f5f9', marginBottom:'0.25rem' }}>{user?.username || 'User'}</h2>
              <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
                <span style={{ fontSize:'0.875rem', color:'#64748b' }}>Level <strong style={{ color:'#6366f1' }}>{level}</strong></span>
                <span style={{ fontSize:'0.875rem', color:'#64748b' }}><strong style={{ color:'#f59e0b' }}>{karma}</strong> Karma XP</span>
                <span style={{ fontSize:'0.875rem', color:'#64748b' }}><strong style={{ color:'#10b981' }}>{stats?.completed ?? 0}</strong> Tasks Completed</span>
              </div>
              {/* XP bar */}
              <div style={{ marginTop:'0.875rem' }}>
                <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden', maxWidth:400 }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${xpPct}%` }} transition={{ duration:1 }}
                    style={{ height:'100%', background:'linear-gradient(90deg,#6366f1,#06b6d4)', borderRadius:99 }} />
                </div>
                <div style={{ fontSize:'0.7rem', color:'#475569', marginTop:'0.3rem' }}>{karma % 100}/100 XP to Level {level + 1}</div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
            {[
              { label:'Total Tasks',  value: stats?.total ?? 0,     icon:'📋', color:'#6366f1' },
              { label:'Completed',    value: stats?.completed ?? 0, icon:'✅', color:'#10b981' },
              { label:'Badges Earned',value: badges.length,          icon:'🏅', color:'#f59e0b' },
            ].map(s => (
              <motion.div key={s.label} whileHover={{ y:-3 }} className="glass" style={{ borderRadius:'1.25rem', padding:'1.25rem' }}>
                <div style={{ fontSize:'1.5rem', marginBottom:'0.4rem' }}>{s.icon}</div>
                <div style={{ fontSize:'2rem', fontWeight:900, color:s.color, letterSpacing:'-0.04em' }}>{s.value}</div>
                <div style={{ fontSize:'0.75rem', color:'#64748b', fontWeight:600 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Badges section */}
          <div className="glass" style={{ borderRadius:'1.5rem', padding:'1.5rem' }}>
            <h3 style={{ fontWeight:800, fontSize:'0.875rem', color:'#f1f5f9', marginBottom:'1.25rem' }}>🏅 Achievement Badges</h3>
            {Object.entries(BADGES_META).length === 0 ? null : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'0.875rem' }}>
                {Object.entries(BADGES_META).map(([key, b]) => {
                  const earned = badges.some(bd => bd.badge_key === key);
                  return (
                    <motion.div key={key} whileHover={{ scale:1.03 }}
                      style={{ borderRadius:'1rem', padding:'1rem', textAlign:'center',
                        background: earned ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${earned ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)'}`,
                        opacity: earned ? 1 : 0.4, filter: earned ? 'none' : 'grayscale(1)',
                      }}>
                      <div style={{ fontSize:'2rem', marginBottom:'0.4rem' }}>{b.icon}</div>
                      <div style={{ fontSize:'0.8rem', fontWeight:800, color:'#f1f5f9', marginBottom:'0.25rem' }}>{b.name}</div>
                      <div style={{ fontSize:'0.7rem', color:'#64748b' }}>{b.desc}</div>
                      {earned && <div style={{ fontSize:'0.65rem', color:'#10b981', fontWeight:700, marginTop:'0.4rem' }}>✓ Earned</div>}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
