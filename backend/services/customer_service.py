from models.customer_model import create_customer, get_customers_by_user, get_customer_by_id, update_customer, delete_customer
from extensions.db import get_db

def add_customer(name, user_id):
    return create_customer(name, user_id)

def get_customers(user_id):
    return get_customers_by_user(user_id)

def get_customer(customer_id, user_id):
    return get_customer_by_id(customer_id, user_id)

def edit_customer(customer_id, name, user_id):
    update_customer(customer_id, name, user_id)

def remove_customer(customer_id, user_id):
    delete_customer(customer_id, user_id)

def get_reports(user_id):
    db = get_db()
    customers = db.execute('SELECT COUNT(*) as total_customers FROM customers WHERE user_id = ?', (user_id,)).fetchone()['total_customers']
    todos = db.execute('SELECT COUNT(*) as total_todos FROM todos WHERE user_id = ?', (user_id,)).fetchone()['total_todos']
    completed = db.execute('SELECT COUNT(*) as completed_todos FROM todos WHERE user_id = ? AND completed = 1', (user_id,)).fetchone()['completed_todos']
    return {
        'total_customers': customers,
        'total_todos': todos,
        'completed_todos': completed,
        'pending_todos': todos - completed
    }