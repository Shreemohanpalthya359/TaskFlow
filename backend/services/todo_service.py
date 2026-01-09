from models.todo_model import create_todo, get_todos, update_todo, delete_todo

def add_task(title, description, user_id):
    create_todo(title, description, user_id)

def list_tasks(user_id):
    return get_todos(user_id)

def mark_done(todo_id, completed):
    update_todo(todo_id, completed)

def remove_task(todo_id):
    delete_todo(todo_id)
