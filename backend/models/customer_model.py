from extensions.db import get_db

def create_customer(name, user_id):
    db = get_db()
    db.execute('INSERT INTO customers (name, user_id) VALUES (?, ?)', (name, user_id))
    db.commit()
    return db.execute('SELECT last_insert_rowid()').fetchone()[0]

def get_customers_by_user(user_id):
    db = get_db()
    return db.execute('SELECT * FROM customers WHERE user_id = ?', (user_id,)).fetchall()

def get_customer_by_id(customer_id, user_id):
    db = get_db()
    return db.execute('SELECT * FROM customers WHERE id = ? AND user_id = ?', (customer_id, user_id)).fetchone()

def update_customer(customer_id, name, user_id):
    db = get_db()
    db.execute('UPDATE customers SET name = ? WHERE id = ? AND user_id = ?', (name, customer_id, user_id))
    db.commit()

def delete_customer(customer_id, user_id):
    db = get_db()
    db.execute('DELETE FROM customers WHERE id = ? AND user_id = ?', (customer_id, user_id))
    db.commit()