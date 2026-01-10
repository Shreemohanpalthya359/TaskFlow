from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.customer_service import add_customer, get_customers, get_customer, edit_customer, remove_customer, get_reports

customer_bp = Blueprint("customer", __name__, url_prefix="/customers")

@customer_bp.route("/", methods=["POST"])
@jwt_required()
def create_customer():
    user_id = int(get_jwt_identity())
    data = request.json
    customer_id = add_customer(data["name"], user_id)
    return jsonify({"message": "Customer added", "id": customer_id})

@customer_bp.route("/", methods=["GET"])
@jwt_required()
def list_customers():
    user_id = int(get_jwt_identity())
    customers = get_customers(user_id)
    return jsonify([dict(c) for c in customers])

@customer_bp.route("/<int:customer_id>", methods=["GET"])
@jwt_required()
def get_customer_detail(customer_id):
    user_id = int(get_jwt_identity())
    customer = get_customer(customer_id, user_id)
    if not customer:
        return jsonify({"error": "Customer not found"}), 404
    return jsonify(dict(customer))

@customer_bp.route("/<int:customer_id>", methods=["PUT"])
@jwt_required()
def update_customer(customer_id):
    user_id = int(get_jwt_identity())
    data = request.json
    edit_customer(customer_id, data["name"], user_id)
    return jsonify({"message": "Customer updated"})

@customer_bp.route("/<int:customer_id>", methods=["DELETE"])
@jwt_required()
def delete_customer(customer_id):
    user_id = int(get_jwt_identity())
    remove_customer(customer_id, user_id)
    return jsonify({"message": "Customer deleted"})

@customer_bp.route("/reports", methods=["GET"])
@jwt_required()
def get_reports_route():
    user_id = int(get_jwt_identity())
    reports = get_reports(user_id)
    return jsonify(reports)