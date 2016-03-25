#!/usr/bin/python3


# SQLAlchemy
# python-flask

# from flask import Flask, render_template, request, make_response, redirect
# from flask.ext.sqlalchemy import SQLAlchemy
from PIL import Image
from io import BytesIO
from werkzeug.utils import secure_filename
import base64
# import bleach
import hashlib


def get_md5_hex(login):
    m = hashlib.md5()
    m.update(login.encode())
    return m.hexdigest()


def separate_blocks(md5_hex):
    return [md5_hex[j * 8: (j + 1) * 8] for j in range(len(md5_hex) // 8)]


def generate_image(string):
    img = Image.new('RGBA', (50, 50))
    data = [
        (
            int(string[:2], 16),
            int(string[2:4], 16),
            int(string[4:6], 16),
            int(string[6:8], 16)
        ) for x in range(50*50)]
    img.putdata(data, 1, 0)
    buff = BytesIO()
    img.save(buff, format="PNG")
    return base64.b64encode(buff.getvalue())
    # img.save("static/img/user/" + login + ".png")


def get_hash_part(b64data):
    img = Image.open(BytesIO(base64.b64decode(b64data))) #Image.open('static/img/user/' + img, 'RGBA')
    data = img.getdata()[0]
    hashcolor = str(hex(data[0])) + str(hex(data[1])) + str(hex(data[2])) + str(hex(data[3]))
    return hashcolor

#
# def get_file_data(form):
#     filename = secure_filename(form.invite.file.filename)
#     buff = BytesIO()
#     form.invite.file.save(buff)
#     print(buff)
#     return buff
