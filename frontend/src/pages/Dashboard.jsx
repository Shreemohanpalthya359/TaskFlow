import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/common/Sidebar";
import TaskCard from "../components/dashboard/TaskCard";
import KanbanBoard from "../components/dashboard/KanbanBoard";
import CalendarView from "../components/dashboard/CalendarView";
import VoiceAssistant from "../components/dashboard/VoiceAssistant";
import ZenMode from "../components/dashboard/ZenMode";
import CommandPalette from "../components/dashboard/CommandPalette";
import { todoAPI, extraAPI } from "../services/api";

const PRIORITIES = ["Urgent","High","Medium","Low"];
const CATEGORIES = ["General","Work","Personal","Health","Finance","Learning"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks,     setTasks]    = useState([]);
  const [stats,     setStats]    = useState({ total:0, completed:0, karma_points:0, level:1 });
  const [overdue,   setOverdue]  = useState([]);
  const [view,      setView]     = useState("List");
  const [showZen,   setShowZen]  = useState(false);
  const [showCmd,   setShowCmd]  = useState(false);
  const [badgeToast,setBadgeToast]=useState(null);
  const [streak,    setStreak]   = useState(0);

  const [input,       setInput]       = useState("");
  const [description, setDescription] = useState("");
  const [priority,    setPriority]    = useState("Medium");
  const [category,    setCategory]    = useState("General");
  const [dueDate,     setDueDate]     = useState("");

  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus,   setFilterStatus]   = useState("All");
  const [searchQuery,    setSearchQuery]     = useState("");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    init();
    // Ctrl+K shortcut
    const handleKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowCmd(c => !c); } };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const init = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchTasks(), fetchStats(), fetchOverdue(), fetchStreak()]);
      setError(null);
    } catch { setError("Failed to load data"); }
    finally { setLoading(false); }
  };

  const fetchTasks   = async () => { const d = await todoAPI.getAllTasks();  setTasks(d); };
  const fetchStats   = async () => { const d = await todoAPI.getStats();     setStats(d); };
  const fetchOverdue = async () => { try { const d = await extraAPI.getOverdue(); setOverdue(d); } catch {} };
  const fetchStreak  = async () => { try { const d = await extraAPI.getStreak();  setStreak(d.streak || 0); } catch {} };
  const refresh      = async ()  => { await Promise.all([fetchTasks(), fetchStats(), fetchOverdue()]); };

  const addTask = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    try {
      await todoAPI.createTask(input.trim(), description.trim(), priority, category, dueDate || null);
      setInput(""); setDescription(""); setDueDate(""); setPriority("Medium"); setCategory("General");
      await refresh();
    } catch { setError("Failed to add task"); }
  };

  const handleVoiceTask = (text) => setInput(text);

  const toggleTask = async (id, completed) => {
    const newStatus = !completed ? "Done" : "To-Do";
    const res = await todoAPI.updateTask(id, !completed, newStatus);
    if (res?.new_badges?.length) {
      const b = res.new_badges[0];
      setBadgeToast(`${b.icon} Badge Unlocked: ${b.name}!`);
      setTimeout(() => setBadgeToast(null), 4000);
    }
    await refresh();
  };

  const updateStatus = async (id, status) => {
    await todoAPI.updateTask(id, status === "Done", status);
    await refresh();
  };

  const deleteTask = async (id) => { await todoAPI.deleteTask(id); await refresh(); };

  const handleCmdAction = async (action) => {
    if (action === 'zen')      setShowZen(true);
    if (action === 'board')    setView('Board');
    if (action === 'calendar') setView('Calendar');
    if (action === 'refresh')  await refresh();
  };

  const filtered = tasks.filter(t => {
    const matchP = filterPriority === "All" || t.priority === filterPriority;
    const matchS = filterStatus   === "All" || t.status   === filterStatus;
    const matchQ = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchP && matchS && matchQ;
  });

  const focusTasks   = tasks.filter(t => t.is_focus && !t.completed);
  const inProgressCt = tasks.filter(t => t.status === "In Progress").length;

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#050811" }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#050811", display:"flex", position:"relative", overflow:"hidden" }}>
      <div className="orb orb-indigo" style={{ width:700,height:700, top:"-20%", right:"-10%", opacity:0.12 }} />
      <div className="orb orb-emerald" style={{ width:400,height:400, bottom:"-15%", left:"20%", opacity:0.08 }} />

      <Sidebar karma={stats.karma_points} level={stats.level} streak={streak} />

      <main style={{ flex:1, overflowY:"auto", padding:"2.5rem 2rem", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>

          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <div style={{ fontSize:"0.7rem", fontWeight:800, letterSpacing:"0.2em", color:"#6366f1", textTransform:"uppercase", marginBottom:"0.4rem" }}>⚡ God-Tier Productivity</div>
              <h1 style={{ fontSize:"2.5rem", fontWeight:900, color:"#f1f5f9", letterSpacing:"-0.04em", lineHeight:1 }}>My Workspace</h1>
            </div>
            <div style={{ display:"flex", gap:"0.5rem", alignItems:"center", flexWrap:"wrap" }}>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={() => setShowCmd(true)}
                style={{ padding:"0.6rem 1.25rem", borderRadius:99, fontWeight:700, fontSize:"0.8rem", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#64748b", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                ⌨️ <span>Command</span> <span style={{ fontSize:"0.65rem", padding:"0.1rem 0.4rem", background:"rgba(255,255,255,0.08)", borderRadius:"0.3rem" }}>⌘K</span>
              </motion.button>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={() => setShowZen(true)}
                style={{ padding:"0.6rem 1.25rem", borderRadius:99, fontWeight:700, fontSize:"0.8rem", background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.3)", color:"#818cf8", cursor:"pointer" }}>
                🧘 Zen Mode
              </motion.button>
              <div style={{ display:"flex", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:99, padding:"0.3rem" }}>
                {["List","Board","Calendar"].map(v => (
                  <button key={v} onClick={() => setView(v)} style={{ padding:"0.4rem 1rem", borderRadius:99, fontWeight:700, fontSize:"0.8rem", background: view === v ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "transparent", border:"none", color: view === v ? "#fff" : "#64748b", cursor:"pointer", transition:"all 0.2s" }}>{v}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"1rem", marginBottom:"2rem" }}>
            {[
              { label:"Total",       value:stats.total,       icon:"📋", color:"#6366f1" },
              { label:"Completed",   value:stats.completed,   icon:"✅", color:"#10b981" },
              { label:"In Progress", value:inProgressCt,      icon:"⚡", color:"#f59e0b" },
              { label:"Karma XP",    value:stats.karma_points,icon:"🏆", color:"#06b6d4" },
              { label:"Streak 🔥",   value:`${streak}d`,      icon:"🔥", color:"#f43f5e" },
            ].map(s => (
              <motion.div key={s.label} whileHover={{ y:-3 }} className="glass" style={{ borderRadius:"1.25rem", padding:"1.25rem 1rem" }}>
                <div style={{ fontSize:"1.25rem", marginBottom:"0.4rem" }}>{s.icon}</div>
                <div style={{ fontSize:"1.75rem", fontWeight:900, color:s.color, letterSpacing:"-0.04em" }}>{s.value}</div>
                <div style={{ fontSize:"0.7rem", fontWeight:600, color:"#64748b", marginTop:"0.2rem" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Overdue alert */}
          {overdue.length > 0 && (
            <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
              className="glass" style={{ borderRadius:"1.25rem", padding:"1rem 1.25rem", marginBottom:"1.5rem", borderColor:"rgba(244,63,94,0.3)", background:"rgba(244,63,94,0.06)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", flexWrap:"wrap" }}>
                <span style={{ fontSize:"1.1rem" }}>⚠️</span>
                <strong style={{ color:"#f43f5e", fontSize:"0.875rem" }}>{overdue.length} overdue task{overdue.length > 1 ? 's' : ''}</strong>
                <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
                  {overdue.slice(0,3).map(t => (
                    <span key={t.id} style={{ fontSize:"0.72rem", padding:"0.2rem 0.75rem", borderRadius:99, background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.2)", color:"#fda4af" }}>{t.title}</span>
                  ))}
                  {overdue.length > 3 && <span style={{ fontSize:"0.72rem", color:"#64748b" }}>+{overdue.length - 3} more</span>}
                </div>
              </div>
            </motion.div>
          )}

          {/* Focus tasks */}
          {focusTasks.length > 0 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="glass" style={{ borderRadius:"1.5rem", padding:"1.25rem 1.5rem", marginBottom:"1.5rem", background:"rgba(99,102,241,0.06)", borderColor:"rgba(99,102,241,0.2)" }}>
              <div style={{ fontSize:"0.75rem", fontWeight:800, color:"#818cf8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.875rem" }}>📌 Today's Focus</div>
              <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap" }}>
                {focusTasks.map(t => (
                  <TaskCard key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onRefresh={refresh} />
                ))}
              </div>
            </motion.div>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:"1.5rem", alignItems:"start" }}>
            {/* Left panel */}
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              <div className="glass" style={{ borderRadius:"1.5rem", padding:"1.5rem" }}>
                <h3 style={{ fontWeight:800, fontSize:"0.875rem", color:"#f1f5f9", marginBottom:"1rem" }}>✨ Quick Add Task</h3>
                <form onSubmit={addTask} style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                  <input className="input-glass" value={input} onChange={e => setInput(e.target.value)} placeholder="Task title…" />
                  <input className="input-glass" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" />
                  <select className="input-glass" value={priority} onChange={e => setPriority(e.target.value)}>
                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <select className="input-glass" value={category} onChange={e => setCategory(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input type="date" className="input-glass" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ colorScheme:"dark" }} />
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} type="submit" className="btn-primary" style={{ width:"100%", padding:"0.875rem", borderRadius:"0.875rem", fontSize:"0.9rem" }}>
                    ⚡ Deploy Task
                  </motion.button>
                </form>
              </div>

              <div className="glass" style={{ borderRadius:"1.5rem", padding:"1.25rem" }}>
                <h3 style={{ fontWeight:800, fontSize:"0.8rem", color:"#64748b", marginBottom:"0.75rem", textTransform:"uppercase", letterSpacing:"0.1em" }}>🔍 Filters</h3>
                <input className="input-glass" placeholder="Search…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ marginBottom:"0.5rem" }} />
                <select className="input-glass" value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ marginBottom:"0.5rem" }}>
                  <option value="All">All Priorities</option>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
                <select className="input-glass" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="All">All Statuses</option>
                  {["To-Do","In Progress","Done"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Main content */}
            <div>
              {error && <div style={{ background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.3)", borderRadius:"1rem", padding:"0.875rem 1rem", color:"#f43f5e", fontSize:"0.875rem", marginBottom:"1rem" }}>{error}</div>}
              <AnimatePresence mode="wait">
                {view === "List" && (
                  <motion.div key="list" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}>
                    {filtered.length === 0 ? (
                      <div style={{ textAlign:"center", padding:"4rem 2rem", color:"#334155" }}>
                        <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✨</div>
                        <p style={{ fontWeight:700, fontSize:"1.1rem" }}>No tasks yet</p>
                        <p style={{ fontSize:"0.875rem", marginTop:"0.5rem" }}>Add your first task or press ⌘K</p>
                      </div>
                    ) : (
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px,1fr))", gap:"1rem" }}>
                        {filtered.map(task => <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onRefresh={refresh} />)}
                      </div>
                    )}
                  </motion.div>
                )}
                {view === "Board" && (
                  <motion.div key="board" initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.97 }}>
                    <KanbanBoard tasks={filtered} onToggle={toggleTask} onDelete={deleteTask} onStatusChange={updateStatus} />
                  </motion.div>
                )}
                {view === "Calendar" && (
                  <motion.div key="calendar" initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.97 }}>
                    <CalendarView tasks={filtered} onToggle={toggleTask} onDelete={deleteTask} onRefresh={refresh} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>{showZen && <ZenMode onClose={() => setShowZen(false)} />}</AnimatePresence>
      <AnimatePresence>{showCmd && <CommandPalette onClose={() => setShowCmd(false)} onAction={handleCmdAction} />}</AnimatePresence>
      <VoiceAssistant onTaskRecognized={handleVoiceTask} />

      <AnimatePresence>
        {badgeToast && (
          <motion.div initial={{ opacity:0, y:60, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:60 }}
            style={{ position:"fixed", bottom:"5.5rem", right:"2rem", zIndex:200, background:"linear-gradient(135deg,rgba(99,102,241,0.95),rgba(6,182,212,0.95))", backdropFilter:"blur(20px)", padding:"1rem 1.5rem", borderRadius:"1.25rem", color:"#fff", fontWeight:800, fontSize:"0.9rem", boxShadow:"0 8px 32px rgba(99,102,241,0.5)", display:"flex", alignItems:"center", gap:"0.75rem", maxWidth:280 }}>
            <span style={{ fontSize:"1.5rem" }}>🎖</span>
            <div>
              <div style={{ fontSize:"0.65rem", opacity:0.8, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.15rem" }}>Achievement Unlocked!</div>
              {badgeToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
