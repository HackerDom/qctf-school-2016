from apphc import app, db
from apphc.config import SQLALCHEMY_DATABASE_FILE
import os.path

if not os.path.exists(SQLALCHEMY_DATABASE_FILE):
    print("Creating {}...".format(SQLALCHEMY_DATABASE_FILE))
    db.create_all()
else:
    print("Connecting {}...".format(SQLALCHEMY_DATABASE_FILE))

app.run(debug=False)
