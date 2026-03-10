import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MODES = [
  { key: 'Work',       label: 'Focus',       mins: 25, color: '#6366f1' },
  { key: 'Short',      label: 'Short Break', mins: 5,  color: '#10b981' },
  { key: 'Long',       label: 'Long Break',  mins: 15, color: '#06b6d4' },
];

export default function ZenMode({ onClose }) {
  const [modeIdx, setModeIdx]  = useState(0);
  const [timeLeft, setTimeLeft] = useState(MODES[0].mins * 60);
  const [isActive, setIsActive] = useState(false);
  const [toast, setToast]       = useState(null);
  const intervalRef = useRef(null);

  const mode = MODES[modeIdx];

  useEffect(() => {
    setTimeLeft(mode.mins * 60);
    setIsActive(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeIdx]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      setIsActive(false);
      const msg = mode.key === 'Work' ? '🎯 Focus session complete! Take a break.' : '⚡ Break over. Back to work!';
      setToast(msg);
      setTimeout(() => setToast(null), 4000);
    }
    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft]);

  const total = mode.mins * 60;
  const pct   = (timeLeft / total);
  const R     = 110;
  const circ  = 2 * Math.PI * R;
  const dash  = circ * pct;

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      style={{
        position:'fixed', inset:0, zIndex:200,
        background:'#050811',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        overflow:'hidden',
      }}
    >
      {/* Ambient orbs */}
      <div className="orb orb-indigo" style={{ width:500,height:500, top:'-15%', left:'-10%', opacity:0.3 }} />
      <div className="orb orb-emerald" style={{ width:400,height:400, bottom:'-10%', right:'-5%', opacity:0.2 }} />
      <div className="orb orb-cyan" style={{ width:300,height:300, top:'50%', right:'20%', opacity:0.15 }} />

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position:'absolute', top:'1.5rem', right:'1.5rem',
          width:44, height:44, borderRadius:'50%',
          background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
          color:'#94a3b8', fontSize:'1.2rem', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}
      >✕</button>

      {/* Mode switcher */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'2.5rem', zIndex:10 }}>
        {MODES.map((m, i) => (
          <motion.button
            key={m.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModeIdx(i)}
            style={{
              padding:'0.55rem 1.25rem', borderRadius:99, fontWeight:700, fontSize:'0.8rem',
              cursor:'pointer', transition:'all 0.2s',
              background: modeIdx === i ? m.color : 'rgba(255,255,255,0.05)',
              border: `1px solid ${modeIdx === i ? m.color : 'rgba(255,255,255,0.1)'}`,
              color: modeIdx === i ? '#fff' : '#64748b',
            }}
          >{m.label}</motion.button>
        ))}
      </div>

      {/* Timer ring */}
      <div style={{ position:'relative', width:280, height:280, zIndex:10 }}>
        <svg width="280" height="280" style={{ transform:'rotate(-90deg)', position:'absolute', inset:0 }}>
          <circle cx="140" cy="140" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <motion.circle
            cx="140" cy="140" r={R} fill="none" stroke={mode.color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - dash}
            style={{ filter:`drop-shadow(0 0 12px ${mode.color})`, transition:'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div style={{
          position:'absolute', inset:0, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
        }}>
          <motion.div
            key={mode.key}
            initial={{ opacity:0, y:8 }}
            animate={{ opacity:1, y:0 }}
            style={{ fontSize:'0.7rem', fontWeight:800, letterSpacing:'0.2em', color:mode.color, textTransform:'uppercase', marginBottom:'0.5rem' }}
          >{mode.label}</motion.div>
          <div style={{ fontSize:'4rem', fontWeight:900, letterSpacing:'-0.04em', color:'#f1f5f9', lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
            {fmt(timeLeft)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', gap:'1rem', marginTop:'2.5rem', zIndex:10 }}>
        <motion.button
          whileHover={{ scale:1.04 }}
          whileTap={{ scale:0.96 }}
          onClick={() => setIsActive(a => !a)}
          style={{
            padding:'0.875rem 2.5rem', borderRadius:99, fontWeight:800, fontSize:'1rem',
            cursor:'pointer', background: isActive ? '#fff' : mode.color,
            color: isActive ? '#0f172a' : '#fff', border:'none',
            boxShadow: isActive ? 'none' : `0 4px 24px ${mode.color}66`,
          }}
        >{isActive ? '⏸ Pause' : '▶ Start Focus'}</motion.button>

        <motion.button
          whileHover={{ scale:1.04 }}
          whileTap={{ scale:0.96 }}
          onClick={() => { setIsActive(false); setTimeLeft(mode.mins * 60); }}
          style={{
            padding:'0.875rem 1.75rem', borderRadius:99, fontWeight:700, fontSize:'0.9rem',
            cursor:'pointer', background:'rgba(255,255,255,0.06)',
            border:'1px solid rgba(255,255,255,0.1)', color:'#64748b',
          }}
        >↺ Reset</motion.button>
      </div>

      <p style={{ marginTop:'3rem', color:'#334155', fontStyle:'italic', fontSize:'0.85rem', zIndex:10 }}>
        "Deep work is the superpower of the 21st century."
      </p>

      {/* Toast notification (no alert!) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity:0, y:40 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:40 }}
            style={{
              position:'fixed', bottom:'2rem', left:'50%', transform:'translateX(-50%)',
              background:'rgba(99,102,241,0.9)', backdropFilter:'blur(20px)',
              border:'1px solid rgba(255,255,255,0.2)',
              padding:'1rem 2rem', borderRadius:99, color:'#fff', fontWeight:700, fontSize:'0.9rem',
              zIndex:300, boxShadow:'0 8px 32px rgba(0,0,0,0.4)',
            }}
          >{toast}</motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
