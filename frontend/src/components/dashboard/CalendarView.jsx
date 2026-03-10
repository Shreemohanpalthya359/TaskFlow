import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getWeekDays() {
  const today = new Date();
  const week = [];
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    week.push(d);
  }
  return week;
}

function fmt(d) { return d.toISOString().split('T')[0]; }

export default function CalendarView({ tasks, onToggle, onDelete, onRefresh }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(fmt(new Date()));
  const today = new Date();

  const week = getWeekDays().map(d => {
    const shifted = new Date(d);
    shifted.setDate(shifted.getDate() + weekOffset * 7);
    return shifted;
  });

  const forDay = (d) => tasks.filter(t => t.due_date === fmt(d));
  const todayStr = fmt(today);

  const selectedTasks = tasks.filter(t => t.due_date === selectedDay);
  const noDateTasks   = tasks.filter(t => !t.due_date);

  return (
    <div style={{ display:'grid', gridTemplateRows:'auto 1fr', gap:'1.25rem' }}>
      {/* Week header */}
      <div className="glass" style={{ borderRadius:'1.5rem', padding:'1.25rem 1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={() => setWeekOffset(w => w - 1)}
            style={{ padding:'0.4rem 0.875rem', borderRadius:'0.75rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#64748b', cursor:'pointer', fontWeight:700 }}>
            ← Prev
          </motion.button>
          <span style={{ fontWeight:800, fontSize:'0.9rem', color:'#f1f5f9' }}>
            {week[0].toLocaleDateString('en-US', { month:'short', day:'numeric' })} – {week[6].toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
          </span>
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={() => setWeekOffset(w => w + 1)}
            style={{ padding:'0.4rem 0.875rem', borderRadius:'0.75rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#64748b', cursor:'pointer', fontWeight:700 }}>
            Next →
          </motion.button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'0.5rem' }}>
          {week.map((d, i) => {
            const dayStr = fmt(d);
            const count  = forDay(d).length;
            const isToday   = dayStr === todayStr;
            const isSelected = dayStr === selectedDay;
            return (
              <motion.button key={i} whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                onClick={() => setSelectedDay(dayStr)}
                style={{ borderRadius:'1rem', padding:'0.75rem 0.5rem', textAlign:'center', cursor:'pointer',
                  background: isSelected ? 'rgba(99,102,241,0.2)' : isToday ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSelected ? 'rgba(99,102,241,0.5)' : isToday ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                <div style={{ fontSize:'0.65rem', fontWeight:700, color:'#64748b', marginBottom:'0.35rem', textTransform:'uppercase' }}>{DAYS[d.getDay()]}</div>
                <div style={{ fontSize:'1.1rem', fontWeight:900, color: isSelected ? '#818cf8' : isToday ? '#06b6d4' : '#f1f5f9' }}>{d.getDate()}</div>
                {count > 0 && (
                  <div style={{ marginTop:'0.4rem', width:20, height:4, borderRadius:99, margin:'0.35rem auto 0', background: isSelected ? '#6366f1' : '#334155' }} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected day tasks */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'1rem', alignItems:'start' }}>
        <div>
          <div style={{ fontWeight:800, fontSize:'0.8rem', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.875rem' }}>
            📅 {new Date(selectedDay + 'T12:00:00').toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
            <span style={{ marginLeft:'0.5rem', fontSize:'0.7rem', background:'rgba(99,102,241,0.15)', color:'#818cf8', padding:'0.15rem 0.5rem', borderRadius:99 }}>
              {selectedTasks.length} tasks
            </span>
          </div>
          {selectedTasks.length === 0 ? (
            <div className="glass" style={{ borderRadius:'1.25rem', padding:'2rem', textAlign:'center', color:'#334155' }}>
              <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>🗓</div>
              <p style={{ fontWeight:700 }}>No tasks due this day</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {selectedTasks.map(t => <TaskCard key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} onRefresh={onRefresh} />)}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontWeight:800, fontSize:'0.8rem', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.875rem' }}>
            📋 No Due Date <span style={{ fontSize:'0.7rem', background:'rgba(255,255,255,0.05)', padding:'0.15rem 0.5rem', borderRadius:99 }}>{noDateTasks.length}</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', maxHeight:400, overflowY:'auto' }}>
            {noDateTasks.slice(0,5).map(t => <TaskCard key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} onRefresh={onRefresh} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
