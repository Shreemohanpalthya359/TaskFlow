import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { todoAPI, extraAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ACTIONS = [
  { id: 'add',       icon: '✨', label: 'Add new task',    hint: 'Type your task then press Enter' },
  { id: 'zen',       icon: '🧘', label: 'Open Zen Mode',   hint: 'Focus timer' },
  { id: 'board',     icon: '🗂', label: 'Switch to Board', hint: 'Kanban view' },
  { id: 'calendar',  icon: '📅', label: 'Calendar view',   hint: 'Weekly planner' },
  { id: 'reports',   icon: '📊', label: 'Go to Reports',   hint: 'Analytics' },
  { id: 'profile',   icon: '👤', label: 'Go to Profile',   hint: 'Badges & XP' },
];

export default function CommandPalette({ onClose, onAction }) {
  const [query,   setQuery]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const filtered = query.trim()
    ? ACTIONS.filter(a => a.label.toLowerCase().includes(query.toLowerCase()))
    : ACTIONS;

  const handleAction = async (id) => {
    if (id === 'add' && query.trim()) {
      setLoading(true);
      try { await todoAPI.createTask(query.trim()); onAction('refresh'); }
      catch {}
      setLoading(false);
      onClose();
      return;
    }
    if (id === 'reports')  { navigate('/reports');  onClose(); return; }
    if (id === 'profile')  { navigate('/profile');  onClose(); return; }
    onAction(id);
    onClose();
  };

  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', zIndex:500, display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:'12vh' }}>
        <motion.div initial={{ opacity:0, y:-20, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-20 }}
          onClick={e => e.stopPropagation()}
          style={{ width:'100%', maxWidth:560, background:'rgba(5,8,17,0.95)', backdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'1.5rem', overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.7)' }}>

          {/* Search input */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'1rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize:'1.1rem', opacity:0.5 }}>⌨️</span>
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && filtered.length > 0) handleAction(filtered[0].id); }}
              placeholder="Search actions or type a task to add…"
              style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:'1rem', color:'#f1f5f9', fontFamily:'Inter,sans-serif' }} />
            <span style={{ fontSize:'0.7rem', padding:'0.2rem 0.5rem', background:'rgba(255,255,255,0.06)', borderRadius:'0.4rem', color:'#475569' }}>ESC</span>
          </div>

          {/* Results */}
          <div style={{ padding:'0.5rem', maxHeight:340, overflowY:'auto' }}>
            {filtered.length === 0 && query ? (
              <div style={{ padding:'1rem', textAlign:'center', color:'#334155', fontSize:'0.875rem' }}>
                Press Enter to create task: "<strong style={{ color:'#818cf8' }}>{query}</strong>"
              </div>
            ) : filtered.map((a, i) => (
              <motion.button key={a.id} whileHover={{ x:4 }}
                onClick={() => handleAction(a.id)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:'0.875rem', padding:'0.75rem 0.875rem', borderRadius:'0.875rem', background:'transparent', border:'none', cursor:'pointer', textAlign:'left', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(99,102,241,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <span style={{ width:32, height:32, borderRadius:'0.625rem', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{a.icon}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#f1f5f9' }}>{a.label}</div>
                  <div style={{ fontSize:'0.72rem', color:'#475569' }}>{a.hint}</div>
                </div>
                <div style={{ marginLeft:'auto', fontSize:'0.65rem', color:'#334155', padding:'0.15rem 0.4rem', background:'rgba(255,255,255,0.04)', borderRadius:'0.35rem' }}>↵</div>
              </motion.button>
            ))}
          </div>

          <div style={{ padding:'0.75rem 1.25rem', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:'1.5rem' }}>
            {[['↑↓','navigate'],['↵','select'],['ESC','close']].map(([k,l]) => (
              <span key={k} style={{ fontSize:'0.7rem', color:'#334155' }}>
                <span style={{ background:'rgba(255,255,255,0.06)', padding:'0.1rem 0.4rem', borderRadius:'0.3rem', marginRight:'0.35rem', color:'#64748b' }}>{k}</span>{l}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
