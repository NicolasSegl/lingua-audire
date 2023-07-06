import uuid

class Config():
    SECRET_KEY = uuid.uuid4().hex

class devConfig(Config):
    MYSQL_HOST     = "localhost"
    MYSQL_USER     = "root"
    MYSQL_PASSWORD = ""
    MYSQL_DB       = "language-test"

class prodConfig(Config):
    MYSQL_HOST     = "db"
    MYSQL_USER     = "root"
    MYSQL_PASSWORD = "root"
    MYSQL_DB       = "db"