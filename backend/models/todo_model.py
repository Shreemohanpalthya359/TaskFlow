from extensions.db import get_db

def create_todo(title, description, user_id):
    db = get_db()
    db.execute(
        "INSERT INTO todos (title, description, user_id) VALUES (?, ?, ?)",
        (title, description, user_id)
    )
    db.commit()

def get_todos(user_id):
    db = get_db()
    return db.execute(
        "SELECT * FROM todos WHERE user_id = ?", (user_id,)
    ).fetchall()

def update_todo(todo_id, completed):
    db = get_db()
    db.execute(
        "UPDATE todos SET completed = ? WHERE id = ?",
        (completed, todo_id)
    )
    db.commit()

def delete_todo(todo_id):
    db = get_db()
    db.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
    db.commit()
