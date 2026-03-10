const API_BASE_URL = "http://127.0.0.1:5001";
const getToken = () => localStorage.getItem("token");
const getHeaders = (auth = true) => {
  const h = { "Content-Type": "application/json" };
  if (auth) { const t = getToken(); if (t) h["Authorization"] = `Bearer ${t}`; }
  return h;
};
const hr = async (res) => {
  if (res.status === 401) { localStorage.removeItem("token"); window.location.href = "/login"; throw new Error("Session expired"); }
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || e.message || `Error ${res.status}`); }
  return res.json();
};
const hb = async (res) => {
  if (res.status === 401) { localStorage.removeItem("token"); window.location.href = "/login"; throw new Error("Session expired"); }
  if (!res.ok) throw new Error("Request failed");
  return res.blob();
};

export const authAPI = {
  register: async (username, email, password, avatar = null) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, { method:"POST", headers:getHeaders(false), body:JSON.stringify({ username, email, password, avatar }) });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || "Registration failed"); }
    return res.json();
  },
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, { method:"POST", headers:getHeaders(false), body:JSON.stringify({ email, password }) });
    if (!res.ok) throw new Error("Invalid email or password");
    const data = await res.json(); localStorage.setItem("token", data.access_token); return data;
  },
  updateProfile: async (avatar) => hr(await fetch(`${API_BASE_URL}/auth/profile`, { method:"PUT", headers:getHeaders(), body:JSON.stringify({ avatar }) })),
  logout: () => localStorage.removeItem("token"),
};

export const todoAPI = {
  createTask: async (title, description="", priority="Medium", category="General", dueDate=null) =>
    hr(await fetch(`${API_BASE_URL}/todos/`, { method:"POST", headers:getHeaders(), body:JSON.stringify({ title, description, priority, category, due_date:dueDate }) })),
  getAllTasks: async () => hr(await fetch(`${API_BASE_URL}/todos/all`, { headers:getHeaders() })),
  getStats:   async () => hr(await fetch(`${API_BASE_URL}/todos/stats`, { headers:getHeaders() })),
  updateTask: async (id, completed, status=null) => {
    const b = { completed }; if (status!==null) b.status=status;
    return hr(await fetch(`${API_BASE_URL}/todos/${id}`, { method:"PUT", headers:getHeaders(), body:JSON.stringify(b) }));
  },
  deleteTask: async (id) => hr(await fetch(`${API_BASE_URL}/todos/${id}`, { method:"DELETE", headers:getHeaders() })),
  addSubtask:    async (id, title) => hr(await fetch(`${API_BASE_URL}/todos/${id}/subtasks`, { method:"POST", headers:getHeaders(), body:JSON.stringify({ title }) })),
  toggleSubtask: async (id) => hr(await fetch(`${API_BASE_URL}/todos/subtasks/${id}/toggle`, { method:"PUT", headers:getHeaders() })),
  deleteSubtask: async (id) => hr(await fetch(`${API_BASE_URL}/todos/subtasks/${id}`, { method:"DELETE", headers:getHeaders() })),
  aiBreakdown:   async (goal) => hr(await fetch(`${API_BASE_URL}/todos/ai-breakdown`, { method:"POST", headers:getHeaders(), body:JSON.stringify({ goal }) })),
  exportPDF:     async (ids=[]) => hb(await fetch(`${API_BASE_URL}/todos/export`, { method:"POST", headers:getHeaders(), body:JSON.stringify({ task_ids:ids }) })),
};

export const extraAPI = {
  // Comments
  getComments:  async (todoId) => hr(await fetch(`${API_BASE_URL}/todos/${todoId}/comments`, { headers:getHeaders() })),
  addComment:   async (todoId, text) => hr(await fetch(`${API_BASE_URL}/todos/${todoId}/comments`, { method:"POST", headers:getHeaders(), body:JSON.stringify({ text }) })),
  deleteComment: async (id) => hr(await fetch(`${API_BASE_URL}/comments/${id}`, { method:"DELETE", headers:getHeaders() })),
  // Time tracker
  startTimer: async (todoId) => hr(await fetch(`${API_BASE_URL}/todos/${todoId}/timer/start`, { method:"POST", headers:getHeaders() })),
  stopTimer:  async (todoId, logId) => hr(await fetch(`${API_BASE_URL}/todos/${todoId}/timer/stop`, { method:"POST", headers:getHeaders(), body:JSON.stringify({ log_id:logId }) })),
  // Tags
  getTags:        async () => hr(await fetch(`${API_BASE_URL}/tags`, { headers:getHeaders() })),
  createTag:      async (name, color) => hr(await fetch(`${API_BASE_URL}/tags`, { method:"POST", headers:getHeaders(), body:JSON.stringify({ name, color }) })),
  addTagToTodo:   async (todoId, tagId) => hr(await fetch(`${API_BASE_URL}/todos/${todoId}/tags`, { method:"POST", headers:getHeaders(), body:JSON.stringify({ tag_id:tagId }) })),
  removeTagFromTodo: async (todoId, tagId) => hr(await fetch(`${API_BASE_URL}/todos/${todoId}/tags/${tagId}`, { method:"DELETE", headers:getHeaders() })),
  deleteTag:      async (id) => hr(await fetch(`${API_BASE_URL}/tags/${id}`, { method:"DELETE", headers:getHeaders() })),
  // Focus pin
  toggleFocus: async (todoId) => hr(await fetch(`${API_BASE_URL}/todos/${todoId}/focus`, { method:"PUT", headers:getHeaders() })),
  // Streak
  getStreak:   async () => hr(await fetch(`${API_BASE_URL}/streak`, { headers:getHeaders() })),
  // Heatmap
  getHeatmap:  async () => hr(await fetch(`${API_BASE_URL}/heatmap`, { headers:getHeaders() })),
  // Recurring
  setRecur:    async (todoId, interval) => hr(await fetch(`${API_BASE_URL}/todos/${todoId}/recur`, { method:"POST", headers:getHeaders(), body:JSON.stringify({ interval }) })),
  removeRecur: async (todoId) => hr(await fetch(`${API_BASE_URL}/todos/${todoId}/recur`, { method:"DELETE", headers:getHeaders() })),
  // Overdue
  getOverdue: async () => hr(await fetch(`${API_BASE_URL}/todos/overdue`, { headers:getHeaders() })),
};

export const api = { baseUrl: API_BASE_URL };
