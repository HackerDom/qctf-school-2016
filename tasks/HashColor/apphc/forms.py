from flask_wtf import Form
from wtforms import StringField, FileField
from wtforms.validators import DataRequired


class LoginForm(Form):
    login = StringField('login', validators=[DataRequired('Not a valid login')])
    password = StringField('password', validators=[DataRequired('Not a valid password')])


class RegistrationForm(Form):
    invite = FileField('invite')
    login = StringField('login', validators=[DataRequired('Not a valid login')])
    password = StringField('password', validators=[DataRequired('Not a valid password')])
