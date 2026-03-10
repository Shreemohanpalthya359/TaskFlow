import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceAssistant({ onTaskRecognized }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript]   = useState('');
  const [supported, setSupported]     = useState(false);

  useEffect(() => {
    setSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart  = () => { setIsListening(true); setTranscript('Listening…'); };
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setTimeout(() => { onTaskRecognized(text); setIsListening(false); setTranscript(''); }, 900);
    };
    rec.onerror  = () => { setIsListening(false); setTranscript(''); };
    rec.onend    = () => setIsListening(false);
    rec.start();
  };

  if (!supported) return null;

  return (
    <div style={{ position:'fixed', bottom:'2rem', right:'2rem', zIndex:50 }}>
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity:0, y:12, scale:0.9 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:12, scale:0.9 }}
            style={{
              position:'absolute', bottom:'4.5rem', right:0,
              background:'rgba(5,8,17,0.9)', backdropFilter:'blur(20px)',
              border:'1px solid rgba(99,102,241,0.3)',
              borderRadius:'1.25rem', padding:'1rem 1.25rem',
              minWidth:200, boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.5rem' }}>
              <span style={{ position:'relative', display:'inline-flex', width:10, height:10 }}>
                <span style={{
                  position:'absolute', inset:0, borderRadius:'50%', background:'#f43f5e',
                  animation:'pulse-anim 1s ease infinite',
                }} />
                <span style={{ position:'relative', width:10, height:10, borderRadius:'50%', background:'#f43f5e', display:'block' }} />
              </span>
              <span style={{ fontSize:'0.7rem', fontWeight:800, color:'#818cf8', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                Voice Intelligence
              </span>
            </div>
            <p style={{ fontSize:'0.875rem', color:'#f1f5f9', fontStyle:'italic' }}>
              "{transcript}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale:1.1 }}
        whileTap={{ scale:0.9 }}
        onClick={startListening}
        style={{
          width:56, height:56, borderRadius:'50%', cursor:'pointer',
          background: isListening
            ? 'linear-gradient(135deg,#f43f5e,#e11d48)'
            : 'linear-gradient(135deg,#6366f1,#4f46e5)',
          border:'none', color:'#fff', fontSize:'1.4rem',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow: isListening
            ? '0 4px 20px rgba(244,63,94,0.5)'
            : '0 4px 20px rgba(99,102,241,0.5)',
          position:'relative',
        }}
      >
        {isListening && (
          <>
            <span style={{ position:'absolute', inset:'-6px', borderRadius:'50%', border:'2px solid rgba(244,63,94,0.5)', animation:'ring1 1.2s ease-out infinite' }} />
            <span style={{ position:'absolute', inset:'-12px', borderRadius:'50%', border:'2px solid rgba(244,63,94,0.25)', animation:'ring1 1.2s ease-out 0.4s infinite' }} />
          </>
        )}
        🎙
      </motion.button>

      <style>{`
        @keyframes pulse-anim { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2);opacity:0} }
        @keyframes ring1 { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.5);opacity:0} }
      `}</style>
    </div>
  );
}
