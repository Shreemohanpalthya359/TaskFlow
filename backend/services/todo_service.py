from models.todo_model import (create_todo, get_all_todos, update_todo, delete_todo,
                               create_subtask, toggle_subtask, delete_subtask, get_stats)
from extensions.db import get_db
from fpdf import FPDF
import io

# ─── Badges ─────────────────────────────────────────────
BADGES = {
    'first_task':   {'name': 'First Step',   'icon': '🌱', 'desc': 'Complete your first task'},
    'ten_tasks':    {'name': 'Momentum',      'icon': '⚡', 'desc': 'Complete 10 tasks'},
    'fifty_tasks':  {'name': 'Centurion',     'icon': '🏆', 'desc': 'Complete 50 tasks'},
    'zen_master':   {'name': 'Zen Master',    'icon': '🧘', 'desc': 'Use Zen Mode 5 times'},
    'speed_demon':  {'name': 'Speed Demon',   'icon': '🚀', 'desc': 'Complete 5 tasks in one day'},
    'level_5':      {'name': 'Rising Star',   'icon': '⭐', 'desc': 'Reach Level 5'},
    'level_10':     {'name': 'Legend',        'icon': '👑', 'desc': 'Reach Level 10'},
}

def check_and_award_badges(user_id):
    db = get_db()
    completed_count = db.execute('SELECT COUNT(*) FROM todos WHERE user_id = ? AND completed = 1', (user_id,)).fetchone()[0]
    user = db.execute('SELECT karma_points, level FROM users WHERE id = ?', (user_id,)).fetchone()
    existing = {r['badge_key'] for r in db.execute('SELECT badge_key FROM badges WHERE user_id = ?', (user_id,)).fetchall()}

    to_award = []
    if completed_count >= 1  and 'first_task'  not in existing: to_award.append('first_task')
    if completed_count >= 10 and 'ten_tasks'   not in existing: to_award.append('ten_tasks')
    if completed_count >= 50 and 'fifty_tasks' not in existing: to_award.append('fifty_tasks')
    if user and user['level'] >= 5  and 'level_5'  not in existing: to_award.append('level_5')
    if user and user['level'] >= 10 and 'level_10' not in existing: to_award.append('level_10')

    for badge_key in to_award:
        try:
            db.execute('INSERT OR IGNORE INTO badges (user_id, badge_key) VALUES (?, ?)', (user_id, badge_key))
        except Exception:
            pass
    if to_award:
        db.commit()
    return [{'key': k, **BADGES[k]} for k in to_award]

def add_task(title, description, user_id, priority='Medium', category='General', due_date=None):
    create_todo(title, description, user_id, priority, category, due_date)

def list_all_tasks(user_id):
    return get_all_todos(user_id)

def mark_done(todo_id, completed, user_id, status=None):
    update_todo(todo_id, completed, user_id, status)
    newly_earned = []
    if completed:
        from models.user_model import add_karma
        add_karma(user_id, 10)
        newly_earned = check_and_award_badges(user_id)
    return newly_earned

def remove_task(todo_id, user_id):
    delete_todo(todo_id, user_id)

def add_subtask(todo_id, title):
    create_subtask(todo_id, title)

def toggle_subtask_done(subtask_id):
    toggle_subtask(subtask_id)

def remove_subtask(subtask_id):
    delete_subtask(subtask_id)

def fetch_stats(user_id):
    return get_stats(user_id)

def export_tasks_pdf(task_ids, user_id):
    todos = get_all_todos(user_id)
    if task_ids:
        todos = [t for t in todos if t['id'] in task_ids]
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="TaskFlow - Exported Tasks", ln=True, align='C')
    for todo in todos:
        pdf.cell(200, 10, txt=f"Title: {todo['title']}", ln=True)
        pdf.cell(200, 10, txt=f"Priority: {todo['priority']} | Status: {todo['status']}", ln=True)
        pdf.cell(200, 10, txt=f"Completed: {'Yes' if todo['completed'] else 'No'}", ln=True)
        pdf.cell(200, 10, txt="", ln=True)
    buffer = io.BytesIO()
    pdf.output(buffer)
    buffer.seek(0)
    return buffer
