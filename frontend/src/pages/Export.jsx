import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import { todoAPI } from '../services/api';

const PRIORITY_COLORS = { Urgent:'#f43f5e', High:'#f59e0b', Medium:'#6366f1', Low:'#10b981' };

export default function Export() {
  const [tasks,         setTasks]         = useState([]);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [loading,       setLoading]       = useState(false);
  const [toast,         setToast]         = useState(null);

  useEffect(() => {
    todoAPI.getAllTasks().then(setTasks).catch(() => {});
  }, []);

  const toggleSelect = (id) => {
    const s = new Set(selectedTasks);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedTasks(s);
  };

  const selectAll = () =>
    setSelectedTasks(selectedTasks.size === tasks.length ? new Set() : new Set(tasks.map(t => t.id)));

  const exportPDF = async () => {
    setLoading(true);
    try {
      const blob = await todoAPI.exportPDF(Array.from(selectedTasks));
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'taskflow_report.pdf'; a.click();
      URL.revokeObjectURL(url);
      setToast('✅ PDF exported successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('❌ Failed to export PDF');
      setTimeout(() => setToast(null), 3000);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#050811', display:'flex', position:'relative' }}>
      <div className="orb orb-cyan" style={{ width:500,height:500,top:'-15%',right:'-5%',opacity:0.08 }} />

      <Sidebar />

      <main style={{ flex:1, overflowY:'auto', padding:'2.5rem 2rem' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ marginBottom:'2rem' }}>
            <div style={{ fontSize:'0.7rem', fontWeight:800, letterSpacing:'0.2em', color:'#6366f1', textTransform:'uppercase', marginBottom:'0.4rem' }}>📤 Export</div>
            <h1 style={{ fontSize:'2.5rem', fontWeight:900, color:'#f1f5f9', letterSpacing:'-0.04em' }}>Export Tasks</h1>
            <p style={{ fontSize:'0.9rem', color:'#64748b', marginTop:'0.5rem' }}>Select tasks to export as a PDF report.</p>
          </div>

          {/* Action bar */}
          <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={selectAll}
              style={{ padding:'0.65rem 1.25rem', borderRadius:'0.875rem', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8' }}>
              {selectedTasks.size === tasks.length ? 'Deselect All' : 'Select All'}
            </motion.button>
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={exportPDF}
              disabled={selectedTasks.size === 0 || loading}
              className="btn-primary"
              style={{ padding:'0.65rem 1.5rem', borderRadius:'0.875rem', fontSize:'0.85rem', opacity: (selectedTasks.size === 0 || loading) ? 0.5 : 1 }}>
              {loading ? 'Exporting…' : `📄 Export ${selectedTasks.size > 0 ? selectedTasks.size : ''} Task${selectedTasks.size !== 1 ? 's' : ''} as PDF`}
            </motion.button>
          </div>

          {/* Task list */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {tasks.length === 0 ? (
              <div style={{ textAlign:'center', padding:'4rem 2rem', color:'#334155' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>📋</div>
                <p style={{ fontWeight:700 }}>No tasks to export</p>
              </div>
            ) : tasks.map(task => (
              <motion.div key={task.id} whileHover={{ y:-1 }}
                onClick={() => toggleSelect(task.id)}
                className="glass"
                style={{ borderRadius:'1rem', padding:'1rem 1.25rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'1rem',
                  border: selectedTasks.has(task.id) ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  background: selectedTasks.has(task.id) ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)' }}>
                <div style={{ width:20, height:20, borderRadius:'0.375rem', flexShrink:0,
                  border: selectedTasks.has(task.id) ? '2px solid #6366f1' : '2px solid rgba(255,255,255,0.2)',
                  background: selectedTasks.has(task.id) ? '#6366f1' : 'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}>
                  {selectedTasks.has(task.id) && <span style={{ color:'#fff', fontSize:'0.7rem' }}>✓</span>}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:'0.875rem', color: task.completed ? '#475569' : '#f1f5f9', textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.title}
                  </div>
                  {task.description && <div style={{ fontSize:'0.75rem', color:'#64748b', marginTop:'0.2rem' }}>{task.description}</div>}
                </div>
                <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                  <span style={{ fontSize:'0.65rem', fontWeight:700, padding:'0.2rem 0.6rem', borderRadius:99, color: PRIORITY_COLORS[task.priority] || '#6366f1', background:'rgba(255,255,255,0.06)' }}>
                    {task.priority}
                  </span>
                  <span style={{ fontSize:'0.65rem', color:'#475569' }}>{task.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:'2rem', left:'50%', transform:'translateX(-50%)',
          background:'rgba(5,8,17,0.95)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)',
          padding:'0.875rem 2rem', borderRadius:99, color:'#f1f5f9', fontWeight:700, fontSize:'0.875rem', zIndex:100 }}>
          {toast}
        </div>
      )}
    </div>
  );
}