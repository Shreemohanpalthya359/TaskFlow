import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const { register } = useContext(AuthContext);
  const navigate     = useNavigate();
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#050811', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', position:'relative', overflow:'hidden' }}>
      <div className="orb orb-indigo" style={{ width:700,height:700,top:'-30%',right:'-20%',opacity:0.15 }} />
      <div className="orb orb-emerald" style={{ width:400,height:400,bottom:'-20%',left:'-10%',opacity:0.1 }} />

      <motion.div
        initial={{ opacity:0, y:30, scale:0.97 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:0.4 }}
        className="glass"
        style={{ width:'100%', maxWidth:420, borderRadius:'2rem', padding:'2.5rem', position:'relative', zIndex:1 }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'2rem' }}>
          <div style={{ width:40,height:40,borderRadius:'0.875rem',background:'linear-gradient(135deg,#6366f1,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',boxShadow:'0 4px 20px rgba(99,102,241,0.4)' }}>⚡</div>
          <span style={{ fontWeight:900, fontSize:'1.5rem', letterSpacing:'-0.03em', color:'#f1f5f9' }}>TaskFlow</span>
        </div>

        <h1 style={{ fontWeight:900, fontSize:'1.75rem', letterSpacing:'-0.04em', color:'#f1f5f9', marginBottom:'0.4rem' }}>
          Create your account
        </h1>
        <p style={{ fontSize:'0.875rem', color:'#64748b', marginBottom:'2rem' }}>
          Start your productivity journey today
        </p>

        {error && (
          <div style={{ background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.3)', borderRadius:'0.875rem', padding:'0.75rem 1rem', color:'#f43f5e', fontSize:'0.8rem', marginBottom:'1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {[
            { label:'Username', id:'signup-username', type:'text',     val:username, set:setUsername, ph:'Your name' },
            { label:'Email',    id:'signup-email',    type:'email',    val:email,    set:setEmail,    ph:'you@example.com' },
            { label:'Password', id:'signup-password', type:'password', val:password, set:setPassword, ph:'At least 8 characters' },
          ].map(f => (
            <div key={f.id}>
              <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#64748b', display:'block', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>{f.label}</label>
              <input id={f.id} type={f.type} required className="input-glass" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} />
            </div>
          ))}
          <motion.button
            whileHover={{ scale:1.02, y:-1 }}
            whileTap={{ scale:0.97 }}
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width:'100%', padding:'0.875rem', borderRadius:'0.875rem', fontSize:'0.95rem', marginTop:'0.5rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating account…' : 'Create Account →'}
          </motion.button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.875rem', color:'#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#818cf8', fontWeight:700, textDecoration:'none' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}