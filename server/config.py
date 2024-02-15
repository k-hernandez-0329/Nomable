# Standard library imports
import secrets

# Remote library imports
from flask import Flask, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
import os


# Local imports

# Instantiate app, set attributes
app = Flask(__name__)

app.config["SECRET_KEY"] = secrets.token_bytes(16)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = os.environ.get("UPLOAD_FOLDER", "uploads")

app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)
bcrypt = Bcrypt(app)
template_dir = os.path.join(os.path.dirname(__file__), "templates")
app.template_folder = template_dir
# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)
