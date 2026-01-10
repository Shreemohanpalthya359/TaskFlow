from extensions.db import get_db

def create_todo(title, description, customer_id, user_id):
    db = get_db()
    db.execute('INSERT INTO todos (title, description, customer_id, user_id) VALUES (?, ?, ?, ?)',
               (title, description, customer_id, user_id))
    db.commit()

def get_todos_by_customer(customer_id, user_id):
    db = get_db()
    return db.execute('SELECT * FROM todos WHERE customer_id = ? AND user_id = ?', (customer_id, user_id)).fetchall()

def get_all_todos(user_id):
    db = get_db()
    return db.execute('''
        SELECT t.*, c.name as customer_name
        FROM todos t
        JOIN customers c ON t.customer_id = c.id
        WHERE t.user_id = ?
    ''', (user_id,)).fetchall()

def update_todo(todo_id, completed, user_id):
    db = get_db()
    db.execute('UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?', (completed, todo_id, user_id))
    db.commit()

def delete_todo(todo_id, user_id):
    db = get_db()
    db.execute('DELETE FROM todos WHERE id = ? AND user_id = ?', (todo_id, user_id))
    db.commit()
