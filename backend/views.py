from flask import Blueprint, send_from_directory

blueprint = Blueprint("app", __name__)

@blueprint.route('/')
def index():
    return send_from_directory('../frontend/build', "index.html")

@blueprint.route('/game/')
def game():
    return send_from_directory("../frontend/build", "game.html")