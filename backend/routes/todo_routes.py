from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.todo_service import add_task, list_tasks, mark_done, remove_task

todo_bp = Blueprint("todo", __name__, url_prefix="/todos")

@todo_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    user_id = get_jwt_identity()
    data = request.json
    add_task(data["title"], data.get("description", ""), user_id)
    return jsonify({"message": "Task created"})

@todo_bp.route("/", methods=["GET"])
@jwt_required()
def get_all():
    user_id = get_jwt_identity()
    todos = list_tasks(user_id)
    return jsonify([dict(todo) for todo in todos])

@todo_bp.route("/<int:todo_id>", methods=["PUT"])
@jwt_required()
def update(todo_id):
    data = request.json
    mark_done(todo_id, data["completed"])
    return jsonify({"message": "Task updated"})

@todo_bp.route("/<int:todo_id>", methods=["DELETE"])
@jwt_required()
def delete(todo_id):
    remove_task(todo_id)
    return jsonify({"message": "Task deleted"})
