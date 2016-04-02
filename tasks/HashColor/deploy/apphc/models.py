from apphc import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(64), index=True, unique=True)
    password = db.Column(db.String(120), index=True, unique=False)
    referral = db.Column(db.String(64), index=True)
    count = db.Column(db.SmallInteger)
    userhash = db.Column(db.String(32))
    flag = db.Column(db.Boolean, default=False)
    authenticated = db.Column(db.Boolean, default=False)
    show = db.Column(db.Boolean, default=False)

    def __init__(self, login, password, referral, count, userhash, flag):
        self.login = login
        self.password = password
        self.referral = referral
        self.count = count
        self.userhash = userhash
        self.flag = flag

    def __repr__(self):
        return "<User(login='{}', password='{}', referral='{}', count='{}', userhash='{}', flag='{}')>". \
            format(self.login, self.password, self.referral, self.count, self.userhash, self.flag)

    def is_authenticated(self):
        return self.authenticated

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id
