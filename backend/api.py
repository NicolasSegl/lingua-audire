from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_mysqldb import MySQL

from backend.ClipHandler import ClipHandler
from backend.database import db
from backend.views import blueprint
from backend.config import devConfig

# create a flask app using the factory pattern
def create_app():
    # initialize the flask instance
    app = Flask(__name__, static_url_path='', static_folder='../frontend/build')

    # for development use only: this prevents CORS errors
    CORS(app)

    # initialize the blueprint defining all of the app's view endpoints
    app.register_blueprint(blueprint)

    # initialize flask_restful
    api = Api(app)

    # setup the REST endpoints
    api.add_resource(ClipHandler, "/danish")

    # initialize the app's config
    app.config.from_object(devConfig)

    # initialize the database
    db = MySQL(app)

    return app