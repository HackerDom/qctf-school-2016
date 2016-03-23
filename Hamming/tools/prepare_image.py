#!/usr/bin/env python3

import sys
from PIL import Image, ImageFont, ImageDraw


MESSAGE = 'Flag is concatenation of \'QCTF_\' and md5sum of this image'

image = Image.open(sys.argv[1])
draw = ImageDraw.Draw(image)
font = ImageFont.truetype('resource/arial.ttf', 20)
width, height = image.size

text_width, text_height = draw.textsize(MESSAGE, font=font)
if text_width > width or text_height > height:
    print('Image to small')
    exit(-1)

x = (width - text_width) // 2
y = (height - text_height) // 2
draw.text((x, y), MESSAGE, font=font)

image.save(sys.argv[2], 'BMP')
