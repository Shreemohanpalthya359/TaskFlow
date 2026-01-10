from flask_cors import CORS

def enable_cors(app):
    CORS(app, origins='*', supports_credentials=True)
