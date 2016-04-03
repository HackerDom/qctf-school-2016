from flask import render_template, make_response, redirect
from apphc import app, db, models, forms, lm
from flask_login import login_user, current_user, logout_user, login_required
from apphc.scripts import *


@app.route('/')
@app.route('/index/')
def main():
    resp = make_response(render_template("main.htm"))
    if current_user.is_anonymous != True:

        count = current_user.count
        kwargs = dict()
        kwargs.setdefault('login', current_user.login)
        kwargs.setdefault('hash', current_user.userhash)

        if current_user.show:
            current_user.show = False
            db.session.commit()
            text = 'Инвайт:'
            img = None
            if count > 0:
                img = generate_image(separate_blocks(current_user.userhash)[3 - count])
                current_user.count -= 1
                count = current_user.count
                db.session.commit()
            else:
                text = 'А инвайты кончились :('

            if img:
                kwargs.setdefault('img', img)

            kwargs.setdefault('text', text)

        kwargs.setdefault('count', count)

        if current_user.flag:
            kwargs.setdefault('flag', 'QCTF_f00fba01f86dbf3a22171e514fc32d7e')
            current_user.flag = False
            db.session.commit()
            db.session.delete(current_user)
            db.session.commit()
            logout_user()


        resp = make_response(render_template("main.htm", **kwargs))

    return resp


@app.route('/image/', methods=['GET'])
def get_image():
    current_user.show = True
    db.session.commit()
    return redirect('/')


@app.route('/registration/', methods=['POST', 'GET'])
def registration():
    form = forms.RegistrationForm()

    if form.validate_on_submit():
        login = form.login.data
        password = form.password.data
        invite = form.invite.data
        userhash = get_md5_hex(login)
        flag = False

        if (invite.filename):
            file = get_file_data(invite)
            hashcolor = get_hash_part(file)
            invite = hashcolor
            users = models.User.query.all()
            for u in users:
                if hashcolor == separate_blocks(u.userhash)[-1]:
                    flag = True
        else:
            invite = None

        if models.User.query.filter_by(login=login).first():
            return render_template("registration.htm", form=form, text="Такой пользователь уже есть")

        user = models.User(login, password, invite, 3, userhash, flag)
        db.session.add(user)
        db.session.commit()

        return redirect('/login/')

    return render_template("registration.htm", form=form)


@app.route('/login/', methods=['POST', 'GET'])
def login():
    form = forms.LoginForm()
    if form.validate_on_submit():
        login = form.login.data
        password = form.password.data
        user = models.User.query.filter_by(login=login, password=password).first()
        if user:
            user.authenticated = True
            db.session.commit()
            login_user(user, remember=True)
            return redirect('/')
        else:
            return render_template("login.htm", form=form, text="Ошибочка вышла, логин/пароль не верен!")
    return render_template("login.htm", form=form)


@lm.user_loader
def user_loader(user_id):
    return models.User.query.get(user_id)


@app.route('/logout/', methods=['GET'])
@login_required
def logout():
    user = current_user
    user.authenticated = False
    db.session.commit()
    logout_user()
    return redirect('/')
