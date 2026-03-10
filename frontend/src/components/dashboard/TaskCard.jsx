import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { todoAPI, extraAPI } from '../../services/api';

const PRIORITY_STYLES = {
  Urgent: { label:'🔴 Urgent', cls:'badge-urgent' },
  High:   { label:'🟠 High',   cls:'badge-high'   },
  Medium: { label:'🔵 Medium', cls:'badge-medium'  },
  Low:    { label:'🟢 Low',    cls:'badge-low'     },
};

function getDueDateLabel(due) {
  if (!due) return null;
  const diff = Math.ceil((new Date(due) - new Date()) / 86400000);
  if (diff < 0)   return { text:`${Math.abs(diff)}d overdue`, color:'#f43f5e' };
  if (diff === 0) return { text:'Due today', color:'#f59e0b' };
  if (diff <= 3)  return { text:`Due in ${diff}d`, color:'#f59e0b' };
  return { text:`Due in ${diff}d`, color:'#94a3b8' };
}

export default function TaskCard({ task, onToggle, onDelete, onRefresh }) {
  const [showSubs,     setShowSubs]     = useState(false);
  const [newSub,       setNewSub]       = useState('');
  const [showAI,       setShowAI]       = useState(false);
  const [aiGoal,       setAiGoal]       = useState(task.title);
  const [aiSuggested,  setAiSuggested]  = useState([]);
  const [aiLoading,    setAiLoading]    = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [comments,     setComments]     = useState([]);
  const [newComment,   setNewComment]   = useState('');
  const [timerLogId,   setTimerLogId]   = useState(null);
  const [timeSecs,     setTimeSecs]     = useState(task.total_time_secs || 0);

  useEffect(() => {
    let intv;
    if (timerLogId) intv = setInterval(() => setTimeSecs(s => s + 1), 1000);
    return () => clearInterval(intv);
  }, [timerLogId]);

  const loadComments = async () => setComments(await extraAPI.getComments(task.id));
  const addComment = async () => { if (!newComment.trim()) return; await extraAPI.addComment(task.id, newComment.trim()); setNewComment(''); loadComments(); };
  const deleteComment = async (id) => { await extraAPI.deleteComment(id); loadComments(); };
  const toggleFocus = async () => { await extraAPI.toggleFocus(task.id); onRefresh(); };
  const toggleTimer = async () => {
    if (timerLogId) { await extraAPI.stopTimer(task.id, timerLogId); setTimerLogId(null); }
    else { const res = await extraAPI.startTimer(task.id); setTimerLogId(res.log_id); }
  };
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`; return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const pri = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium;
  const due = getDueDateLabel(task.due_date);
  const subtasks  = task.subtasks || [];
  const doneSubs  = subtasks.filter(s => s.completed).length;
  const pctDone   = subtasks.length > 0 ? (doneSubs / subtasks.length) * 100 : 0;

  const addSub = async () => {
    if (!newSub.trim()) return;
    await todoAPI.addSubtask(task.id, newSub.trim());
    setNewSub(''); onRefresh();
  };

  const toggleSub = async (id) => { await todoAPI.toggleSubtask(id); onRefresh(); };
  const deleteSub = async (id) => { await todoAPI.deleteSubtask(id); onRefresh(); };

  const runAI = async () => {
    setAiLoading(true);
    try { const r = await todoAPI.aiBreakdown(aiGoal); setAiSuggested(r.subtasks); }
    catch {}
    setAiLoading(false);
  };

  const adoptAISuggestion = async (text) => {
    await todoAPI.addSubtask(task.id, text);
    setAiSuggested(prev => prev.filter(s => s !== text));
    onRefresh();
  };

  return (
    <motion.div layout initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
      whileHover={{ y:-2, boxShadow:'0 8px 32px rgba(99,102,241,0.15)' }}
      className="glass" style={{ borderRadius:'1.25rem', padding:'1.125rem', position:'relative', overflow:'hidden' }}>

      {task.completed && <div style={{ position:'absolute', inset:0, background:'rgba(16,185,129,0.04)', pointerEvents:'none', borderRadius:'inherit' }} />}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem', marginBottom:'0.75rem' }}>
        <motion.button whileTap={{ scale:0.8 }} onClick={() => onToggle(task.id, task.completed)}
          style={{ width:22, height:22, borderRadius:'50%', flexShrink:0, border: task.completed ? '2px solid #10b981' : '2px solid rgba(255,255,255,0.2)',
            background: task.completed ? '#10b981' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', marginTop:2 }}>
          {task.completed && <span style={{ color:'#fff', fontSize:'0.7rem' }}>✓</span>}
        </motion.button>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontWeight:700, fontSize:'0.9rem', color:'#f1f5f9', textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.5 : 1, lineHeight:1.4, wordBreak:'break-word' }}>
            {task.is_focus ? <span style={{ marginRight:'0.4rem', fontSize:'0.85rem' }} title="Today's Focus">📌</span> : null}
            {task.title}
          </p>
          {task.description && <p style={{ fontSize:'0.75rem', color:'#64748b', lineHeight:1.4, marginTop:'0.2rem' }}>{task.description}</p>}
        </div>
        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={() => onDelete(task.id)}
          style={{ width:28, height:28, borderRadius:'0.5rem', flexShrink:0, background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.2)', color:'#f43f5e', fontSize:'0.8rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          ✕
        </motion.button>
      </div>

      {/* Subtask progress bar */}
      {subtasks.length > 0 && (
        <div style={{ marginBottom:'0.75rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
            <span style={{ fontSize:'0.65rem', color:'#64748b', fontWeight:600 }}>Subtasks</span>
            <span style={{ fontSize:'0.65rem', color:'#10b981', fontWeight:700 }}>{doneSubs}/{subtasks.length}</span>
          </div>
          <div style={{ height:3, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
            <motion.div initial={{ width:0 }} animate={{ width:`${pctDone}%` }} transition={{ duration:0.5 }}
              style={{ height:'100%', background:'linear-gradient(90deg,#6366f1,#10b981)', borderRadius:99 }} />
          </div>
        </div>
      )}

      {/* Footer row */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
        <span className={pri.cls} style={{ fontSize:'0.65rem', fontWeight:700, padding:'0.2rem 0.6rem', borderRadius:99 }}>{pri.label}</span>
        {task.category && task.category !== 'General' && (
          <span style={{ fontSize:'0.65rem', fontWeight:600, padding:'0.2rem 0.6rem', borderRadius:99, background:'rgba(6,182,212,0.1)', color:'#06b6d4', border:'1px solid rgba(6,182,212,0.2)' }}>{task.category}</span>
        )}
        {due && <span style={{ fontSize:'0.65rem', fontWeight:700, color:due.color }}>{due.text}</span>}
        <div style={{ marginLeft:'auto', display:'flex', gap:'0.4rem', flexWrap:'wrap', justifyContent:'flex-end' }}>
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={toggleTimer}
            style={{ fontSize:'0.7rem', fontWeight:600, padding:'0.2rem 0.5rem', borderRadius:'0.5rem', background: timerLogId ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)', border: timerLogId ? '1px solid rgba(244,63,94,0.3)' : '1px solid rgba(16,185,129,0.3)', color: timerLogId ? '#f43f5e' : '#10b981', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.3rem' }} title="Time Tracker">
            {timerLogId ? '⏹' : '▶'} {formatTime(timeSecs)}
          </motion.button>
          <motion.button whileHover={{ scale:1.1 }} onClick={toggleFocus}
            style={{ fontSize:'0.75rem', padding:'0.2rem 0.5rem', borderRadius:'0.5rem', background: task.is_focus ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)', border: task.is_focus ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.1)', color: task.is_focus ? '#f59e0b' : '#64748b', cursor:'pointer' }} title="Toggle Focus">
            📌
          </motion.button>
          <motion.button whileHover={{ scale:1.1 }} onClick={() => { setShowComments(!showComments); if (!showComments) loadComments(); }}
            style={{ fontSize:'0.75rem', padding:'0.2rem 0.5rem', borderRadius:'0.5rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#64748b', cursor:'pointer' }} title="Comments">
            💬
          </motion.button>
          <motion.button whileHover={{ scale:1.1 }} onClick={() => { setShowAI(!showAI); setAiSuggested([]); }}
            style={{ fontSize:'0.75rem', padding:'0.2rem 0.5rem', borderRadius:'0.5rem', background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.3)', color:'#818cf8', cursor:'pointer' }} title="AI Breakdown">
            🧠
          </motion.button>
          <motion.button whileHover={{ scale:1.1 }} onClick={() => setShowSubs(!showSubs)}
            style={{ fontSize:'0.75rem', padding:'0.2rem 0.5rem', borderRadius:'0.5rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#64748b', cursor:'pointer' }} title="Subtasks">
            {showSubs ? '▲' : `☰ ${subtasks.length}`}
          </motion.button>
        </div>
      </div>

      {/* AI Breakdown panel */}
      <AnimatePresence>
        {showAI && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            style={{ marginTop:'0.875rem', paddingTop:'0.875rem', borderTop:'1px solid rgba(255,255,255,0.06)', overflow:'hidden' }}>
            <div style={{ fontSize:'0.75rem', fontWeight:800, color:'#818cf8', marginBottom:'0.5rem' }}>🧠 AI Task Breakdown</div>
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.75rem' }}>
              <input value={aiGoal} onChange={e => setAiGoal(e.target.value)} className="input-glass"
                style={{ fontSize:'0.8rem', padding:'0.5rem 0.75rem', flex:1 }} placeholder="Describe your goal…" />
              <motion.button whileTap={{ scale:0.95 }} onClick={runAI} disabled={aiLoading}
                style={{ padding:'0.5rem 0.875rem', borderRadius:'0.75rem', background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'#fff', fontWeight:700, fontSize:'0.75rem', border:'none', cursor:'pointer', opacity: aiLoading ? 0.7 : 1 }}>
                {aiLoading ? '…' : '⚡ Break it down'}
              </motion.button>
            </div>
            <AnimatePresence>
              {aiSuggested.map((s, i) => (
                <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.05 }}
                  style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginBottom:'0.4rem' }}>
                  <span style={{ fontSize:'0.8rem', color:'#94a3b8', flex:1 }}>• {s}</span>
                  <motion.button whileHover={{ scale:1.1 }} onClick={() => adoptAISuggestion(s)}
                    style={{ fontSize:'0.7rem', padding:'0.15rem 0.5rem', borderRadius:'0.5rem', background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)', color:'#10b981', cursor:'pointer' }}>
                    + Add
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtasks panel */}
      <AnimatePresence>
        {showSubs && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            style={{ marginTop:'0.875rem', paddingTop:'0.875rem', borderTop:'1px solid rgba(255,255,255,0.06)', overflow:'hidden' }}>
            <div style={{ fontSize:'0.75rem', fontWeight:800, color:'#94a3b8', marginBottom:'0.5rem' }}>✅ Subtasks</div>
            {subtasks.map(s => (
              <div key={s.id} style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.4rem' }}>
                <motion.button whileTap={{ scale:0.8 }} onClick={() => toggleSub(s.id)}
                  style={{ width:16, height:16, borderRadius:'50%', border: s.completed ? '2px solid #10b981' : '2px solid rgba(255,255,255,0.2)', background: s.completed ? '#10b981' : 'transparent', cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {s.completed && <span style={{ color:'#fff', fontSize:'0.55rem' }}>✓</span>}
                </motion.button>
                <span style={{ fontSize:'0.8rem', color: s.completed ? '#475569' : '#94a3b8', flex:1, textDecoration: s.completed ? 'line-through' : 'none' }}>{s.title}</span>
                <motion.button whileHover={{ scale:1.1 }} onClick={() => deleteSub(s.id)}
                  style={{ fontSize:'0.65rem', color:'#f43f5e', background:'none', border:'none', cursor:'pointer' }}>✕</motion.button>
              </div>
            ))}
            <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.5rem' }}>
              <input value={newSub} onChange={e => setNewSub(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSub()}
                className="input-glass" style={{ fontSize:'0.8rem', padding:'0.4rem 0.75rem', flex:1 }} placeholder="Add subtask…" />
              <motion.button whileTap={{ scale:0.95 }} onClick={addSub}
                style={{ padding:'0.4rem 0.75rem', borderRadius:'0.75rem', background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.3)', color:'#818cf8', fontWeight:700, fontSize:'0.8rem', cursor:'pointer' }}>+</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Comments panel */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            style={{ marginTop:'0.875rem', paddingTop:'0.875rem', borderTop:'1px solid rgba(255,255,255,0.06)', overflow:'hidden' }}>
            <div style={{ fontSize:'0.75rem', fontWeight:800, color:'#94a3b8', marginBottom:'0.5rem' }}>💬 Comments</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'0.75rem', maxHeight:150, overflowY:'auto' }}>
              {comments.length === 0 ? (
                <div style={{ fontSize:'0.75rem', color:'#475569', fontStyle:'italic' }}>No comments yet.</div>
              ) : comments.map(c => (
                <div key={c.id} style={{ fontSize:'0.75rem', padding:'0.5rem', background:'rgba(255,255,255,0.03)', borderRadius:'0.5rem', position:'relative', paddingRight:'1.5rem' }}>
                  <span style={{ color:'#f1f5f9' }}>{c.text}</span>
                  <div style={{ fontSize:'0.6rem', color:'#475569', marginTop:'0.2rem' }}>{new Date(c.created_at).toLocaleString()}</div>
                  <button onClick={() => deleteComment(c.id)} style={{ position:'absolute', top:'0.4rem', right:'0.4rem', background:'none', border:'none', color:'#f43f5e', fontSize:'0.6rem', cursor:'pointer' }}>✕</button>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <input value={newComment} onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addComment()}
                className="input-glass" style={{ fontSize:'0.8rem', padding:'0.4rem 0.75rem', flex:1 }} placeholder="Write a comment…" />
              <motion.button whileTap={{ scale:0.95 }} onClick={addComment}
                style={{ padding:'0.4rem 0.75rem', borderRadius:'0.75rem', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'#f1f5f9', fontWeight:700, fontSize:'0.8rem', cursor:'pointer' }}>↗</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>

  );
}
