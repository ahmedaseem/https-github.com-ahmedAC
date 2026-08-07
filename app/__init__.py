"""
ASEM Global Platform
Application Factory
"""

from flask import Flask

from app.extensions import (
    db,
    migrate,
    jwt
)


def create_app():

    app = Flask(__name__)

    app.config.from_object(
        "config.Config"
    )


    db.init_app(app)

    migrate.init_app(
        app,
        db
    )


    jwt.init_app(
        app
    )


    # Load models once
    from flask import Flask

from app.extensions import (
    db,
    migrate,
    jwt
)

from app.auth.routes import auth_bp
from app.api.routes import api_bp


def create_app():

    app = Flask(__name__)


    app.config.from_object(
        "config.Config"
    )


    db.init_app(app)

    migrate.init_app(
        app,
        db
    )


    jwt.init_app(
        app
    )


    app.register_blueprint(
        auth_bp
    )


    app.register_blueprint(
        api_bp
    )


    return app
