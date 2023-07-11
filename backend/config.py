import uuid

class Config():
    SECRET_KEY = uuid.uuid4().hex

class devConfig(Config):
    MYSQL_HOST     = "localhost"
    MYSQL_USER     = "root"
    MYSQL_PASSWORD = ""
    MYSQL_DB       = "language-test"

class prodConfig(Config):
    # MYSQL_HOST     = "/cloudsql/lingua-audire:us-central1:lingua-audire-mysql"
    MYSQL_UNIX_SOCKET = "/cloudsql/lingua-audire:us-central1:lingua-audire-sql"
    MYSQL_USER     = "root"
    MYSQL_PASSWORD = "),DpIU5nj5|7$F4y"
    MYSQL_DB       = "db"