from models.todo_model import create_todo, get_todos_by_customer, get_all_todos, update_todo, delete_todo
from fpdf import FPDF
import io

def add_task(title, description, customer_id, user_id):
    create_todo(title, description, customer_id, user_id)

def list_tasks_by_customer(customer_id, user_id):
    return get_todos_by_customer(customer_id, user_id)

def list_all_tasks(user_id):
    return get_all_todos(user_id)

def mark_done(todo_id, completed, user_id):
    update_todo(todo_id, completed, user_id)

def remove_task(todo_id, user_id):
    delete_todo(todo_id, user_id)

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
        pdf.cell(200, 10, txt=f"Description: {todo['description'] or 'N/A'}", ln=True)
        pdf.cell(200, 10, txt=f"Customer: {todo['customer_name']}", ln=True)
        pdf.cell(200, 10, txt=f"Completed: {'Yes' if todo['completed'] else 'No'}", ln=True)
        pdf.cell(200, 10, txt="", ln=True)

    buffer = io.BytesIO()
    pdf.output(buffer)
    buffer.seek(0)
    return buffer
