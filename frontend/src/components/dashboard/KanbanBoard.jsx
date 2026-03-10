import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';

const COLUMNS = [
  { key: 'To-Do',       label: '◯ To-Do',       color: '#64748b', glow: 'rgba(100,116,139,0.1)' },
  { key: 'In Progress', label: '◑ In Progress',  color: '#6366f1', glow: 'rgba(99,102,241,0.1)'  },
  { key: 'Done',        label: '● Done',          color: '#10b981', glow: 'rgba(16,185,129,0.1)'  },
];

export default function KanbanBoard({ tasks, onToggle, onDelete, onStatusChange }) {
  const getByStatus = (s) => tasks.filter(t => t.status === s);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem', alignItems:'start' }}>
      {COLUMNS.map(({ key, label, color, glow }) => (
        <div
          key={key}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            const id = e.dataTransfer.getData('taskId');
            if (id) onStatusChange(parseInt(id), key);
          }}
          style={{
            minHeight: 480,
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '1.5rem',
            padding: '1.25rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
            boxShadow: `inset 0 0 60px ${glow}`,
          }}
        >
          {/* Column header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.5rem' }}>
            <span style={{ fontWeight:800, fontSize:'0.8rem', color, letterSpacing:'0.08em', textTransform:'uppercase' }}>
              {label}
            </span>
            <span style={{
              fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.65rem', borderRadius:99,
              background:`rgba(${color === '#6366f1' ? '99,102,241' : color === '#10b981' ? '16,185,129' : '100,116,139'},0.15)`,
              color,
            }}>
              {getByStatus(key).length}
            </span>
          </div>

          {/* Cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', flex:1 }}>
            <AnimatePresence mode="popLayout">
              {getByStatus(key).map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity:0, scale:0.92 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0, scale:0.9 }}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('taskId', task.id)}
                  style={{ cursor:'grab' }}
                >
                  <TaskCard task={task} onToggle={onToggle} onDelete={onDelete} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Drop zone hint */}
          {getByStatus(key).length === 0 && (
            <div style={{
              flex:1, display:'flex', alignItems:'center', justifyContent:'center',
              borderRadius:'1rem', border:'2px dashed rgba(255,255,255,0.07)',
              color:'#334155', fontSize:'0.75rem', fontWeight:600, minHeight:100,
            }}>
              Drop tasks here
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
