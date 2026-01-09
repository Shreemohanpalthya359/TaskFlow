from models.user_model import create_user, get_user_by_email
from utils.password_hash import hash_password, verify_password
from utils.jwt_handler import generate_token

def register_user(username, email, password):
    hashed = hash_password(password)
    create_user(username, email, hashed)

def login_user(email, password):
    user = get_user_by_email(email)
    if user and verify_password(password, user["password"]):
        return generate_token(user["id"])
    return None
