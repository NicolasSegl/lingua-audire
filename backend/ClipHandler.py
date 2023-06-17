from flask import jsonify, request
from flask_restful import Resource

from backend.constants import SQL_PATH_INDEX, SQL_SENTENCE_INDEX
from backend.database import db

import base64 # for encoding the audio data so the frontend can handle it
import random # for randomly selecting a clip (will be used only temporarily, for testing purposes)

# defines the REST endpoint that handles sending clips to users
class ClipHandler(Resource):
	def get(self):

		# get the difficulty parameter passed in by the client
		difficulty = int(request.args["difficulty"])
		language   = request.args["language"]

		# query the database for a random clip
		cursor = db.connection.cursor()

		try:
			cursor.execute(f"SELECT * FROM clip WHERE clip.language = \"{language}\" AND clip.difficulty < {difficulty * 10} AND clip.difficulty > {difficulty * 10 - 10}")
		except:
			cursor.close()
			return
		
		rv = cursor.fetchall()
		index = random.randint(0, len(rv) - 1)
		fileName = rv[index][SQL_PATH_INDEX]
		sentence = rv[index][SQL_SENTENCE_INDEX]
		cursor.close()

		# using the clip's filename, send the file to the user
		with open(f"{language}/clips/" + fileName, "rb") as file:
			# encode the file as base64 so that the javascript can play the file as audio
			response = jsonify({"audioData": base64.b64encode(file.read()).decode("utf-8"), "sentence": sentence})
			return response