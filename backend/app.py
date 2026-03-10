from flask import Flask
from flask_jwt_extended import JWTManager
from extensions.db import init_db, close_db
from extensions.cors import enable_cors
from routes.auth_routes import auth_bp
from routes.todo_routes import todo_bp
from routes.extra_routes import extra_bp
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    enable_cors(app)
    JWTManager(app)

    with app.app_context():
        init_db()

    app.teardown_appcontext(close_db)

    app.register_blueprint(auth_bp)
    app.register_blueprint(todo_bp)
    app.register_blueprint(extra_bp)

    @app.route('/')
    def home():
        return {'message': 'TaskFlow Backend Running 🚀'}

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
