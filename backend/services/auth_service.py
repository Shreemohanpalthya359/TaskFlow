from models.user_model import create_user, get_user_by_email, update_user_avatar
from utils.password_hash import hash_password, verify_password
from flask_jwt_extended import create_access_token

def register_user(username, email, password, avatar=None):
    hashed = hash_password(password)
    create_user(username, email, hashed, avatar)

def login_user(email, password):
    user = get_user_by_email(email)
    if not user or not verify_password(password, user['password']):
        return None
    return create_access_token(identity=str(user['id']))

def update_profile(user_id, avatar):
    update_user_avatar(user_id, avatar)
