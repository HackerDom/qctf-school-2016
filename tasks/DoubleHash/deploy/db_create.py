#!flask/bin/python
from app import db, app
from app.models import User
from hashlib import md5

db.create_all()
password = 'love'
salt = '5A17'

hash_password = md5((password + salt).encode()).hexdigest()

user = User(login='admin', password=hash_password)
db.session.add(user)
db.session.commit()
