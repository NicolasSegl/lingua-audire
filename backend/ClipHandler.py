from flask import jsonify
from flask_restful import Resource, reqparse

from backend.constants import SQL_PATH_INDEX, SQL_SENTENCE_INDEX
from backend.database import db

import base64 # for encoding the audio data so the frontend can handle it
import random # for randomly selecting a clip (will be used only temporarily, for testing purposes)

# defines the REST endpoint that handles sending clips to users
class ClipHandler(Resource):
	def get(self):

		# query the database for a random clip
		cursor = db.connection.cursor()
		cursor.execute("SELECT * FROM clip WHERE clip.difficulty < 10")
		rv = cursor.fetchall()
		fileName = rv[random.randint(0, len(rv))][SQL_PATH_INDEX]
		cursor.close()

		# using the clip's filename, send the file to the user
		with open("da/clips/" + fileName, "rb") as file:
			# encode the file as base64 so that the javascript can play the file as audio
			response = jsonify({"audioData": base64.b64encode(file.read()).decode("utf-8")})
			return response