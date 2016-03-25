from flask import render_template, request, make_response, redirect
from apphc import app, db, models, forms
from apphc.scripts import *


@app.route('/')
@app.route('/index/')
@app.route('/home/')
def main():
    login = request.cookies.get('login')
    flag = ''
    resp = make_response(render_template("main.htm", flag=flag))

    # if login:
    #     users = models.User.query.all()
    #     for u in users:
    #         if u.login == login
        # password = request.args.get('password')
        # count = request.cookies.get('count')
        # if int(count) <= 0:
        #     count = '0'
        # resp = make_response(render_template("main.htm", login=login, count=count))
        # inviter = request.cookies.get('inviter')
        # invite = request.cookies.get('invite')
        # if invite and inviter:
        #     inviter_hash = separate_blocks(get_md5_hex(inviter))[-1]
        #     if inviter_hash == get_hash_part(invite):
        #         resp = make_response(render_template("main.htm", flag='invite'))

        # resp.set_cookie('user', get_md5_hex(login)[10][::-1])
        # resp.set_cookie('inviter', get_md5_hex(inviter)[6*4][::-1])

    return resp

#
# @app.route('/image/')
# def get_image():
#     login = request.cookies.get('login')
#     count = request.cookies.get('count')
#     if login and count and (int(count) >= 1):
#         # has a problem with file / count / else
#         response = make_response(render_template("image.html", image=login+str(int(count)-1)))
#         response.set_cookie('count', int(count) - 1)
#         return response
#     return render_template("image.html")


@app.route('/registration/', methods=['POST', 'GET'])
def registration():
    form = forms.RegistrationForm()
    # if login:
    #     password = request.args.get('password')
    #     referral = request.args.get('referral')
    #     invite = request.args.get('invite')
    #     flag = False
    #     userhash = get_md5_hex(login)
    #     if get_hash_part(invite) == separate_blocks(get_md5_hex(referral))[-1]:
    #         flag = True
    #     # users = models.User.query.all()
    #     # for u in users:
    #     #     if u.login == login:
    #     #         return render_template("registration.htm", already_in=True)
    #     user = models.User(login, password, referral, 4, userhash, flag)
    #     db.session.add(user)
    #     db.session.commit()
    #     redirect_to_index = redirect('/index/')
    #     response = app.make_response(redirect_to_index)
    #     response.set_cookie('login', login)
    if form.validate_on_submit():
        login = form.login.data
        password = form.password.data
        invite = form.invite.data
        # filename = secure_filename(form.invite.data)
        # print(form.invite.raw_data)
        # print(invite)
        # for i in request.files:
        #     print(i)


        # print(request.files[invite])


        # print('fuck')
        # file = request.files[form.invite.data].read()
        # print(file)
        print(dir(invite))
        print(type(invite))
        # todo:save file from invite to BytesIO
        # todo:add a correct login system
        print('register', login, password, invite)
        return redirect('/index')
    return render_template("registration.htm", form=form)


@app.route('/login/', methods=['POST', 'GET'])
def login():
    form = forms.LoginForm()
    if form.validate_on_submit():

        # flash('Login requested for login="' + form.login.data + '", password=' + str(form.password.data))
        login = form.login.data
        password = form.password.data
        print('login', login, password)
        return redirect('/index')
    return render_template("login.htm", form=form)
