from extensions.db import get_db

def create_user(username, email, password, avatar=None):
    db = get_db()
    db.execute('INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)',
               (username, email, password, avatar))
    db.commit()

def get_user_by_email(email):
    db = get_db()
    return db.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()

def update_user_avatar(user_id, avatar):
    db = get_db()
    db.execute('UPDATE users SET avatar = ? WHERE id = ?', (avatar, user_id))
    db.commit()
