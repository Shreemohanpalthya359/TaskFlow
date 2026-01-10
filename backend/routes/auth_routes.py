from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.auth_service import register_user, login_user, update_profile

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    register_user(data['username'], data['email'], data['password'], data.get('avatar'))
    return jsonify({'message': 'User registered successfully'})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    token = login_user(data['email'], data['password'])
    if not token:
        return jsonify({'error': 'Invalid credentials'}), 401
    return jsonify({'access_token': token})

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile_route():
    user_id = int(get_jwt_identity())
    data = request.json
    update_profile(user_id, data.get('avatar'))
    return jsonify({'message': 'Profile updated successfully'})
