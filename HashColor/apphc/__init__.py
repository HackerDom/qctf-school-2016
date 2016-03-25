from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from apphc.config import SQLALCHEMY_DATABASE_URI

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['CSRF_ENABLED'] = True
app.config['SECRET_KEY'] = 'fuck_off'
db = SQLAlchemy(app)

from apphc import views, models, scripts
