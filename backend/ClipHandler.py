from flask import jsonify, request
from flask_restful import Resource

from backend.constants import SQL_PATH_INDEX, SQL_SENTENCE_INDEX
from backend.database import db

import base64 # for encoding the audio data so the frontend can handle it
import random # for randomly selecting a clip (will be used only temporarily, for testing purposes)
import os # for testing purposes

# defines the REST endpoint that handles sending clips to users
class ClipHandler(Resource):
	def get(self):
		# get the difficulty parameter passed in by the client
		difficulty = int(request.args["difficulty"])
		language   = request.args["language"]

		# query the database for a random clip
		cursor = db.connection.cursor()

		# defines the lower boundary for the requested clip's difficulty (assuming a default difficulty of 1/easy)
		difficultyLower  = 0

		# defines the upper boundary for the requested clip's difficulty (assuming a default difficulty of 1/easy)
		difficultyUpper = 12

		if difficulty == 2: # medium difficulty
			difficultyLower = 13
			difficultyUpper = 40
		elif difficulty == 3: # hard difficulty
			difficultyLower = 41
			difficultyUpper = 100
		elif difficulty >= 4: # very hard difficulty (or the user has typed into the url their own difficulty)
			difficultyLower = 101
			difficultyUpper = 9999

		try:
			cursor.execute(f"SELECT * FROM clip WHERE clip.language = \"{language}\" AND clip.difficulty < {difficultyUpper} AND clip.difficulty > {difficultyLower} ORDER BY RAND () LIMIT 1")
		except:
			cursor.close()
			return
				
		try:
			rv = cursor.fetchall()
			index = random.randint(0, len(rv) - 1)
			fileName = rv[index][SQL_PATH_INDEX]
			sentence = rv[index][SQL_SENTENCE_INDEX]
			cursor.close()
		except:
			cursor.close()
			return

		# this ensures that the file will be found (some of the .tsv files include the name
		# of the audio file, but omit the .mp3 extension on the name)
		if not fileName.endswith(".mp3"):
			fileName += ".mp3"

		# using the clip's filename, send the file to the user
		with open(f"languages/{language}/clips/" + fileName, "rb") as file:
			# encode the file as base64 so that the javascript can play the file as audio
			response = jsonify({"audioData": base64.b64encode(file.read()).decode("utf-8"), "sentence": sentence, "path": fileName})
			return response