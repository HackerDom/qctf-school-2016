from flask import render_template, session, request, url_for, redirect
from app import app, db
from app.models import User
from hashlib import md5

salt = "****"
flag = "*************************************"

@app.route('/', methods=['GET'])
@app.route('/index', methods=['GET'])
def index():
    session['flag'] = "Log in to see flag"
    return render_template("index.html")

@app.route('/', methods=['POST'])
@app.route('/index', methods=['POST'])
def login():
    username = request.form['login']
    password = request.form['password']
    hash_password = md5((password + salt).encode()).hexdigest()
    user = User.query.filter_by(login=username, password=hash_password).first() # не забыть закрыть анонимный доступ в дб
    if user is not None:
        if username == 'admin':
            session['flag'] = flag
        else:
            session['flag'] = "sorry, flag is forbidden"
    else:
        session['flag'] = "uncorrect login-password"
    return render_template("index.html")

@app.route('/reg', methods=['GET'])
def reg_get():
    return render_template("reg.html")

@app.route('/reg', methods=['POST'])
def reg_post():
    username = request.form['login']
    password = request.form['password']
    hash_password = md5((password + salt).encode()).hexdigest()
    user = User(login=username, password=hash_password)
    if User.query.filter_by(login=username).first() is not None:
        session['error_message'] = "user already exists"
        return render_template("reg.html")
    db.session.add(user)
    db.session.commit()
    session['error_message'] = None
    return redirect(url_for("index"))
