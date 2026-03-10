import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#050811', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', position:'relative', overflow:'hidden' }}>
      <div className="orb orb-indigo" style={{ width:700,height:700,top:'-30%',right:'-20%',opacity:0.15 }} />
      <div className="orb orb-cyan" style={{ width:400,height:400,bottom:'-20%',left:'-10%',opacity:0.1 }} />

      <motion.div
        initial={{ opacity:0, y:30, scale:0.97 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:0.4 }}
        className="glass"
        style={{ width:'100%', maxWidth:420, borderRadius:'2rem', padding:'2.5rem', position:'relative', zIndex:1 }}
      >
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'2rem' }}>
          <div style={{ width:40,height:40,borderRadius:'0.875rem',background:'linear-gradient(135deg,#6366f1,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',boxShadow:'0 4px 20px rgba(99,102,241,0.4)' }}>⚡</div>
          <span style={{ fontWeight:900, fontSize:'1.5rem', letterSpacing:'-0.03em', color:'#f1f5f9' }}>TaskFlow</span>
        </div>

        <h1 style={{ fontWeight:900, fontSize:'1.75rem', letterSpacing:'-0.04em', color:'#f1f5f9', marginBottom:'0.4rem' }}>
          Welcome back
        </h1>
        <p style={{ fontSize:'0.875rem', color:'#64748b', marginBottom:'2rem' }}>
          Sign in to your productivity suite
        </p>

        {error && (
          <div style={{ background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.3)', borderRadius:'0.875rem', padding:'0.75rem 1rem', color:'#f43f5e', fontSize:'0.8rem', marginBottom:'1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#64748b', display:'block', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>Email</label>
            <input id="login-email" type="email" required className="input-glass" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'#64748b', display:'block', marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>Password</label>
            <input id="login-password" type="password" required className="input-glass" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <motion.button
            whileHover={{ scale:1.02, y:-1 }}
            whileTap={{ scale:0.97 }}
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width:'100%', padding:'0.875rem', borderRadius:'0.875rem', fontSize:'0.95rem', marginTop:'0.5rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </motion.button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.875rem', color:'#64748b' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color:'#818cf8', fontWeight:700, textDecoration:'none' }}>Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}