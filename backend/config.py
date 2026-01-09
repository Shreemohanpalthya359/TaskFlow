import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "taskflow-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "taskflow-jwt-secret")
    DATABASE = "taskflow.db"
