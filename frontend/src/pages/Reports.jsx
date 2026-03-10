import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import { todoAPI, extraAPI } from '../services/api';
import HeatmapChart from '../components/dashboard/HeatmapChart';

const BAR_COLORS = {
  'To-Do': '#64748b', 'In Progress': '#6366f1', 'Done': '#10b981',
  'Urgent': '#f43f5e', 'High': '#f59e0b', 'Medium': '#6366f1', 'Low': '#10b981',
};

function StatBar({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ marginBottom:'0.875rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.35rem' }}>
        <span style={{ fontSize:'0.8rem', fontWeight:600, color:'#94a3b8' }}>{label}</span>
        <span style={{ fontSize:'0.8rem', fontWeight:700, color }}>{count}</span>
      </div>
      <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
        <motion.div
          initial={{ width:0 }}
          animate={{ width:`${pct}%` }}
          transition={{ duration:0.8, ease:'easeOut' }}
          style={{ height:'100%', background:color, borderRadius:99 }}
        />
      </div>
    </div>
  );
}

export default function Reports() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [heatmap, setHeatmap] = useState([]);
  const [streak,  setStreak]  = useState(0);

  useEffect(() => {
    Promise.all([
      todoAPI.getStats().then(setStats).catch(()=>{}),
      extraAPI.getHeatmap().then(setHeatmap).catch(()=>{}),
      extraAPI.getStreak().then(d => setStreak(d.streak || 0)).catch(()=>{})
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#050811' }}>
      <div className="spinner" />
    </div>
  );

  const byStatus   = stats?.by_status   || [];
  const byPriority = stats?.by_priority || [];
  const byCategory = stats?.by_category || [];
  const total      = stats?.total ?? 0;
  const completed  = stats?.completed ?? 0;
  const rate       = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ minHeight:'100vh', background:'#050811', display:'flex', position:'relative' }}>
      <div className="orb orb-indigo" style={{ width:600,height:600,top:'-15%',right:'-5%',opacity:0.1 }} />

      <Sidebar karma={stats?.karma_points ?? 0} level={stats?.level ?? 1} />

      <main style={{ flex:1, overflowY:'auto', padding:'2.5rem 2rem' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ marginBottom:'2rem' }}>
            <div style={{ fontSize:'0.7rem', fontWeight:800, letterSpacing:'0.2em', color:'#6366f1', textTransform:'uppercase', marginBottom:'0.4rem' }}>
              📊 Personal Analytics
            </div>
            <h1 style={{ fontSize:'2.5rem', fontWeight:900, color:'#f1f5f9', letterSpacing:'-0.04em' }}>
              Your Productivity Report
            </h1>
          </div>

          {/* Hero stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem' }}>
            {[
              { label:'Total Tasks',   value:total,     color:'#6366f1', icon:'📋' },
              { label:'Completed',     value:completed, color:'#10b981', icon:'✅' },
              { label:'Completion %',  value:`${rate}%`,color:'#f59e0b', icon:'🎯' },
              { label:'Current Streak',value:`${streak}d`,color:'#f43f5e', icon:'🔥' },
            ].map(s => (
              <motion.div key={s.label} whileHover={{ y:-3 }} className="glass" style={{ borderRadius:'1.5rem', padding:'1.5rem' }}>
                <div style={{ fontSize:'1.5rem', marginBottom:'0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize:'2rem', fontWeight:900, color:s.color, letterSpacing:'-0.04em' }}>{s.value}</div>
                <div style={{ fontSize:'0.8rem', fontWeight:600, color:'#64748b', marginTop:'0.25rem' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="glass" style={{ borderRadius:'1.5rem', padding:'1.5rem 2rem', marginBottom:'2rem' }}>
            <h3 style={{ fontWeight:800, fontSize:'1.1rem', color:'#f1f5f9', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <span>🗓</span> Productivity Heatmap
            </h3>
            <HeatmapChart data={heatmap} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem' }}>
            {/* By Status */}
            <div className="glass" style={{ borderRadius:'1.5rem', padding:'1.5rem' }}>
              <h3 style={{ fontWeight:800, fontSize:'0.875rem', color:'#f1f5f9', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                📌 By Status
              </h3>
              {byStatus.map(r => (
                <StatBar key={r.status} label={r.status} count={r.count} total={total} color={BAR_COLORS[r.status] || '#6366f1'} />
              ))}
            </div>

            {/* By Priority */}
            <div className="glass" style={{ borderRadius:'1.5rem', padding:'1.5rem' }}>
              <h3 style={{ fontWeight:800, fontSize:'0.875rem', color:'#f1f5f9', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                🔥 By Priority
              </h3>
              {byPriority.map(r => (
                <StatBar key={r.priority} label={r.priority} count={r.count} total={total} color={BAR_COLORS[r.priority] || '#6366f1'} />
              ))}
            </div>

            {/* By Category */}
            <div className="glass" style={{ borderRadius:'1.5rem', padding:'1.5rem' }}>
              <h3 style={{ fontWeight:800, fontSize:'0.875rem', color:'#f1f5f9', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                🏷 By Category
              </h3>
              {byCategory.map(r => (
                <StatBar key={r.category} label={r.category} count={r.count} total={total} color="#6366f1" />
              ))}
            </div>
          </div>

          {/* XP card */}
          <div className="glass" style={{ borderRadius:'1.5rem', padding:'1.5rem', marginTop:'1.25rem', display:'flex', alignItems:'center', gap:'1.5rem' }}>
            <div style={{ fontSize:'3rem' }}>🏆</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                <span style={{ fontWeight:800, color:'#f1f5f9' }}>Karma XP · Level {stats?.level ?? 1}</span>
                <span style={{ fontWeight:700, color:'#06b6d4' }}>{stats?.karma_points ?? 0} XP</span>
              </div>
              <div style={{ height:8, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
                <motion.div
                  initial={{ width:0 }}
                  animate={{ width:`${Math.min(((stats?.karma_points ?? 0) % 100),100)}%` }}
                  transition={{ duration:1 }}
                  style={{ height:'100%', background:'linear-gradient(90deg,#6366f1,#06b6d4)', borderRadius:99 }}
                />
              </div>
              <p style={{ fontSize:'0.75rem', color:'#64748b', marginTop:'0.35rem' }}>
                Complete tasks to earn XP and level up
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}