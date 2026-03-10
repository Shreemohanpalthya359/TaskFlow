from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions.db import get_db
from datetime import date, datetime

extra_bp = Blueprint('extra', __name__)

# ─── Comments ────────────────────────────────────────────
@extra_bp.route('/todos/<int:todo_id>/comments', methods=['GET'])
@jwt_required()
def get_comments(todo_id):
    db = get_db()
    rows = db.execute('SELECT * FROM comments WHERE todo_id = ? ORDER BY created_at ASC', (todo_id,)).fetchall()
    return jsonify([dict(r) for r in rows])

@extra_bp.route('/todos/<int:todo_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(todo_id):
    user_id = int(get_jwt_identity())
    text = request.json.get('text', '').strip()
    if not text:
        return jsonify({'error': 'Text required'}), 400
    db = get_db()
    db.execute('INSERT INTO comments (todo_id, user_id, text) VALUES (?, ?, ?)', (todo_id, user_id, text))
    db.commit()
    return jsonify({'message': 'Comment added'}), 201

@extra_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    db = get_db()
    db.execute('DELETE FROM comments WHERE id = ?', (comment_id,))
    db.commit()
    return jsonify({'message': 'Comment deleted'})

# ─── Time Tracker ─────────────────────────────────────────
@extra_bp.route('/todos/<int:todo_id>/timer/start', methods=['POST'])
@jwt_required()
def start_timer(todo_id):
    db = get_db()
    now = datetime.now().isoformat()
    db.execute('INSERT INTO time_logs (todo_id, started_at) VALUES (?, ?)', (todo_id, now))
    db.commit()
    log = db.execute('SELECT last_insert_rowid() as id').fetchone()
    return jsonify({'log_id': log['id'], 'started_at': now})

@extra_bp.route('/todos/<int:todo_id>/timer/stop', methods=['POST'])
@jwt_required()
def stop_timer(todo_id):
    import datetime
    db = get_db()
    data = request.json or {}
    log_id = data.get('log_id')
    log = db.execute('SELECT * FROM time_logs WHERE id = ?', (log_id,)).fetchone()
    if not log:
        return jsonify({'error': 'Timer not found'}), 404
    now = datetime.datetime.now()
    start = datetime.datetime.fromisoformat(log['started_at'])
    duration = int((now - start).total_seconds())
    db.execute('UPDATE time_logs SET stopped_at = ?, duration_secs = ? WHERE id = ?',
               (now.isoformat(), duration, log_id))
    db.execute('UPDATE todos SET total_time_secs = total_time_secs + ? WHERE id = ?', (duration, todo_id))
    db.commit()
    return jsonify({'duration_secs': duration})

@extra_bp.route('/todos/<int:todo_id>/time', methods=['GET'])
@jwt_required()
def get_time(todo_id):
    db = get_db()
    total = db.execute('SELECT total_time_secs FROM todos WHERE id = ?', (todo_id,)).fetchone()
    return jsonify({'total_secs': total['total_time_secs'] if total else 0})

# ─── Tags ─────────────────────────────────────────────────
@extra_bp.route('/tags', methods=['GET'])
@jwt_required()
def get_tags():
    user_id = int(get_jwt_identity())
    db = get_db()
    tags = db.execute('SELECT * FROM tags WHERE user_id = ?', (user_id,)).fetchall()
    return jsonify([dict(t) for t in tags])

@extra_bp.route('/tags', methods=['POST'])
@jwt_required()
def create_tag():
    user_id = int(get_jwt_identity())
    data = request.json
    db = get_db()
    try:
        db.execute('INSERT INTO tags (user_id, name, color) VALUES (?, ?, ?)',
                   (user_id, data['name'], data.get('color', '#6366f1')))
        db.commit()
        return jsonify({'message': 'Tag created'}), 201
    except Exception:
        return jsonify({'error': 'Tag already exists'}), 409

@extra_bp.route('/todos/<int:todo_id>/tags', methods=['POST'])
@jwt_required()
def add_tag_to_todo(todo_id):
    tag_id = request.json.get('tag_id')
    db = get_db()
    try:
        db.execute('INSERT OR IGNORE INTO todo_tags (todo_id, tag_id) VALUES (?, ?)', (todo_id, tag_id))
        db.commit()
    except Exception:
        pass
    return jsonify({'message': 'Tag assigned'})

@extra_bp.route('/todos/<int:todo_id>/tags/<int:tag_id>', methods=['DELETE'])
@jwt_required()
def remove_tag_from_todo(todo_id, tag_id):
    db = get_db()
    db.execute('DELETE FROM todo_tags WHERE todo_id = ? AND tag_id = ?', (todo_id, tag_id))
    db.commit()
    return jsonify({'message': 'Tag removed'})

@extra_bp.route('/tags/<int:tag_id>', methods=['DELETE'])
@jwt_required()
def delete_tag(tag_id):
    db = get_db()
    db.execute('DELETE FROM tags WHERE id = ?', (tag_id,))
    db.commit()
    return jsonify({'message': 'Tag deleted'})

# ─── Focus Pin ────────────────────────────────────────────
@extra_bp.route('/todos/<int:todo_id>/focus', methods=['PUT'])
@jwt_required()
def toggle_focus(todo_id):
    db = get_db()
    cur = db.execute('SELECT is_focus FROM todos WHERE id = ?', (todo_id,)).fetchone()
    new_val = 0 if (cur and cur['is_focus']) else 1
    db.execute('UPDATE todos SET is_focus = ? WHERE id = ?', (new_val, todo_id))
    db.commit()
    return jsonify({'is_focus': new_val})

# ─── Streak ──────────────────────────────────────────────
@extra_bp.route('/streak', methods=['GET'])
@jwt_required()
def get_streak():
    user_id = int(get_jwt_identity())
    db = get_db()
    user = db.execute('SELECT streak, last_completed_date FROM users WHERE id = ?', (user_id,)).fetchone()
    return jsonify({'streak': user['streak'] if user else 0, 'last_completed_date': user['last_completed_date'] if user else None})

# ─── Heatmap Data ─────────────────────────────────────────
@extra_bp.route('/heatmap', methods=['GET'])
@jwt_required()
def heatmap():
    user_id = int(get_jwt_identity())
    db = get_db()
    rows = db.execute(
        "SELECT date(created_at) as day, COUNT(*) as count FROM todos "
        "WHERE user_id = ? AND completed = 1 GROUP BY day",
        (user_id,)
    ).fetchall()
    return jsonify([dict(r) for r in rows])

# ─── Recurring Tasks ──────────────────────────────────────
@extra_bp.route('/todos/<int:todo_id>/recur', methods=['POST'])
@jwt_required()
def set_recur(todo_id):
    db = get_db()
    interval = request.json.get('interval', 'daily')  # daily | weekly | monthly
    db.execute('UPDATE todos SET is_recurring = 1, recur_interval = ? WHERE id = ?', (interval, todo_id))
    db.commit()
    return jsonify({'message': f'Task set to recur {interval}'})

@extra_bp.route('/todos/<int:todo_id>/recur', methods=['DELETE'])
@jwt_required()
def remove_recur(todo_id):
    db = get_db()
    db.execute('UPDATE todos SET is_recurring = 0, recur_interval = NULL WHERE id = ?', (todo_id,))
    db.commit()
    return jsonify({'message': 'Recurrence removed'})

# ─── Overdue ──────────────────────────────────────────────
@extra_bp.route('/todos/overdue', methods=['GET'])
@jwt_required()
def get_overdue():
    user_id = int(get_jwt_identity())
    today = date.today().isoformat()
    db = get_db()
    rows = db.execute(
        "SELECT * FROM todos WHERE user_id = ? AND due_date < ? AND completed = 0 ORDER BY due_date ASC",
        (user_id, today)
    ).fetchall()
    return jsonify([dict(r) for r in rows])
