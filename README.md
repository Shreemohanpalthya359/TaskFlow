<div align="center">

# ⚡ TaskFlow : God-Tier Productivity

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white" alt="Electron" />
</p>

### Elevate your work. Destroy your to-do list. Let AI do the heavy lifting.

*TaskFlow isn't just a to-do list; it's an elite, intelligence-driven productivity suite featuring a deep-space glassmorphism UI, a built-in AI assistant, gamification, and native macOS integration.*

---

</div>

## ✨ God-Tier Features

<table>
  <tr>
    <td width="50%">
      <h3>🧠 AI-Powered Task Breakdown</h3>
      <p>Stuck on a big goal? Click the brain icon and let the <b>Gemini AI</b> instantly break it down into actionable subtasks. Add them to your list with one click.</p>
    </td>
    <td width="50%">
      <h3>🏆 Karma & Gamification</h3>
      <p>Level up your productivity. Earn <b>Karma XP</b> for every completed task, track your <b>Daily Streak 🔥</b>, and unlock exclusive <b>Achievement Badges 🎖️</b>.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🌌 3 Dynamic Views</h3>
      <p>Switch seamlessly between a traditional <b>List</b>, a drag-and-drop <b>Kanban Board</b>, or a 7-day <b>Weekly Calendar</b> to visualize your workload.</p>
    </td>
    <td width="50%">
      <h3>🧘 Immersive Zen Mode</h3>
      <p>Block out distractions with an ambient, full-screen <b>Pomodoro timer</b>. Features immersive 3D floating orbs and customizable work/break intervals.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⌨️ Command Palette (⌘K)</h3>
      <p>Never take your hands off the keyboard. Press <code>Ctrl+K</code> or <code>Cmd+K</code> anywhere to instantly create tasks, switch views, or navigate the app.</p>
    </td>
    <td width="50%">
      <h3>🎙 Voice Intelligence</h3>
      <p>Hands full? Click the mic and simply speak your tasks into existence using the built-in <b>Web Speech API</b> integration.</p>
    </td>
  </tr>
</table>

---

## 🛠 Inside the Task Card

Every task in TaskFlow is a powerhouse of its own:

- **Subtasks & Checklists:** Infinite nesting with live-updating progress bars.
- **⏱ Time Tracker:** Built-in stopwatch. Hit play to log exactly how many seconds you spend on a task.
- **📌 Daily Focus:** Pin up to 3 tasks as your "Today's Focus" so they float to the top of your dashboard.
- **💬 Comments:** Keep an activity log or add quick notes directly inside the task.
- **⚠️ Overdue Alerts:** Never drop the ball. Overdue tasks trigger a red dashboard warning.

---

## 📊 Analytics & Insights

<div align="center">
  <i>Your brand new "Reports" dashboard gives you the ultimate bird's-eye view.</i>
</div>

- **🗓 GitHub-Style Heatmap:** A 52-week contribution grid that gets greener the more productive you are.
- **🔥 Streak Tracker:** See how many consecutive days you've crushed at least one task.
- **📈 Graphical Breakdowns:** Beautiful Chart.js visualizations of your tasks by Status, Priority, and Category.
- **📄 PDF Export:** Instantly generate and download a professional PDF report of your accomplishments.

---

## 🎨 Design System: Deep Space Glassmorphism

TaskFlow ditches boring flat design for an ultra-premium visual experience:
- **Translucent panels** with live background blurring (`backdrop-filter: blur(24px)`).
- **Fluid Micro-animations** on every hover and click powered by `framer-motion`.
- **Dynamic ambient orbs** that float seamlessly behind your workspace.
- **Customized priority badging** with neon glows.

---

## 🚀 Getting Started

TaskFlow is built on a **React** frontend and a **Flask (Python)** backend. 

### 1. Run the Backend (API)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
*The backend will run on `http://127.0.0.1:5001`.*

### 2. Run the Frontend (React)
```bash
cd frontend
npm install
npm start
```
*The web app will run on `http://localhost:3000`.*

---

## 🍏 Native macOS Desktop App

TaskFlow isn't just a website. It's packaged as a native macOS application using **Electron**. 

When running the Electron `.app`, it acts as a standalone wrapper that automatically boots the Flask backend in a hidden child process and serves the React UI in a gorgeous, chromeless native window.

**To build the Mac app yourself:**
```bash
cd frontend
npm run electron:build
```
*Your native app will be generated at: `frontend/dist/mac-arm64/TaskFlow.app`*

---

<div align="center">
  <p><b>Built with ❤️ for maximum focus and uncompromised aesthetics.</b></p>
</div>
