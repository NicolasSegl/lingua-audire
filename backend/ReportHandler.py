from flask_restful import Resource, reqparse

from backend.database import db

parser = reqparse.RequestParser()
parser.add_argument("path")

# defines the REST endpoint that handles sending clips to users
class ReportHandler(Resource):
	# this POST request will be sent when a user has clicked on the report button on the game page
	def post(self):
		args = parser.parse_args()

		# get a cursosr into the database
		cursor = db.connection.cursor()

		# execute the SQL query that will update the row
		cursor.execute("UPDATE clip SET reports = reports + 1 WHERE path = %s", (args['path'],))

		# commit the changes
		db.connection.commit()

		cursor.close()

		return None