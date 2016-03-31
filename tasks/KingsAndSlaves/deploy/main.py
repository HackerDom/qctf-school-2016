import hashlib
from flask import Flask, render_template, redirect, url_for, request, flash, abort
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.bootstrap import Bootstrap
from flask.ext.login import LoginManager, UserMixin, login_required, login_user, logout_user, current_user
from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, SubmitField, ValidationError
from wtforms.validators import Required, Length, EqualTo, Regexp


app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
db = SQLAlchemy(app)

Bootstrap(app)

login_manager = LoginManager()
login_manager.session_protection = "strong"
login_manager.login_view = "index"
login_manager.init_app(app)
app.config["SECRET_KEY"] = "QCTF_d561499418f345c491cce265067d0b0f"


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(32))
    is_king = db.Column(db.Boolean, default=False)
    is_god = db.Column(db.Boolean, default=False)
    money = db.Column(db.Integer, default=1000)

    def __init__(self, username, password):
        self.username = username
        self.password_hash = hashlib.md5(password.encode()).hexdigest()

    def verify_password(self, password):
        if hashlib.md5(password.encode()).hexdigest() == self.password_hash:
            return True
        return False

    def set_password(self, password):
        self.password_hash = hashlib.md5(password.encode()).hexdigest()

    def __repr__(self):
        return "<User {0}>".format(self.username)


class LoginForm(Form):
    username = StringField("Имя",validators=[Required("Имя не должно быть пустым."), Length(1, 64, message="Длина имени должна быть от 1 до 64.")])
    password = PasswordField("Пароль", validators=[Required("Пароль не должен быть пустым.")])
    submit = SubmitField("Проснуться")


class RegisterForm(Form):
    username = StringField("Имя", validators=[Required("Имя не должно быть пустым."), Length(1, 64, message="Длина имени должна быть от 1 до 64."), Regexp("^[A-Za-z][A-Za-z0-9.]*$", 0, "Имя может содержать только латинские буквы, цифры и точки.")])
    password = PasswordField("Пароль", validators=[Required("Пароль не должен быть пустым."), EqualTo("password2", message="Пароли должны совпадать.")])
    password2 = PasswordField("Еще раз", validators=[Required("Пароль не должен быть пустым.")])
    submit = SubmitField("Родиться")

    def validate_username(self, username):
        if User.query.filter_by(username=username.data).first():
            raise ValidationError("Пользователь с таким именем уже родился.")


class EditForm(Form):
    password = PasswordField("Пароль", validators=[Required("Пароль не должен быть пустым."), EqualTo("password2", message="Пароли должны совпадать.")])
    password2 = PasswordField("Еще раз", validators=[Required("Пароль не должен быть пустым.")])
    submit = SubmitField("Сменить пароль")


@login_manager.user_loader
def load_user(user_id):
    return User.query.filter_by(id=int(user_id)).first()


@app.route("/", methods=["GET", "POST"])
def index():
    if current_user.is_authenticated:
        return redirect(url_for("profile", person=current_user.username))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user, True)
            return redirect(request.args.get("next") or url_for("profile", person=user.username))
        flash("Неверное имя или пароль. Или вы уже умерли.")
    return render_template("index.html", login_form=form)


@app.route("/auth/logout")
@login_required
def logout():
    logout_user()
    flash("Вы смогли уснуть.")
    return redirect(url_for("index"))


@app.route("/auth/register", methods=["GET", "POST"])
def register():
    login_form = LoginForm()
    form = RegisterForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, password=form.password.data)
        god = User(username="БОГ_{0}".format(hashlib.md5(form.username.data.encode()).hexdigest()), password="SomeSecretPassword")
        god.is_king = True
        god.is_god = True
        db.session.add(user)
        db.session.add(god)

        db.session.commit()
        flash("Поздравляем. Вы родились!")
        return redirect(url_for("index"))
    return render_template("register.html", register_form=form, login_form=login_form)


@app.route("/profile/<person>/edit", methods=["GET", "POST"])
@login_required
def edit(person):
    form = EditForm()
    if form.validate_on_submit():
        person = User.query.filter_by(username=person).first()
        if person:
            person.set_password(form.password.data)
            db.session.add(person)
            db.session.commit()
            flash("Пароль успешно изменен.")
            return redirect(url_for("profile", person=person.username))
    return render_template("edit.html", edit_form=form)


@app.route("/profile/<person>/show")
@login_required
def profile(person):
    if person == "БОГ" and not current_user.username.startswith("БОГ"):
        return redirect(url_for("profile", person="БОГ_{0}".format(hashlib.md5(current_user.username.encode()).hexdigest())))
    user = User.query.filter_by(username=person).first()
    if user is None:
        abort(404)
    return render_template("profile.html", user=user)


@app.route("/profile/secret")
@login_required
def secret():
    if current_user.is_king:
        if current_user.money >= 100000:
            current_user.money -= 100000
            flash("Секрет: {0}".format(app.config["SECRET_KEY"]))
            db.session.add(current_user)
            db.session.commit()
        else:
            flash("У вас не хватает золота, Ваше Величество. Нужно 100000.")
    else:
        flash("Только истинные короли могут купить секрет.")
    return redirect(url_for("profile", person=current_user.username))


@app.route("/profile/king")
@login_required
def king():
    flash("Королем можно стать только с божьей помощью. Но БОГ ничего не сделает. Ему лень.")
    return redirect(url_for("profile", person=current_user.username))


@app.route("/profile/kill")
@login_required
def killing():
    if current_user.username == "КОРОЛЬ":
        flash("Вы бессмертны и не можете погибнуть. Мучайтесь.")
        return redirect(url_for("profile", person=current_user.username))
    User.query.filter_by(username=current_user.username).delete()
    User.query.filter_by(username="БОГ_{0}".format(hashlib.md5(current_user.username.encode()).hexdigest())).delete()
    db.session.commit()
    logout_user()
    flash("Вы покончили жизнь самоубийством.")
    return redirect(url_for("index"))


@app.route("/profile/<king>/tax")
@login_required
def tax(king):
    king = User.query.filter_by(username=king).first()
    if king and king.is_king:
        if king.money <= 1000000:
            king.money += 100
        current_user.money -= 100
        db.session.add(king)
        db.session.add(current_user)
        flash("Налог успешно оплачен.")
        db.session.commit()
        if current_user.money <= 0:
            User.query.filter_by(username=current_user.username).delete()
            User.query.filter_by(username="БОГ_{0}".format(hashlib.md5(current_user.username.encode()).hexdigest())).delete()
            db.session.commit()
            flash("Вы отдали последнее и погибли от голода.")
            return redirect(url_for("index"))
    return redirect(url_for("profile", person=king.username))


@app.route("/profile/<king>/downgrade")
@login_required
def downgrade(king):
    if current_user.is_god:
        king = User.query.filter_by(username=king).first()
        if king and king.is_king:
            king.is_king = False
            db.session.add(king)
            db.session.commit()
            flash("Вы успешно сделали из короля холопа. Так держать!")
            return redirect(url_for("profile", person=king.username))
    return redirect(url_for("profile", person=current_user.username))


@app.route("/profile/<king>/upgrade")
@login_required
def upgrade(king):
    if current_user.is_god:
        king = User.query.filter_by(username=king).first()
        if king and not king.is_king:
            king.is_king = True
            db.session.add(king)
            db.session.commit()
            flash("Вы успешно сделали из холопа короля. К чему это приведет?")
            return redirect(url_for("profile", person=king.username))
    return redirect(url_for("profile", person=current_user.username))


@app.errorhandler(404)
def page_not_found(e):
    login_form = LoginForm()
    return render_template('error.html', login_form=login_form), 404


@app.errorhandler(500)
def internal_server_error(e):
    login_form = LoginForm()
    return render_template('error.html', login_form=login_form), 500


db.create_all()
if not User.query.filter_by(username="КОРОЛЬ").first():
    king = User(username="КОРОЛЬ", password="SuperKing")
    king.is_king = True
    db.session.add(king)
    db.session.commit()


if __name__ == "__main__":
    app.run(debug=False)
