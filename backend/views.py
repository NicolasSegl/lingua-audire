from flask import Blueprint, send_from_directory

blueprint = Blueprint("app", __name__)

@blueprint.route('/')
def index():
    return send_from_directory('../frontend/build', "index.html")

@blueprint.route('/game/<path:text>')
def game(text):
    return send_from_directory("../frontend/build", "index.html")

@blueprint.route('/About/')
def about():
    return send_from_directory("../frontend/build", "index.html")