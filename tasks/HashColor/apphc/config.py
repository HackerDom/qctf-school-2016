import os
basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'apphc.db')
SQLALCHEMY_DATABASE_FILE = os.path.join(basedir, 'apphc.db')
