from extensions.db import get_db

def create_todo(title, description, user_id, priority='Medium', category='General', due_date=None, status='To-Do'):
    db = get_db()
    db.execute(
        'INSERT INTO todos (title, description, user_id, priority, category, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (title, description, user_id, priority, category, due_date, status)
    )
    db.commit()

def get_all_todos(user_id):
    db = get_db()
    todos = db.execute(
        'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
        (user_id,)
    ).fetchall()
    result = []
    for t in todos:
        t_dict = dict(t)
        subs = db.execute('SELECT * FROM subtasks WHERE todo_id = ? ORDER BY created_at ASC', (t['id'],)).fetchall()
        t_dict['subtasks'] = [dict(s) for s in subs]
        result.append(t_dict)
    return result

def update_todo(todo_id, completed, user_id, status=None):
    db = get_db()
    if status is not None:
        db.execute(
            'UPDATE todos SET completed = ?, status = ? WHERE id = ? AND user_id = ?',
            (completed, status, todo_id, user_id)
        )
    else:
        db.execute(
            'UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?',
            (completed, todo_id, user_id)
        )
    db.commit()

def delete_todo(todo_id, user_id):
    db = get_db()
    db.execute('DELETE FROM todos WHERE id = ? AND user_id = ?', (todo_id, user_id))
    db.commit()

# ─── Subtasks ───────────────────────────────────────────
def create_subtask(todo_id, title):
    db = get_db()
    db.execute('INSERT INTO subtasks (todo_id, title) VALUES (?, ?)', (todo_id, title))
    db.commit()

def toggle_subtask(subtask_id):
    db = get_db()
    db.execute('UPDATE subtasks SET completed = NOT completed WHERE id = ?', (subtask_id,))
    db.commit()

def delete_subtask(subtask_id):
    db = get_db()
    db.execute('DELETE FROM subtasks WHERE id = ?', (subtask_id,))
    db.commit()

# ─── Stats ──────────────────────────────────────────────
def get_stats(user_id):
    db = get_db()
    total     = db.execute('SELECT COUNT(*) FROM todos WHERE user_id = ?', (user_id,)).fetchone()[0]
    completed = db.execute('SELECT COUNT(*) FROM todos WHERE user_id = ? AND completed = 1', (user_id,)).fetchone()[0]
    by_status   = db.execute('SELECT status, COUNT(*) as count FROM todos WHERE user_id = ? GROUP BY status', (user_id,)).fetchall()
    by_priority = db.execute('SELECT priority, COUNT(*) as count FROM todos WHERE user_id = ? GROUP BY priority', (user_id,)).fetchall()
    by_category = db.execute('SELECT category, COUNT(*) as count FROM todos WHERE user_id = ? GROUP BY category', (user_id,)).fetchall()
    karma = db.execute('SELECT karma_points, level FROM users WHERE id = ?', (user_id,)).fetchone()
    badges = db.execute('SELECT badge_key, earned_at FROM badges WHERE user_id = ?', (user_id,)).fetchall()
    return {
        'total': total,
        'completed': completed,
        'by_status':   [dict(r) for r in by_status],
        'by_priority': [dict(r) for r in by_priority],
        'by_category': [dict(r) for r in by_category],
        'karma_points': karma['karma_points'] if karma else 0,
        'level':        karma['level'] if karma else 1,
        'badges':       [dict(b) for b in badges],
    }
