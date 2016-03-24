#!/usr/bin/python3


# SQLAlchemy
# python-flask

from flask import Flask, render_template, request, make_response, redirect
from os import walk
from PIL import Image
import bleach
import hashlib

app = Flask(__name__)


def get_md5_hex(login):
    m = hashlib.md5()
    m.update(login.encode())
    return m.hexdigest()


def separate_blocks(md5_hex):
    return [md5_hex[j * 8: (j + 1) * 8] for j in range(len(md5_hex) // 8)]


@app.route('/')
@app.route('/index/')
@app.route('/home/')
def main():
    login = request.cookies.get('login')
    flag = ''
    resp = make_response(render_template("main.htm", flag=flag))

    if login:
        # password = request.args.get('password')
        count = request.cookies.get('count')
        if int(count) <= 0:
            count = '0'
        resp = make_response(render_template("main.htm", login=login, count=count))
        inviter = request.cookies.get('inviter')
        invite = request.cookies.get('invite')
        if invite and inviter:
            inviter_hash = separate_blocks(get_md5_hex(inviter))[-1]
            if inviter_hash == get_part(invite):
                resp = make_response(render_template("main.htm", flag='invite'))

        # resp.set_cookie('user', get_md5_hex(login)[10][::-1])
        # resp.set_cookie('inviter', get_md5_hex(inviter)[6*4][::-1])

    return resp


@app.route('/image/')
def get_image():
    login = request.cookies.get('login')
    count = request.cookies.get('count')
    if login and count and (int(count) >= 1):
        # todo:
        # has a problem with file / count / else
        response = make_response(render_template("image.html", image=login+str(int(count)-1)))
        response.set_cookie('count', int(count) - 1)
        return response
    return render_template("image.html")


@app.route('/register/')
def register():
    login = request.args.get('login')
    if login:
        password = request.args.get('password')
        inviter = request.args.get('inviter')
        invite = request.args.get('invite')
        hashes = separate_blocks(get_md5_hex(login))
        i = 0
        try:
            for h in hashes:
                generate_image(login + str(i), h)
                i += 1
        except Exception as e:
            print(e.args)
        redirect_to_index = redirect('/index/')
        response = app.make_response(redirect_to_index)
        response.set_cookie('login', login)
        response.set_cookie('count', str(4))
        if inviter and invite:
            response.set_cookie('inviter', inviter)
            response.set_cookie('invite', invite)
        return response
    return render_template("register.htm")


def generate_image(login, string):
    img = Image.new('RGBA', (50, 50))
    data = [
        (
            int(string[:2], 16),
            int(string[2:4], 16),
            int(string[4:6], 16),
            int(string[6:8], 16)
        ) for x in range(50*50)]
    img.putdata(data, 1, 0)
    img.save("static/img/user/" + login + ".png")


def get_part(img):
    img = Image.open('static/img/user/' + img, 'RGBA')
    data = img.getdata()[0]
    hashcolor = str(hex(data[0])) + str(hex(data[1])) + str(hex(data[2])) + str(hex(data[3]))
    return hashcolor

if __name__ == '__main__':
    app.run()

