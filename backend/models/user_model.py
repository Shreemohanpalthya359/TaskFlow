from extensions.db import get_db

def create_user(username, email, password, avatar=None):
    db = get_db()
    db.execute('INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)',
               (username, email, password, avatar))
    db.commit()

def update_user_avatar(user_id, avatar):
    db = get_db()
    db.execute('UPDATE users SET avatar = ? WHERE id = ?', (avatar, user_id))
    db.commit()

def get_user_by_email(email):
    db = get_db()
    return db.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()

def add_karma(user_id, points):
    db = get_db()
    user = db.execute('SELECT karma_points, level FROM users WHERE id = ?', (user_id,)).fetchone()
    if user:
        new_points = user['karma_points'] + points
        new_level = user['level']
        
        # Level up every 100 points
        if new_points >= 100:
            new_level += new_points // 100
            new_points = new_points % 100
            
        db.execute('UPDATE users SET karma_points = ?, level = ? WHERE id = ?', (new_points, new_level, user_id))
        db.commit()
