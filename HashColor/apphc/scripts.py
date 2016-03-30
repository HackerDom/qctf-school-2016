#!/usr/bin/python3
from random import randint

# SQLAlchemy
# python-flask

from PIL import Image
from io import BytesIO
import base64
import hashlib


def get_md5_hex(login):
    m = hashlib.md5()
    m.update(login.encode())
    return m.hexdigest()


def separate_blocks(md5_hex):
    return [md5_hex[j * 8: (j + 1) * 8] for j in range(len(md5_hex) // 8)]


def generate_image(string):
    size = randint(50, 150)
    img = Image.new('RGBA', (size, size))
    data = [
        (
            int(string[:2], 16),
            int(string[2:4], 16),
            int(string[4:6], 16),
            int(string[6:8], 16)
        ) for x in range(size*size)]
    img.putdata(data, 1, 0)
    buff = BytesIO()
    img.save(buff, format="PNG")
    return base64.b64encode(buff.getvalue()).decode()


def get_hash_part(raw_data):
    img = Image.open(raw_data) #Image.open('static/img/user/' + img, 'RGBA')
    data = img.getdata()[0]
    hashcolor = str(hex(data[0])[2:] + hex(data[1])[2:] + hex(data[2])[2:] + hex(data[3])[2:])
    return hashcolor


def get_file_data(invite):
    buff = BytesIO()
    invite.save(buff)
    buff.seek(0)
    # print(buff)
    return buff
