import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getDateGrid() {
  const today = new Date();
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

export default function HeatmapChart({ data = [] }) {
  const [tooltip, setTooltip] = useState(null);
  const countMap = {};
  data.forEach(r => { countMap[r.day] = r.count; });

  const days = getDateGrid();
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const getColor = (count) => {
    if (!count) return 'rgba(255,255,255,0.04)';
    if (count >= 8) return '#10b981';
    if (count >= 5) return '#34d399';
    if (count >= 3) return '#6ee7b7';
    if (count >= 1) return '#a7f3d0';
    return 'rgba(255,255,255,0.04)';
  };

  return (
    <div style={{ position:'relative' }}>
      <div style={{ overflowX:'auto', paddingBottom:'0.5rem' }}>
        <div style={{ display:'flex', gap:3 }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display:'flex', flexDirection:'column', gap:3 }}>
              {week.map(day => {
                const count = countMap[day] || 0;
                return (
                  <motion.div key={day}
                    whileHover={{ scale:1.4, zIndex:10 }}
                    onMouseEnter={() => setTooltip({ day, count })}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ width:11, height:11, borderRadius:2, background:getColor(count), cursor:'default', flexShrink:0 }} />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{ position:'absolute', bottom:'120%', left:'50%', transform:'translateX(-50%)', background:'rgba(5,8,17,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'0.5rem', padding:'0.4rem 0.75rem', fontSize:'0.72rem', color:'#f1f5f9', whiteSpace:'nowrap', zIndex:20, pointerEvents:'none' }}>
          <strong>{tooltip.count}</strong> tasks on {tooltip.day}
        </div>
      )}

      {/* Legend */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'0.5rem', justifyContent:'flex-end' }}>
        <span style={{ fontSize:'0.65rem', color:'#475569' }}>Less</span>
        {['rgba(255,255,255,0.04)','#a7f3d0','#6ee7b7','#34d399','#10b981'].map((c,i) => (
          <div key={i} style={{ width:11, height:11, borderRadius:2, background:c }} />
        ))}
        <span style={{ fontSize:'0.65rem', color:'#475569' }}>More</span>
      </div>
    </div>
  );
}
