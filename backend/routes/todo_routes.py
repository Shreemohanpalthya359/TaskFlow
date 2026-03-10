from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.todo_service import (add_task, list_all_tasks, mark_done, remove_task,
                                   export_tasks_pdf, fetch_stats, add_subtask,
                                   toggle_subtask_done, remove_subtask)
import os, json

todo_bp = Blueprint("todo", __name__, url_prefix="/todos")

@todo_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    user_id = int(get_jwt_identity())
    data = request.json
    add_task(data["title"], data.get("description", ""), user_id,
             data.get("priority", "Medium"), data.get("category", "General"), data.get("due_date"))
    return jsonify({"message": "Task created"}), 201

@todo_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all():
    user_id = int(get_jwt_identity())
    todos = list_all_tasks(user_id)
    return jsonify(todos)

@todo_bp.route("/stats", methods=["GET"])
@jwt_required()
def stats():
    user_id = int(get_jwt_identity())
    return jsonify(fetch_stats(user_id))

@todo_bp.route("/<int:todo_id>", methods=["PUT"])
@jwt_required()
def update(todo_id):
    user_id = int(get_jwt_identity())
    data = request.json
    newly_earned = mark_done(todo_id, data["completed"], user_id, data.get("status"))
    return jsonify({"message": "Task updated", "new_badges": newly_earned})

@todo_bp.route("/<int:todo_id>", methods=["DELETE"])
@jwt_required()
def delete(todo_id):
    user_id = int(get_jwt_identity())
    remove_task(todo_id, user_id)
    return jsonify({"message": "Task deleted"})

# ─── Subtasks ────────────────────────────────────────────
@todo_bp.route("/<int:todo_id>/subtasks", methods=["POST"])
@jwt_required()
def add_sub(todo_id):
    data = request.json
    add_subtask(todo_id, data["title"])
    return jsonify({"message": "Subtask added"}), 201

@todo_bp.route("/subtasks/<int:subtask_id>/toggle", methods=["PUT"])
@jwt_required()
def toggle_sub(subtask_id):
    toggle_subtask_done(subtask_id)
    return jsonify({"message": "Subtask toggled"})

@todo_bp.route("/subtasks/<int:subtask_id>", methods=["DELETE"])
@jwt_required()
def delete_sub(subtask_id):
    remove_subtask(subtask_id)
    return jsonify({"message": "Subtask deleted"})

# ─── AI Breakdown ────────────────────────────────────────
@todo_bp.route("/ai-breakdown", methods=["POST"])
@jwt_required()
def ai_breakdown():
    data = request.json
    goal = data.get("goal", "")
    if not goal:
        return jsonify({"error": "Goal is required"}), 400

    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        # Fallback: return smart dummy subtasks when no API key
        words = goal.lower()
        subtasks = [
            f"Research and plan: {goal}",
            f"Break down the first step of: {goal}",
            f"Execute the main action for: {goal}",
            f"Review and test results of: {goal}",
            f"Finalize and complete: {goal}"
        ]
        return jsonify({"subtasks": subtasks})

    try:
        import urllib.request
        prompt = (f"Break this goal into 4-6 clear, actionable subtasks. "
                  f"Return ONLY a JSON array of strings, nothing else.\n\nGoal: {goal}")
        payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode()
        req = urllib.request.Request(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}",
            data=payload, headers={"Content-Type": "application/json"}, method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read())
        text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
        # Parse JSON from response
        import re
        match = re.search(r'\[.*?\]', text, re.DOTALL)
        subtasks = json.loads(match.group()) if match else [text]
        return jsonify({"subtasks": subtasks})
    except Exception as e:
        # Graceful fallback
        subtasks = [
            f"Research: {goal}",
            f"Plan approach for: {goal}",
            f"Begin execution of: {goal}",
            f"Review progress on: {goal}",
            f"Complete: {goal}"
        ]
        return jsonify({"subtasks": subtasks})

# ─── Export ──────────────────────────────────────────────
@todo_bp.route("/export", methods=["POST"])
@jwt_required()
def export():
    user_id = int(get_jwt_identity())
    data = request.json
    buffer = export_tasks_pdf(data.get("task_ids", []), user_id)
    return send_file(buffer, as_attachment=True, download_name='tasks.pdf', mimetype='application/pdf')
