from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.todo_service import add_task, list_tasks_by_customer, list_all_tasks, mark_done, remove_task, export_tasks_pdf

todo_bp = Blueprint("todo", __name__, url_prefix="/todos")

@todo_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    user_id = int(get_jwt_identity())
    data = request.json
    add_task(data["title"], data.get("description", ""), data["customer_id"], user_id)
    return jsonify({"message": "Task created"})

@todo_bp.route("/customer/<int:customer_id>", methods=["GET"])
@jwt_required()
def get_by_customer(customer_id):
    user_id = int(get_jwt_identity())
    todos = list_tasks_by_customer(customer_id, user_id)
    return jsonify([dict(todo) for todo in todos])

@todo_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all():
    user_id = int(get_jwt_identity())
    todos = list_all_tasks(user_id)
    return jsonify([dict(todo) for todo in todos])

@todo_bp.route("/<int:todo_id>", methods=["PUT"])
@jwt_required()
def update(todo_id):
    user_id = int(get_jwt_identity())
    data = request.json
    mark_done(todo_id, data["completed"], user_id)
    return jsonify({"message": "Task updated"})

@todo_bp.route("/<int:todo_id>", methods=["DELETE"])
@jwt_required()
def delete(todo_id):
    user_id = int(get_jwt_identity())
    remove_task(todo_id, user_id)
    return jsonify({"message": "Task deleted"})

@todo_bp.route("/export", methods=["POST"])
@jwt_required()
def export():
    user_id = int(get_jwt_identity())
    data = request.json
    task_ids = data.get("task_ids", [])
    buffer = export_tasks_pdf(task_ids, user_id)
    return send_file(buffer, as_attachment=True, download_name='tasks.pdf', mimetype='application/pdf')
