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
    cursor = db.execute('''
        SELECT c.name, 
               COUNT(t.id) as total_tasks, 
               SUM(CASE WHEN t.completed = 1 THEN 1 ELSE 0 END) as completed_tasks
        FROM customers c
        LEFT JOIN todos t ON c.id = t.customer_id
        WHERE c.user_id = ?
        GROUP BY c.id, c.name
    ''', (user_id,))
    
    reports = []
    for row in cursor.fetchall():
        reports.append({
            'name': row['name'],
            'total_tasks': row['total_tasks'],
            'completed_tasks': row['completed_tasks'] or 0
        })
    return reports