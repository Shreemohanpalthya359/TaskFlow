import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FEATURES = [
  { icon:'🗂', title:'Kanban Board',       desc:'Drag-and-drop tasks between To-Do, In Progress, and Done with silky smooth animations.' },
  { icon:'🎙', title:'Voice Intelligence', desc:'Hands-free task capture. Click the mic and speak your task — it\'s instantly added.' },
  { icon:'🧘', title:'Zen / Pomodoro',     desc:'Immersive focus sessions with a precision timer, ambient orbs, and three timer modes.' },
  { icon:'🏆', title:'Karma XP System',    desc:'Complete tasks and earn XP. Level up and watch your productivity score grow.' },
  { icon:'📊', title:'Smart Analytics',    desc:'Real-time breakdown of tasks by status, priority, and category with animated charts.' },
  { icon:'📤', title:'PDF Export',         desc:'Export your task list as a beautiful PDF report in one click.' },
];

export default function Landing() {
  return (
    <div style={{ minHeight:'100vh', background:'#050811', color:'#f1f5f9', fontFamily:'Inter,sans-serif', overflowX:'hidden' }}>
      {/* Global orbs */}
      <div className="orb orb-indigo" style={{ width:800,height:800,top:'-30%',right:'-20%',opacity:0.15 }} />
      <div className="orb orb-emerald" style={{ width:500,height:500,bottom:'10%',left:'-10%',opacity:0.1 }} />
      <div className="orb orb-cyan" style={{ width:400,height:400,top:'60%',right:'30%',opacity:0.08 }} />

      {/* Navbar */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.5rem 3rem', position:'relative', zIndex:10, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <div style={{ width:36,height:36,borderRadius:'0.75rem',background:'linear-gradient(135deg,#6366f1,#4f46e5)', display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',fontWeight:900,boxShadow:'0 4px 20px rgba(99,102,241,0.4)' }}>⚡</div>
          <span style={{ fontWeight:900,fontSize:'1.25rem',letterSpacing:'-0.02em' }}>TaskFlow</span>
        </div>
        <div style={{ display:'flex', gap:'1rem' }}>
          <Link to="/login" style={{ textDecoration:'none' }}>
            <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} style={{ padding:'0.6rem 1.5rem', borderRadius:99, background:'transparent', border:'1px solid rgba(255,255,255,0.15)', color:'#94a3b8', fontWeight:600, fontSize:'0.875rem', cursor:'pointer' }}>
              Log In
            </motion.button>
          </Link>
          <Link to="/signup" style={{ textDecoration:'none' }}>
            <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} className="btn-primary" style={{ padding:'0.6rem 1.5rem', borderRadius:99, fontSize:'0.875rem' }}>
              Get Started →
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth:860, margin:'0 auto', textAlign:'center', padding:'7rem 2rem 5rem', position:'relative', zIndex:1 }}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.4rem 1rem', borderRadius:99, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.3)', color:'#818cf8', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'2rem' }}>
            ⚡ God-Tier Productivity Suite
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
          style={{ fontSize:'clamp(3rem,8vw,5.5rem)', fontWeight:900, letterSpacing:'-0.05em', lineHeight:1.0, marginBottom:'1.5rem',
            background:'linear-gradient(135deg,#f1f5f9 0%,#818cf8 50%,#06b6d4 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          Your Productivity<br/>Superpower
        </motion.h1>
        <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          style={{ fontSize:'1.25rem', color:'#64748b', lineHeight:1.7, maxWidth:560, margin:'0 auto 2.5rem' }}>
          Kanban boards, voice capture, Zen focus sessions, and gamified XP — all in one elite workspace.
        </motion.p>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }} style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/signup" style={{ textDecoration:'none' }}>
            <motion.button whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.97 }} className="btn-primary"
              style={{ padding:'1rem 2.5rem', borderRadius:99, fontSize:'1rem', letterSpacing:'-0.01em' }}>
              Start for Free →
            </motion.button>
          </Link>
          <Link to="/login" style={{ textDecoration:'none' }}>
            <motion.button whileHover={{ scale:1.04 }} className="btn-ghost"
              style={{ padding:'1rem 2rem', borderRadius:99, fontSize:'1rem' }}>
              Log In
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding:'3rem 2rem 6rem', position:'relative', zIndex:1 }}>
        <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ textAlign:'center', fontSize:'2.5rem', fontWeight:900, letterSpacing:'-0.04em', marginBottom:'0.75rem' }}>
          Everything you need
        </motion.h2>
        <p style={{ textAlign:'center', color:'#64748b', marginBottom:'3rem', fontSize:'1rem' }}>
          Packed with intelligence-first features that make you unstoppable.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity:0, y:24 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y:-4 }}
              className="glass"
              style={{ borderRadius:'1.5rem', padding:'1.75rem' }}
            >
              <div style={{ fontSize:'2rem', marginBottom:'0.875rem' }}>{f.icon}</div>
              <h3 style={{ fontWeight:800, fontSize:'1rem', color:'#f1f5f9', marginBottom:'0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize:'0.875rem', color:'#64748b', lineHeight:1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth:700, margin:'0 auto 8rem', padding:'0 2rem', position:'relative', zIndex:1, textAlign:'center' }}>
        <div className="glass" style={{ borderRadius:'2rem', padding:'3rem', position:'relative', overflow:'hidden' }}>
          <div className="orb orb-indigo" style={{ width:300,height:300,top:'-50%',left:'-10%',opacity:0.3 }} />
          <div className="orb orb-cyan" style={{ width:200,height:200,bottom:'-30%',right:'5%',opacity:0.2 }} />
          <h2 style={{ fontSize:'2.5rem', fontWeight:900, letterSpacing:'-0.04em', marginBottom:'1rem', position:'relative' }}>
            Ready to level up?
          </h2>
          <p style={{ color:'#64748b', marginBottom:'2rem', fontSize:'1rem', position:'relative' }}>
            Join TaskFlow and transform the way you work. No customer tracking. Just pure, personal productivity.
          </p>
          <Link to="/signup" style={{ textDecoration:'none', position:'relative' }}>
            <motion.button whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.97 }} className="btn-primary"
              style={{ padding:'1rem 3rem', borderRadius:99, fontSize:'1rem' }}>
              Get Started Free →
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.05)', textAlign:'center', padding:'2rem', color:'#334155', fontSize:'0.8rem', position:'relative', zIndex:1 }}>
        © 2026 TaskFlow · Built for elite productivity
      </footer>
    </div>
  );
}
